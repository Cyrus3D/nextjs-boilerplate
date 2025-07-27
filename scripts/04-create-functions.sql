-- 노출 횟수 증가 함수
CREATE OR REPLACE FUNCTION increment_exposure(card_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE business_cards 
  SET 
    exposure_count = COALESCE(exposure_count, 0) + 1,
    last_exposed_at = NOW(),
    exposure_weight = CASE 
      WHEN exposure_count < 50 THEN 1.0 + (50 - exposure_count) * 0.02
      ELSE 1.0 - (exposure_count - 50) * 0.01
    END
  WHERE id = card_id;
END;
$$ LANGUAGE plpgsql;

-- 노출 통계 리셋 함수 (관리자용)
CREATE OR REPLACE FUNCTION reset_exposure_stats()
RETURNS VOID AS $$
BEGIN
  UPDATE business_cards 
  SET 
    exposure_count = 0,
    last_exposed_at = NULL,
    exposure_weight = 1.0;
END;
$$ LANGUAGE plpgsql;

-- 프리미엄 만료 확인 함수
CREATE OR REPLACE FUNCTION check_premium_expiry()
RETURNS VOID AS $$
BEGIN
  UPDATE business_cards 
  SET is_premium = FALSE 
  WHERE is_premium = TRUE 
    AND premium_expires_at IS NOT NULL 
    AND premium_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 매일 실행할 정리 작업
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS VOID AS $$
BEGIN
  -- 만료된 프리미엄 상태 정리
  PERFORM check_premium_expiry();
  
  -- 30일 이상 비활성 카드의 가중치 리셋
  UPDATE business_cards 
  SET exposure_weight = 1.0
  WHERE last_exposed_at < NOW() - INTERVAL '30 days'
    OR last_exposed_at IS NULL;
END;
$$ LANGUAGE plpgsql;
