-- 샘플 뉴스 데이터 삽입
-- 먼저 카테고리 ID를 가져와서 변수에 저장
DO $$
DECLARE
    politics_id INTEGER;
    economy_id INTEGER;
    society_id INTEGER;
    international_id INTEGER;
    culture_id INTEGER;
    sports_id INTEGER;
    it_science_id INTEGER;
    expat_news_id INTEGER;
    life_info_id INTEGER;
    etc_id INTEGER;
    
    breaking_tag_id INTEGER;
    politics_tag_id INTEGER;
    economy_tag_id INTEGER;
    society_tag_id INTEGER;
    korea_tag_id INTEGER;
    thailand_tag_id INTEGER;
    bangkok_tag_id INTEGER;
    expat_tag_id INTEGER;
    visa_tag_id INTEGER;
    investment_tag_id INTEGER;
    
    article_id INTEGER;
BEGIN
    -- 카테고리 ID 조회
    SELECT id INTO politics_id FROM news_categories WHERE name = '정치';
    SELECT id INTO economy_id FROM news_categories WHERE name = '경제';
    SELECT id INTO society_id FROM news_categories WHERE name = '사회';
    SELECT id INTO international_id FROM news_categories WHERE name = '국제';
    SELECT id INTO culture_id FROM news_categories WHERE name = '문화';
    SELECT id INTO sports_id FROM news_categories WHERE name = '스포츠';
    SELECT id INTO it_science_id FROM news_categories WHERE name = 'IT/과학';
    SELECT id INTO expat_news_id FROM news_categories WHERE name = '교민소식';
    SELECT id INTO life_info_id FROM news_categories WHERE name = '생활정보';
    SELECT id INTO etc_id FROM news_categories WHERE name = '기타';
    
    -- 태그 ID 조회
    SELECT id INTO breaking_tag_id FROM news_tags WHERE name = '속보';
    SELECT id INTO politics_tag_id FROM news_tags WHERE name = '정치';
    SELECT id INTO economy_tag_id FROM news_tags WHERE name = '경제';
    SELECT id INTO society_tag_id FROM news_tags WHERE name = '사회';
    SELECT id INTO korea_tag_id FROM news_tags WHERE name = '한국';
    SELECT id INTO thailand_tag_id FROM news_tags WHERE name = '태국';
    SELECT id INTO bangkok_tag_id FROM news_tags WHERE name = '방콕';
    SELECT id INTO expat_tag_id FROM news_tags WHERE name = '교민';
    SELECT id INTO visa_tag_id FROM news_tags WHERE name = '비자';
    SELECT id INTO investment_tag_id FROM news_tags WHERE name = '투자';

    -- 뉴스 기사 삽입
    
    -- 1. 속보 뉴스
    INSERT INTO news_articles (title, summary, content, category_id, source, author, image_url, external_url, view_count, is_breaking, is_pinned, published_at)
    VALUES (
        '태국 정부, 한국인 관광객 대상 새로운 비자 정책 발표',
        '태국 정부가 한국인 관광객 유치를 위한 새로운 비자 정책을 발표했습니다. 이번 정책으로 한국인들의 태국 방문이 더욱 편리해질 것으로 예상됩니다.',
        '태국 관광청은 오늘 기자회견을 통해 한국인 관광객을 대상으로 한 새로운 비자 정책을 발표했습니다. 주요 내용으로는 관광비자 연장 기간 확대, 다중입국 비자 발급 조건 완화, 온라인 비자 신청 시스템 개선 등이 포함되어 있습니다. 태국 관광청 관계자는 "코로나19 이후 회복되고 있는 관광 산업에 활력을 불어넣기 위한 조치"라고 설명했습니다.',
        politics_id,
        '태국 일보',
        '김태국',
        '/placeholder.svg?height=200&width=300&text=태국+비자+정책',
        'https://example.com/news/1',
        156,
        true,
        true,
        NOW() - INTERVAL '1 hour'
    ) RETURNING id INTO article_id;
    
    -- 태그 연결
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, breaking_tag_id),
        (article_id, politics_tag_id),
        (article_id, korea_tag_id),
        (article_id, thailand_tag_id),
        (article_id, visa_tag_id);

    -- 2. 교통 뉴스
    INSERT INTO news_articles (title, summary, content, category_id, source, author, image_url, view_count, is_pinned, published_at)
    VALUES (
        '방콕 지하철 새 노선 개통 예정, 교민 거주지역 접근성 향상',
        '방콕 대중교통공사가 새로운 지하철 노선의 개통 일정을 발표했습니다. 한국인 교민들이 많이 거주하는 지역의 교통 편의성이 크게 개선될 예정입니다.',
        '방콕 대중교통공사(BMCL)는 오늘 새로운 지하철 노선인 오렌지 라인의 개통 일정을 발표했습니다. 이 노선은 방콕 중심부에서 동쪽 지역을 연결하며, 한국인 교민들이 많이 거주하는 수쿰빗, 통로, 에까마이 지역의 접근성을 크게 향상시킬 것으로 예상됩니다. 총 연장 35.4km, 30개 역으로 구성된 이 노선은 2024년 말 완전 개통을 목표로 하고 있습니다.',
        society_id,
        '방콕 포스트',
        '이방콕',
        '/placeholder.svg?height=200&width=300&text=방콕+지하철',
        89,
        true,
        NOW() - INTERVAL '4 hours'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, society_tag_id),
        (article_id, bangkok_tag_id),
        (article_id, expat_tag_id);

    -- 3. 경제 뉴스
    INSERT INTO news_articles (title, summary, content, category_id, source, author, view_count, published_at)
    VALUES (
        '태국 바트화 강세 지속, 한국 투자자들 관심 증가',
        '최근 태국 바트화의 강세가 지속되면서 한국 투자자들의 태국 투자에 대한 관심이 높아지고 있습니다.',
        '태국 중앙은행에 따르면 올해 들어 바트화는 달러 대비 약 8% 상승했으며, 이는 아시아 통화 중 가장 높은 상승률을 기록했습니다. 전문가들은 태국의 견고한 경제 펀더멘털과 관광업 회복이 바트화 강세의 주요 원인이라고 분석했습니다. 이에 따라 한국의 기관투자자들과 개인투자자들이 태국 주식시장과 부동산 시장에 대한 투자를 늘리고 있는 것으로 나타났습니다.',
        economy_id,
        '경제신문',
        '박경제',
        67,
        NOW() - INTERVAL '6 hours'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, economy_tag_id),
        (article_id, thailand_tag_id),
        (article_id, korea_tag_id),
        (article_id, investment_tag_id);

    -- 4. 교민 소식
    INSERT INTO news_articles (title, summary, content, category_id, source, author, view_count, published_at)
    VALUES (
        '방콕 한인회, 추석 맞이 대규모 행사 개최 예정',
        '방콕 한인회가 다가오는 추석을 맞아 교민들을 위한 대규모 행사를 준비하고 있다고 발표했습니다.',
        '방콕 한인회는 오는 9월 29일 추석을 맞아 방콕 시내 호텔에서 교민 화합 행사를 개최한다고 발표했습니다. 이번 행사에는 전통 차례상 차리기 체험, 한국 전통 놀이, K-POP 공연 등 다양한 프로그램이 준비되어 있습니다. 한인회 관계자는 "코로나19로 인해 고향을 그리워하는 교민들에게 따뜻한 위로가 되길 바란다"고 말했습니다. 참가 신청은 한인회 홈페이지에서 가능합니다.',
        expat_news_id,
        '한인신문',
        '최교민',
        234,
        NOW() - INTERVAL '8 hours'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, expat_tag_id),
        (article_id, bangkok_tag_id),
        (article_id, korea_tag_id);

    -- 5. 문화 뉴스
    INSERT INTO news_articles (title, summary, content, category_id, source, view_count, published_at)
    VALUES (
        'K-POP 콘서트 방콕 개최, 한류 열풍 지속',
        '세계적인 K-POP 그룹의 방콕 콘서트가 확정되면서 태국 내 한류 열풍이 더욱 뜨거워지고 있습니다.',
        '태국 최대 공연장인 임팩트 아레나에서 오는 11월 K-POP 그룹의 대규모 콘서트가 개최됩니다. 이번 콘서트는 아시아 투어의 일환으로 진행되며, 태국 팬들의 뜨거운 관심을 받고 있습니다. 티켓 예매 시작 1시간 만에 전석 매진을 기록하며 한류의 인기를 다시 한번 입증했습니다. 태국 문화부 관계자는 "한국 문화 콘텐츠가 태국 젊은이들에게 미치는 긍정적 영향이 크다"고 평가했습니다.',
        culture_id,
        '문화일보',
        '송문화',
        145,
        NOW() - INTERVAL '12 hours'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, bangkok_tag_id),
        (article_id, korea_tag_id);

    -- 6. 스포츠 뉴스
    INSERT INTO news_articles (title, summary, content, category_id, source, view_count, published_at)
    VALUES (
        '태국 프리미어리그에 한국 선수 영입, 현지 팬들 환영',
        '태국 프리미어리그 구단이 한국 선수를 영입하면서 현지 축구팬들의 관심이 집중되고 있습니다.',
        '방콕 유나이티드 FC가 K리그에서 활약했던 한국 선수를 영입했다고 발표했습니다. 이 선수는 지난 시즌 K리그에서 우수한 성적을 거둔 공격수로, 태국 리그에서의 활약이 기대됩니다. 구단 관계자는 "한국 선수의 영입으로 팀의 경쟁력을 높이고, 한국 팬들에게도 더 많은 관심을 받을 것으로 기대한다"고 말했습니다. 첫 경기는 다음 주 토요일 방콕 스타디움에서 열릴 예정입니다.',
        sports_id,
        '스포츠투데이',
        '김스포츠',
        98,
        NOW() - INTERVAL '1 day'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, bangkok_tag_id),
        (article_id, korea_tag_id);

    -- 7. IT/과학 뉴스
    INSERT INTO news_articles (title, summary, content, category_id, source, view_count, published_at)
    VALUES (
        '태국 정부, 디지털 노마드 비자 도입 검토',
        '태국 정부가 디지털 노마드를 위한 특별 비자 도입을 검토하고 있어 한국 IT 전문가들의 관심이 높아지고 있습니다.',
        '태국 디지털경제사회부는 원격근무가 가능한 외국인 전문가들을 위한 디지털 노마드 비자 도입을 검토 중이라고 발표했습니다. 이 비자는 최대 1년간 체류가 가능하며, IT, 디자인, 마케팅 등 다양한 분야의 전문가들이 대상입니다. 한국의 많은 IT 전문가들이 이미 관심을 표명하고 있으며, 태국의 저렴한 생활비와 좋은 인프라를 활용한 원격근무 환경으로 주목받고 있습니다.',
        it_science_id,
        'IT뉴스',
        '이아이티',
        76,
        NOW() - INTERVAL '1 day 2 hours'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, thailand_tag_id),
        (article_id, korea_tag_id),
        (article_id, visa_tag_id);

    -- 8. 생활정보
    INSERT INTO news_articles (title, summary, content, category_id, source, view_count, published_at)
    VALUES (
        '방콕 새로운 한국마트 오픈, 교민들 편의 증대',
        '방콕에 새로운 한국마트가 오픈하면서 교민들의 생활 편의가 크게 향상될 것으로 예상됩니다.',
        '방콕 수쿰빗 지역에 대형 한국마트가 새롭게 문을 열었습니다. 이 마트는 한국 식품, 생활용품, 화장품 등 다양한 한국 제품을 판매하며, 특히 신선한 한국 채소와 육류를 저렴한 가격에 제공합니다. 마트 관계자는 "교민들이 고향의 맛을 그리워하지 않도록 최선을 다하겠다"고 말했습니다. 오픈 기념으로 이번 주말까지 전 품목 20% 할인 행사를 진행합니다.',
        life_info_id,
        '생활정보',
        '박생활',
        187,
        NOW() - INTERVAL '1 day 6 hours'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, bangkok_tag_id),
        (article_id, expat_tag_id),
        (article_id, korea_tag_id);

    -- 9. 국제 뉴스
    INSERT INTO news_articles (title, summary, content, category_id, source, view_count, published_at)
    VALUES (
        '한-태 정상회담 개최 예정, 양국 관계 발전 기대',
        '한국과 태국 정상회담이 예정되어 있어 양국 관계의 새로운 전환점이 될 것으로 기대됩니다.',
        '한국과 태국 정부는 다음 달 정상회담을 개최한다고 발표했습니다. 이번 회담에서는 경제협력 확대, 문화교류 증진, 관광산업 발전 등 다양한 분야의 협력 방안이 논의될 예정입니다. 특히 한국의 첨단기술과 태국의 제조업 인프라를 결합한 새로운 협력 모델이 주목받고 있습니다. 양국 정상은 또한 교민 보호와 지원 방안에 대해서도 깊이 있는 논의를 할 것으로 알려졌습니다.',
        international_id,
        '국제뉴스',
        '최국제',
        123,
        NOW() - INTERVAL '2 days'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, korea_tag_id),
        (article_id, thailand_tag_id),
        (article_id, politics_tag_id);

    -- 10. 기타 뉴스
    INSERT INTO news_articles (title, summary, content, category_id, source, view_count, published_at)
    VALUES (
        '태국 우기철 대비 안전 수칙, 교민들 주의 당부',
        '태국의 우기철이 시작되면서 교민들의 안전에 각별한 주의가 필요한 시점입니다.',
        '태국 기상청은 올해 우기철이 평년보다 강할 것으로 예상된다고 발표했습니다. 특히 방콕과 주변 지역에는 집중호우와 함께 침수 위험이 높아질 것으로 예상됩니다. 한국 영사관은 교민들에게 ▲침수 위험 지역 피하기 ▲비상용품 준비 ▲긴급연락처 숙지 등의 안전 수칙을 당부했습니다. 또한 응급상황 발생 시 즉시 영사관으로 연락할 것을 요청했습니다.',
        etc_id,
        '안전뉴스',
        '김안전',
        95,
        NOW() - INTERVAL '2 days 4 hours'
    ) RETURNING id INTO article_id;
    
    INSERT INTO news_article_tags (article_id, tag_id) VALUES 
        (article_id, thailand_tag_id),
        (article_id, expat_tag_id);

END $$;
