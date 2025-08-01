-- Drop existing news tables if they exist
DROP TABLE IF EXISTS news_article_tags CASCADE;
DROP TABLE IF EXISTS news_tags CASCADE;
DROP TABLE IF EXISTS news_articles CASCADE;

-- Create news_articles table with simplified structure
CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT '일반',
    tags TEXT[] DEFAULT '{}',
    author VARCHAR(100) DEFAULT '관리자',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    source_url TEXT,
    is_published BOOLEAN DEFAULT true,
    read_time INTEGER DEFAULT 5,
    is_breaking BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_is_published ON news_articles(is_published);
CREATE INDEX idx_news_articles_is_breaking ON news_articles(is_breaking);

-- Insert sample news data
INSERT INTO news_articles (title, excerpt, content, category, tags, author, image_url, source_url, read_time, is_breaking, view_count) VALUES
(
    '태국 비자 연장 절차 간소화, 온라인 신청 가능',
    '태국 이민청이 관광비자 연장 절차를 대폭 간소화하고 온라인 신청 시스템을 도입한다고 발표했습니다.',
    '태국 이민청은 외국인 관광객의 편의를 위해 관광비자 연장 절차를 간소화하고 온라인 신청 시스템을 도입한다고 발표했습니다. 

새로운 시스템은 다음 달부터 시행되며, 기존에 이민청 사무소를 직접 방문해야 했던 절차를 온라인으로 처리할 수 있게 됩니다.

주요 변경사항:
- 온라인 신청 시스템 도입
- 필요 서류 간소화 (5개 → 3개)
- 처리 기간 단축 (7일 → 3일)
- 수수료 10% 할인

이번 조치는 코로나19 이후 태국 관광업 회복을 위한 정부 정책의 일환으로, 외국인 관광객들의 체류 편의성을 크게 향상시킬 것으로 예상됩니다.',
    '비자',
    ARRAY['비자연장', '온라인신청', '이민청', '관광비자'],
    '뉴스팀',
    '/placeholder.svg?height=300&width=600&text=비자+연장+온라인+신청',
    'https://example.com/visa-news',
    4,
    true,
    1250
),
(
    '방콕 BTS 신규 노선 개통, 교통 체증 완화 기대',
    '방콕 대중교통공사가 BTS 스카이트레인 신규 노선을 이달 말 개통한다고 발표했습니다.',
    '방콕 대중교통공사(BTSC)는 BTS 스카이트레인의 새로운 노선인 골드라인(Gold Line)을 이달 말 정식 개통한다고 발표했습니다.

골드라인 주요 정보:
- 총 길이: 1.77km
- 정거장: 3개 (크룽톤부리, 차른13, 콘드 카디)
- 운행시간: 오전 6시 - 자정
- 배차간격: 평일 4-6분, 주말 6-8분

새 노선은 기존 사파안탁신역과 연결되어 차오프라야강 서쪽 지역의 접근성을 크게 향상시킬 예정입니다. 특히 아이콘시암, 리버시티 등 주요 쇼핑몰과 관광지로의 이동이 편리해집니다.

교통당국은 이번 개통으로 해당 지역의 교통 체증이 30% 이상 완화될 것으로 예상한다고 밝혔습니다.',
    '교통',
    ARRAY['BTS', '골드라인', '대중교통', '방콕'],
    '교통부 기자',
    '/placeholder.svg?height=300&width=600&text=BTS+골드라인+개통',
    'https://example.com/bts-news',
    3,
    false,
    890
),
(
    '태국 중앙은행, 기준금리 동결 결정',
    '태국 중앙은행이 경제 불확실성을 고려해 기준금리를 현 수준에서 동결하기로 결정했습니다.',
    '태국 중앙은행(BOT)은 통화정책위원회 회의에서 기준금리를 현행 2.50%에서 동결하기로 만장일치로 결정했다고 발표했습니다.

동결 결정 배경:
- 글로벌 경제 불확실성 지속
- 국내 소비 회복세 둔화
- 인플레이션 안정세 유지
- 부동산 시장 조정 필요

중앙은행 총재는 "현재 금리 수준이 경제 성장과 물가 안정을 동시에 지원하는 적정 수준"이라며 "당분간 통화정책의 완화적 기조를 유지할 것"이라고 밝혔습니다.

전문가들은 올해 말까지 추가 금리 인하 가능성은 낮다고 전망하고 있으며, 내년 상반기 경제 상황에 따라 정책 방향이 결정될 것으로 보입니다.',
    '경제',
    ARRAY['중앙은행', '기준금리', '통화정책', '경제'],
    '경제부 기자',
    '/placeholder.svg?height=300&width=600&text=태국+중앙은행',
    'https://example.com/economy-news',
    5,
    false,
    654
),
(
    '태국 전통 축제 로이크라통, 올해 3년 만에 정상 개최',
    '코로나19로 축소 개최되었던 로이크라통 축제가 올해 3년 만에 정상 규모로 개최됩니다.',
    '태국의 대표적인 전통 축제인 로이크라통(Loy Krathong)이 올해 11월 27일 3년 만에 정상 규모로 개최됩니다.

축제 주요 행사:
- 크라통 띄우기 의식
- 전통 무용 공연
- 불꽃놀이 쇼
- 전통 음식 축제
- 문화 체험 프로그램

특히 올해는 방콕 차오프라야강변, 치앙마이 핑강, 수코타이 역사공원 등 전국 주요 관광지에서 대규모 축제가 동시에 열립니다.

관광청은 "로이크라통 축제를 통해 태국의 아름다운 전통문화를 세계에 알리고, 관광업 회복에도 크게 기여할 것"이라고 기대감을 표했습니다.

외국인 관광객들을 위한 특별 프로그램도 준비되어 있어, 태국 문화를 직접 체험할 수 있는 좋은 기회가 될 것으로 예상됩니다.',
    '문화',
    ARRAY['로이크라통', '전통축제', '관광', '문화'],
    '문화부 기자',
    '/placeholder.svg?height=300&width=600&text=로이크라통+축제',
    'https://example.com/culture-news',
    4,
    false,
    1100
),
(
    '방콕 한인타운 신규 한식당 3곳 동시 오픈',
    '방콕 프롬퐁 지역에 정통 한식을 선보이는 한식당 3곳이 동시에 문을 열어 화제가 되고 있습니다.',
    '방콕 프롬퐁 한인타운에 정통 한식을 선보이는 한식당 3곳이 이번 주 동시에 오픈하여 현지 교민들과 태국인들의 큰 관심을 받고 있습니다.

새로 오픈한 한식당:

1. 서울집 (Seoul House)
- 위치: 프롬퐁 소이 39
- 특징: 전통 한정식과 불고기 전문
- 운영시간: 11:00-22:00

2. 부산횟집 (Busan Sashimi)
- 위치: 프롬퐁 소이 33/1
- 특징: 신선한 회와 해산물 요리
- 운영시간: 17:00-24:00

3. 엄마손맛 (Mom\'s Touch)
- 위치: 프롬퐁 소이 24
- 특징: 가정식 한식과 반찬 전문
- 운영시간: 10:00-21:00

세 식당 모두 한국에서 직접 공수한 신선한 재료를 사용하며, 현지 태국인 직원들에게 한식 조리법을 교육하여 정통 맛을 구현하고 있습니다.

한인회 관계자는 "양질의 한식당이 늘어나면서 한국 문화 전파와 교민들의 식생활 개선에 큰 도움이 될 것"이라고 환영했습니다.',
    '업체',
    ARRAY['한식당', '프롬퐁', '교민업체', '한인타운'],
    '교민뉴스팀',
    '/placeholder.svg?height=300&width=600&text=한식당+오픈',
    'https://example.com/restaurant-news',
    3,
    false,
    780
),
(
    '태국 정부, 외국인 부동산 투자 규제 완화 검토',
    '태국 정부가 경제 활성화를 위해 외국인의 부동산 투자 규제를 완화하는 방안을 검토 중입니다.',
    '태국 정부가 경기 부양과 외국인 투자 유치를 위해 부동산 투자 관련 규제 완화를 적극 검토하고 있다고 재무부 관계자가 밝혔습니다.

검토 중인 주요 완화 방안:

1. 콘도미니엄 외국인 소유 비율 확대
- 현행: 49% → 검토안: 60%
- 적용 대상: 신규 개발 프로젝트

2. 토지 임대 기간 연장
- 현행: 30년 + 30년 연장 → 검토안: 50년 + 50년 연장
- 상업용 부동산에 우선 적용

3. 투자 최소 금액 하향 조정
- 현행: 1,000만 바트 → 검토안: 500만 바트
- 영주권 신청 자격 요건 완화

4. 세제 혜택 확대
- 부동산 취득세 50% 감면
- 임대소득세 우대 세율 적용

부동산업계는 이번 규제 완화가 실현될 경우 외국인 투자가 크게 늘어날 것으로 기대하고 있습니다. 특히 한국, 중국, 일본 등 아시아 투자자들의 관심이 높아질 것으로 예상됩니다.

다만 일부에서는 부동산 가격 급등과 현지인 주거 문제를 우려하는 목소리도 나오고 있어, 정부의 신중한 접근이 필요할 것으로 보입니다.',
    '현지',
    ARRAY['부동산', '외국인투자', '규제완화', '정부정책'],
    '부동산 전문기자',
    '/placeholder.svg?height=300&width=600&text=부동산+투자+규제완화',
    'https://example.com/property-news',
    6,
    false,
    920
);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE news_articles 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get published news articles
CREATE OR REPLACE FUNCTION get_published_news_articles(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    category VARCHAR(50),
    tags TEXT[],
    author VARCHAR(100),
    published_at TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    source_url TEXT,
    read_time INTEGER,
    is_breaking BOOLEAN,
    view_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.excerpt,
        n.content,
        n.category,
        n.tags,
        n.author,
        n.published_at,
        n.image_url,
        n.source_url,
        n.read_time,
        n.is_breaking,
        n.view_count
    FROM news_articles n
    WHERE n.is_published = true
    ORDER BY n.is_breaking DESC, n.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
