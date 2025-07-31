-- Create news tables if they don't exist
-- This script can be run multiple times safely

-- Create news_categories table
CREATE TABLE IF NOT EXISTS news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_tags table
CREATE TABLE IF NOT EXISTS news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category_id INTEGER REFERENCES news_categories(id) ON DELETE SET NULL,
    author VARCHAR(200),
    source_url TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0
);

-- Create news_tag_relations table
CREATE TABLE IF NOT EXISTS news_tag_relations (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(news_id, tag_id)
);

-- Insert default categories if they don't exist
INSERT INTO news_categories (name, description) VALUES
    ('일반뉴스', '일반적인 뉴스 및 사회 이슈'),
    ('비즈니스', '경제, 금융, 기업 관련 뉴스'),
    ('기술', 'IT, 과학기술, 혁신 관련 뉴스'),
    ('건강', '의료, 건강, 웰빙 관련 뉴스'),
    ('여행', '여행, 관광, 문화체험 관련 뉴스'),
    ('음식', '요리, 맛집, 식문화 관련 뉴스'),
    ('교육', '교육, 학습, 연구 관련 뉴스'),
    ('스포츠', '스포츠, 운동, 경기 관련 뉴스'),
    ('문화', '예술, 문화, 엔터테인먼트 관련 뉴스'),
    ('정치', '정치, 정책, 정부 관련 뉴스')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_news_id ON news_tag_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_tag_id ON news_tag_relations(tag_id);

-- Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY IF NOT EXISTS "Public can read active news" ON news
    FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "Public can read news categories" ON news_categories
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public can read news tags" ON news_tags
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public can read news tag relations" ON news_tag_relations
    FOR SELECT USING (true);

-- Create policies for authenticated users (admin)
CREATE POLICY IF NOT EXISTS "Authenticated users can manage news" ON news
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can manage categories" ON news_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can manage tags" ON news_tags
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can manage tag relations" ON news_tag_relations
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_categories_updated_at ON news_categories;
CREATE TRIGGER update_news_categories_updated_at
    BEFORE UPDATE ON news_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON news, news_categories, news_tags, news_tag_relations TO anon;
GRANT ALL ON news, news_categories, news_tags, news_tag_relations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify tables were created
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'news') THEN
        RAISE NOTICE 'News tables created successfully!';
    ELSE
        RAISE EXCEPTION 'Failed to create news tables!';
    END IF;
END $$;
