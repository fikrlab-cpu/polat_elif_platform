-- Database initialization script for Po'lat va Elif Platform

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  user_type VARCHAR(10) CHECK (user_type IN ('polat', 'elif')),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  auth_token VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  text TEXT,
  type VARCHAR(20) CHECK (type IN ('text', 'voice', 'image')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  published_at TIMESTAMP,
  is_draft BOOLEAN DEFAULT false,
  FOREIGN KEY (user_id) REFERENCES users(telegram_id)
);

CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  mood INT CHECK (mood >= 1 AND mood <= 10),
  context_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(telegram_id)
);

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  city_name VARCHAR(255),
  country VARCHAR(255),
  accuracy FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(telegram_id)
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('meeting', 'gift', 'milestone', 'anniversary')),
  description TEXT,
  importance INT CHECK (importance >= 1 AND importance <= 5),
  created_by BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (created_by) REFERENCES users(telegram_id)
);

CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  author VARCHAR(255),
  date_saved TIMESTAMP DEFAULT NOW(),
  category VARCHAR(100),
  language VARCHAR(20),
  source_url VARCHAR(500),
  saved_by BIGINT,
  FOREIGN KEY (saved_by) REFERENCES users(telegram_id)
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  message_id INT,
  url_path VARCHAR(500),
  file_size INT,
  duration INT,
  transcript_text TEXT,
  uploader_id BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (message_id) REFERENCES messages(id),
  FOREIGN KEY (uploader_id) REFERENCES users(telegram_id)
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7),
  usage_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS message_tags (
  message_id INT,
  tag_id INT,
  PRIMARY KEY (message_id, tag_id),
  FOREIGN KEY (message_id) REFERENCES messages(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_moods_user_id ON moods(user_id);
CREATE INDEX IF NOT EXISTS idx_moods_created_at ON moods(created_at);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);

-- Insert initial data
INSERT INTO users (telegram_id, user_type, first_name) VALUES
(9054617774, 'polat', 'Po''lat'),
(0, 'elif', 'Elif')
ON CONFLICT DO NOTHING;

-- Create some initial events
INSERT INTO events (title, date, type, description, importance, created_by) VALUES
('Birinchi uchrashhuv', '2026-10-11', 'meeting', 'Afsona - Namangan', 5, 9054617774),
('Namangan savoyalligi', '2026-10-25', 'meeting', 'Elif bilan sayr', 5, 9054617774),
('Elif Ohangaronga ketadi', '2026-10-27', 'milestone', 'Uzoqlashish boshlandi', 4, 9054617774)
ON CONFLICT DO NOTHING;
