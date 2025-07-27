-- 현재는 단일 필드 유지, 필요시 확장 가능한 구조
-- 1단계: 기본 website 필드 유지
-- 2단계: 필요시 map_url 컬럼 추가
-- 3단계: 더 많은 링크가 필요하면 JSON 또는 관련 테이블 사용

-- 현재 구조 유지
-- business_cards 테이블의 website 컬럼 사용

-- 향후 확장을 위한 옵션 1: 별도 컬럼 추가
-- ALTER TABLE business_cards ADD COLUMN map_url VARCHAR(500);
-- ALTER TABLE business_cards ADD COLUMN social_media_url VARCHAR(500);

-- 향후 확장을 위한 옵션 2: JSON 필드 사용 (PostgreSQL)
-- ALTER TABLE business_cards ADD COLUMN links JSONB;
-- 예시 데이터: {"website": "https://example.com", "map": "https://maps.app.goo.gl/xyz", "facebook": "https://facebook.com/page"}

-- 향후 확장을 위한 옵션 3: 관련 테이블 생성
-- CREATE TABLE business_links (
--   id SERIAL PRIMARY KEY,
--   business_card_id INTEGER REFERENCES business_cards(id) ON DELETE CASCADE,
--   link_type VARCHAR(50) NOT NULL, -- 'website', 'map', 'facebook', 'instagram' 등
--   url VARCHAR(500) NOT NULL,
--   display_name VARCHAR(100),
--   is_primary BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
