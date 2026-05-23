-- Add updated_at column to purchases (was missing, referenced by payments.ts)
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Drop old CHECK constraint if it exists and recreate with 'cancelled'
DO $$
BEGIN
  ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_status_check;
END $$;

ALTER TABLE purchases ADD CONSTRAINT purchases_status_check
  CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded'));
