-- map_url 컬럼이 있다면 제거 (단일 website 필드 사용)
ALTER TABLE business_cards DROP COLUMN IF EXISTS map_url;

-- 기존 데이터는 그대로 유지 (website 필드에 지도/웹사이트 URL 모두 저장)
