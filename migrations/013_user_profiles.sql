-- User profiles: stores visitor contact info (name, email, phone)
-- Keyed by device_id (UUID stored in localStorage)
CREATE TABLE IF NOT EXISTS user_profiles (
  id            SERIAL PRIMARY KEY,
  device_id     UUID NOT NULL UNIQUE,
  name          VARCHAR(200) DEFAULT '',
  email         VARCHAR(320) DEFAULT '',
  phone         VARCHAR(30) DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_device_id ON user_profiles(device_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email) WHERE email <> '';
