-- Drop existing news tables if they exist to recreate with proper structure
DROP TABLE IF EXISTS news_article_tags CASCADE;
DROP TABLE IF EXISTS news_tags CASCADE;
DROP TABLE IF EXISTS news_articles CASCADE;
DROP TABLE IF EXISTS news_categories CASCADE;

-- Create news categories table
CREATE TABLE news_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color_class VARCHAR(100) DEFAULT 'bg-blue-100 text-blue-800',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news articles table
CREATE TABLE news_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT '일반',
  author VARCHAR(100) DEFAULT 'Admin',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time INTEGER DEFAULT 5,
  is_breaking BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'published',
  image_url TEXT,
  source_url TEXT,
  original_language VARCHAR(10) DEFAULT 'ko',
  translated BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
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

-- Insert sample news articles
INSERT INTO news_articles (title, excerpt, content, category, author, tags, image_url) VALUES
  (
    '태국 정부, 새로운 관광 정책 발표',
    '태국 정부가 관광객 유치를 위한 새로운 정책을 발표했습니다.',
    '태국 정부는 오늘 관광객 유치를 위한 새로운 정책을 발표했습니다. 이번 정책에는 비자 간소화, 관광지 인프라 개선, 안전 강화 등이 포함되어 있습니다. 관광청 관계자는 "이번 정책으로 더 많은 관광객들이 태국을 방문할 것으로 기대한다"고 말했습니다.',
    '정책',
    'HOT THAI 편집부',
    ARRAY['태국', '관광', '정책', '비자'],
    '/placeholder.svg?height=200&width=400&text=태국+관광+정책'
  ),
  (
    '방콕 지하철 새 노선 개통 예정',
    '방콕 지하철 새 노선이 내년 상반기 개통될 예정입니다.',
    '방콕 대중교통공사(BMTA)는 새로운 지하철 노선이 내년 상반기에 개통될 예정이라고 발표했습니다. 새 노선은 시내 중심가와 외곽 지역을 연결하여 교통 편의성을 크게 향상시킬 것으로 예상됩니다. 총 15개 역이 신설되며, 일일 승객 수용 능력은 50만 명으로 계획되어 있습니다.',
    '교통',
    'HOT THAI 편집부',
    ARRAY['방콕', '지하철', '교통', '개통'],
    '/placeholder.svg?height=200&width=400&text=방콕+지하철'
  ),
  (
    '한국-태국 비자 면제 협정 논의',
    '한국과 태국 간 비자 면제 협정에 대한 논의가 진행되고 있습니다.',
    '한국과 태국 정부가 양국 국민의 비자 면제 협정에 대해 논의하고 있다고 외교부가 발표했습니다. 이 협정이 체결되면 양국 국민들이 더욱 자유롭게 상대국을 방문할 수 있게 됩니다. 협정 체결 시기는 아직 확정되지 않았지만, 양국 모두 적극적인 의지를 보이고 있습니다.',
    '비자',
    'HOT THAI 편집부',
    ARRAY['한국', '태국', '비자', '면제', '협정'],
    '/placeholder.svg?height=200&width=400&text=비자+면제'
  ),
  (
    '태국 경제 성장률 전망 상향 조정',
    '태국 중앙은행이 올해 경제 성장률 전망을 상향 조정했습니다.',
    '태국 중앙은행(BOT)이 2024년 경제 성장률 전망을 기존 2.8%에서 3.2%로 상향 조정했다고 발표했습니다. 관광업 회복과 수출 증가가 주요 요인으로 분석됩니다. 중앙은행 총재는 "내수 소비 증가와 정부의 경기 부양책이 효과를 보이고 있다"고 설명했습니다.',
    '경제',
    'HOT THAI 편집부',
    ARRAY['태국', '경제', '성장률', '중앙은행'],
    '/placeholder.svg?height=200&width=400&text=경제+성장'
  ),
  (
    '치앙마이 꽃 축제 개최 안내',
    '치앙마이에서 연례 꽃 축제가 개최됩니다.',
    '치앙마이시는 오는 2월 첫째 주말에 연례 꽃 축제를 개최한다고 발표했습니다. 이번 축제에서는 다양한 꽃 전시, 퍼레이드, 문화 공연 등이 펼쳐질 예정입니다. 특히 올해는 한국 관광객을 위한 특별 프로그램도 준비되어 있어 많은 관심을 받고 있습니다.',
    '문화',
    'HOT THAI 편집부',
    ARRAY['치앙마이', '꽃축제', '문화', '관광'],
    '/placeholder.svg?height=200&width=400&text=치앙마이+꽃축제'
  ),
  (
    '파타야 교민 업체 신규 오픈 소식',
    '파타야에 새로운 한국 음식점이 오픈했습니다.',
    '파타야 중심가에 새로운 한국 음식점 "서울 맛집"이 오픈했습니다. 한국에서 10년 경력의 셰프가 직접 운영하며, 정통 한식을 합리적인 가격에 제공합니다. 특히 김치찌개와 불고기가 인기 메뉴로, 현지 교민들과 태국인들 모두에게 좋은 반응을 얻고 있습니다.',
    '교민 업체',
    'HOT THAI 편집부',
    ARRAY['파타야', '교민', '음식점', '한식'],
    '/placeholder.svg?height=200&width=400&text=파타야+한식당'
  );

-- Create indexes for better performance
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_status ON news_articles(status);
CREATE INDEX idx_news_articles_is_breaking ON news_articles(is_breaking);
CREATE INDEX idx_news_articles_tags ON news_articles USING GIN(tags);

-- Create function to increment news view count
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE news_articles 
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to search news articles
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
  status VARCHAR(20),
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
    na.status,
    na.image_url,
    na.source_url,
    na.view_count,
    na.created_at,
    na.updated_at
  FROM news_articles na
  WHERE 
    na.is_published = TRUE
    AND na.status = 'published'
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
