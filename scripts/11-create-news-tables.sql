-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS news_tag_relations CASCADE;
DROP TABLE IF EXISTS news_tags CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS news_categories CASCADE;

-- Create news categories table
CREATE TABLE news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_class VARCHAR(100) DEFAULT 'bg-blue-100 text-blue-800',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE news (
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
    view_count INTEGER DEFAULT 0,
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT FALSE
);

-- Create news tags table
CREATE TABLE news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news tag relations table
CREATE TABLE news_tag_relations (
    id SERIAL PRIMARY KEY,
    news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(news_id, tag_id)
);

-- Insert default news categories
INSERT INTO news_categories (name, description, color_class) VALUES
('일반뉴스', '일반적인 뉴스', 'bg-blue-100 text-blue-800'),
('비즈니스', '비즈니스 관련 뉴스', 'bg-green-100 text-green-800'),
('기술', '기술 관련 뉴스', 'bg-purple-100 text-purple-800'),
('건강', '건강 관련 뉴스', 'bg-red-100 text-red-800'),
('여행', '여행 관련 뉴스', 'bg-yellow-100 text-yellow-800'),
('음식', '음식 관련 뉴스', 'bg-orange-100 text-orange-800'),
('교육', '교육 관련 뉴스', 'bg-indigo-100 text-indigo-800'),
('스포츠', '스포츠 관련 뉴스', 'bg-pink-100 text-pink-800'),
('문화', '문화 관련 뉴스', 'bg-teal-100 text-teal-800'),
('정치', '정치 관련 뉴스', 'bg-gray-100 text-gray-800');

-- Insert some default tags
INSERT INTO news_tags (name) VALUES
('태국'),
('한국'),
('비즈니스'),
('기술'),
('여행'),
('음식'),
('건강'),
('교육'),
('문화'),
('정치');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_original_language ON news(original_language);
CREATE INDEX IF NOT EXISTS idx_news_is_translated ON news(is_translated);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_news_id ON news_tag_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_tag_id ON news_tag_relations(tag_id);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_news_title_fts ON news USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_news_content_fts ON news USING gin(to_tsvector('english', content));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_news_categories_updated_at BEFORE UPDATE ON news_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public can read news_categories" ON news_categories FOR SELECT USING (true);
CREATE POLICY "Public can read active news" ON news FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read news_tags" ON news_tags FOR SELECT USING (true);
CREATE POLICY "Public can read news_tag_relations" ON news_tag_relations FOR SELECT USING (true);

-- Create RLS policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can manage news_categories" ON news_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage news" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage news_tags" ON news_tags FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage news_tag_relations" ON news_tag_relations FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample news data
INSERT INTO news (title, content, summary, category_id, author, source_url, is_featured, original_language) VALUES
('태국 비즈니스 환경 개선', '태국 정부가 외국인 투자 유치를 위한 새로운 정책을 발표했습니다. 이번 정책은 특히 기술 분야와 제조업 분야에 대한 투자를 장려하는 내용을 담고 있습니다.', '태국 정부의 새로운 외국인 투자 정책 발표', 2, '뉴스팀', 'https://example.com/news1', true, 'ko'),
('한국 기업의 태국 진출 확대', '최근 한국의 여러 대기업들이 태국 시장 진출을 확대하고 있습니다. 특히 IT 서비스와 제조업 분야에서 활발한 움직임을 보이고 있습니다.', '한국 기업들의 태국 시장 진출 현황', 2, '경제팀', 'https://example.com/news2', false, 'ko'),
('태국 여행 산업 회복세', '코로나19 이후 태국의 관광 산업이 빠른 회복세를 보이고 있습니다. 특히 한국 관광객들의 방문이 크게 증가하고 있습니다.', '태국 관광 산업의 회복과 한국 관광객 증가', 5, '여행팀', 'https://example.com/news3', true, 'ko');

-- Link sample news with tags
INSERT INTO news_tag_relations (news_id, tag_id) VALUES
(1, 1), (1, 3), -- 태국, 비즈니스
(2, 1), (2, 2), (2, 3), -- 태국, 한국, 비즈니스
(3, 1), (3, 2), (3, 5); -- 태국, 한국, 여행
