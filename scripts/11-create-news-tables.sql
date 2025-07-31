-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  source_url VARCHAR(1000),
  image_url VARCHAR(1000),
  category VARCHAR(100) DEFAULT 'general',
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  original_language VARCHAR(10) DEFAULT 'ko',
  is_translated BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_language ON news(original_language);
CREATE INDEX IF NOT EXISTS idx_news_translated ON news(is_translated);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON news FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON news FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON news FOR DELETE USING (true);
