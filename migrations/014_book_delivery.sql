-- Migration: add delivery_channel column to research_leads
ALTER TABLE research_leads ADD COLUMN IF NOT EXISTS delivery_channel VARCHAR(20) DEFAULT 'email';
