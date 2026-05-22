-- 021_payment_fields.sql
-- Add YooKassa payment tracking columns to purchases table

ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS yookassa_payment_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_purchases_yookassa_payment_id
  ON purchases (yookassa_payment_id);

CREATE INDEX IF NOT EXISTS idx_purchases_payment_id
  ON purchases (payment_id);
