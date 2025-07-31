-- News Tables Setup Script
-- This script safely creates all news-related tables and can be run multiple times

-- Create news_categories table
CREATE TABLE IF NOT EXISTS public.news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_class VARCHAR(50) DEFAULT 'bg-gray-100 text-gray-800',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create news_tags table
CREATE TABLE IF NOT EXISTS public.news_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category_id INTEGER REFERENCES public.news_categories(id) ON DELETE SET NULL,
    author VARCHAR(200),
    source_url TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    original_language VARCHAR(10) DEFAULT 'ko',
    is_translated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create news_tag_relations table
CREATE TABLE IF NOT EXISTS public.news_tag_relations (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES public.news_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(news_id, tag_id)
);

-- Insert default news categories if they don't exist
INSERT INTO public.news_categories (name, description, color_class) VALUES
    ('일반뉴스', '일반적인 뉴스', 'bg-blue-100 text-blue-800'),
    ('비즈니스', '비즈니스 관련 뉴스', 'bg-green-100 text-green-800'),
    ('기술', '기술 관련 뉴스', 'bg-purple-100 text-purple-800'),
    ('건강', '건강 관련 뉴스', 'bg-red-100 text-red-800'),
    ('여행', '여행 관련 뉴스', 'bg-yellow-100 text-yellow-800'),
    ('음식', '음식 관련 뉴스', 'bg-orange-100 text-orange-800'),
    ('교육', '교육 관련 뉴스', 'bg-indigo-100 text-indigo-800'),
    ('스포츠', '스포츠 관련 뉴스', 'bg-teal-100 text-teal-800'),
    ('문화', '문화 관련 뉴스', 'bg-pink-100 text-pink-800'),
    ('정치', '정치 관련 뉴스', 'bg-gray-100 text-gray-800')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_category_id ON public.news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON public.news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_is_featured ON public.news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_news_id ON public.news_tag_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tag_relations_tag_id ON public.news_tag_relations(tag_id);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_tag_relations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.news_categories;
CREATE POLICY "Enable read access for all users" ON public.news_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.news_tags;
CREATE POLICY "Enable read access for all users" ON public.news_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for active news" ON public.news;
CREATE POLICY "Enable read access for active news" ON public.news FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.news_tag_relations;
CREATE POLICY "Enable read access for all users" ON public.news_tag_relations FOR SELECT USING (true);

-- Grant necessary permissions
GRANT SELECT ON public.news_categories TO anon, authenticated;
GRANT SELECT ON public.news_tags TO anon, authenticated;
GRANT SELECT ON public.news TO anon, authenticated;
GRANT SELECT ON public.news_tag_relations TO anon, authenticated;

-- Grant full access to authenticated users (for admin functions)
GRANT ALL ON public.news_categories TO authenticated;
GRANT ALL ON public.news_tags TO authenticated;
GRANT ALL ON public.news TO authenticated;
GRANT ALL ON public.news_tag_relations TO authenticated;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_news_categories_updated_at ON public.news_categories;
CREATE TRIGGER update_news_categories_updated_at
    BEFORE UPDATE ON public.news_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_tags_updated_at ON public.news_tags;
CREATE TRIGGER update_news_tags_updated_at
    BEFORE UPDATE ON public.news_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created successfully
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news') THEN
        RAISE NOTICE 'News tables created successfully!';
    ELSE
        RAISE EXCEPTION 'Failed to create news tables';
    END IF;
END $$;
