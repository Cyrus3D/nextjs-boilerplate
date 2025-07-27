-- map_url 컬럼이 있다면 제거 (단일 필드 사용)
ALTER TABLE business_cards DROP COLUMN IF EXISTS map_url;

-- 기존 데이터는 website 컬럼에 그대로 유지
-- 자동 감지 로직으로 지도/웹사이트 구분
