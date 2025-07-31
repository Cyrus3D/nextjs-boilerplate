-- 샘플 뉴스 데이터 삽입
WITH sample_news AS (
  SELECT 
    '태국 정부, 한국인 관광객 대상 비자 면제 기간 연장 검토' as title,
    '태국 정부가 한국인 관광객을 대상으로 한 비자 면제 기간을 현재 30일에서 60일로 연장하는 방안을 검토 중이라고 발표했습니다.' as summary,
    '태국 관광청은 오늘 기자회견을 통해 한국인 관광객 유치를 위한 새로운 정책을 발표했습니다. 주요 내용은 비자 면제 기간 연장과 함께 한국인 전용 관광 서비스 확대 등이 포함되어 있습니다.' as content,
    1 as category_id,
    NOW() - INTERVAL '2 hours' as published_at,
    '태국 관광청' as source,
    '김기자' as author,
    true as is_breaking,
    false as is_pinned
  UNION ALL
  SELECT 
    '방콕 지하철 새 노선 개통, 한국인 거주 지역 접근성 크게 개선',
    '방콕 대중교통공사(BMTA)가 새로운 지하철 노선을 개통하면서 한국인들이 많이 거주하는 수쿰빗 지역의 교통 접근성이 크게 개선될 것으로 예상됩니다.',
    '새로 개통된 지하철 노선은 수쿰빗 소이 24부터 아속역까지 연결되며, 한국인들이 자주 이용하는 상업지구와 주거지역을 효율적으로 연결합니다.',
    3,
    NOW() - INTERVAL '4 hours',
    'BTS 공사',
    '이기자',
    false,
    true
  UNION ALL
  SELECT 
    '태국 바트화 강세 지속, 한국 원화 대비 환율 변동 주목',
    '최근 태국 바트화가 강세를 보이면서 한국 원화 대비 환율이 지속적으로 변동하고 있어 한국인 거주자들과 관광객들의 관심이 집중되고 있습니다.',
    '태국 중앙은행에 따르면 바트화 강세는 태국 경제의 안정적 성장과 관광업 회복에 따른 것으로 분석됩니다.',
    2,
    NOW() - INTERVAL '6 hours',
    '태국 중앙은행',
    '박기자',
    false,
    false
  UNION ALL
  SELECT 
    '치앙마이 한국 문화 축제 성황리 개최, 3만명 참석',
    '치앙마이에서 열린 한국 문화 축제가 성황리에 마무리되었습니다. 이번 축제에는 현지인과 한국인 관광객 등 총 3만여 명이 참석했습니다.',
    '축제에서는 K-pop 공연, 한국 전통 음식 체험, 한복 체험 등 다양한 프로그램이 진행되었으며, 한국과 태국의 문화 교류 증진에 크게 기여했다는 평가를 받고 있습니다.',
    5,
    NOW() - INTERVAL '8 hours',
    '치앙마이 시청',
    '최기자',
    false,
    false
  UNION ALL
  SELECT 
    '태국 내 한국 기업 투자 급증, 올해 전년 대비 40% 증가',
    '태국 투자청(BOI)에 따르면 올해 태국 내 한국 기업의 투자가 전년 대비 40% 증가한 것으로 나타났습니다.',
    '특히 제조업과 서비스업 분야에서 한국 기업들의 투자가 활발하며, 이는 태국의 경제 성장과 한국 기업들의 동남아시아 진출 확대 전략이 맞아떨어진 결과로 분석됩니다.',
    2,
    NOW() - INTERVAL '12 hours',
    '태국 투자청',
    '정기자',
    false,
    false
  UNION ALL
  SELECT 
    '파타야 한국인 관광객 대상 사기 사건 발생, 주의 당부',
    '파타야 지역에서 한국인 관광객을 대상으로 한 사기 사건이 발생해 주의가 당부되고 있습니다.',
    '태국 관광경찰에 따르면 가짜 보석 판매, 과도한 요금 청구 등의 수법으로 한국인 관광객들을 대상으로 한 사기 사건이 증가하고 있어 각별한 주의가 필요합니다.',
    9,
    NOW() - INTERVAL '1 day',
    '태국 관광경찰',
    '한기자',
    false,
    false
)
INSERT INTO news_articles (title, summary, content, category_id, published_at, source, author, is_breaking, is_pinned)
SELECT title, summary, content, category_id, published_at, source, author, is_breaking, is_pinned
FROM sample_news;

-- 뉴스 기사에 태그 연결
WITH article_tags AS (
  SELECT 
    na.id as article_id,
    nt.id as tag_id
  FROM news_articles na
  CROSS JOIN news_tags nt
  WHERE 
    (na.title LIKE '%비자%' AND nt.name IN ('비자', '한국인', '정책변경')) OR
    (na.title LIKE '%지하철%' AND nt.name IN ('교통', '생활정보')) OR
    (na.title LIKE '%환율%' AND nt.name IN ('환율', '경제정책')) OR
    (na.title LIKE '%문화 축제%' AND nt.name IN ('문화행사', '축제', '한국인')) OR
    (na.title LIKE '%투자%' AND nt.name IN ('투자', '경제정책')) OR
    (na.title LIKE '%사기%' AND nt.name IN ('안전', '범죄', '한국인'))
)
INSERT INTO news_article_tags (article_id, tag_id)
SELECT DISTINCT article_id, tag_id FROM article_tags
ON CONFLICT (article_id, tag_id) DO NOTHING;
