-- 카테고리 데이터 삽입
INSERT INTO categories (name, color_class) VALUES
('음식점', 'bg-red-100 text-red-800'),
('배송서비스', 'bg-blue-100 text-blue-800'),
('여행서비스', 'bg-green-100 text-green-800'),
('식품', 'bg-orange-100 text-orange-800'),
('이벤트서비스', 'bg-purple-100 text-purple-800'),
('방송서비스', 'bg-indigo-100 text-indigo-800'),
('전자제품', 'bg-cyan-100 text-cyan-800'),
('유흥업소', 'bg-pink-100 text-pink-800'),
('교통서비스', 'bg-emerald-100 text-emerald-800'),
('서비스', 'bg-gray-100 text-gray-800');

-- 태그 데이터 삽입
INSERT INTO tags (name) VALUES
('한식'), ('무한리필'), ('숯불구이'), ('단체예약'), ('막창'), ('가성비'), ('신규오픈'),
('국제배송'), ('항공특송'), ('해상운송'), ('픽업서비스'), ('골프예약'), ('최저가보장'),
('카카오톡예약'), ('건강간식'), ('맥반석'), ('구운계란'), ('개별포장'), ('풀파티'),
('바베큐'), ('DJ'), ('파타야'), ('한국방송'), ('실시간TV'), ('다시보기'), ('스포츠'),
('컴퓨터'), ('노트북'), ('게이밍'), ('A/S'), ('리뉴얼'), ('노래방'), ('유흥'), ('방콕'),
('포차'), ('생맥주'), ('뷔페'), ('공항픽업'), ('최저가');

-- 비즈니스 카드 데이터 삽입
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, website, 
  promotion, rating, is_promoted, image_url
) VALUES
(
  '윤키친 (YOON''S KITCHEN)',
  '공항에서 15분거리, 무한 리필 숯불 구이로 리노베이션 완료. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.',
  1, -- 음식점
  '공항 15분 거리',
  '082 048 8139',
  'moda70',
  'https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7',
  '단체 예약 필수',
  4.7,
  true,
  '/placeholder.svg?height=200&width=400'
),
(
  '방콕막창 2호점',
  '팔람4 빅씨 맞은편! 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다. 오픈 기념 선물도 준비되어 있습니다.',
  1, -- 음식점
  '팔람4 빅씨 맞은편',
  '0638861034',
  null,
  'https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7',
  '오픈 기념 선물 증정',
  4.5,
  true,
  '/placeholder.svg?height=200&width=400'
);

-- 비즈니스 카드와 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id) VALUES
-- 윤키친 태그
(1, 1), (1, 2), (1, 3), (1, 4), -- 한식, 무한리필, 숯불구이, 단체예약
-- 방콕막창 태그
(2, 5), (2, 6), (2, 7); -- 막창, 가성비, 신규오픈
