-- 뉴스 기사 데이터 삽입
WITH inserted_articles AS (
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
        is_pinned
    ) VALUES
    (
        '태국 정부, 한국인 관광객 대상 새로운 비자 정책 발표',
        '태국 정부가 한국인 관광객 유치를 위한 새로운 비자 정책을 발표했습니다. 이번 정책으로 한국인들의 태국 방문이 더욱 편리해질 것으로 예상됩니다.',
        '태국 관광청은 오늘 기자회견을 통해 한국인 관광객을 대상으로 한 새로운 비자 정책을 발표했습니다. 주요 내용으로는 관광비자 연장 기간 확대, 다중입국 비자 발급 조건 완화, 온라인 비자 신청 시스템 개선 등이 포함되어 있습니다. 태국 관광청장은 "한국은 태국의 중요한 관광 파트너 국가"라며 "이번 정책으로 더 많은 한국인 관광객들이 태국을 방문할 수 있을 것"이라고 말했습니다.',
        (SELECT id FROM news_categories WHERE name = '정치'),
        NOW() - INTERVAL '1 hour',
        '태국 일보',
        '김태국',
        '/placeholder.svg?height=200&width=300&text=태국+비자+정책',
        'https://example.com/news/1',
        156,
        true,
        true
    ),
    (
        '방콕 지하철 새 노선 개통 예정, 교민 거주지역 접근성 향상',
        '방콕 대중교통공사가 새로운 지하철 노선의 개통 일정을 발표했습니다. 한국인 교민들이 많이 거주하는 지역의 교통 편의성이 크게 개선될 예정입니다.',
        '방콕 대중교통공사(BMCL)는 오늘 새로운 지하철 노선인 오렌지 라인의 개통 일정을 발표했습니다. 이 노선은 방콕 중심부에서 동쪽 지역을 연결하며, 한국인 교민들이 많이 거주하는 수쿰빗, 통로, 에까마이 지역의 접근성을 크게 향상시킬 것으로 예상됩니다. 새 노선은 총 17개 역으로 구성되며, 2025년 상반기 개통을 목표로 하고 있습니다.',
        (SELECT id FROM news_categories WHERE name = '사회'),
        NOW() - INTERVAL '4 hours',
        '방콕 포스트',
        '이방콕',
        '/placeholder.svg?height=200&width=300&text=방콕+지하철',
        NULL,
        89,
        false,
        true
    ),
    (
        '태국 바트화 강세 지속, 한국 투자자들 관심 증가',
        '최근 태국 바트화의 강세가 지속되면서 한국 투자자들의 태국 투자에 대한 관심이 높아지고 있습니다.',
        '태국 중앙은행에 따르면 올해 들어 바트화는 달러 대비 약 8% 상승했으며, 이는 아시아 통화 중 가장 높은 상승률을 기록했습니다. 전문가들은 태국의 견고한 경제 펀더멘털과 관광업 회복이 바트화 강세의 주요 원인이라고 분석했습니다. 이에 따라 한국의 기관투자자들과 개인투자자들이 태국 주식시장과 부동산 시장에 대한 관심을 높이고 있습니다.',
        (SELECT id FROM news_categories WHERE name = '경제'),
        NOW() - INTERVAL '6 hours',
        '경제신문',
        '박경제',
        '/placeholder.svg?height=200&width=300&text=태국+경제',
        NULL,
        67,
        false,
        false
    ),
    (
        '방콕 한인회, 추석 맞이 대규모 행사 개최 예정',
        '방콕 한인회가 다가오는 추석을 맞아 교민들을 위한 대규모 행사를 준비하고 있다고 발표했습니다.',
        '방콕 한인회는 오는 9월 29일 추석을 맞아 방콕 시내 호텔에서 교민 화합 행사를 개최한다고 발표했습니다. 이번 행사에는 전통 차례상 차리기 체험, 한국 전통 놀이, K-POP 공연 등 다양한 프로그램이 준비되어 있습니다. 한인회 관계자는 "코로나19로 인해 오랫동안 대규모 행사를 개최하지 못했는데, 이번 추석 행사를 통해 교민들이 한자리에 모여 고향의 정을 나눌 수 있을 것"이라고 말했습니다.',
        (SELECT id FROM news_categories WHERE name = '교민소식'),
        NOW() - INTERVAL '8 hours',
        '한인신문',
        '최교민',
        '/placeholder.svg?height=200&width=300&text=추석+행사',
        NULL,
        234,
        false,
        false
    ),
    (
        'K-POP 콘서트 방콕 개최, 한류 열풍 지속',
        '세계적인 K-POP 그룹의 방콕 콘서트가 확정되면서 태국 내 한류 열풍이 더욱 뜨거워지고 있습니다.',
        '태국 최대 공연장인 임팩트 아레나에서 오는 11월 K-POP 그룹의 대규모 콘서트가 개최됩니다. 이번 콘서트는 아시아 투어의 일환으로 진행되며, 태국 팬들의 뜨거운 관심을 받고 있습니다. 티켓 예매 시작 1시간 만에 전석이 매진되는 등 한류의 인기를 실감할 수 있었습니다. 태국 문화부 관계자는 "K-POP을 통한 한-태 문화교류가 더욱 활발해지고 있다"고 평가했습니다.',
        (SELECT id FROM news_categories WHERE name = '문화'),
        NOW() - INTERVAL '12 hours',
        '문화일보',
        '송문화',
        '/placeholder.svg?height=200&width=300&text=K-POP+콘서트',
        NULL,
        145,
        false,
        false
    ),
    (
        '태국 프리미어리그에 한국 선수 영입, 현지 팬들 환영',
        '태국 프리미어리그 구단이 한국 선수를 영입하면서 현지 축구팬들의 관심이 집중되고 있습니다.',
        '방콕 유나이티드 FC가 K리그에서 활약했던 한국 선수를 영입했다고 발표했습니다. 이 선수는 지난 시즌 K리그에서 우수한 성적을 거둔 공격수로, 태국 리그에서의 활약이 기대됩니다. 구단 관계자는 "한국 선수의 기술력과 경험이 팀에 큰 도움이 될 것"이라며 "태국 축구 발전에도 기여할 것으로 기대한다"고 말했습니다.',
        (SELECT id FROM news_categories WHERE name = '스포츠'),
        NOW() - INTERVAL '24 hours',
        '스포츠투데이',
        '김스포츠',
        '/placeholder.svg?height=200&width=300&text=축구+선수',
        NULL,
        98,
        false,
        false
    ),
    (
        '태국 정부, 디지털 노마드 비자 도입 검토',
        '태국 정부가 디지털 노마드를 위한 특별 비자 도입을 검토하고 있어 한국 IT 전문가들의 관심이 높아지고 있습니다.',
        '태국 디지털경제사회부는 원격근무가 가능한 외국인 전문가들을 위한 디지털 노마드 비자 도입을 검토 중이라고 발표했습니다. 이 비자는 최대 1년간 체류가 가능하며, IT, 디자인, 마케팅 등 다양한 분야의 전문가들이 대상입니다. 한국의 많은 IT 전문가들이 이미 관심을 보이고 있으며, 태국의 저렴한 생활비와 좋은 기후 조건이 큰 매력으로 작용하고 있습니다.',
        (SELECT id FROM news_categories WHERE name = 'IT/과학'),
        NOW() - INTERVAL '26 hours',
        'IT뉴스',
        '이아이티',
        '/placeholder.svg?height=200&width=300&text=디지털+노마드',
        NULL,
        76,
        false,
        false
    ),
    (
        '방콕 새로운 한국마트 오픈, 교민들 편의 증대',
        '방콕에 새로운 한국마트가 오픈하면서 교민들의 생활 편의가 크게 향상될 것으로 예상됩니다.',
        '방콕 수쿰빗 지역에 대형 한국마트가 새롭게 문을 열었습니다. 이 마트는 한국 식품, 생활용품, 화장품 등 다양한 한국 제품을 판매하며, 특히 신선한 한국 채소와 육류를 저렴한 가격에 제공합니다. 마트 관계자는 "교민들이 고향의 맛을 그리워하지 않도록 최선을 다하겠다"며 "앞으로도 다양한 한국 제품을 지속적으로 들여올 계획"이라고 말했습니다.',
        (SELECT id FROM news_categories WHERE name = '생활정보'),
        NOW() - INTERVAL '30 hours',
        '생활정보',
        '박생활',
        '/placeholder.svg?height=200&width=300&text=한국마트',
        NULL,
        187,
        false,
        false
    ),
    (
        '한-태 정상회담 개최 예정, 양국 관계 발전 기대',
        '한국과 태국 정상회담이 예정되어 있어 양국 관계의 새로운 전환점이 될 것으로 기대됩니다.',
        '한국과 태국 정부는 다음 달 정상회담을 개최한다고 발표했습니다. 이번 회담에서는 경제협력 확대, 문화교류 증진, 관광산업 발전 등 다양한 분야의 협력 방안이 논의될 예정입니다. 양국 외교부는 "이번 정상회담을 통해 한-태 관계가 한 단계 더 발전할 것"이라며 "특히 경제협력 분야에서 구체적인 성과가 있을 것으로 기대한다"고 밝혔습니다.',
        (SELECT id FROM news_categories WHERE name = '국제'),
        NOW() - INTERVAL '48 hours',
        '국제뉴스',
        '최국제',
        '/placeholder.svg?height=200&width=300&text=정상회담',
        NULL,
        123,
        false,
        false
    ),
    (
        '태국 우기철 대비 안전 수칙, 교민들 주의 당부',
        '태국의 우기철이 시작되면서 교민들의 안전에 각별한 주의가 필요한 시점입니다.',
        '태국 기상청은 올해 우기철이 평년보다 강할 것으로 예상된다고 발표했습니다. 특히 방콕과 주변 지역에는 집중호우와 함께 침수 위험이 높아질 것으로 예상됩니다. 한국 영사관은 교민들에게 "우기철 동안 외출 시 각별한 주의를 기울이고, 침수 위험 지역은 피해달라"고 당부했습니다. 또한 비상연락망을 점검하고 응급상황에 대비할 것을 권고했습니다.',
        (SELECT id FROM news_categories WHERE name = '기타'),
        NOW() - INTERVAL '52 hours',
        '안전뉴스',
        '김안전',
        '/placeholder.svg?height=200&width=300&text=우기철+안전',
        NULL,
        95,
        false,
        false
    )
    RETURNING id, title
)
SELECT * FROM inserted_articles;

-- 뉴스 기사-태그 연결 데이터 삽입
INSERT INTO news_article_tags (article_id, tag_id)
SELECT 
    na.id,
    nt.id
FROM news_articles na
CROSS JOIN news_tags nt
WHERE 
    (na.title LIKE '%비자%' AND nt.name IN ('속보', '정치', '한국', '태국', '비자'))
    OR (na.title LIKE '%지하철%' AND nt.name IN ('사회', '방콕', '교민'))
    OR (na.title LIKE '%바트화%' AND nt.name IN ('경제', '태국', '투자'))
    OR (na.title LIKE '%추석%' AND nt.name IN ('교민', '방콕', '한국'))
    OR (na.title LIKE '%K-POP%' AND nt.name IN ('방콕', '한국', '문화'))
    OR (na.title LIKE '%축구%' AND nt.name IN ('방콕', '한국', '스포츠'))
    OR (na.title LIKE '%디지털%' AND nt.name IN ('태국', '한국', 'IT', '비자'))
    OR (na.title LIKE '%한국마트%' AND nt.name IN ('방콕', '교민', '한국'))
    OR (na.title LIKE '%정상회담%' AND nt.name IN ('한국', '태국', '정치'))
    OR (na.title LIKE '%우기철%' AND nt.name IN ('태국', '교민'))
ON CONFLICT (article_id, tag_id) DO NOTHING;

-- 데이터 삽입 확인
SELECT 
    na.id,
    na.title,
    nc.name as category,
    na.published_at,
    na.view_count,
    na.is_breaking,
    na.is_pinned
FROM news_articles na
LEFT JOIN news_categories nc ON na.category_id = nc.id
ORDER BY na.published_at DESC;
