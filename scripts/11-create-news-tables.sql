-- 뉴스 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color_class VARCHAR(100) DEFAULT 'bg-gray-100 text-gray-800',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 태그 테이블 생성
CREATE TABLE IF NOT EXISTS news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color_class VARCHAR(100) DEFAULT 'bg-blue-100 text-blue-800',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 기사 테이블 생성
CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    category_id INTEGER REFERENCES news_categories(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(200),
    author VARCHAR(200),
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER DEFAULT 0,
    is_breaking BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 기사-태그 연결 테이블 생성
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
CREATE INDEX IF NOT EXISTS idx_news_articles_title ON news_articles USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_news_articles_summary ON news_articles USING gin(to_tsvector('english', summary));
CREATE INDEX IF NOT EXISTS idx_news_article_tags_article_id ON news_article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_news_article_tags_tag_id ON news_article_tags(tag_id);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
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
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_tags_updated_at ON news_tags;
CREATE TRIGGER update_news_tags_updated_at
    BEFORE UPDATE ON news_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
CREATE TRIGGER update_news_articles_updated_at
    BEFORE UPDATE ON news_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_article_tags ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public read access for news_categories" ON news_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for news_tags" ON news_tags
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for news_articles" ON news_articles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for news_article_tags" ON news_article_tags
    FOR SELECT USING (true);

-- 관리자 전체 권한 정책 (authenticated 사용자 중 admin 역할)
CREATE POLICY "Admin full access for news_categories" ON news_categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access for news_tags" ON news_tags
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access for news_articles" ON news_articles
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access for news_article_tags" ON news_article_tags
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
