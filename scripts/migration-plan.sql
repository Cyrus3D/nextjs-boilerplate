-- 단계별 마이그레이션 계획

-- 1단계: 현재 상태 유지 (website 필드만 사용)
-- 대부분의 비즈니스는 하나의 주요 링크만 가짐

-- 2단계: 필요시 map_url 컬럼 추가
-- ALTER TABLE business_cards ADD COLUMN map_url VARCHAR(500);

-- 3단계: 더 많은 링크가 필요한 경우 JSON 필드 추가
-- ALTER TABLE business_cards ADD COLUMN additional_links JSONB;
-- 예시 데이터:
-- {
--   "social": {
--     "facebook": "https://facebook.com/business",
--     "instagram": "https://instagram.com/business"
--   },
--   "menu": "https://menu.com/business",
--   "booking": "https://booking.com/business"
-- }

-- 4단계: 완전한 확장이 필요한 경우 관련 테이블 생성
-- CREATE TABLE business_links (
--   id SERIAL PRIMARY KEY,
--   business_card_id INTEGER REFERENCES business_cards(id) ON DELETE CASCADE,
--   link_type VARCHAR(50) NOT NULL,
--   url VARCHAR(500) NOT NULL,
--   display_name VARCHAR(100),
--   is_primary BOOLEAN DEFAULT FALSE,
--   sort_order INTEGER DEFAULT 0,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- 현재는 1단계로 시작하고, 필요에 따라 점진적 확장
