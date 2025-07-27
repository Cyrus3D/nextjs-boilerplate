-- 프리미엄 기능과 노출 통계를 위한 필드 추가
ALTER TABLE business_cards 
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN premium_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN exposure_count INTEGER DEFAULT 0,
ADD COLUMN last_exposed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN exposure_weight DECIMAL(3,2) DEFAULT 1.0;

-- 인덱스 추가
CREATE INDEX idx_business_cards_premium ON business_cards(is_premium, premium_expires_at);
CREATE INDEX idx_business_cards_exposure ON business_cards(exposure_count, last_exposed_at);
CREATE INDEX idx_business_cards_weight ON business_cards(exposure_weight);

-- 프리미엄 카드 관리를 위한 코멘트
COMMENT ON COLUMN business_cards.is_premium IS '프리미엄(유료) 카드 여부';
COMMENT ON COLUMN business_cards.premium_expires_at IS '프리미엄 만료일';
COMMENT ON COLUMN business_cards.exposure_count IS '노출 횟수';
COMMENT ON COLUMN business_cards.last_exposed_at IS '마지막 노출 시간';
COMMENT ON COLUMN business_cards.exposure_weight IS '노출 가중치 (낮을수록 우선 노출)';
