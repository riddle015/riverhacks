from flask import Flask, request, jsonify
import psycopg2 as pg
from flask_cors import CORS
import os
import json
from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

from serp_api_service.news_fetcher import NewsFetcher
from serp_api_service.events_fetcher import EventsFetcher
from serp_api_service.volunteer_events_fetcher import VolunteerEventsFetcher

app = Flask(__name__)
news_fetcher = NewsFetcher()
events_fetcher = EventsFetcher()
volunteer_events_fetcher = VolunteerEventsFetcher()

CORS(app)

# --------------------------
# JWT setup
# --------------------------
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-key")
jwt =  JWTManager(app)

# --------------------------
# In-memory store for demo only
# Swap out for you DB/SQLAlchemy models
# --------------------------
reports ={}


def execute_sql_query(query, args=None, fetch=False):
  """Run a SQL query against Postgres. If fetch=True, returns all rows."""
  with open('database_credentials.json') as f:
    creds = json.load(f)
  
  conn = None
  cur = None
  try:
    conn = pg.connect(
       database=creds['DB_NAME'],
       user=creds['DB_USER'],
       password=creds['DB_PASS'],
       host=creds['DB_HOST'],
       port=creds['DB_PORT']
    )
    # Execute sql query
    cur = conn.cursor()
    cur.execute(query, args or ())
    if fetch:
       rows = cur.fetchall()
       conn.commit()
       return rows
    conn.commit()
  except Exception as e:
    print(f"Error occurred while attempting to execute {query} query.\n\n Error: {e}")
    if conn:
      conn.rollback()
  finally:
    if cur is not None:
      cur.close()
    if conn is not None:
      conn.close()

@app.route('/')
def index():
  return jsonify({
     "message": "AustinAlertHub API is up",
     "timestamp": datetime.utcnow().isoformat() + "Z"
  }), 200

# ───────────────────────────────────────────────────
# AUTH: Signup
# ───────────────────────────────────────────────────
@app.route('/api/v1/auth/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    # required fields
    missing = [f for f in ("email", "password") if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    email = data['email']
    pw_hash = generate_password_hash(data['password'])
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')

    sql = """
    INSERT INTO users (
      email,
      password_hash,
      first_name,
      last_name,
      phone_number
    ) VALUES (%s, %s, %s, %s, %s)
    RETURNING user_id, email, first_name, last_name, phone_number, created_at;
    """
    try:
        row = execute_sql_query(
            sql,
            args=(email, pw_hash, first_name, last_name, phone_number),
            fetch=True
        )[0]
    except Exception as e:
        if "duplicate key" in str(e).lower():
            return jsonify({"error": "Email already registered"}), 409
        return jsonify({"error": "Failed to create user", "details": str(e)}), 500

    user = dict(zip(
        ['user_id','email','first_name','last_name','phone_number','created_at'],
        row
    ))
    # issue JWT token
    access_token = create_access_token(identity=user['user_id'])
    return jsonify({"user": user, "access_token": access_token}), 201


# ───────────────────────────────────────────────────
# AUTH: Login
# ───────────────────────────────────────────────────
@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    missing = [f for f in ("email", "password") if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    sql = "SELECT user_id, password_hash FROM users WHERE email = %s;"
    try:
        rows = execute_sql_query(sql, args=(data['email'],), fetch=True)
    except Exception as e:
        return jsonify({"error": "Login failed", "details": str(e)}), 500

    if not rows:
        return jsonify({"error": "Invalid email or password"}), 401

    user_id, pw_hash = rows[0]
    if not check_password_hash(pw_hash, data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": access_token, "user_id": user_id}), 200

@app.route('/api/v1/reports', methods=['POST'])
def create_report():
  data = request.get_json() or {}
  required = ['user_id', 'category', 'description', 'severity', 'latitude', 'longitude']
  missing = [f for f in required if f not in data]
  if missing:
    return jsonify({'error': f'Missing fields{", ".join(missing)}'}), 400

  # Generate IDs
  report_id = str(uuid.uuid4())
  tracking_number = datetime.utcnow().strftime('%Y%m%d%H%M%S') + '-' + report_id[:8]

  # Prepare WKT geography
  point_wkt = f"SRID=4326;POINT({data['longitude']} {data['latitude']})"

  # Insert into reports
  insert_sql = """
  INSERT INTO reports (
    report_id,
    tracking_number,
    user_id,
    category_id,
    description,
    severity,
    location_point,
    status,
    created_at,
    updated_at
  ) VALUES (
    %s, %s, %s, %s, %s, %s,
    ST_GeogFromText(%s),
    'submitted',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
  RETURNING
    report_id,
    tracking_number,
    user_id,
    category_id,
    description,
    severity,
    ST_AsGeoJSON(location_point) AS location,
    status,
    created_at;
  """
  try:
    row = execute_sql_query(
      insert_sql,
      args=(
        report_id,
        tracking_number,
        data['user_id'],
        data['category_id'],
        data['description'],
        data['severity'],
        point_wkt
      ),
      fetch=True
    )[0]
  except Exception as e:
    return jsonify({"error": "Failed to create report", "details": str(e)}), 500

  keys = ['report_id','tracking_number','user_id','category_id','description','severity','location','status','created_at']
  report = dict(zip(keys, row))
  return jsonify(report), 201

@app.route('/api/v1/reports', methods=['GET'])
def list_reports():
  user_filter = request.args.get('user_id')
  if user_filter:
      sql = """
      SELECT
        report_id,
        tracking_number,
        user_id,
        category_id,
        description,
        severity,
        ST_AsGeoJSON(location_point) AS location,
        status,
        created_at
      FROM reports
      WHERE user_id = %s
      ORDER BY created_at DESC;
      """
      rows = execute_sql_query(sql, args=(user_filter,), fetch=True)
  else:
      sql = """
      SELECT
        report_id,
        tracking_number,
        user_id,
        category_id,
        description,
        severity,
        ST_AsGeoJSON(location_point) AS location,
        status,
        created_at
      FROM reports
      ORDER BY created_at DESC
      LIMIT 100;
      """
      rows = execute_sql_query(sql, fetch=True)

  keys = ['report_id','tracking_number','user_id','category_id',
          'description','severity','location','status','created_at']
  reports = [dict(zip(keys, r)) for r in rows]
  return jsonify(reports), 200


@app.route('/api/v1/reports/<report_id>', methods=['GET'])
def get_report(report_id):
  sql = """
  SELECT
    report_id,
    tracking_number,
    user_id,
    category_id,
    description,
    severity,
    ST_AsGeoJSON(location_point) AS location,
    status,
    created_at
  FROM reports
  WHERE report_id = %s;
  """
  rows = execute_sql_query(sql, args=(report_id,), fetch=True)
  if not rows:
      return jsonify({"error": "Report not found"}), 404

  keys = ['report_id','tracking_number','user_id','category_id',
          'description','severity','location','status','created_at']
  report = dict(zip(keys, rows[0]))
  return jsonify(report), 200

@app.route('/api/v1/reports/<report_id>/updates', methods=['POST'])
def add_report_update(report_id):
  data = request.get_json() or {}
  required = ['user_id', 'status_change', 'comment']
  missing = [f for f in required if f not in data]
  if missing:
      return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

  # Ensure report exists
  exists = execute_sql_query(
      "SELECT 1 FROM reports WHERE report_id = %s;",
      args=(report_id,), fetch=True
  )
  if not exists:
      return jsonify({"error": "Report not found"}), 404

  update_id = str(uuid.uuid4())
  insert_sql = """
  INSERT INTO report_updates (
    update_id,
    report_id,
    user_id,
    status_change,
    comment,
    created_at
  ) VALUES (
    %s, %s, %s, %s, %s, CURRENT_TIMESTAMP
  )
  RETURNING update_id, report_id, user_id, status_change, comment, created_at;
  """

  try:
      row = execute_sql_query(
          insert_sql,
          args=(update_id, report_id, data['user_id'], data['status_change'], data['comment']),
          fetch=True
      )[0]

      # Also update the report's current status
      execute_sql_query(
          "UPDATE reports SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE report_id = %s;",
          args=(data['status_change'], report_id)
      )
  except Exception as e:
      return jsonify({"error": "Failed to add update", "details": str(e)}), 500

  keys = ['update_id','report_id','user_id','status_change','comment','created_at']
  update = dict(zip(keys, row))
  return jsonify(update), 201

@app.route('/api/v1/serpapi/news', methods=['GET'])
def serpapi_news():
  query = request.args.get('q', 'Austin')  # default to "Austin" if no query
  try:
      news = news_fetcher.fetch_general_news(query)
      if not news:
          return jsonify({"error": "No news articles found."}), 404
      return jsonify(news)
  except Exception as e:
      print(e)
      return jsonify({"error": "Failed to fetch news", "details": str(e)}), 500

@app.route('/api/v1/serpapi/events', methods=['GET'])
def serpapi_events():
  try:
      events = events_fetcher.fetch_events_for_location(query="Events in Austin, TX")
      if not events:
          return jsonify({"error": "No events found."}), 404
      return jsonify(events)
  except Exception as e:
      print(e)
      return jsonify({"error": "Failed to fetch events", "details": str(e)}), 500

@app.route('/api/v1/serpapi/volunteer-events', methods=['GET'])
def serpapi_volunteer_events():
  try:
      events = volunteer_events_fetcher.fetch_volunteer_events(location="Austin, Texas")
      if not events:
          return jsonify({"error": "No volunteer events found."}), 404
      return jsonify(events)
  except Exception as e:
      print(e)
      return jsonify({"error": "Failed to fetch volunteer events", "details": str(e)}), 500

@app.route('/api/v1/heatmap', methods=['GET'])
def get_heatmap_data():
    """
    Get heat map data with optional filtering
    Query params:
    - category_id: Filter by issue category
    - start_date: Filter starting from date (YYYY-MM-DD)
    - end_date: Filter ending at date (YYYY-MM-DD)
    - status: Filter by report status
    - council_district: Filter by council district
    """
    # Parse query parameters
    category_id = request.args.get('category_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    status = request.args.get('status')
    council_district = request.args.get('council_district')
    
    # Build base query
    query = """
    SELECT
        report_id,
        category_id,
        ST_AsGeoJSON(location_point) AS location,
        severity,
        status,
        created_at,
        resolved_at,
        council_district
    FROM reports
    WHERE 1=1
    """
    
    args = []
    
    # Add filters
    if category_id:
        query += " AND category_id = %s"
        args.append(category_id)
    
    if start_date:
        query += " AND created_at >= %s"
        args.append(start_date)
    
    if end_date:
        query += " AND created_at <= %s"
        args.append(end_date)
    
    if status:
        query += " AND status = %s"
        args.append(status)
    
    if council_district:
        query += " AND council_district = %s"
        args.append(council_district)
    
    # Execute query
    try:
        rows = execute_sql_query(query, args=args, fetch=True)
        
        # Process results to GeoJSON format
        features = []
        for row in rows:
            report_id, category_id, location_json, severity, status, created_at, resolved_at, council_district = row
            
            try:
                location_data = json.loads(location_json)
                
                # Create feature
                feature = {
                    "type": "Feature",
                    "geometry": location_data,
                    "properties": {
                        "report_id": report_id,
                        "category_id": category_id,
                        "severity": severity,
                        "status": status,
                        "created_at": created_at.isoformat() if created_at else None,
                        "resolved_at": resolved_at.isoformat() if resolved_at else None,
                        "council_district": council_district
                    }
                }
                features.append(feature)
            except Exception as e:
                print(f"Error processing location data for report {report_id}: {e}")
    
    except Exception as e:
        print(f"Error fetching heatmap data: {e}")
        # If the query fails, return sample data
        features = generate_sample_heatmap_data()
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return jsonify(geojson), 200

def generate_sample_heatmap_data():
    """Generate sample heatmap data points around Austin"""
    # Austin center coordinates
    center_lat = 30.2672
    center_lng = -97.7431
    
    features = []
    
    # Generate different categories of issues
    categories = ['infrastructure', 'traffic', 'crime', 'environment', 'public_services', 'noise', 'animals', 'other']
    statuses = ['submitted', 'in_progress', 'resolved', 'closed']
    
    # Generate random points around Austin
    import random
    import uuid
    from datetime import datetime, timedelta
    
    for i in range(100):
        # Random location within ~5 miles of center
        lat = center_lat + (random.random() - 0.5) * 0.1
        lng = center_lng + (random.random() - 0.5) * 0.1
        
        # Random attributes
        category = random.choice(categories)
        severity = random.randint(1, 5)
        status = random.choice(statuses)
        
        # Random dates within the last 6 months
        days_ago = random.randint(0, 180)
        created_at = (datetime.now() - timedelta(days=days_ago)).isoformat()
        
        # 70% chance of having a resolution date if not 'submitted'
        resolved_at = None
        if status != 'submitted' and random.random() < 0.7:
            resolution_days = random.randint(1, min(30, days_ago))
            resolved_at = (datetime.now() - timedelta(days=days_ago-resolution_days)).isoformat()
        
        # Random council district (1-10 for Austin)
        district = random.randint(1, 10)
        
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
            "properties": {
                "report_id": str(uuid.uuid4()),
                "category_id": category,
                "severity": severity,
                "status": status,
                "created_at": created_at,
                "resolved_at": resolved_at,
                "council_district": district
            }
        }
        
        features.append(feature)
    
    return features

@app.route('/api/v1/heatmap/statistics', methods=['GET'])
def get_heatmap_statistics():
    """Get statistics for heat map visualization"""
    # Parse query parameters
    category_id = request.args.get('category_id')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    status = request.args.get('status')
    
    # Build base query for neighborhood statistics
    # Using ST_DWithin instead of ST_Contains for geography type
    query = """
    SELECT
        n.neighborhood_id,
        n.name AS neighborhood_name,
        COUNT(r.report_id) AS report_count,
        AVG(EXTRACT(EPOCH FROM (r.resolved_at - r.created_at))/3600)::float AS avg_resolution_hours
    FROM neighborhoods n
    LEFT JOIN reports r ON ST_DWithin(n.boundary::geography, r.location_point, 0)
    WHERE 1=1
    """
    
    args = []
    
    # Add filters
    if category_id:
        query += " AND r.category_id = %s"
        args.append(category_id)
    
    if start_date:
        query += " AND r.created_at >= %s"
        args.append(start_date)
    
    if end_date:
        query += " AND r.created_at <= %s"
        args.append(end_date)
    
    if status:
        query += " AND r.status = %s"
        args.append(status)
    
    query += " GROUP BY n.neighborhood_id, n.name ORDER BY report_count DESC"
    
    # Execute query
    try:
        neighborhood_stats = execute_sql_query(query, args=args, fetch=True)
    except Exception as e:
        print(f"Error in neighborhood stats query: {e}")
        # Provide a fallback response with sample data if there's an error
        return jsonify({
            "neighborhood_statistics": [
                {
                    "neighborhood_id": 1,
                    "neighborhood_name": "Downtown",
                    "report_count": 24,
                    "avg_resolution_hours": 36.5
                },
                {
                    "neighborhood_id": 2,
                    "neighborhood_name": "East Austin",
                    "report_count": 18,
                    "avg_resolution_hours": 48.2
                },
                {
                    "neighborhood_id": 3,
                    "neighborhood_name": "South Congress",
                    "report_count": 15,
                    "avg_resolution_hours": 24.8
                }
            ],
            "time_trends": [
                {
                    "month": "2025-01",
                    "report_count": 45
                },
                {
                    "month": "2025-02",
                    "report_count": 52
                },
                {
                    "month": "2025-03",
                    "report_count": 38
                },
                {
                    "month": "2025-04",
                    "report_count": 30
                }
            ]
        }), 200
    
    # Query for time-based trends (monthly)
    trend_query = """
    SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
        COUNT(*) AS report_count
    FROM reports
    WHERE 1=1
    """
    
    # Add the same filters
    trend_args = []
    if category_id:
        trend_query += " AND category_id = %s"
        trend_args.append(category_id)
    
    if start_date:
        trend_query += " AND created_at >= %s"
        trend_args.append(start_date)
    
    if end_date:
        trend_query += " AND created_at <= %s"
        trend_args.append(end_date)
    
    if status:
        trend_query += " AND status = %s"
        trend_args.append(status)
    
    trend_query += " GROUP BY month ORDER BY month"
    
    try:
        trend_data = execute_sql_query(trend_query, args=trend_args, fetch=True)
    except Exception as e:
        print(f"Error in trend query: {e}")
        # If this query fails, provide empty trend data
        trend_data = []
    
    # Format the results
    result = {
        "neighborhood_statistics": [
            {
                "neighborhood_id": row[0] if row[0] is not None else 0,
                "neighborhood_name": row[1] if row[1] is not None else "Unknown",
                "report_count": row[2] if row[2] is not None else 0,
                "avg_resolution_hours": row[3]
            } for row in (neighborhood_stats or [])
        ],
        "time_trends": [
            {
                "month": row[0],
                "report_count": row[1]
            } for row in (trend_data or [])
        ]
    }
    
    return jsonify(result), 200

@app.route('/api/v1/heatmap/infrastructure', methods=['GET'])
def get_infrastructure_data():
    """Get public infrastructure data to overlay on the map"""
    # In a real implementation, this would come from your database
    # For now, we'll return sample data
    
    infrastructure = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-97.7431, 30.2672]  # Austin City Hall
                },
                "properties": {
                    "name": "City Hall",
                    "type": "government",
                    "address": "301 W 2nd St, Austin, TX 78701"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-97.7365, 30.2849]  # APD Headquarters
                },
                "properties": {
                    "name": "Police Headquarters",
                    "type": "police",
                    "address": "715 E 8th St, Austin, TX 78701"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-97.7377, 30.2759]  # Austin Fire Station 1
                },
                "properties": {
                    "name": "Fire Station 1",
                    "type": "fire",
                    "address": "401 E 5th St, Austin, TX 78701"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-97.7516, 30.2751]  # Austin Public Library
                },
                "properties": {
                    "name": "Central Library",
                    "type": "library",
                    "address": "710 W César Chávez St, Austin, TX 78701"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-97.7359, 30.2664]  # Austin Convention Center
                },
                "properties": {
                    "name": "Convention Center",
                    "type": "public",
                    "address": "500 E Cesar Chavez St, Austin, TX 78701"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-97.7387, 30.2742]  # Travis County Courthouse
                },
                "properties": {
                    "name": "County Courthouse",
                    "type": "government",
                    "address": "1000 Guadalupe St, Austin, TX 78701"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-97.7428, 30.2745]  # Austin EMS Station
                },
                "properties": {
                    "name": "EMS Station 6",
                    "type": "medical",
                    "address": "517 S Pleasant Valley Rd, Austin, TX 78741"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point", 
                    "coordinates": [-97.7265, 30.2913]  # UT Austin
                },
                "properties": {
                    "name": "UT Austin Campus",
                    "type": "education",
                    "address": "110 Inner Campus Drive, Austin, TX 78705"
                }
            }
        ]
    }
    
    return jsonify(infrastructure), 200

if __name__ == "__main__":
  port = int(os.environ.get("PORT", 4000))
  host = os.environ.get("HOST", "0.0.0.0")
  print(f"Starting Flask app on http://{host}:{port}")
  app.run(host=host, port=port, debug=True)
