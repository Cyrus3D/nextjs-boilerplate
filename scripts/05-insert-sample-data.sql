-- 샘플 비즈니스 카드 데이터 삽입
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, website, 
  promotion, is_promoted, image_url
) VALUES
(
  '윤키친 (YOON''S KITCHEN)',
  '공항에서 15분거리, 무한 리필 숯불 구이로 리노베이션 완료. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.',
  2, -- 음식점
  '공항 15분 거리',
  '082 048 8139',
  'moda70',
  'https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7',
  '단체 예약 필수',
  true,
  '/placeholder.svg?height=200&width=400'
),
(
  '방콕막창 2호점',
  '팔람4 빅씨 맞은편! 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다. 오픈 기념 선물도 준비되어 있습니다.',
  2, -- 음식점
  '팔람4 빅씨 맞은편',
  '0638861034',
  null,
  'https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7',
  '오픈 기념 선물 증정',
  true,
  '/placeholder.svg?height=200&width=400'
),
(
  '스타익스프레스 배송서비스',
  '태국-한국 항공특송 및 해상운송 전문업체. Kg당 130바트로 방콕에서 픽업하여 한국 주소지까지 논스톱 배송서비스 제공.',
  3, -- 배송서비스
  '방콕 전지역',
  '080-066-9770',
  'jagnbacu',
  'https://www.starexpress.co.kr',
  null,
  false,
  '/placeholder.svg?height=200&width=400'
),
(
  '몽키트래블 골프예약',
  '카카오톡으로 간편하게 예약하세요! 세금계산서 & 현금영수증 발급 가능. 가격 비교 끝, 몽키가 제일 싸요 최저가 보장!',
  4, -- 여행서비스
  '태국 전지역',
  null,
  '몽키트래블',
  'https://thai.monkeytravel.com',
  '17시까지 특별 할인',
  false,
  '/placeholder.svg?height=200&width=400'
),
(
  '맥반석 구운계란',
  '72시간 정성으로 구워낸 깊은 맛! 한 알씩 개별 포장으로 위생적이며 언제 어디서나 간편하게 즐길 수 있는 건강한 간식입니다.',
  5, -- 식품
  '방콕',
  '089-456-8818',
  'thaibnh',
  null,
  '개별포장으로 위생적',
  false,
  '/placeholder.svg?height=200&width=400'
);

-- 비즈니스 카드와 태그 연결
INSERT INTO business_card_tags (business_card_id, tag_id) VALUES
-- 윤키친 태그
(1, 1), (1, 2), (1, 3), (1, 4), -- 한식, 무한리필, 숯불구이, 단체예약
-- 방콕막창 태그
(2, 5), (2, 6), (2, 7), -- 막창, 가성비, 신규오픈
-- 스타익스프레스 태그
(3, 8), (3, 9), (3, 10), (3, 11), -- 국제배송, 항공특송, 해상운송, 픽업서비스
-- 몽키트래블 태그
(4, 12), (4, 13), (4, 14), -- 골프예약, 최저가보장, 카카오톡예약
-- 맥반석 구운계란 태그
(5, 15), (5, 16), (5, 17), (5, 18); -- 건강간식, 맥반석, 구운계란, 개별포장
