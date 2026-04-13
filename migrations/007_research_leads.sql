-- Migration: research_leads table for lead generation via research downloads
CREATE TABLE IF NOT EXISTS research_leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  telegram VARCHAR(255),
  company VARCHAR(255),
  position VARCHAR(255),
  research_id VARCHAR(100) NOT NULL,
  research_title VARCHAR(500),
  source_form VARCHAR(100) DEFAULT 'research_card',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_leads_email ON research_leads(email);
CREATE INDEX IF NOT EXISTS idx_research_leads_research_id ON research_leads(research_id);
CREATE INDEX IF NOT EXISTS idx_research_leads_created_at ON research_leads(created_at DESC);
