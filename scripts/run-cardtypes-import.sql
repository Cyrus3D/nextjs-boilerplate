-- CardTypes.txt 데이터 전체 임포트 실행 스크립트
-- 이 스크립트를 실행하여 모든 CardTypes 데이터를 한번에 등록합니다.

-- 1. 비즈니스 카드 데이터 삽입
\i scripts/08-insert-cardtypes-data.sql

-- 2. 추가 태그 삽입
\i scripts/09-insert-cardtypes-tags.sql

-- 3. 비즈니스 카드와 태그 연결
\i scripts/10-link-cardtypes-tags.sql

-- 4. 결과 확인
SELECT 
    bc.title,
    c.name as category,
    bc.location,
    bc.phone,
    STRING_AGG(t.name, ', ') as tags
FROM business_cards bc
LEFT JOIN categories c ON bc.category_id = c.id
LEFT JOIN business_card_tags bct ON bc.id = bct.business_card_id
LEFT JOIN tags t ON bct.tag_id = t.id
WHERE bc.created_at >= CURRENT_DATE
GROUP BY bc.id, bc.title, c.name, bc.location, bc.phone
ORDER BY bc.created_at DESC;
