-- 배치 조회수 증가를 위한 함수 생성
CREATE OR REPLACE FUNCTION increment_view_counts(card_ids integer[])
RETURNS void AS $$
BEGIN
  UPDATE business_cards 
  SET 
    view_count = COALESCE(view_count, 0) + 1,
    updated_at = NOW()
  WHERE id = ANY(card_ids);
END;
$$ LANGUAGE plpgsql;
