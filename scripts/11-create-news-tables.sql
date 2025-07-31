-- 뉴스 카테고리 테이블
CREATE TABLE IF NOT EXISTS news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color_class VARCHAR(100) DEFAULT 'bg-gray-100 text-gray-800',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 태그 테이블
CREATE TABLE IF NOT EXISTS news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color_class VARCHAR(100) DEFAULT 'bg-blue-100 text-blue-800',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 기사 테이블
CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    category_id INTEGER REFERENCES news_categories(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(200) DEFAULT '알 수 없음',
    author VARCHAR(100),
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER DEFAULT 0,
    is_breaking BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 기사-태그 연결 테이블 (다대다 관계)
CREATE TABLE IF NOT EXISTS news_article_tags (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES news_articles(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, tag_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_articles_category_id ON news_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_active ON news_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_breaking ON news_articles(is_breaking);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_pinned ON news_articles(is_pinned);
CREATE INDEX IF NOT EXISTS idx_news_articles_view_count ON news_articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_title ON news_articles USING gin(to_tsvector('korean', title));
CREATE INDEX IF NOT EXISTS idx_news_articles_summary ON news_articles USING gin(to_tsvector('korean', summary));
CREATE INDEX IF NOT EXISTS idx_news_article_tags_article_id ON news_article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_news_article_tags_tag_id ON news_article_tags(tag_id);

-- 전문 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_news_articles_title_search ON news_articles USING gin(to_tsvector('korean', title));
CREATE INDEX IF NOT EXISTS idx_news_articles_summary_search ON news_articles USING gin(to_tsvector('korean', summary));
CREATE INDEX IF NOT EXISTS idx_news_articles_content_search ON news_articles USING gin(to_tsvector('korean', content));

-- RLS (Row Level Security) 활성화
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_article_tags ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "Enable read access for all users" ON news_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Enable read access for all users" ON news_tags
    FOR SELECT USING (is_active = true);

CREATE POLICY "Enable read access for all users" ON news_articles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Enable read access for all users" ON news_article_tags
    FOR SELECT USING (true);

-- 관리자만 쓰기 가능하도록 정책 설정 (나중에 관리자 시스템 구현 시 사용)
CREATE POLICY "Enable all access for admin users" ON news_categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable all access for admin users" ON news_tags
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable all access for admin users" ON news_articles
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Enable all access for admin users" ON news_article_tags
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_news_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS update_news_categories_updated_at ON news_categories;
CREATE TRIGGER update_news_categories_updated_at
    BEFORE UPDATE ON news_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_news_updated_at_column();

DROP TRIGGER IF EXISTS update_news_tags_updated_at ON news_tags;
CREATE TRIGGER update_news_tags_updated_at
    BEFORE UPDATE ON news_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_news_updated_at_column();

DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
CREATE TRIGGER update_news_articles_updated_at
    BEFORE UPDATE ON news_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_news_updated_at_column();

-- 뷰 생성 (조인된 데이터를 쉽게 조회하기 위함)
CREATE OR REPLACE VIEW news_articles_with_category AS
SELECT 
    na.*,
    nc.name as category_name,
    nc.color_class as category_color_class
FROM news_articles na
LEFT JOIN news_categories nc ON na.category_id = nc.id
WHERE na.is_active = true;

-- 태그가 포함된 뉴스 기사 뷰
CREATE OR REPLACE VIEW news_articles_with_tags AS
SELECT 
    na.*,
    nc.name as category_name,
    nc.color_class as category_color_class,
    COALESCE(
        array_agg(nt.name ORDER BY nt.name) FILTER (WHERE nt.name IS NOT NULL),
        ARRAY[]::VARCHAR[]
    ) as tags
FROM news_articles na
LEFT JOIN news_categories nc ON na.category_id = nc.id
LEFT JOIN news_article_tags nat ON na.id = nat.article_id
LEFT JOIN news_tags nt ON nat.tag_id = nt.id AND nt.is_active = true
WHERE na.is_active = true
GROUP BY na.id, nc.name, nc.color_class;

COMMENT ON TABLE news_categories IS '뉴스 카테고리 테이블';
COMMENT ON TABLE news_tags IS '뉴스 태그 테이블';
COMMENT ON TABLE news_articles IS '뉴스 기사 테이블';
COMMENT ON TABLE news_article_tags IS '뉴스 기사-태그 연결 테이블';
