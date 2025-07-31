-- 뉴스 테이블 생성 스크립트 (안전한 버전)
-- 이미 존재하는 테이블은 건드리지 않고, 없는 테이블만 생성합니다.

-- 1. 뉴스 카테고리 테이블
CREATE TABLE IF NOT EXISTS news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_class VARCHAR(50) DEFAULT 'bg-gray-100 text-gray-800',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 뉴스 태그 테이블
CREATE TABLE IF NOT EXISTS news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 뉴스 메인 테이블
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
    view_count INTEGER DEFAULT 0,
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 뉴스-태그 관계 테이블
CREATE TABLE IF NOT EXISTS news_tag_relations (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(news_id, tag_id)
);

-- 5. 기본 카테고리 데이터 삽입 (중복 방지)
INSERT INTO news_categories (name, description, color_class) VALUES
    ('일반뉴스', '일반적인 뉴스', 'bg-blue-100 text-blue-800'),
    ('비즈니스', '경제 및 비즈니스 뉴스', 'bg-green-100 text-green-800'),
    ('기술', '기술 및 IT 뉴스', 'bg-purple-100 text-purple-800'),
    ('건강', '건강 및 의료 뉴스', 'bg-red-100 text-red-800'),
    ('여행', '여행 및 관광 뉴스', 'bg-yellow-100 text-yellow-800'),
    ('음식', '음식 및 요리 뉴스', 'bg-orange-100 text-orange-800'),
    ('교육', '교육 관련 뉴스', 'bg-indigo-100 text-indigo-800'),
    ('스포츠', '스포츠 뉴스', 'bg-teal-100 text-teal-800'),
    ('문화', '문화 및 예술 뉴스', 'bg-pink-100 text-pink-800'),
    ('정치', '정치 관련 뉴스', 'bg-gray-100 text-gray-800')
ON CONFLICT (name) DO NOTHING;

-- 6. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_view_count ON news(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_news_id ON news_tag_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_tag_id ON news_tag_relations(tag_id);

-- 7. RLS (Row Level Security) 정책 설정
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- 8. 공개 읽기 정책 (모든 사용자가 읽을 수 있음)
DO $$ 
BEGIN
    -- news_categories 읽기 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_categories' AND policyname = 'news_categories_select_policy') THEN
        CREATE POLICY news_categories_select_policy ON news_categories FOR SELECT USING (true);
    END IF;

    -- news_tags 읽기 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_tags' AND policyname = 'news_tags_select_policy') THEN
        CREATE POLICY news_tags_select_policy ON news_tags FOR SELECT USING (true);
    END IF;

    -- news 읽기 정책 (활성화된 뉴스만)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'news_select_policy') THEN
        CREATE POLICY news_select_policy ON news FOR SELECT USING (is_active = true);
    END IF;

    -- news_tag_relations 읽기 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_tag_relations' AND policyname = 'news_tag_relations_select_policy') THEN
        CREATE POLICY news_tag_relations_select_policy ON news_tag_relations FOR SELECT USING (true);
    END IF;
END $$;

-- 9. 관리자 권한 정책 (서비스 역할 키로 모든 작업 가능)
DO $$ 
BEGIN
    -- news_categories 관리자 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_categories' AND policyname = 'news_categories_admin_policy') THEN
        CREATE POLICY news_categories_admin_policy ON news_categories FOR ALL USING (auth.role() = 'service_role');
    END IF;

    -- news_tags 관리자 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_tags' AND policyname = 'news_tags_admin_policy') THEN
        CREATE POLICY news_tags_admin_policy ON news_tags FOR ALL USING (auth.role() = 'service_role');
    END IF;

    -- news 관리자 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'news_admin_policy') THEN
        CREATE POLICY news_admin_policy ON news FOR ALL USING (auth.role() = 'service_role');
    END IF;

    -- news_tag_relations 관리자 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_tag_relations' AND policyname = 'news_tag_relations_admin_policy') THEN
        CREATE POLICY news_tag_relations_admin_policy ON news_tag_relations FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

-- 10. 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. 트리거 생성
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_categories_updated_at') THEN
        CREATE TRIGGER update_news_categories_updated_at BEFORE UPDATE ON news_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_tags_updated_at') THEN
        CREATE TRIGGER update_news_tags_updated_at BEFORE UPDATE ON news_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_updated_at') THEN
        CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 완료 메시지
SELECT 'News tables setup completed successfully!' as status;
