-- business_cards 테이블에 map_url 컬럼 추가
ALTER TABLE business_cards ADD COLUMN map_url VARCHAR(500);

-- 기존 데이터에서 website가 지도 URL인 경우 map_url로 이동
UPDATE business_cards 
SET map_url = website, website = NULL 
WHERE website LIKE '%maps.app.goo.gl%' 
   OR website LIKE '%maps.google.com%'
   OR website LIKE '%goo.gl/maps%';

-- 인덱스 추가 (선택사항)
CREATE INDEX idx_business_cards_map_url ON business_cards(map_url);
