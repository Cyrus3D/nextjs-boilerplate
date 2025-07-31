-- 뉴스 테이블 생성
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  source VARCHAR(200) NOT NULL,
  original_url VARCHAR(1000) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category VARCHAR(50) DEFAULT '일반',
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 뉴스 인덱스 생성
CREATE INDEX idx_news_active ON news(is_active);
CREATE INDEX idx_news_featured ON news(is_featured);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_created_at ON news(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public read access" ON news FOR SELECT USING (is_active = true);

-- 관리자 전체 접근 정책 (나중에 관리자 역할이 정의되면 수정)
CREATE POLICY "Admin full access" ON news FOR ALL USING (true);

-- 뉴스 카테고리 기본값 삽입
INSERT INTO news (title, summary, content, source, original_url, category, tags, is_featured) VALUES
('샘플 뉴스 1', '태국 한인 커뮤니티 관련 첫 번째 샘플 뉴스입니다.', '이것은 샘플 뉴스의 전체 내용입니다. 태국 한인 커뮤니티에 대한 중요한 정보를 담고 있습니다.', '태국 한인 뉴스', 'https://example.com/news1', '사회', ARRAY['한인사회', '커뮤니티'], true),
('샘플 뉴스 2', '태국 경제 동향에 대한 두 번째 샘플 뉴스입니다.', '태국의 최근 경제 동향과 한인 사업가들에게 미치는 영향에 대해 다룹니다.', '태국 경제 뉴스', 'https://example.com/news2', '경제', ARRAY['경제', '사업'], false),
('샘플 뉴스 3', '태국 문화 행사 관련 세 번째 샘플 뉴스입니다.', '태국에서 열리는 다양한 문화 행사와 한인들의 참여에 대한 소식입니다.', '태국 문화 뉴스', 'https://example.com/news3', '문화', ARRAY['문화', '행사'], false);
