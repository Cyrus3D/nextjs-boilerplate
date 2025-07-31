-- 뉴스 카테고리 테이블
CREATE TABLE IF NOT EXISTS news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color_class VARCHAR(100) DEFAULT 'bg-gray-100 text-gray-800',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 기사 테이블
CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT,
    category_id INTEGER REFERENCES news_categories(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(200) NOT NULL,
    author VARCHAR(200),
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER DEFAULT 0,
    is_breaking BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 태그 테이블
CREATE TABLE IF NOT EXISTS news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
CREATE INDEX IF NOT EXISTS idx_news_articles_is_breaking ON news_articles(is_breaking);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_pinned ON news_articles(is_pinned);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_active ON news_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_news_articles_view_count ON news_articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_article_tags_article_id ON news_article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_news_article_tags_tag_id ON news_article_tags(tag_id);

-- 전체 텍스트 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_news_articles_search ON news_articles USING gin(to_tsvector('korean', title || ' ' || summary || ' ' || COALESCE(content, '')));

-- 업데이트 시간 자동 갱신 함수
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

DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
CREATE TRIGGER update_news_articles_updated_at
    BEFORE UPDATE ON news_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_news_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_article_tags ENABLE ROW LEVEL SECURITY;

-- 읽기 권한 (모든 사용자)
CREATE POLICY "Allow read access to news_categories" ON news_categories FOR SELECT USING (true);
CREATE POLICY "Allow read access to news_articles" ON news_articles FOR SELECT USING (is_active = true);
CREATE POLICY "Allow read access to news_tags" ON news_tags FOR SELECT USING (true);
CREATE POLICY "Allow read access to news_article_tags" ON news_article_tags FOR SELECT USING (true);

-- 관리자 권한 (모든 작업)
CREATE POLICY "Allow admin full access to news_categories" ON news_categories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access to news_articles" ON news_articles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access to news_tags" ON news_tags FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access to news_article_tags" ON news_article_tags FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
