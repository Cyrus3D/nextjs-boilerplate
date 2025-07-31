-- 샘플 뉴스 데이터 삽입
WITH category_ids AS (
  SELECT id, name FROM news_categories
),
tag_ids AS (
  SELECT id, name FROM news_tags
)
INSERT INTO news_articles (
  title, 
  summary, 
  content, 
  category_id, 
  published_at, 
  source, 
  author, 
  image_url, 
  external_url, 
  view_count, 
  is_breaking, 
  is_pinned, 
  is_active
) VALUES
-- 속보 뉴스
(
  '태국 정부, 새로운 관광 정책 발표',
  '태국 정부가 한국인 관광객 유치를 위한 새로운 정책을 발표했습니다. 비자 면제 기간 연장과 함께 다양한 혜택이 포함되어 있습니다.',
  '태국 관광청은 오늘 기자회견을 통해 한국인 관광객을 대상으로 한 새로운 관광 정책을 발표했습니다. 주요 내용으로는 비자 면제 기간을 기존 30일에서 45일로 연장하고, 주요 관광지에서 한국어 서비스를 확대하는 것이 포함되어 있습니다. 또한 한국인 관광객을 위한 전용 입국 게이트를 수완나품 공항에 신설할 예정이라고 밝혔습니다.',
  (SELECT id FROM category_ids WHERE name = '정치'),
  NOW() - INTERVAL '2 hours',
  '태국 일보',
  '김태국',
  '/placeholder.svg?height=200&width=300&text=태국+관광+정책',
  'https://example.com/news/1',
  156,
  true,
  true,
  true
),
(
  '방콕 지하철 새 노선 개통 예정',
  '방콕 대중교통공사가 새로운 지하철 노선의 개통 일정을 발표했습니다. 한인타운과 주요 쇼핑몰을 연결하는 노선입니다.',
  '방콕 대중교통공사(BMCL)는 오늘 새로운 지하철 노선인 오렌지 라인의 개통 일정을 발표했습니다. 이 노선은 한인타운이 위치한 수쿰빗 지역과 주요 쇼핑몰들을 연결하여 한국인 거주자들의 교통 편의성을 크게 향상시킬 것으로 예상됩니다. 총 20개 역으로 구성된 이 노선은 내년 3월 개통 예정입니다.',
  (SELECT id FROM category_ids WHERE name = '교통'),
  NOW() - INTERVAL '4 hours',
  '방콕 포스트',
  '이방콕',
  '/placeholder.svg?height=200&width=300&text=방콕+지하철',
  'https://example.com/news/2',
  89,
  false,
  true,
  true
),
-- 경제 뉴스
(
  '태국 바트화 강세, 환율 변동 주의',
  '최근 태국 바트화가 강세를 보이면서 한국 원화 대비 환율이 크게 변동하고 있습니다. 교민들의 주의가 필요합니다.',
  '태국 중앙은행 발표에 따르면, 최근 태국 바트화가 주요 통화 대비 강세를 보이고 있다고 밝혔습니다. 특히 한국 원화 대비 환율이 지난 주 대비 3% 상승하여 1바트당 37.8원을 기록했습니다. 전문가들은 태국의 관광업 회복과 수출 증가가 주요 원인이라고 분석했습니다. 교민들은 환전 시기를 신중하게 결정할 필요가 있습니다.',
  (SELECT id FROM category_ids WHERE name = '경제'),
  NOW() - INTERVAL '6 hours',
  '경제 일보',
  '박경제',
  '/placeholder.svg?height=200&width=300&text=환율+변동',
  'https://example.com/news/3',
  234,
  false,
  false,
  true
),
(
  '태국 부동산 시장 동향 분석',
  '2024년 태국 부동산 시장이 회복세를 보이고 있습니다. 특히 방콕과 파타야 지역의 콘도 가격이 상승하고 있습니다.',
  '태국 부동산 정보센터의 최신 보고서에 따르면, 2024년 태국 부동산 시장이 코로나19 이후 본격적인 회복세를 보이고 있다고 발표했습니다. 특히 방콕 중심가와 파타야 해변가의 콘도미니엄 가격이 전년 대비 8-12% 상승했습니다. 한국인 투자자들의 관심도 높아지고 있어, 투자 시 신중한 검토가 필요합니다.',
  (SELECT id FROM category_ids WHERE name = '경제'),
  NOW() - INTERVAL '8 hours',
  '부동산 투데이',
  '최부동산',
  '/placeholder.svg?height=200&width=300&text=부동산+시장',
  'https://example.com/news/4',
  167,
  false,
  false,
  true
),
-- 사회 뉴스
(
  '태국 의료보험 제도 개선 소식',
  '태국 정부가 외국인 거주자를 위한 의료보험 제도를 개선한다고 발표했습니다. 한국인 장기 거주자들에게 도움이 될 것으로 예상됩니다.',
  '태국 보건부는 외국인 장기 거주자를 위한 의료보험 제도 개선안을 발표했습니다. 새로운 제도에서는 1년 이상 거주하는 외국인도 태국 국민건강보험에 가입할 수 있게 됩니다. 월 보험료는 소득에 따라 차등 적용되며, 주요 병원에서 한국어 통역 서비스도 확대될 예정입니다. 이 제도는 내년 1월부터 시행됩니다.',
  (SELECT id FROM category_ids WHERE name = '사회'),
  NOW() - INTERVAL '10 hours',
  '헬스케어 뉴스',
  '정의료',
  '/placeholder.svg?height=200&width=300&text=의료보험',
  'https://example.com/news/5',
  145,
  false,
  false,
  true
),
(
  '방콕 한국 문화원 새 프로그램 시작',
  '방콕 한국 문화원에서 태국인을 위한 한국어 교육 프로그램과 한국 문화 체험 프로그램을 새롭게 시작합니다.',
  '주태국 한국 문화원은 태국인들의 한국 문화에 대한 관심 증가에 따라 새로운 교육 프로그램을 시작한다고 발표했습니다. K-pop 댄스 클래스, 한국 요리 체험, 한국어 회화 수업 등 다양한 프로그램이 준비되어 있습니다. 수강료는 무료이며, 온라인으로 신청할 수 있습니다. 한국인 자원봉사자도 모집하고 있습니다.',
  (SELECT id FROM category_ids WHERE name = '문화'),
  NOW() - INTERVAL '12 hours',
  '문화 일보',
  '한문화',
  '/placeholder.svg?height=200&width=300&text=한국+문화원',
  'https://example.com/news/6',
  98,
  false,
  false,
  true
),
-- 교민 소식
(
  '태국 한인회 신년 행사 개최 예정',
  '태국 한인회에서 2024년 신년 행사를 개최합니다. 다양한 프로그램과 함께 교민들의 화합의 장이 될 예정입니다.',
  '태국 한인회는 2024년 신년을 맞아 대규모 신년 행사를 개최한다고 발표했습니다. 행사는 방콕 시내 호텔에서 열리며, 전통 공연, 경품 추첨, 네트워킹 시간 등이 준비되어 있습니다. 참가비는 성인 1,500바트, 어린이 800바트이며, 사전 등록이 필요합니다. 자세한 내용은 한인회 홈페이지에서 확인할 수 있습니다.',
  (SELECT id FROM category_ids WHERE name = '교민소식'),
  NOW() - INTERVAL '14 hours',
  '한인회 소식',
  '김한인',
  '/placeholder.svg?height=200&width=300&text=한인회+행사',
  'https://example.com/news/7',
  203,
  false,
  false,
  true
),
(
  '방콕 한국인 학교 입학 설명회',
  '방콕 한국인 학교에서 2024년도 신입생 입학 설명회를 개최합니다. 학부모들의 많은 참여를 바랍니다.',
  '방콕 한국인 학교는 2024년도 신입생 모집을 위한 입학 설명회를 개최한다고 발표했습니다. 설명회에서는 교육과정, 입학 절차, 학비, 기숙사 등에 대한 자세한 안내가 제공됩니다. 또한 학교 시설 견학과 교사진과의 상담 시간도 마련되어 있습니다. 참가 신청은 학교 홈페이지에서 할 수 있으며, 선착순 100명까지 접수받습니다.',
  (SELECT id FROM category_ids WHERE name = '교민소식'),
  NOW() - INTERVAL '16 hours',
  '교육 소식',
  '이교육',
  '/placeholder.svg?height=200&width=300&text=한국인+학교',
  'https://example.com/news/8',
  156,
  false,
  false,
  true
),
-- 생활 정보
(
  '태국 비자 연장 절차 변경 안내',
  '태국 이민청에서 비자 연장 절차가 일부 변경되었습니다. 한국인 거주자들은 새로운 절차를 확인해야 합니다.',
  '태국 이민청은 외국인 비자 연장 절차를 간소화하고 온라인 서비스를 확대한다고 발표했습니다. 주요 변경사항으로는 온라인 사전 예약 시스템 도입, 필요 서류 간소화, 처리 기간 단축 등이 있습니다. 특히 관광비자에서 다른 비자로 변경하는 절차가 크게 개선되었습니다. 자세한 내용은 이민청 홈페이지에서 확인할 수 있습니다.',
  (SELECT id FROM category_ids WHERE name = '생활정보'),
  NOW() - INTERVAL '18 hours',
  '비자 가이드',
  '박비자',
  '/placeholder.svg?height=200&width=300&text=비자+연장',
  'https://example.com/news/9',
  312,
  false,
  false,
  true
),
(
  '방콕 대기질 개선 프로젝트 시작',
  '방콕시에서 대기질 개선을 위한 대규모 프로젝트를 시작합니다. 시민들의 건강을 위한 다양한 조치가 시행될 예정입니다.',
  '방콕시는 심각한 대기오염 문제 해결을 위해 종합적인 대기질 개선 프로젝트를 시작한다고 발표했습니다. 주요 내용으로는 전기버스 도입 확대, 공장 배출가스 규제 강화, 도심 녹지 확대 등이 포함되어 있습니다. 또한 실시간 대기질 정보를 제공하는 모바일 앱도 출시될 예정입니다. 프로젝트는 5년간 진행되며 총 100억 바트가 투입됩니다.',
  (SELECT id FROM category_ids WHERE name = '생활정보'),
  NOW() - INTERVAL '20 hours',
  '환경 뉴스',
  '최환경',
  '/placeholder.svg?height=200&width=300&text=대기질+개선',
  'https://example.com/news/10',
  187,
  false,
  false,
  true
);

-- 뉴스 기사와 태그 연결
WITH article_tag_mapping AS (
  SELECT 
    na.id as article_id,
    na.title,
    nt.id as tag_id,
    nt.name as tag_name
  FROM news_articles na
  CROSS JOIN news_tags nt
  WHERE 
    (na.title LIKE '%속보%' AND nt.name = '속보') OR
    (na.title LIKE '%정부%' AND nt.name = '정치') OR
    (na.title LIKE '%관광%' AND nt.name = '여행') OR
    (na.title LIKE '%지하철%' AND nt.name = '교통') OR
    (na.title LIKE '%방콕%' AND nt.name = '방콕') OR
    (na.title LIKE '%환율%' AND nt.name = '환율') OR
    (na.title LIKE '%바트%' AND nt.name = '경제') OR
    (na.title LIKE '%부동산%' AND nt.name = '부동산') OR
    (na.title LIKE '%투자%' AND nt.name = '투자') OR
    (na.title LIKE '%의료%' AND nt.name = '의료') OR
    (na.title LIKE '%보험%' AND nt.name = '건강') OR
    (na.title LIKE '%문화원%' AND nt.name = '문화') OR
    (na.title LIKE '%한국%' AND nt.name = '한국') OR
    (na.title LIKE '%한인회%' AND nt.name = '교민') OR
    (na.title LIKE '%학교%' AND nt.name = '교육') OR
    (na.title LIKE '%비자%' AND nt.name = '비자') OR
    (na.title LIKE '%대기질%' AND nt.name = '생활')
)
INSERT INTO news_article_tags (article_id, tag_id)
SELECT DISTINCT article_id, tag_id
FROM article_tag_mapping
ON CONFLICT (article_id, tag_id) DO NOTHING;
