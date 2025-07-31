-- 뉴스 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS news_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color_class VARCHAR(50) DEFAULT 'bg-blue-100 text-blue-800',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 테이블 생성
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
    view_count INTEGER DEFAULT 0,
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT FALSE
);

-- 뉴스 태그 테이블 생성
CREATE TABLE IF NOT EXISTS news_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 태그 관계 테이블 생성
CREATE TABLE IF NOT EXISTS news_tag_relations (
  id SERIAL PRIMARY KEY,
  news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES news_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(news_id, tag_id)
);

-- 기본 뉴스 카테고리 삽입
INSERT INTO news_categories (name, description, color_class) VALUES
('일반뉴스', '일반적인 뉴스', 'bg-blue-100 text-blue-800'),
('비즈니스', '비즈니스 관련 뉴스', 'bg-green-100 text-green-800'),
('기술', '기술 관련 뉴스', 'bg-purple-100 text-purple-800'),
('건강', '건강 관련 뉴스', 'bg-red-100 text-red-800'),
('여행', '여행 관련 뉴스', 'bg-yellow-100 text-yellow-800'),
('음식', '음식 관련 뉴스', 'bg-orange-100 text-orange-800'),
('교육', '교육 관련 뉴스', 'bg-indigo-100 text-indigo-800'),
('스포츠', '스포츠 관련 뉴스', 'bg-pink-100 text-pink-800')
ON CONFLICT (name) DO NOTHING;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_language ON news(original_language);
CREATE INDEX IF NOT EXISTS idx_news_translated ON news(is_translated);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_news ON news_tag_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_tag ON news_tag_relations(tag_id);

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_news_updated_at();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성화된 뉴스를 읽을 수 있도록 허용
CREATE POLICY IF NOT EXISTS "Public can read news_categories" ON news_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can read active news" ON news FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "Public can read news_tags" ON news_tags FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can read news_tag_relations" ON news_tag_relations FOR SELECT USING (true);

-- 인증된 사용자만 뉴스를 생성, 수정, 삭제할 수 있도록 제한
CREATE POLICY IF NOT EXISTS "Authenticated can manage news_categories" ON news_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated can manage news" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated can manage news_tags" ON news_tags FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated can manage news_tag_relations" ON news_tag_relations FOR ALL USING (auth.role() = 'authenticated');
