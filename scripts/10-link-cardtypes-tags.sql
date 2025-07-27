-- 비즈니스 카드와 태그를 연결하는 스크립트

-- 시그니엘 24시 출장마사지 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '시그니엘 24시 출장마사지'
AND t.name IN ('출장마사지', '24시간', '라이센스', '건전마사지', '방콕', '파타야');

-- 윤키친 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '윤키친 (YOON''S KITCHEN)'
AND t.name IN ('한식', '무한리필', '숯불구이', '공항근처', '단체예약가능');

-- 방콕막창 2호점 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '방콕막창 2호점'
AND t.name IN ('막창전문', '가성비', '오픈기념', '방콕');

-- 수락 SURAK 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '수락 SURAK Korean Restaurant'
AND t.name IN ('간장게장', '양념게장', '새우장', '무한리필', '방콕');

-- 찬스 떡볶이 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '찬스 떡볶이'
AND t.name IN ('떡볶이', '10%할인', '단체주문', '방콕');

-- 해피컴퍼니 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '해피컴퍼니 (Happy Company)'
AND t.name IN ('택시서비스', '비자런', 'VIP서비스', '100%보장', '24시간');

-- VALUXE COMPANY 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = 'VALUXE COMPANY LIMITED'
AND t.name IN ('비자업무', '법인설립', '부동산', '종합서비스');

-- 락타이몰 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '락타이몰 (배송 & 구매대행)'
AND t.name IN ('배송대행', '구매대행', '항공특송', '해운배송');

-- 아라비카 유기농커피 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '아라비카 유기농커피'
AND t.name IN ('유기농', '직접볶음', '택배포함');

-- KFT Farm 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = 'KFT Farm'
AND t.name IN ('친환경', '벌꿀', '햅쌀', '참외', '한국볍씨');

-- 맥반석 구운계란 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '맥반석 구운계란'
AND t.name IN ('맥반석', '구운계란', '개별포장', '건강간식');

-- 방콕 베트남식 큐 이발소 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '방콕 베트남식 큐 이발소'
AND t.name IN ('베트남식', '이발소', '풀케어', '캐리어보관', '방콕');

-- 방콕 황제 이발소 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '방콕 황제 이발소'
AND t.name IN ('황제이발소', '15명수용', '주차가능', '방콕');

-- 명륜진사갈비 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '명륜진사갈비'
AND t.name IN ('명륜진사갈비', '런치스페셜', '뷔페', '투어가능', '한식');

-- 오아시스18 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '오아시스18 (레이크우드 컨트리클럽)'
AND t.name IN ('골프예약', '레이크우드', '카오야이', '20년경력');

-- BM Law & Consulting 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = 'BM Law & Consulting'
AND t.name IN ('법률상담', '세무서비스', '워크퍼밋', '법인설립');

-- Ok김밥 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = 'Ok김밥'
AND t.name IN ('김밥전문', '냉모밀', '김치판매', '단체주문', '한식');

-- 파타야 7포차&노래방 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '파타야 7포차&노래방'
AND t.name IN ('포차', '노래방', '생맥주', '한국주방장', '배달가능', '파타야');

-- 스쿰빗소이5 유천 부붸 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '스쿰빗소이5 유천 부붸'
AND t.name IN ('고기뷔페', '무한리필', '부가세포함', '방콕');

-- 파타야 THE LOUNGE 박사부 한식뷔페 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id)
SELECT bc.id, t.id
FROM business_cards bc, tags t
WHERE bc.title = '파타야 THE LOUNGE 박사부 한식뷔페'
AND t.name IN ('한식뷔페', '조식', '오픈이벤트', '쿠폰할인', '파타야');
