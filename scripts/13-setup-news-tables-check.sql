-- 뉴스 관련 테이블 생성 스크립트 (안전한 실행을 위한 체크 포함)

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

-- 3. 뉴스 메인 테이블
CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    author VARCHAR(200),
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

-- 5. 인덱스 생성 (존재하지 않는 경우에만)
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category_id ON news_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_active ON news_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_featured ON news_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_articles_view_count ON news_articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_article_tags_article_id ON news_article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_news_article_tags_tag_id ON news_article_tags(tag_id);

-- 6. 트리거 함수 생성 (업데이트 시간 자동 갱신)
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. 트리거 생성 (존재하지 않는 경우에만)
DROP TRIGGER IF EXISTS trigger_update_news_updated_at ON news_articles;
CREATE TRIGGER trigger_update_news_updated_at
    BEFORE UPDATE ON news_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_news_updated_at();

-- 8. RLS (Row Level Security) 정책 설정
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_article_tags ENABLE ROW LEVEL SECURITY;

-- 읽기 정책 (모든 사용자가 활성화된 뉴스 읽기 가능)
CREATE POLICY IF NOT EXISTS "Anyone can read active news categories" ON news_categories
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can read news tags" ON news_tags
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can read active news articles" ON news_articles
    FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "Anyone can read news article tags" ON news_article_tags
    FOR SELECT USING (true);

-- 관리자 정책 (인증된 사용자만 수정 가능)
CREATE POLICY IF NOT EXISTS "Authenticated users can manage news categories" ON news_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can manage news tags" ON news_tags
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can manage news articles" ON news_articles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can manage news article tags" ON news_article_tags
    FOR ALL USING (auth.role() = 'authenticated');

-- 9. 기본 카테고리 데이터 삽입
INSERT INTO news_categories (name, color_class) VALUES
    ('정치', 'bg-red-100 text-red-800'),
    ('경제', 'bg-blue-100 text-blue-800'),
    ('사회', 'bg-green-100 text-green-800'),
    ('문화', 'bg-purple-100 text-purple-800'),
    ('스포츠', 'bg-orange-100 text-orange-800'),
    ('기술', 'bg-cyan-100 text-cyan-800'),
    ('국제', 'bg-yellow-100 text-yellow-800'),
    ('기타', 'bg-gray-100 text-gray-800')
ON CONFLICT (name) DO NOTHING;

-- 10. 기본 태그 데이터 삽입
INSERT INTO news_tags (name) VALUES
    ('속보'),
    ('분석'),
    ('인터뷰'),
    ('현장'),
    ('독점'),
    ('심층보도'),
    ('데이터'),
    ('트렌드'),
    ('이슈'),
    ('화제')
ON CONFLICT (name) DO NOTHING;

-- 11. 조회수 증가 함수 생성
CREATE OR REPLACE FUNCTION increment_news_view_count(news_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE news_articles 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = news_id;
END;
$$ LANGUAGE plpgsql;

-- 12. 뉴스 통계 뷰 생성
CREATE OR REPLACE VIEW news_statistics AS
SELECT 
    COUNT(*) as total_articles,
    COUNT(*) FILTER (WHERE is_active = true) as active_articles,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_articles,
    SUM(view_count) as total_views,
    AVG(view_count) as avg_views,
    COUNT(DISTINCT category_id) as categories_used,
    COUNT(DISTINCT author) FILTER (WHERE author IS NOT NULL) as unique_authors
FROM news_articles;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '뉴스 테이블 설정이 완료되었습니다.';
    RAISE NOTICE '- 테이블: news_categories, news_tags, news_articles, news_article_tags';
    RAISE NOTICE '- 인덱스: 성능 최적화를 위한 인덱스 생성 완료';
    RAISE NOTICE '- 함수: increment_news_view_count() 생성 완료';
    RAISE NOTICE '- 트리거: 자동 업데이트 시간 갱신 설정 완료';
    RAISE NOTICE '- RLS: 보안 정책 설정 완료';
    RAISE NOTICE '- 기본 데이터: 카테고리 및 태그 삽입 완료';
END $$;
