-- Check if news tables exist and create them if they don't
-- This script can be run safely multiple times

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION table_exists(table_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
    );
END;
$$ LANGUAGE plpgsql;

-- Check and create news_categories table
DO $$
BEGIN
    IF NOT table_exists('news_categories') THEN
        RAISE NOTICE 'Creating news_categories table...';
        
        CREATE TABLE news_categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            description TEXT,
            color_class VARCHAR(100) DEFAULT 'bg-blue-100 text-blue-800',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Insert default categories
        INSERT INTO news_categories (name, description, color_class) VALUES
        ('일반뉴스', '일반적인 뉴스', 'bg-blue-100 text-blue-800'),
        ('비즈니스', '비즈니스 관련 뉴스', 'bg-green-100 text-green-800'),
        ('기술', '기술 관련 뉴스', 'bg-purple-100 text-purple-800'),
        ('건강', '건강 관련 뉴스', 'bg-red-100 text-red-800'),
        ('여행', '여행 관련 뉴스', 'bg-yellow-100 text-yellow-800'),
        ('음식', '음식 관련 뉴스', 'bg-orange-100 text-orange-800'),
        ('교육', '교육 관련 뉴스', 'bg-indigo-100 text-indigo-800'),
        ('스포츠', '스포츠 관련 뉴스', 'bg-pink-100 text-pink-800'),
        ('문화', '문화 관련 뉴스', 'bg-teal-100 text-teal-800'),
        ('정치', '정치 관련 뉴스', 'bg-gray-100 text-gray-800');
        
        RAISE NOTICE 'news_categories table created successfully';
    ELSE
        RAISE NOTICE 'news_categories table already exists';
    END IF;
END $$;

-- Check and create news table
DO $$
BEGIN
    IF NOT table_exists('news') THEN
        RAISE NOTICE 'Creating news table...';
        
        CREATE TABLE news (
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            view_count INTEGER DEFAULT 0,
            original_language VARCHAR(10) DEFAULT 'ko',
            is_translated BOOLEAN DEFAULT FALSE
        );
        
        RAISE NOTICE 'news table created successfully';
    ELSE
        RAISE NOTICE 'news table already exists';
    END IF;
END $$;

-- Check and create news_tags table
DO $$
BEGIN
    IF NOT table_exists('news_tags') THEN
        RAISE NOTICE 'Creating news_tags table...';
        
        CREATE TABLE news_tags (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Insert default tags
        INSERT INTO news_tags (name) VALUES
        ('태국'),
        ('한국'),
        ('비즈니스'),
        ('기술'),
        ('여행'),
        ('음식'),
        ('건강'),
        ('교육'),
        ('문화'),
        ('정치');
        
        RAISE NOTICE 'news_tags table created successfully';
    ELSE
        RAISE NOTICE 'news_tags table already exists';
    END IF;
END $$;

-- Check and create news_tag_relations table
DO $$
BEGIN
    IF NOT table_exists('news_tag_relations') THEN
        RAISE NOTICE 'Creating news_tag_relations table...';
        
        CREATE TABLE news_tag_relations (
            id SERIAL PRIMARY KEY,
            news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
            tag_id INTEGER REFERENCES news_tags(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(news_id, tag_id)
        );
        
        RAISE NOTICE 'news_tag_relations table created successfully';
    ELSE
        RAISE NOTICE 'news_tag_relations table already exists';
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
    -- Check and create indexes for news table
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_category_id') THEN
        CREATE INDEX idx_news_category_id ON news(category_id);
        RAISE NOTICE 'Created index: idx_news_category_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_is_featured') THEN
        CREATE INDEX idx_news_is_featured ON news(is_featured);
        RAISE NOTICE 'Created index: idx_news_is_featured';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_is_active') THEN
        CREATE INDEX idx_news_is_active ON news(is_active);
        RAISE NOTICE 'Created index: idx_news_is_active';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_published_at') THEN
        CREATE INDEX idx_news_published_at ON news(published_at DESC);
        RAISE NOTICE 'Created index: idx_news_published_at';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_created_at') THEN
        CREATE INDEX idx_news_created_at ON news(created_at DESC);
        RAISE NOTICE 'Created index: idx_news_created_at';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_original_language') THEN
        CREATE INDEX idx_news_original_language ON news(original_language);
        RAISE NOTICE 'Created index: idx_news_original_language';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_is_translated') THEN
        CREATE INDEX idx_news_is_translated ON news(is_translated);
        RAISE NOTICE 'Created index: idx_news_is_translated';
    END IF;
    
    -- Check and create indexes for news_tag_relations table
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_tag_relations_news_id') THEN
        CREATE INDEX idx_news_tag_relations_news_id ON news_tag_relations(news_id);
        RAISE NOTICE 'Created index: idx_news_tag_relations_news_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_tag_relations_tag_id') THEN
        CREATE INDEX idx_news_tag_relations_tag_id ON news_tag_relations(tag_id);
        RAISE NOTICE 'Created index: idx_news_tag_relations_tag_id';
    END IF;
END $$;

-- Create or replace update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_categories_updated_at') THEN
        CREATE TRIGGER update_news_categories_updated_at 
        BEFORE UPDATE ON news_categories 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created trigger: update_news_categories_updated_at';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_news_updated_at') THEN
        CREATE TRIGGER update_news_updated_at 
        BEFORE UPDATE ON news 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created trigger: update_news_updated_at';
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Public can read news_categories" ON news_categories;
    DROP POLICY IF EXISTS "Public can read active news" ON news;
    DROP POLICY IF EXISTS "Public can read news_tags" ON news_tags;
    DROP POLICY IF EXISTS "Public can read news_tag_relations" ON news_tag_relations;
    DROP POLICY IF EXISTS "Authenticated users can manage news_categories" ON news_categories;
    DROP POLICY IF EXISTS "Authenticated users can manage news" ON news;
    DROP POLICY IF EXISTS "Authenticated users can manage news_tags" ON news_tags;
    DROP POLICY IF EXISTS "Authenticated users can manage news_tag_relations" ON news_tag_relations;
    
    -- Create new policies
    CREATE POLICY "Public can read news_categories" ON news_categories FOR SELECT USING (true);
    CREATE POLICY "Public can read active news" ON news FOR SELECT USING (is_active = true);
    CREATE POLICY "Public can read news_tags" ON news_tags FOR SELECT USING (true);
    CREATE POLICY "Public can read news_tag_relations" ON news_tag_relations FOR SELECT USING (true);
    
    -- Create policies for authenticated users (admin access)
    CREATE POLICY "Authenticated users can manage news_categories" ON news_categories FOR ALL USING (auth.role() = 'authenticated');
    CREATE POLICY "Authenticated users can manage news" ON news FOR ALL USING (auth.role() = 'authenticated');
    CREATE POLICY "Authenticated users can manage news_tags" ON news_tags FOR ALL USING (auth.role() = 'authenticated');
    CREATE POLICY "Authenticated users can manage news_tag_relations" ON news_tag_relations FOR ALL USING (auth.role() = 'authenticated');
    
    RAISE NOTICE 'RLS policies created successfully';
END $$;

-- Insert sample news data if news table is empty
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM news) = 0 THEN
        RAISE NOTICE 'Inserting sample news data...';
        
        INSERT INTO news (title, content, summary, category_id, author, source_url, is_featured, original_language) VALUES
        ('태국 비즈니스 환경 개선', '태국 정부가 외국인 투자 유치를 위한 새로운 정책을 발표했습니다. 이번 정책은 특히 기술 분야와 제조업 분야에 대한 투자를 장려하는 내용을 담고 있습니다. 새로운 정책에 따르면 외국인 투자자들은 더 간소화된 절차를 통해 사업을 시작할 수 있으며, 세제 혜택도 확대됩니다.', '태국 정부의 새로운 외국인 투자 정책 발표', 2, '뉴스팀', 'https://example.com/news1', true, 'ko'),
        ('한국 기업의 태국 진출 확대', '최근 한국의 여러 대기업들이 태국 시장 진출을 확대하고 있습니다. 특히 IT 서비스와 제조업 분야에서 활발한 움직임을 보이고 있습니다. 삼성, LG, 현대 등 주요 기업들이 태국 내 생산 시설을 확장하고 있으며, 이는 태국의 경제 성장에도 긍정적인 영향을 미치고 있습니다.', '한국 기업들의 태국 시장 진출 현황', 2, '경제팀', 'https://example.com/news2', false, 'ko'),
        ('태국 여행 산업 회복세', '코로나19 이후 태국의 관광 산업이 빠른 회복세를 보이고 있습니다. 특히 한국 관광객들의 방문이 크게 증가하고 있습니다. 태국 관광청에 따르면 올해 한국 관광객 수는 전년 대비 200% 이상 증가했으며, 이는 태국 경제에 큰 도움이 되고 있습니다. 방콕, 파타야, 푸켓 등 주요 관광지들이 다시 활기를 되찾고 있습니다.', '태국 관광 산업의 회복과 한국 관광객 증가', 5, '여행팀', 'https://example.com/news3', true, 'ko');
        
        -- Link sample news with tags
        INSERT INTO news_tag_relations (news_id, tag_id) VALUES
        (1, 1), (1, 3), -- 태국, 비즈니스
        (2, 1), (2, 2), (2, 3), -- 태국, 한국, 비즈니스
        (3, 1), (3, 2), (3, 5); -- 태국, 한국, 여행
        
        RAISE NOTICE 'Sample news data inserted successfully';
    ELSE
        RAISE NOTICE 'News table already contains data, skipping sample data insertion';
    END IF;
END $$;

-- Clean up the helper function
DROP FUNCTION IF EXISTS table_exists(text);

-- Final status check
DO $$
DECLARE
    news_count INTEGER;
    categories_count INTEGER;
    tags_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO news_count FROM news;
    SELECT COUNT(*) INTO categories_count FROM news_categories;
    SELECT COUNT(*) INTO tags_count FROM news_tags;
    
    RAISE NOTICE '=== NEWS TABLES SETUP COMPLETE ===';
    RAISE NOTICE 'News articles: %', news_count;
    RAISE NOTICE 'News categories: %', categories_count;
    RAISE NOTICE 'News tags: %', tags_count;
    RAISE NOTICE '================================';
END $$;
