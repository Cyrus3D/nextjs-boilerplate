-- 뉴스 테이블 생성
CREATE TABLE IF NOT EXISTS news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT '일반',
  tags TEXT[] DEFAULT '{}',
  author VARCHAR(100) NOT NULL DEFAULT 'Admin',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time INTEGER DEFAULT 5,
  view_count INTEGER DEFAULT 0,
  is_breaking BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS news_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color_class VARCHAR(100) DEFAULT 'bg-gray-100 text-gray-800',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 뉴스 카테고리 삽입
INSERT INTO news_categories (name, color_class) VALUES
('현지 뉴스', 'bg-blue-100 text-blue-800'),
('교민 업체', 'bg-green-100 text-green-800'),
('정책', 'bg-purple-100 text-purple-800'),
('교통', 'bg-yellow-100 text-yellow-800'),
('비자', 'bg-red-100 text-red-800'),
('일반', 'bg-gray-100 text-gray-800')
ON CONFLICT (name) DO NOTHING;

-- 뉴스 태그 테이블 생성
CREATE TABLE IF NOT EXISTS news_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 뉴스 태그 삽입
INSERT INTO news_tags (name) VALUES
('속보'), ('정책'), ('교통'), ('비자'), ('코로나'), ('경제'), 
('관광'), ('음식'), ('쇼핑'), ('의료'), ('교육'), ('부동산')
ON CONFLICT (name) DO NOTHING;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_published ON news_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_breaking ON news_articles(is_breaking);
CREATE INDEX IF NOT EXISTS idx_news_articles_tags ON news_articles USING GIN(tags);

-- RLS 정책 설정 (필요한 경우)
-- ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
