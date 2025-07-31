-- 뉴스 테이블들이 존재하지 않는 경우에만 생성하는 안전한 스크립트

-- 1. 뉴스 카테고리 테이블
CREATE TABLE IF NOT EXISTS news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color_class VARCHAR(100) DEFAULT 'bg-gray-100 text-gray-800',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 뉴스 태그 테이블
CREATE TABLE IF NOT EXISTS news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 뉴스 메인 테이블
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES news_categories(id) ON DELETE SET NULL,
    author VARCHAR(255),
    source_url TEXT,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 뉴스-태그 관계 테이블
CREATE TABLE IF NOT EXISTS news_tag_relations (
    id SERIAL PRIMARY KEY,
    news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(news_id, tag_id)
);

-- 5. 인덱스 생성 (존재하지 않는 경우에만)
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_view_count ON news(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_news_id ON news_tag_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_tag_id ON news_tag_relations(tag_id);

-- 6. 기본 카테고리 데이터 삽입 (존재하지 않는 경우에만)
INSERT INTO news_categories (name, color_class) VALUES
    ('정치', 'bg-red-100 text-red-800'),
    ('경제', 'bg-blue-100 text-blue-800'),
    ('사회', 'bg-green-100 text-green-800'),
    ('문화', 'bg-purple-100 text-purple-800'),
    ('스포츠', 'bg-orange-100 text-orange-800'),
    ('국제', 'bg-indigo-100 text-indigo-800'),
    ('생활', 'bg-pink-100 text-pink-800'),
    ('기술', 'bg-cyan-100 text-cyan-800')
ON CONFLICT (name) DO NOTHING;

-- 7. 뉴스 조회수 증가 함수 생성
CREATE OR REPLACE FUNCTION increment_news_view_count(news_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE news 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = news_id;
END;
$$ LANGUAGE plpgsql;

-- 8. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. 업데이트 트리거 생성 (존재하지 않는 경우에만)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_update_news_updated_at'
    ) THEN
        CREATE TRIGGER trigger_update_news_updated_at
            BEFORE UPDATE ON news
            FOR EACH ROW
            EXECUTE FUNCTION update_news_updated_at();
    END IF;
END $$;

-- 10. RLS (Row Level Security) 정책 설정
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 생성
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON news_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON news_tags FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON news FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON news_tag_relations FOR SELECT USING (true);

-- 인증된 사용자만 쓰기 가능하도록 정책 생성
CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON news_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable update for authenticated users only" ON news_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable delete for authenticated users only" ON news_categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON news_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable update for authenticated users only" ON news_tags FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable delete for authenticated users only" ON news_tags FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable update for authenticated users only" ON news FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable delete for authenticated users only" ON news FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON news_tag_relations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable update for authenticated users only" ON news_tag_relations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Enable delete for authenticated users only" ON news_tag_relations FOR DELETE USING (auth.role() = 'authenticated');

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'News tables setup completed successfully!';
    RAISE NOTICE 'Tables created: news_categories, news_tags, news, news_tag_relations';
    RAISE NOTICE 'Indexes, functions, triggers, and RLS policies have been set up.';
END $$;
