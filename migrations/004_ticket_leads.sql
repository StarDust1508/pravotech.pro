-- Create ticket_leads table
CREATE TABLE IF NOT EXISTS ticket_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  ticket_type VARCHAR(100) NOT NULL,
  ticket_price VARCHAR(50),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);