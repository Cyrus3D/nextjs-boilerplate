-- 뉴스 조회수 증가 함수 생성
CREATE OR REPLACE FUNCTION increment_news_view_count(news_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE news_articles 
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE id = news_id::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION increment_news_view_count(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_news_view_count(TEXT) TO authenticated;
