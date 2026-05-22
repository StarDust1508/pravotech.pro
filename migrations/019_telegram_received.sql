-- Migration: add received_materials JSON tracking to telegram_users
ALTER TABLE telegram_users ADD COLUMN IF NOT EXISTS received_materials JSONB DEFAULT '[]'::jsonb;
