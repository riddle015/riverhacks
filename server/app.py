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

app = Flask(__name__)
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

if __name__ == "__main__":
  port = int(os.environ.get("PORT", 4000))
  host = os.environ.get("HOST", "0.0.0.0")
  print(f"Starting Flask app on http://{host}:{port}")
  app.run(host=host, port=port, debug=True)
