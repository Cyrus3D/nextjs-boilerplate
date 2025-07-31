-- 뉴스 테이블 생성
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    source VARCHAR(200) NOT NULL,
    original_url TEXT NOT NULL UNIQUE,
    published_at TIMESTAMP,
    category VARCHAR(50) DEFAULT '일반',
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_title ON news USING gin(to_tsvector('korean', title));
CREATE INDEX IF NOT EXISTS idx_news_content ON news USING gin(to_tsvector('korean', content));
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_tags ON news USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_original_language ON news(original_language);
CREATE INDEX IF NOT EXISTS idx_news_is_translated ON news(is_translated);

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
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 활성화된 뉴스를 읽을 수 있도록 허용
CREATE POLICY "Anyone can view active news" ON news
    FOR SELECT USING (is_active = true);

-- 인증된 사용자만 뉴스를 생성, 수정, 삭제할 수 있도록 제한
CREATE POLICY "Authenticated users can insert news" ON news
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update news" ON news
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news" ON news
    FOR DELETE USING (auth.role() = 'authenticated');
