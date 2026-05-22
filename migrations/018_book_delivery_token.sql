-- Migration: add telegram_delivery_token to research_leads for deep-link tracking
ALTER TABLE research_leads ADD COLUMN IF NOT EXISTS telegram_delivery_token VARCHAR(64);
