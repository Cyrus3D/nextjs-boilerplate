-- Insert sample news articles
WITH category_ids AS (
    SELECT id, name FROM news_categories
)
INSERT INTO news_articles (
    title, 
    content, 
    summary, 
    category_id, 
    category, 
    source, 
    author, 
    published_at, 
    image_url, 
    view_count, 
    is_featured, 
    is_breaking
) VALUES
(
    '태국 정부, 관광객 비자 연장 정책 발표',
    '태국 정부가 관광 활성화를 위해 관광객 비자 연장 정책을 발표했습니다. 이번 정책에 따르면 관광 목적으로 입국한 외국인들은 기존 30일에서 45일까지 체류할 수 있게 됩니다. 또한 비자 연장 절차도 간소화되어 온라인으로도 신청이 가능해집니다. 태국 관광청은 이번 정책이 코로나19 이후 침체된 관광업계 회복에 큰 도움이 될 것으로 기대한다고 밝혔습니다.',
    '태국 정부가 관광 활성화를 위한 새로운 비자 정책을 발표했습니다.',
    (SELECT id FROM category_ids WHERE name = '정책'),
    '정책',
    '태국 관광청',
    '뉴스팀',
    NOW() - INTERVAL '2 hours',
    '/placeholder.svg?height=200&width=400',
    245,
    true,
    false
),
(
    '방콕 지하철 새 노선 개통 예정',
    '방콕 대중교통 시스템이 확장됩니다. BTS(방콕 스카이트레인)의 새로운 노선이 다음 달 개통될 예정입니다. 새 노선은 기존 수쿰빗 라인을 연장하여 방콕 외곽 지역까지 연결하게 됩니다. 이로 인해 교통 체증 완화와 시민들의 이동 편의성이 크게 향상될 것으로 예상됩니다. 방콕 대중교통공사는 향후 5년간 총 3개의 새로운 노선을 추가로 개통할 계획이라고 발표했습니다.',
    '방콕 지하철 새 노선이 다음 달 개통 예정입니다.',
    (SELECT id FROM category_ids WHERE name = '교통'),
    '교통',
    'BTS',
    '교통팀',
    NOW() - INTERVAL '1 day',
    '/placeholder.svg?height=200&width=400',
    189,
    false,
    true
),
(
    '태국 한인회 신년 행사 개최',
    '태국 한인회에서 신년 맞이 행사를 개최합니다. 이번 행사는 방콕 시내 호텔에서 열리며, 전통 공연과 함께 한국 음식을 맛볼 수 있는 기회가 제공됩니다. 또한 한인 사업가들의 네트워킹 시간도 마련되어 있어 많은 참여가 예상됩니다. 한인회 관계자는 "코로나19로 인해 오랫동안 만나지 못했던 교민들이 한자리에 모여 새해 인사를 나눌 수 있는 뜻깊은 자리가 될 것"이라고 말했습니다.',
    '태국 한인회 신년 행사가 이번 주말 개최됩니다.',
    (SELECT id FROM category_ids WHERE name = '커뮤니티'),
    '커뮤니티',
    '태국한인회',
    '커뮤니티팀',
    NOW() - INTERVAL '2 days',
    '/placeholder.svg?height=200&width=400',
    156,
    false,
    false
),
(
    '태국 바트화 강세 지속, 환율 변동 주의',
    '최근 태국 바트화가 강세를 보이면서 한국 원화 대비 환율이 크게 변동하고 있습니다. 전문가들은 태국의 관광업 회복과 수출 증가가 바트화 강세의 주요 원인이라고 분석하고 있습니다. 태국 거주 한국인들은 환율 변동에 따른 생활비 변화에 주의해야 할 것으로 보입니다. 태국 중앙은행은 통화정책을 통해 급격한 환율 변동을 억제하겠다고 발표했습니다.',
    '태국 바트화 강세로 인한 환율 변동이 지속되고 있습니다.',
    (SELECT id FROM category_ids WHERE name = '경제'),
    '경제',
    '태국 중앙은행',
    '경제팀',
    NOW() - INTERVAL '3 days',
    '/placeholder.svg?height=200&width=400',
    203,
    true,
    false
),
(
    '방콕 한국문화원, K-POP 콘서트 개최',
    '방콕 한국문화원에서 K-POP 콘서트를 개최합니다. 이번 콘서트에는 태국에서 활동하는 한국 아티스트들과 현지 K-POP 커버 댄스팀들이 참여할 예정입니다. 한류 열풍이 지속되는 가운데 많은 태국 현지인들의 관심이 집중되고 있습니다. 문화원 관계자는 "한국과 태국의 문화 교류를 더욱 활성화하는 계기가 되길 바란다"고 말했습니다.',
    '방콕 한국문화원에서 K-POP 콘서트가 개최됩니다.',
    (SELECT id FROM category_ids WHERE name = '문화'),
    '문화',
    '방콕 한국문화원',
    '문화팀',
    NOW() - INTERVAL '4 days',
    '/placeholder.svg?height=200&width=400',
    178,
    false,
    false
);

-- Insert sample news tags
INSERT INTO news_tags (name) VALUES
('비자'), ('관광'), ('정책'), ('교통'), ('지하철'), ('방콕'),
('한인회'), ('행사'), ('커뮤니티'), ('환율'), ('경제'), ('바트화'),
('K-POP'), ('콘서트'), ('한류'), ('문화교류')
ON CONFLICT (name) DO NOTHING;

-- Link articles with tags
WITH article_tag_mapping AS (
    SELECT 
        na.id as article_id,
        nt.id as tag_id,
        na.title
    FROM news_articles na
    CROSS JOIN news_tags nt
    WHERE 
        (na.title LIKE '%비자%' AND nt.name IN ('비자', '관광', '정책')) OR
        (na.title LIKE '%지하철%' AND nt.name IN ('교통', '지하철', '방콕')) OR
        (na.title LIKE '%한인회%' AND nt.name IN ('한인회', '행사', '커뮤니티')) OR
        (na.title LIKE '%바트화%' AND nt.name IN ('환율', '경제', '바트화')) OR
        (na.title LIKE '%K-POP%' AND nt.name IN ('K-POP', '콘서트', '한류', '문화교류'))
)
INSERT INTO news_article_tags (news_article_id, news_tag_id)
SELECT DISTINCT article_id, tag_id FROM article_tag_mapping
ON CONFLICT DO NOTHING;
