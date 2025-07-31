-- 뉴스 관련 테이블 생성 스크립트 (안전한 실행을 위한 체크 포함)

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 뉴스 메인 테이블
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category_id INTEGER REFERENCES news_categories(id) ON DELETE SET NULL
);

-- 4. 뉴스-태그 관계 테이블
CREATE TABLE IF NOT EXISTS news_tag_relations (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(news_id, tag_id)
);

-- 5. 인덱스 생성 (존재하지 않는 경우에만)
DO $$
BEGIN
    -- news 테이블 인덱스
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_published_at') THEN
        CREATE INDEX idx_news_published_at ON news(published_at DESC);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_is_active') THEN
        CREATE INDEX idx_news_is_active ON news(is_active);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_is_featured') THEN
        CREATE INDEX idx_news_is_featured ON news(is_featured);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_category_id') THEN
        CREATE INDEX idx_news_category_id ON news(category_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_view_count') THEN
        CREATE INDEX idx_news_view_count ON news(view_count DESC);
    END IF;
    
    -- news_tag_relations 테이블 인덱스
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_tag_relations_news_id') THEN
        CREATE INDEX idx_news_tag_relations_news_id ON news_tag_relations(news_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_tag_relations_tag_id') THEN
        CREATE INDEX idx_news_tag_relations_tag_id ON news_tag_relations(tag_id);
    END IF;
    
    -- news_categories 테이블 인덱스
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_categories_is_active') THEN
        CREATE INDEX idx_news_categories_is_active ON news_categories(is_active);
    END IF;
END
$$;

-- 6. 트리거 함수 생성 (업데이트 시간 자동 갱신)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. 트리거 생성 (존재하지 않는 경우에만)
DO $$
BEGIN
    -- news 테이블 트리거
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_updated_at') THEN
        CREATE TRIGGER update_news_updated_at
            BEFORE UPDATE ON news
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- news_categories 테이블 트리거
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_categories_updated_at') THEN
        CREATE TRIGGER update_news_categories_updated_at
            BEFORE UPDATE ON news_categories
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- news_tags 테이블 트리거
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_tags_updated_at') THEN
        CREATE TRIGGER update_news_tags_updated_at
            BEFORE UPDATE ON news_tags
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- 8. RLS (Row Level Security) 정책 설정
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- 9. 기본 정책 생성 (모든 사용자가 읽기 가능, 인증된 사용자만 쓰기 가능)
DO $$
BEGIN
    -- news 테이블 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_select_policy') THEN
        CREATE POLICY news_select_policy ON news FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_insert_policy') THEN
        CREATE POLICY news_insert_policy ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_update_policy') THEN
        CREATE POLICY news_update_policy ON news FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_delete_policy') THEN
        CREATE POLICY news_delete_policy ON news FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
    
    -- news_categories 테이블 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_categories_select_policy') THEN
        CREATE POLICY news_categories_select_policy ON news_categories FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_categories_insert_policy') THEN
        CREATE POLICY news_categories_insert_policy ON news_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_categories_update_policy') THEN
        CREATE POLICY news_categories_update_policy ON news_categories FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_categories_delete_policy') THEN
        CREATE POLICY news_categories_delete_policy ON news_categories FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
    
    -- news_tags 테이블 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_tags_select_policy') THEN
        CREATE POLICY news_tags_select_policy ON news_tags FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_tags_insert_policy') THEN
        CREATE POLICY news_tags_insert_policy ON news_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_tags_update_policy') THEN
        CREATE POLICY news_tags_update_policy ON news_tags FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_tags_delete_policy') THEN
        CREATE POLICY news_tags_delete_policy ON news_tags FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
    
    -- news_tag_relations 테이블 정책
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_tag_relations_select_policy') THEN
        CREATE POLICY news_tag_relations_select_policy ON news_tag_relations FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_tag_relations_insert_policy') THEN
        CREATE POLICY news_tag_relations_insert_policy ON news_tag_relations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_tag_relations_update_policy') THEN
        CREATE POLICY news_tag_relations_update_policy ON news_tag_relations FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'news_tag_relations_delete_policy') THEN
        CREATE POLICY news_tag_relations_delete_policy ON news_tag_relations FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END
$$;

-- 10. 기본 카테고리 데이터 삽입
INSERT INTO news_categories (name, color_class) VALUES
    ('정치', 'bg-red-100 text-red-800'),
    ('경제', 'bg-green-100 text-green-800'),
    ('사회', 'bg-blue-100 text-blue-800'),
    ('문화', 'bg-purple-100 text-purple-800'),
    ('스포츠', 'bg-orange-100 text-orange-800'),
    ('국제', 'bg-indigo-100 text-indigo-800'),
    ('생활', 'bg-pink-100 text-pink-800'),
    ('기술', 'bg-gray-100 text-gray-800'),
    ('기타', 'bg-gray-100 text-gray-800')
ON CONFLICT (name) DO NOTHING;

-- 11. 기본 태그 데이터 삽입
INSERT INTO news_tags (name) VALUES
    ('뉴스'),
    ('속보'),
    ('분석'),
    ('인터뷰'),
    ('리포트'),
    ('현장'),
    ('독점'),
    ('특집')
ON CONFLICT (name) DO NOTHING;

-- 12. 조회수 증가 함수 생성
CREATE OR REPLACE FUNCTION increment_news_view_count(news_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE news 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = news_id;
END;
$$ LANGUAGE plpgsql;

-- 13. 뉴스 검색 함수 생성
CREATE OR REPLACE FUNCTION search_news(search_term TEXT, category_filter INTEGER DEFAULT NULL, limit_count INTEGER DEFAULT 10, offset_count INTEGER DEFAULT 0)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    summary TEXT,
    content TEXT,
    author VARCHAR(255),
    source_url TEXT,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER,
    is_featured BOOLEAN,
    is_active BOOLEAN,
    original_language VARCHAR(10),
    is_translated BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    category_id INTEGER,
    category_name VARCHAR(100),
    category_color_class VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.summary,
        n.content,
        n.author,
        n.source_url,
        n.image_url,
        n.published_at,
        n.view_count,
        n.is_featured,
        n.is_active,
        n.original_language,
        n.is_translated,
        n.created_at,
        n.updated_at,
        n.category_id,
        nc.name as category_name,
        nc.color_class as category_color_class
    FROM news n
    LEFT JOIN news_categories nc ON n.category_id = nc.id
    WHERE 
        n.is_active = true
        AND (search_term IS NULL OR search_term = '' OR 
             n.title ILIKE '%' || search_term || '%' OR 
             n.summary ILIKE '%' || search_term || '%' OR 
             n.content ILIKE '%' || search_term || '%')
        AND (category_filter IS NULL OR n.category_id = category_filter)
    ORDER BY n.published_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '뉴스 테이블 설정이 완료되었습니다.';
    RAISE NOTICE '- 테이블: news, news_categories, news_tags, news_tag_relations';
    RAISE NOTICE '- 인덱스: 성능 최적화를 위한 인덱스들이 생성되었습니다.';
    RAISE NOTICE '- 트리거: updated_at 자동 갱신 트리거가 설정되었습니다.';
    RAISE NOTICE '- RLS: Row Level Security 정책이 설정되었습니다.';
    RAISE NOTICE '- 함수: increment_news_view_count, search_news 함수가 생성되었습니다.';
    RAISE NOTICE '- 기본 데이터: 카테고리와 태그 기본 데이터가 삽입되었습니다.';
END
$$;
