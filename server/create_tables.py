# Python file to create tables in postgresql database
import psycopg2 as pg
import json


with open('database_credentials.json') as f:
  credentials = json.load(f)
print(credentials)

sql_commands= (
  """CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    profile_image_url VARCHAR(255),
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::JSONB
);
""",
"""
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""
CREATE TABLE issue_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    primary_department_id INTEGER REFERENCES departments(department_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estimated_response_time INTERVAL,
    severity_level INTEGER DEFAULT 3, -- 1-5 scale, with 5 being most severe
    requires_approval BOOLEAN DEFAULT FALSE
);
""",
"""
CREATE TABLE issue_subcategories (
    subcategory_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES issue_categories(category_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""
CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES issue_categories(category_id),
    subcategory_id INTEGER REFERENCES issue_subcategories(subcategory_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_point GEOGRAPHY(POINT, 4326) NOT NULL, 
    address TEXT,
    city VARCHAR(100) DEFAULT 'Austin',
    state VARCHAR(2) DEFAULT 'TX',
    zipcode VARCHAR(10),
    severity INTEGER CHECK (severity BETWEEN 1 AND 5),
    status VARCHAR(50) DEFAULT 'submitted', 
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    council_district INTEGER,
    neighborhood VARCHAR(100),
    ai_category_confidence FLOAT,
    is_duplicate BOOLEAN DEFAULT FALSE,
    original_report_id UUID REFERENCES reports(report_id),
    metadata JSONB
);"""
,
"""CREATE TABLE report_media (
    media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE,
    media_type VARCHAR(50) NOT NULL, -- image, video, audio, document
    file_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    file_size INTEGER,
    original_filename VARCHAR(255),
    content_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE,
    metadata JSONB
);"""
,
"""
CREATE TABLE report_updates (
    update_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    status_change VARCHAR(50),
    comment TEXT,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    parent_update_id UUID REFERENCES report_updates(update_id) ON DELETE SET NULL 
);"""
,
"""
CREATE TABLE department_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined, completed
    response_time INTERVAL,
    is_primary BOOLEAN DEFAULT FALSE, 
    notes TEXT
);"""
,
"""
CREATE TABLE report_votes (
    vote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL, -- upvote, downvote, or confirm
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    comment TEXT,
    UNIQUE(report_id, user_id) -- One vote per user per report
);
""",
"""CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- status_change, assignment, comment, etc.
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);
""",
"""
CREATE TABLE serpapi_results (
    result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    result_json JSONB NOT NULL,
    relevance_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_relevant BOOLEAN
);
""",
"""
CREATE TABLE statistics (
    stat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_date DATE NOT NULL,
    category_id INTEGER REFERENCES issue_categories(category_id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    council_district INTEGER,
    report_count INTEGER DEFAULT 0,
    resolved_count INTEGER DEFAULT 0,
    avg_resolution_time INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""CREATE TABLE subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE NULL,
    category_id INTEGER REFERENCES issue_categories(category_id) ON DELETE CASCADE NULL,
    council_district INTEGER,
    geographic_area GEOGRAPHY(POLYGON, 4326), -- For area subscriptions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    notification_method VARCHAR(20) DEFAULT 'email', -- email, sms, push
    CHECK (report_id IS NOT NULL OR category_id IS NOT NULL OR 
           council_district IS NOT NULL OR geographic_area IS NOT NULL)
);
""",
"""CREATE TABLE feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(report_id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    response_time_rating INTEGER CHECK (response_time_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    resolution_rating INTEGER CHECK (resolution_rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- report, user, department, etc.
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB, 
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""CREATE TABLE council_districts (
    district_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    boundary GEOGRAPHY(MULTIPOLYGON, 4326) NOT NULL,
    council_member VARCHAR(100),
    office_phone VARCHAR(20),
    office_email VARCHAR(255),
    website_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""CREATE TABLE neighborhoods (
    neighborhood_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    boundary GEOGRAPHY(MULTIPOLYGON, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
""",
"""CREATE TABLE report_tags (
    report_id UUID REFERENCES reports(report_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (report_id, tag_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL
);
""",
"""CREATE INDEX idx_users_email ON users(email);""",
"""CREATE INDEX idx_reports_category ON reports(category_id);""",
"""CREATE INDEX idx_reports_status ON reports(status);""",
"""CREATE INDEX idx_reports_user ON reports(user_id);""",
"""CREATE INDEX idx_reports_location ON reports USING GIST(location_point);""",
"""CREATE INDEX idx_reports_created_at ON reports(created_at);""",
"""CREATE INDEX idx_reports_council_district ON reports(council_district);""",
"""CREATE INDEX idx_report_media_report ON report_media(report_id);""",
"""CREATE INDEX idx_report_updates_report ON report_updates(report_id);""",
"""CREATE INDEX idx_report_updates_created_at ON report_updates(created_at);""",
"""CREATE INDEX idx_department_assignments_report ON department_assignments(report_id);""",
"""CREATE INDEX idx_department_assignments_department ON department_assignments(department_id);""",
"""CREATE INDEX idx_notifications_user ON notifications(user_id);""",
"""CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;""",
"""CREATE INDEX idx_report_votes_report ON report_votes(report_id);""",
"""CREATE INDEX idx_serpapi_results_report ON serpapi_results(report_id);""",
"""CREATE INDEX idx_statistics_date ON statistics(stat_date);""",
"""CREATE INDEX idx_statistics_category ON statistics(category_id);""",
"""CREATE INDEX idx_statistics_district ON statistics(council_district);""",
"""CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);""",
"""CREATE INDEX idx_subscriptions_geographic ON subscriptions USING GIST(geographic_area);""",
"""CREATE INDEX idx_feedback_report ON feedback(report_id);""",
"""CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);""",
"""CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);""",
"""CREATE INDEX idx_council_districts_boundary ON council_districts USING GIST(boundary);""",
"""CREATE INDEX idx_neighborhoods_boundary ON neighborhoods USING GIST(boundary);""",
"""CREATE INDEX idx_report_tags_report ON report_tags(report_id);""",
"""CREATE INDEX idx_report_tags_tag ON report_tags(tag_id);"""
)

num_errors  = 0 
cur = None
try:
  conn = pg.connect(database=credentials['DB_NAME'],
                    user=credentials['DB_USER'],
                    password=credentials['DB_PASS'],
                    host=credentials['DB_HOST'],
                    port=credentials['DB_PORT']
                    )
  cur = conn.cursor()
  cur.execute("CREATE EXTENSION IF NOT EXISTS postgis")
  conn.commit()
  cur.execute("CREATE EXTENSION IF NOT EXISTS postgis_topology")
  conn.commit()
  for command in sql_commands:
    try:
      cur.execute(command)
      conn.commit()
    except Exception as error:
      num_errors += 1
      print(f"Error occured while attempting to execute {command}\n\n Error: {error}")  
      conn.rollback()
  
  conn.close()

except Exception as e:
  print(f"Failed to connect: {e}")

finally:
  if cur  is not None:
    cur.close()
  if conn is not None:
    conn.close()


print(f'Finished executing with {num_errors} errors.')