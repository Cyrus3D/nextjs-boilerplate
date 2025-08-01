-- Drop existing news tables if they exist
DROP TABLE IF EXISTS news_articles CASCADE;

-- Create news_articles table
CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL DEFAULT 'HOT THAI',
    category VARCHAR(100) NOT NULL DEFAULT '현지',
    tags TEXT[] DEFAULT '{}',
    imageUrl TEXT,
    sourceUrl TEXT,
    publishedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    isBreaking BOOLEAN DEFAULT FALSE,
    isPublished BOOLEAN DEFAULT TRUE,
    viewCount INTEGER DEFAULT 0,
    readTime INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_news_articles_published ON news_articles(isPublished, publishedAt DESC);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_breaking ON news_articles(isBreaking);
CREATE INDEX idx_news_articles_author ON news_articles(author);

-- Create function to increment news view count
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE news_articles 
    SET viewCount = viewCount + 1,
        updated_at = NOW()
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get published news articles
CREATE OR REPLACE FUNCTION get_published_news_articles(article_limit INTEGER DEFAULT 50)
RETURNS TABLE(
    id INTEGER,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    author VARCHAR(255),
    category VARCHAR(100),
    tags TEXT[],
    imageUrl TEXT,
    sourceUrl TEXT,
    publishedAt TIMESTAMP WITH TIME ZONE,
    isBreaking BOOLEAN,
    isPublished BOOLEAN,
    viewCount INTEGER,
    readTime INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT n.id, n.title, n.excerpt, n.content, n.author, n.category, n.tags,
           n.imageUrl, n.sourceUrl, n.publishedAt, n.isBreaking, n.isPublished,
           n.viewCount, n.readTime, n.created_at, n.updated_at
    FROM news_articles n
    WHERE n.isPublished = TRUE
    ORDER BY n.publishedAt DESC
    LIMIT article_limit;
END;
$$ LANGUAGE plpgsql;

-- Insert sample news data
INSERT INTO news_articles (title, excerpt, content, author, category, tags, imageUrl, isBreaking, readTime) VALUES
(
    '태국 비자 연장 절차 간소화, 온라인 신청 가능',
    '태국 이민청이 관광비자 연장 절차를 대폭 간소화하고 온라인 신청 시스템을 도입한다고 발표했습니다.',
    '태국 이민청은 오늘 관광비자 연장 절차를 간소화하고 온라인 신청 시스템을 도입한다고 공식 발표했습니다.

새로운 시스템은 다음 달부터 시행되며, 기존에 이민청 사무소를 직접 방문해야 했던 절차를 온라인으로 처리할 수 있게 됩니다.

주요 변경사항:
- 온라인 비자 연장 신청 가능
- 필요 서류 50% 감소
- 처리 시간 7일에서 3일로 단축
- 수수료 1,900바트로 동결

이번 조치는 코로나19 이후 태국을 찾는 관광객들의 편의를 위한 것으로, 특히 장기 체류 관광객들에게 큰 도움이 될 것으로 예상됩니다.',
    'HOT THAI',
    '비자',
    ARRAY['비자', '이민청', '온라인신청', '관광비자'],
    '/placeholder.svg?height=300&width=600&text=비자+연장',
    TRUE,
    4
),
(
    '방콕 BTS 신규 노선 개통, 교통 체증 완화 기대',
    '방콕 대중교통공사(BMA)가 BTS 스카이트레인 신규 노선 개통을 발표했습니다. 새로운 노선은 도심과 외곽을 연결합니다.',
    '방콕 대중교통공사(BMA)는 BTS 스카이트레인의 새로운 노선이 다음 주 월요일부터 정식 운행을 시작한다고 발표했습니다.

신규 노선 정보:
- 노선명: 골드 라인 (Gold Line)
- 구간: 크룽톤부리 - 왓 프라깨우
- 역 수: 총 8개 역
- 운행 시간: 오전 6시 - 자정
- 배차 간격: 평일 3-5분, 주말 5-7분

이번 신규 노선 개통으로 방콕 도심의 교통 체증이 크게 완화될 것으로 예상됩니다. 특히 차오프라야 강 서쪽 지역 주민들의 교통 편의성이 대폭 향상될 전망입니다.

요금은 기존 BTS와 동일하며, 래빗 카드로 환승 할인도 받을 수 있습니다.',
    'HOT THAI',
    '교통',
    ARRAY['BTS', '스카이트레인', '교통', '방콕'],
    '/placeholder.svg?height=300&width=600&text=BTS+신규노선',
    FALSE,
    3
),
(
    '태국 중앙은행, 기준금리 2.5% 동결 결정',
    '태국 중앙은행이 통화정책위원회를 열고 기준금리를 현행 2.5%로 유지하기로 결정했습니다.',
    '태국 중앙은행(BOT)은 오늘 열린 통화정책위원회에서 기준금리를 현행 2.5%로 유지하기로 만장일치로 결정했다고 발표했습니다.

이번 결정의 주요 배경:
- 인플레이션 안정세 지속
- 경제 성장률 예상치 내 유지
- 글로벌 경제 불확실성 고려
- 부동산 시장 안정화 필요

중앙은행 총재는 "현재 경제 상황을 종합적으로 고려할 때 금리 동결이 적절하다"며 "앞으로도 경제 지표를 면밀히 모니터링하겠다"고 밝혔습니다.

전문가들은 이번 결정이 태국 경제의 안정적 성장을 위한 신중한 선택이라고 평가하고 있습니다.',
    'HOT THAI',
    '경제',
    ARRAY['중앙은행', '금리', '경제', '통화정책'],
    '/placeholder.svg?height=300&width=600&text=중앙은행',
    FALSE,
    3
),
(
    '로이크라통 축제 정상 개최, 안전 수칙 준수 당부',
    '태국 관광청이 올해 로이크라통 축제를 정상적으로 개최한다고 발표하며, 관광객들에게 안전 수칙 준수를 당부했습니다.',
    '태국 관광청(TAT)은 올해 로이크라통 축제를 전국적으로 정상 개최한다고 공식 발표했습니다.

축제 개최 정보:
- 일시: 11월 27일 (음력 12월 보름)
- 주요 장소: 차오프라야 강변, 룸피니 공원, 벤자키티 공원
- 특별 이벤트: 전통 공연, 크라통 만들기 체험
- 운영 시간: 오후 6시 - 자정

관광청은 축제 참가자들에게 다음 안전 수칙을 준수해 달라고 당부했습니다:
- 친환경 크라통 사용 권장
- 지정된 장소에서만 크라통 띄우기
- 개인 위생 수칙 준수
- 응급상황 대비 연락처 숙지

올해는 특히 외국인 관광객들을 위한 영어 안내 서비스도 확대 운영할 예정입니다.',
    'HOT THAI',
    '문화',
    ARRAY['로이크라통', '축제', '문화', '관광'],
    '/placeholder.svg?height=300&width=600&text=로이크라통',
    FALSE,
    4
),
(
    '방콕 한인타운에 신규 한식당 오픈, 정통 한국 맛 선보여',
    '방콕 한인타운에 새로운 한식당이 문을 열어 현지 한국인들과 태국인들의 관심을 끌고 있습니다.',
    '방콕 한인타운 중심가에 위치한 신규 한식당 "서울집"이 지난주 정식 오픈했습니다.

레스토랑 정보:
- 상호명: 서울집 (Seoul House)
- 위치: 수쿰빗 소이 12
- 운영시간: 오전 11시 - 오후 10시
- 특징: 정통 한국 가정식 전문

메뉴 하이라이트:
- 김치찌개, 된장찌개 (각 180바트)
- 불고기 정식 (320바트)
- 비빔밥 (220바트)
- 한국식 치킨 (450바트)

한국에서 15년간 요리 경력을 쌓은 박 셰프가 직접 조리하며, 모든 김치와 장류는 직접 담가 사용합니다.

오픈 기념으로 이달 말까지 모든 메뉴 20% 할인 이벤트를 진행합니다.',
    'HOT THAI',
    '업체',
    ARRAY['한식당', '한인타운', '맛집', '오픈'],
    '/placeholder.svg?height=300&width=600&text=한식당',
    FALSE,
    3
),
(
    '태국 정부, 외국인 부동산 투자 규제 완화 검토',
    '태국 정부가 외국인의 부동산 투자 활성화를 위해 기존 규제를 완화하는 방안을 검토 중이라고 발표했습니다.',
    '태국 정부는 외국인 투자 유치 활성화를 위해 부동산 투자 관련 규제 완화를 검토하고 있다고 공식 발표했습니다.

검토 중인 주요 내용:
- 콘도미니엄 외국인 소유 비율 확대 (현행 49% → 60%)
- 장기 거주 비자 소지자 토지 소유 허용
- 투자 최소 금액 하향 조정
- 상속 관련 규정 완화

부동산부 장관은 "외국인 투자 증가를 통해 태국 경제 활성화를 도모하겠다"며 "투자자 보호 장치도 함께 마련할 것"이라고 밝혔습니다.

업계에서는 이번 규제 완화가 실현될 경우 한국인을 포함한 외국인 투자자들의 태국 부동산 투자가 크게 늘어날 것으로 예상한다고 분석했습니다.

최종 결정은 다음 달 국회에서 논의될 예정입니다.',
    'HOT THAI',
    '현지',
    ARRAY['부동산', '투자', '규제완화', '외국인'],
    '/placeholder.svg?height=300&width=600&text=부동산+투자',
    FALSE,
    5
);

-- Enable RLS (Row Level Security)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can read published news" ON news_articles
    FOR SELECT USING (isPublished = true);

-- Create policy for admin access (you'll need to adjust this based on your auth setup)
CREATE POLICY "Admin can do everything" ON news_articles
    FOR ALL USING (true);
