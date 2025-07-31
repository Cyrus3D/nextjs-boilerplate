-- 뉴스 테이블 생성
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    source VARCHAR(200) NOT NULL,
    original_url TEXT NOT NULL UNIQUE,
    published_at TIMESTAMP WITH TIME ZONE,
    category VARCHAR(50) DEFAULT '일반',
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_tags ON news USING GIN(tags);

-- RLS 정책 설정
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성화된 뉴스를 읽을 수 있도록 허용
CREATE POLICY "Anyone can view active news" ON news
    FOR SELECT USING (is_active = true);

-- 인증된 사용자만 뉴스를 관리할 수 있도록 허용 (관리자 전용)
CREATE POLICY "Authenticated users can manage news" ON news
    FOR ALL USING (auth.role() = 'authenticated');

-- 뉴스 조회수 업데이트 함수
CREATE OR REPLACE FUNCTION increment_news_view_count(news_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE news 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = news_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 뉴스 검색 함수
CREATE OR REPLACE FUNCTION search_news(
    search_query TEXT DEFAULT '',
    category_filter TEXT DEFAULT '',
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    content TEXT,
    image_url TEXT,
    source VARCHAR(200),
    original_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category VARCHAR(50),
    tags TEXT[],
    is_featured BOOLEAN,
    view_count INTEGER,
    original_language VARCHAR(10),
    is_translated BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.summary,
        n.content,
        n.image_url,
        n.source,
        n.original_url,
        n.published_at,
        n.category,
        n.tags,
        n.is_featured,
        n.view_count,
        n.original_language,
        n.is_translated,
        n.created_at
    FROM news n
    WHERE 
        n.is_active = true
        AND (search_query = '' OR 
             n.title ILIKE '%' || search_query || '%' OR 
             n.summary ILIKE '%' || search_query || '%' OR 
             n.content ILIKE '%' || search_query || '%' OR
             search_query = ANY(n.tags))
        AND (category_filter = '' OR n.category = category_filter)
    ORDER BY 
        n.is_featured DESC,
        n.published_at DESC NULLS LAST,
        n.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 특성 뉴스 가져오기 함수
CREATE OR REPLACE FUNCTION get_featured_news(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    image_url TEXT,
    source VARCHAR(200),
    original_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category VARCHAR(50),
    view_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.summary,
        n.image_url,
        n.source,
        n.original_url,
        n.published_at,
        n.category,
        n.view_count
    FROM news n
    WHERE 
        n.is_active = true
        AND n.is_featured = true
    ORDER BY 
        n.published_at DESC NULLS LAST,
        n.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 카테고리별 뉴스 개수 함수
CREATE OR REPLACE FUNCTION get_news_count_by_category()
RETURNS TABLE (
    category VARCHAR(50),
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.category,
        COUNT(*) as count
    FROM news n
    WHERE n.is_active = true
    GROUP BY n.category
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 트리거 생성
DROP TRIGGER IF EXISTS trigger_update_news_updated_at ON news;
CREATE TRIGGER trigger_update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_news_updated_at();

-- 샘플 카테고리 데이터 (필요시)
-- INSERT INTO news (title, summary, content, source, original_url, category, tags, is_featured) VALUES
-- ('샘플 뉴스', '이것은 샘플 뉴스입니다.', '샘플 뉴스의 전체 내용입니다.', '샘플 출처', 'https://example.com/sample', '일반', ARRAY['샘플', '테스트'], false);

COMMENT ON TABLE news IS '뉴스 기사 정보를 저장하는 테이블';
COMMENT ON COLUMN news.id IS '뉴스 고유 ID';
COMMENT ON COLUMN news.title IS '뉴스 제목';
COMMENT ON COLUMN news.summary IS '뉴스 요약';
COMMENT ON COLUMN news.content IS '뉴스 전체 내용';
COMMENT ON COLUMN news.image_url IS '뉴스 대표 이미지 URL';
COMMENT ON COLUMN news.source IS '뉴스 출처';
COMMENT ON COLUMN news.original_url IS '원본 뉴스 URL';
COMMENT ON COLUMN news.published_at IS '뉴스 발행일';
COMMENT ON COLUMN news.category IS '뉴스 카테고리';
COMMENT ON COLUMN news.tags IS '뉴스 태그 배열';
COMMENT ON COLUMN news.is_active IS '뉴스 활성화 상태';
COMMENT ON COLUMN news.is_featured IS '특성 뉴스 여부';
COMMENT ON COLUMN news.view_count IS '뉴스 조회수';
COMMENT ON COLUMN news.original_language IS '원본 언어 (ko, en, th)';
COMMENT ON COLUMN news.is_translated IS '번역된 뉴스 여부';
COMMENT ON COLUMN news.created_at IS '생성일시';
COMMENT ON COLUMN news.updated_at IS '수정일시';
