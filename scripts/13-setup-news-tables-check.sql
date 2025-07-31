-- Create news tables if they don't exist
-- This script can be run multiple times safely

-- Create news_categories table
CREATE TABLE IF NOT EXISTS news_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_tags table
CREATE TABLE IF NOT EXISTS news_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT '사회',
    image_url TEXT,
    original_url TEXT NOT NULL,
    source VARCHAR(200),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_count INTEGER DEFAULT 0,
    sentiment VARCHAR(20) DEFAULT 'neutral',
    importance INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_tag_relations table
CREATE TABLE IF NOT EXISTS news_tag_relations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(news_id, tag_id)
);

-- Insert default categories if they don't exist
INSERT INTO news_categories (name, description) VALUES
    ('정치', '정치 관련 뉴스'),
    ('경제', '경제 관련 뉴스'),
    ('사회', '사회 관련 뉴스'),
    ('문화', '문화 관련 뉴스'),
    ('스포츠', '스포츠 관련 뉴스'),
    ('국제', '국제 관련 뉴스'),
    ('생활', '생활 관련 뉴스'),
    ('기술', '기술 관련 뉴스')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_view_count ON news(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_source ON news(source);
CREATE INDEX IF NOT EXISTS idx_news_tags_name ON news_tags(name);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_news_id ON news_tag_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_tag_id ON news_tag_relations(tag_id);

-- Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY IF NOT EXISTS "Allow read access to news" ON news FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow read access to news_categories" ON news_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow read access to news_tags" ON news_tags FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow read access to news_tag_relations" ON news_tag_relations FOR SELECT USING (true);

-- Create policies for authenticated users (admin)
CREATE POLICY IF NOT EXISTS "Allow service role to manage news" ON news FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Allow service role to manage news_categories" ON news_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Allow service role to manage news_tags" ON news_tags FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY IF NOT EXISTS "Allow service role to manage news_tag_relations" ON news_tag_relations FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Create function to increment news view count
CREATE OR REPLACE FUNCTION increment_news_view_count(news_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE news 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = news_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON news, news_categories, news_tags, news_tag_relations TO anon;
GRANT ALL ON news, news_categories, news_tags, news_tag_relations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify tables were created
DO $$
BEGIN
    RAISE NOTICE '뉴스 테이블 설정이 완료되었습니다.';
    RAISE NOTICE '- news: 뉴스 메인 테이블';
    RAISE NOTICE '- news_categories: 뉴스 카테고리';
    RAISE NOTICE '- news_tags: 뉴스 태그';
    RAISE NOTICE '- news_tag_relations: 뉴스-태그 관계';
    RAISE NOTICE '기본 카테고리 8개가 추가되었습니다.';
END $$;
