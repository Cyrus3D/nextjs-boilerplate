-- 비즈니스 카테고리 테이블
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color_class VARCHAR(100) DEFAULT 'bg-gray-100 text-gray-800',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 비즈니스 카드 테이블
CREATE TABLE business_cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  location VARCHAR(300),
  phone VARCHAR(50),
  kakao_id VARCHAR(100),
  line_id VARCHAR(100),
  website VARCHAR(500),
  hours VARCHAR(200),
  price VARCHAR(200),
  promotion TEXT,
  image_url VARCHAR(500),
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  is_promoted BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 태그 테이블
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 비즈니스 카드와 태그의 다대다 관계 테이블
CREATE TABLE business_card_tags (
  business_card_id INTEGER REFERENCES business_cards(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (business_card_id, tag_id)
);

-- 인덱스 생성
CREATE INDEX idx_business_cards_category ON business_cards(category_id);
CREATE INDEX idx_business_cards_active ON business_cards(is_active);
CREATE INDEX idx_business_cards_promoted ON business_cards(is_promoted);
CREATE INDEX idx_business_cards_created_at ON business_cards(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_card_tags ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON business_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON business_card_tags FOR SELECT USING (true);
