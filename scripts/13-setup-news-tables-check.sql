-- 뉴스 관련 테이블 생성 스크립트
-- 이 스크립트는 여러 번 실행해도 안전합니다.

-- 1. 뉴스 카테고리 테이블
CREATE TABLE IF NOT EXISTS news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color_class VARCHAR(100) DEFAULT 'bg-gray-100 text-gray-800',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 뉴스 태그 테이블
CREATE TABLE IF NOT EXISTS news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 뉴스 기사 테이블
CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    author VARCHAR(255),
    source_url TEXT,
    image_url TEXT,
    category_id INTEGER REFERENCES news_categories(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT FALSE
);

-- 4. 뉴스-태그 관계 테이블
CREATE TABLE IF NOT EXISTS news_article_tags (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES news_articles(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, tag_id)
);

-- 5. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category_id ON news_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_active ON news_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_featured ON news_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_articles_view_count ON news_articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_article_tags_article_id ON news_article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_news_article_tags_tag_id ON news_article_tags(tag_id);

-- 6. 기본 카테고리 데이터 삽입
INSERT INTO news_categories (name, color_class) VALUES 
    ('정치', 'bg-red-100 text-red-800'),
    ('경제', 'bg-green-100 text-green-800'),
    ('사회', 'bg-blue-100 text-blue-800'),
    ('문화', 'bg-purple-100 text-purple-800'),
    ('스포츠', 'bg-orange-100 text-orange-800'),
    ('기술', 'bg-indigo-100 text-indigo-800'),
    ('국제', 'bg-yellow-100 text-yellow-800'),
    ('기타', 'bg-gray-100 text-gray-800')
ON CONFLICT (name) DO NOTHING;

-- 7. 조회수 증가 함수 생성
CREATE OR REPLACE FUNCTION increment_news_view_count(news_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE news_articles 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = news_id;
END;
$$ LANGUAGE plpgsql;

-- 8. 업데이트 시간 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. 트리거 생성
DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
CREATE TRIGGER update_news_articles_updated_at
    BEFORE UPDATE ON news_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. RLS (Row Level Security) 정책 설정
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_article_tags ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON news_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON news_tags FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON news_articles FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON news_article_tags FOR SELECT USING (true);

-- 인증된 사용자만 쓰기 가능 (관리자용)
CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON news_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable update for authenticated users only" ON news_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable delete for authenticated users only" ON news_categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON news_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable update for authenticated users only" ON news_tags FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable delete for authenticated users only" ON news_tags FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON news_articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable update for authenticated users only" ON news_articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable delete for authenticated users only" ON news_articles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON news_article_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable update for authenticated users only" ON news_article_tags FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable delete for authenticated users only" ON news_article_tags FOR DELETE USING (auth.role() = 'authenticated');

-- 11. 통계 뷰 생성
CREATE OR REPLACE VIEW news_statistics AS
SELECT 
    COUNT(*) as total_articles,
    COUNT(*) FILTER (WHERE is_active = true) as active_articles,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_articles,
    AVG(view_count) as avg_view_count,
    MAX(view_count) as max_view_count,
    COUNT(DISTINCT category_id) as total_categories,
    COUNT(DISTINCT author) FILTER (WHERE author IS NOT NULL) as total_authors
FROM news_articles;

-- 12. 인기 뉴스 뷰 생성
CREATE OR REPLACE VIEW popular_news AS
SELECT 
    na.*,
    nc.name as category_name,
    nc.color_class as category_color
FROM news_articles na
LEFT JOIN news_categories nc ON na.category_id = nc.id
WHERE na.is_active = true
ORDER BY na.view_count DESC, na.published_at DESC;

-- 13. 최신 뉴스 뷰 생성
CREATE OR REPLACE VIEW latest_news AS
SELECT 
    na.*,
    nc.name as category_name,
    nc.color_class as category_color
FROM news_articles na
LEFT JOIN news_categories nc ON na.category_id = nc.id
WHERE na.is_active = true
ORDER BY na.published_at DESC, na.created_at DESC;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '뉴스 테이블 설정이 완료되었습니다.';
    RAISE NOTICE '- 테이블: news_categories, news_tags, news_articles, news_article_tags';
    RAISE NOTICE '- 인덱스: 성능 최적화를 위한 인덱스들이 생성되었습니다.';
    RAISE NOTICE '- 함수: increment_news_view_count() 함수가 생성되었습니다.';
    RAISE NOTICE '- 트리거: updated_at 자동 갱신 트리거가 설정되었습니다.';
    RAISE NOTICE '- RLS: Row Level Security 정책이 설정되었습니다.';
    RAISE NOTICE '- 뷰: 통계 및 인기/최신 뉴스 뷰가 생성되었습니다.';
END $$;
