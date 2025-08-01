-- 뉴스 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS news_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color_class VARCHAR(100) DEFAULT 'bg-blue-100 text-blue-800',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 태그 테이블 생성
CREATE TABLE IF NOT EXISTS news_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 기사 테이블 생성
CREATE TABLE IF NOT EXISTS news_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT '일반',
  tags TEXT[] DEFAULT '{}',
  author VARCHAR(100) DEFAULT 'Admin',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time INTEGER DEFAULT 5,
  is_breaking BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  source_url TEXT,
  original_language VARCHAR(10) DEFAULT 'ko',
  translated BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 뉴스 카테고리 삽입
INSERT INTO news_categories (name, color_class) VALUES
  ('현지 뉴스', 'bg-red-100 text-red-800'),
  ('교민 업체', 'bg-blue-100 text-blue-800'),
  ('정책', 'bg-green-100 text-green-800'),
  ('교통', 'bg-yellow-100 text-yellow-800'),
  ('비자', 'bg-purple-100 text-purple-800'),
  ('일반', 'bg-gray-100 text-gray-800'),
  ('속보', 'bg-red-600 text-white'),
  ('경제', 'bg-emerald-100 text-emerald-800'),
  ('문화', 'bg-pink-100 text-pink-800'),
  ('스포츠', 'bg-orange-100 text-orange-800')
ON CONFLICT (name) DO NOTHING;

-- 기본 뉴스 태그 삽입
INSERT INTO news_tags (name) VALUES
  ('태국'),
  ('방콕'),
  ('파타야'),
  ('치앙마이'),
  ('푸켓'),
  ('교민'),
  ('비자'),
  ('정책'),
  ('교통'),
  ('경제'),
  ('문화'),
  ('관광'),
  ('코로나'),
  ('날씨'),
  ('축제'),
  ('음식'),
  ('쇼핑'),
  ('부동산'),
  ('투자'),
  ('의료')
ON CONFLICT (name) DO NOTHING;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_published ON news_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_breaking ON news_articles(is_breaking);
CREATE INDEX IF NOT EXISTS idx_news_articles_tags ON news_articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at DESC);

-- 뉴스 조회수 업데이트 함수
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE news_articles 
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 검색 함수
CREATE OR REPLACE FUNCTION search_news_articles(
  search_query TEXT DEFAULT '',
  category_filter TEXT DEFAULT '',
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(100),
  tags TEXT[],
  author VARCHAR(100),
  published_at TIMESTAMP WITH TIME ZONE,
  read_time INTEGER,
  is_breaking BOOLEAN,
  is_published BOOLEAN,
  image_url TEXT,
  source_url TEXT,
  view_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    na.id,
    na.title,
    na.excerpt,
    na.content,
    na.category,
    na.tags,
    na.author,
    na.published_at,
    na.read_time,
    na.is_breaking,
    na.is_published,
    na.image_url,
    na.source_url,
    na.view_count,
    na.created_at,
    na.updated_at
  FROM news_articles na
  WHERE 
    na.is_published = TRUE
    AND (search_query = '' OR 
         na.title ILIKE '%' || search_query || '%' OR 
         na.content ILIKE '%' || search_query || '%' OR
         na.excerpt ILIKE '%' || search_query || '%')
    AND (category_filter = '' OR na.category = category_filter)
  ORDER BY 
    na.is_breaking DESC,
    na.published_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE news_articles IS '뉴스 기사 테이블';
COMMENT ON TABLE news_categories IS '뉴스 카테고리 테이블';
COMMENT ON TABLE news_tags IS '뉴스 태그 테이블';
