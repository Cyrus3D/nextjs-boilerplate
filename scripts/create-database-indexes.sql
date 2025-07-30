-- 성능 최적화를 위한 데이터베이스 인덱스 생성

-- business_cards 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_business_cards_is_active ON business_cards(is_active);
CREATE INDEX IF NOT EXISTS idx_business_cards_is_premium ON business_cards(is_premium);
CREATE INDEX IF NOT EXISTS idx_business_cards_is_promoted ON business_cards(is_promoted);
CREATE INDEX IF NOT EXISTS idx_business_cards_created_at ON business_cards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_cards_exposure_count ON business_cards(exposure_count DESC);
CREATE INDEX IF NOT EXISTS idx_business_cards_view_count ON business_cards(view_count DESC);

-- 텍스트 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_business_cards_title_gin ON business_cards USING gin(to_tsvector('korean', title));
CREATE INDEX IF NOT EXISTS idx_business_cards_description_gin ON business_cards USING gin(to_tsvector('korean', description));

-- 복합 인덱스 (자주 함께 사용되는 컬럼들)
CREATE INDEX IF NOT EXISTS idx_business_cards_active_premium ON business_cards(is_active, is_premium, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_cards_active_promoted ON business_cards(is_active, is_promoted, exposure_count DESC);

-- categories 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- business_card_tags 테이블 인덱스 (다대다 관계)
CREATE INDEX IF NOT EXISTS idx_business_card_tags_card_id ON business_card_tags(business_card_id);
CREATE INDEX IF NOT EXISTS idx_business_card_tags_tag_id ON business_card_tags(tag_id);

-- tags 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- 조회수 증가 함수 생성
CREATE OR REPLACE FUNCTION increment_view_count(card_id INTEGER, increment_by INTEGER DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE business_cards 
  SET 
    view_count = COALESCE(view_count, 0) + increment_by,
    updated_at = NOW()
  WHERE id = card_id;
END;
$$ LANGUAGE plpgsql;

-- 노출수 증가 함수 생성
CREATE OR REPLACE FUNCTION increment_exposure_count(card_id INTEGER, increment_by INTEGER DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE business_cards 
  SET 
    exposure_count = COALESCE(exposure_count, 0) + increment_by,
    last_exposed_at = NOW(),
    updated_at = NOW()
  WHERE id = card_id;
END;
$$ LANGUAGE plpgsql;

-- 프리미엄 만료 확인 함수
CREATE OR REPLACE FUNCTION check_premium_expiry()
RETURNS void AS $$
BEGIN
  UPDATE business_cards 
  SET 
    is_premium = false,
    updated_at = NOW()
  WHERE is_premium = true 
    AND premium_expires_at IS NOT NULL 
    AND premium_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 일일 유지보수 함수 (프리미엄 만료 확인 등)
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS void AS $$
BEGIN
  -- 프리미엄 만료 확인
  PERFORM check_premium_expiry();
  
  -- 통계 업데이트 (필요시 추가)
  -- 예: 인기도 점수 재계산 등
END;
$$ LANGUAGE plpgsql;

-- 인덱스 생성 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Database indexes created successfully!';
  RAISE NOTICE 'Performance optimization functions created!';
END $$;
