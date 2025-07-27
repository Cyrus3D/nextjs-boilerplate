-- CardTypes.txt 파일의 비즈니스 정보를 데이터베이스에 삽입

-- 1. 시그니엘 24시 출장마사지
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '시그니엘 24시 출장마사지',
  '전문 건전 마사지 업체로 방콕, 파타야를 중심으로 출장 마사지를 진행합니다. 모든 마사지사는 국가 전문마사지 라이센스를 보유하고 있습니다.',
  10, -- 서비스
  '방콕, 파타야',
  '082-974-7979',
  'sig5858',
  'sig5858',
  NULL,
  '24시간 예약운영제',
  '타이마사지 90분 850바트, 120분 950바트 / 오일마사지 90분 950바트, 120분 1,100바트',
  '120분 코스 Best 추천',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 2. 윤키친 (YOON'S KITCHEN)
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '윤키친 (YOON''S KITCHEN)',
  '공항에서 15분거리 무한 리필 숯불 구이 한식당입니다. 한국 맛과 감성을 그대로 살려 교민과 현지인들에게 좋은 반응을 얻고 있습니다.',
  2, -- 음식점
  '공항에서 15분거리',
  '082-048-8139',
  'moda70',
  'moda70',
  'https://maps.app.goo.gl/KRGafHvKBo7wC6Wu7',
  NULL,
  '무한리필 숯불구이',
  '단체 예약 필수',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 3. 방콕막창 2호점
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '방콕막창 2호점',
  '팔람4 빅씨 맞은편 가성비 맛집에서 저렴하고 맛있게 즐거운 경험을 선사합니다.',
  2, -- 음식점
  '팔람4 빅씨 맞은편',
  '063-886-1034',
  NULL,
  NULL,
  'https://maps.app.goo.gl/CQX8NKdDUt1Eg6Lc7',
  NULL,
  '가성비 맛집',
  '오픈 기념 선물 준비',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 4. 수락 SURAK Korean Restaurant
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '수락 SURAK Korean Restaurant',
  '방콕 최초의 간장게장 전문점으로 강남 역삼에서 간장게장 전문점을 운영하던 셰프가 직접 요리합니다. 간장게장, 양념게장, 새우장, 연어장, 갯가재장을 세트 메뉴 및 무한리필로 제공합니다.',
  2, -- 음식점
  '방콕 에까마이 파크애비뉴',
  NULL,
  'dadj12',
  NULL,
  'https://g.co/kgs/sDM2dPk',
  '11:30am - 4am',
  '간장게장 전문',
  '새벽 늦게까지 영업',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 5. 찬스 떡볶이
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '찬스 떡볶이',
  'Pridi 15 Sukhumvit 71에 위치한 떡볶이 전문점입니다. 한국인 전문 조리사가 맛과 정성을 담아 준비합니다.',
  2, -- 음식점
  'Pridi 15 Sukhumvit 71',
  '098-553-6635',
  NULL,
  NULL,
  'https://goo.gl/maps/JvCXRURFPs4FGENd6',
  '10:00-22:00',
  '떡볶이 전문',
  '주문 시 10% 할인, 단체 주문 가능',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 6. 해피컴퍼니 (Happy Company)
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '해피컴퍼니 (Happy Company)',
  '24시간 택시 서비스, 건전 출장마사지 서비스, 방콕 파타야 캄보디아 비자런, 공항 VIP 입국 서비스를 제공합니다.',
  10, -- 서비스
  '방콕, 파타야',
  NULL,
  '_dejXn',
  '6MYH6DU',
  'https://vo.la/happythai369',
  '24시간',
  '비자런 7천바트, 공항 VIP 4천바트',
  '100% 입출국 가능',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 7. VALUXE COMPANY LIMITED
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  'VALUXE COMPANY LIMITED',
  '비자 업무, 법인 설립, 노무/회계/세무, 태국 법률 및 소송, 은행 통장 개설, 자동차 보험 및 운전면허 발급, 부동산, 여행사 서비스를 제공합니다.',
  10, -- 서비스
  '태국',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '학생비자, 엘리트비자, 은퇴비자, 결혼비자, 워크퍼밋',
  '종합 비즈니스 서비스',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 8. 락타이몰 (배송 & 구매대행)
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '락타이몰 (배송 & 구매대행)',
  '한국 ↔ 태국 전문 배송 & 구매대행 서비스입니다. 항공 특송과 해운 배송을 모두 제공하며, 빠르고 안전한 배송을 보장합니다.',
  3, -- 배송서비스
  '한국 ↔ 태국',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '태국→한국 2~3일, 한국→태국 3~5일 (항공) / 14~20일 (해운)',
  '무거운 짐도 합리적인 비용으로 배송',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 9. 아라비카 유기농커피
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '아라비카 유기농커피',
  '아라비카 유기농커피를 직접 볶아서 배송해드립니다. 신선한 원두로 최고의 맛을 제공합니다.',
  5, -- 식품
  '태국',
  NULL,
  'Yokhcoffee',
  NULL,
  NULL,
  NULL,
  '200g 1봉지 200밧, 5봉지 1kg 800밧',
  '택배비 포함, 바로 볶아서 배송',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 10. KFT Farm
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  'KFT Farm',
  '친환경 벌꿀, 햅쌀, 참외를 생산하는 농장입니다. 모든 제품은 택배비 포함 가격으로 제공됩니다.',
  5, -- 식품
  '태국',
  '090-332-8404',
  'kosya715',
  NULL,
  NULL,
  NULL,
  '야생벌꿀 750밧, 목청벌꿀 450밧, 양봉벌꿀 150밧, 햅쌀 40kg 2,500밧',
  '한국볍씨로 재배한 햅쌀, 당도 보장 참외',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 11. 맥반석 구운계란
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '맥반석 구운계란',
  '72시간 정성으로 구워낸 건강한 간식입니다. 한 알씩 개별 포장으로 위생적이며 언제 어디서나 간편하게 드실 수 있습니다.',
  5, -- 식품
  '태국',
  '089-456-8818',
  'thaibnh',
  NULL,
  NULL,
  NULL,
  '맥반석 구운계란',
  '다이어트, 어린이 영양 간식으로 최적',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 12. 방콕 베트남식 큐 이발소
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '방콕 베트남식 큐 이발소',
  '방콕 코리아타운 4층에 위치한 베트남식 이발소입니다. 발씻기, 면도, 얼굴마사지, 천연오이팩, 귀청소 등 풀케어 서비스를 제공합니다.',
  10, -- 서비스
  '방콕 코리아타운 4층',
  '080-382-0573',
  'bigtrue1',
  'bigtrue1532',
  'https://line.me/ti/p/kEztGRCv9Y',
  '10:30 - 21:00',
  '90분 700바트',
  '단체손님 환영, 캐리어 보관 가능',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 13. 방콕 황제 이발소
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '방콕 황제 이발소',
  '아속역 4번 출구에서 200미터 거리에 위치한 이발소입니다. 동시 수용인원 15명으로 대기시간을 최소화합니다.',
  10, -- 서비스
  '아속역 4번 출구 200미터',
  '02-120-7409',
  'hwangjaek',
  'newman8609',
  'https://maps.app.goo.gl/yqSRhLckMVQ5RaZA6',
  '10:30 - 22:30 (마지막 주문 21:00)',
  '90분 700밧',
  '평일 17시 이후, 주말 하루종일 주차 가능',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 14. 명륜진사갈비
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '명륜진사갈비',
  '제육볶음, 안동찜닭, 소불고기 메뉴가 추가된 한식 갈비 전문점입니다. 런치스페셜 뷔페와 소고기 추가메뉴를 특가로 제공합니다.',
  2, -- 음식점
  '라마4 BIG C, 라마2 BIG C, SEACON BANGKAE, BIG C SAMUTPRAKAN, CENTRAL RAMA 3',
  NULL,
  NULL,
  NULL,
  'https://maps.app.goo.gl/Sk9kQCs1XWBVRYR66',
  NULL,
  '런치스페셜 뷔페 199B+, 꽃등심/채끝등심/부채살 129B',
  '투어식으로도 인기',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 15. 오아시스18 (레이크우드 컨트리클럽)
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '오아시스18 (레이크우드 컨트리클럽)',
  '방콕 명문 레이크우드 컨트리클럽과 럭셔리 카오야이 마운틴크릭 골프 & 빌라의 공식 에이전트입니다. 20년 경력으로 최고의 서비스를 제공합니다.',
  4, -- 여행서비스
  '방콕, 카오야이',
  '+66-61-360-7272',
  'oasis18lakewood',
  'oasis18lakewood',
  'https://maps.app.goo.gl/UgcyhEVU7WWVToSk6',
  NULL,
  '골프 예약 서비스',
  '에이전트 고객만족도 1위',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 16. BM Law & Consulting
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  'BM Law & Consulting',
  '법인설립, 비자&워크퍼밋, 세무/기장서비스, 법률소송 및 상담, 기타 생활편의 서비스를 제공하는 종합 컨설팅 회사입니다.',
  10, -- 서비스
  '태국',
  NULL,
  NULL,
  NULL,
  'https://open.kakao.com/o/sy1QFdBh',
  NULL,
  '법인설립, 비자, 세무, 법률 서비스',
  '믿음과 신뢰를 바탕으로 한 서비스',
  '/placeholder.svg?height=200&width=400',
  true,
  true
);

-- 17. Ok김밥
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  'Ok김밥',
  '맛있고 시원한 냉모밀과 다양한 한국음식을 제공하는 김밥 전문점입니다. 맛있는 김치와 겉절이김치도 주문 가능합니다.',
  2, -- 음식점
  '태국',
  NULL,
  'okkimbap',
  'okkimbap',
  'https://g.co/kgs/h5Rjsh',
  NULL,
  '김치 1키로 200바트, 겉절이김치 1키로 250바트',
  '하루전 예약 시 한국음식 준비, 회사/학교/단체 주문 가능',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 18. 파타야 7포차&노래방
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '파타야 7포차&노래방',
  '파타야 헐리우드클럽 맞은편에 위치한 포차&노래방입니다. 최신음향기기와 노래방기기로 최고의 음질을 제공하며, 한국주방장이 직접 조리합니다.',
  9, -- 유흥업소
  '파타야 헐리우드클럽 맞은편',
  NULL,
  NULL,
  NULL,
  NULL,
  '18:00 - 06:00 (주방마감 05:00)',
  '생맥주, 안주, 노래방',
  '태국 노래방기기 추가, 주차장 완비, 파타야 전지역 배달',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 19. 스쿰빗소이5 유천 부붸
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '스쿰빗소이5 유천 부붸',
  '그레이스호텔 1층에 위치한 무한리필 고기 뷔페입니다. 소고기, 돼지고기를 무한리필로 즐길 수 있습니다.',
  2, -- 음식점
  '스쿰빗소이5 그레이스호텔 1층',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '소고기+돼지고기 무한리필 520바트, 돼지고기 390바트',
  '부가세, 봉사료 포함',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);

-- 20. 파타야 THE LOUNGE 박사부 한식뷔페
INSERT INTO business_cards (
  title, description, category_id, location, phone, kakao_id, line_id, website, 
  hours, price, promotion, image_url, is_promoted, is_active
) VALUES (
  '파타야 THE LOUNGE 박사부 한식뷔페',
  '다빈치풀빌라 옆에 위치한 한식 조식뷔페입니다. 한국인 전문 조리사가 매일 새로운 음식을 맛과 정성을 담아 준비합니다.',
  2, -- 음식점
  '파타야 다빈치풀빌라 옆',
  '082-852-9255',
  NULL,
  NULL,
  'https://maps.app.goo.gl/tVkkjM18eh44zQtW9',
  '06:30 - 10:00',
  '250바트',
  '오픈이벤트 쿠폰판매, 10장 이상 구매시 할인',
  '/placeholder.svg?height=200&width=400',
  false,
  true
);
