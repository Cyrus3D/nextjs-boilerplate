-- Fix news_articles table schema
-- Remove status column references and simplify structure

-- First, let's check what columns actually exist
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'news_articles' AND column_name = 'tags') THEN
        ALTER TABLE news_articles ADD COLUMN tags TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'news_articles' AND column_name = 'read_time') THEN
        ALTER TABLE news_articles ADD COLUMN read_time INTEGER DEFAULT 5;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'news_articles' AND column_name = 'is_breaking') THEN
        ALTER TABLE news_articles ADD COLUMN is_breaking BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'news_articles' AND column_name = 'view_count') THEN
        ALTER TABLE news_articles ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Insert sample news data
INSERT INTO news_articles (
    title, 
    excerpt, 
    content, 
    author, 
    category, 
    tags, 
    published_at, 
    image_url, 
    source_url,
    is_published,
    read_time,
    is_breaking,
    view_count
) VALUES 
(
    '태국 정부, 관광비자 연장 정책 발표',
    '태국 정부가 한국인 관광객을 위한 비자 연장 정책을 발표했습니다. 최대 60일까지 연장 가능합니다.',
    '태국 정부는 오늘 한국인 관광객을 대상으로 한 새로운 비자 연장 정책을 발표했습니다. 이번 정책에 따르면 기존 30일 관광비자를 최대 60일까지 연장할 수 있게 됩니다. 태국 관광청은 이 정책이 한국 관광객 유치에 큰 도움이 될 것으로 기대한다고 밝혔습니다.',
    '핫타이 편집부',
    '비자',
    ARRAY['비자', '관광', '정책', '한국인'],
    NOW() - INTERVAL '2 hours',
    '/placeholder.svg?height=200&width=400&text=비자+정책',
    'https://example.com/visa-news',
    true,
    3,
    true,
    45
),
(
    '방콕 BTS 신규 노선 개통 예정',
    '방콕 대중교통 시스템 BTS의 새로운 노선이 내년 상반기 개통될 예정입니다.',
    '방콕 대중교통공사(BTSC)는 BTS 스카이트레인의 새로운 노선이 2025년 상반기에 개통될 예정이라고 발표했습니다. 새 노선은 기존 수쿰빗 라인을 연장하여 더 많은 지역을 연결할 예정입니다. 이로 인해 교민들의 교통 편의성이 크게 향상될 것으로 예상됩니다.',
    '교통부 기자',
    '교통',
    ARRAY['BTS', '교통', '방콕', '대중교통'],
    NOW() - INTERVAL '5 hours',
    '/placeholder.svg?height=200&width=400&text=BTS+노선',
    'https://example.com/bts-news',
    true,
    4,
    false,
    32
),
(
    '태국 경제성장률 3.2% 기록',
    '태국의 올해 3분기 경제성장률이 3.2%를 기록하며 예상치를 상회했습니다.',
    '태국 국가경제사회개발위원회(NESDC)는 올해 3분기 경제성장률이 전년 동기 대비 3.2%를 기록했다고 발표했습니다. 이는 시장 예상치인 2.8%를 크게 상회하는 수치입니다. 관광업 회복과 수출 증가가 주요 성장 동력으로 작용했습니다.',
    '경제부 기자',
    '경제',
    ARRAY['경제', '성장률', '관광', '수출'],
    NOW() - INTERVAL '1 day',
    '/placeholder.svg?height=200&width=400&text=경제+성장',
    'https://example.com/economy-news',
    true,
    5,
    false,
    28
),
(
    '치앙마이 한국문화축제 성황리 개최',
    '치앙마이에서 열린 한국문화축제에 수천 명의 현지인과 관광객이 참여했습니다.',
    '치앙마이에서 개최된 제5회 한국문화축제가 성황리에 마무리되었습니다. 이번 축제에는 K-pop 공연, 한국 음식 체험, 전통문화 전시 등 다양한 프로그램이 진행되었습니다. 특히 한국 음식 부스에는 긴 줄이 이어져 한류의 인기를 실감할 수 있었습니다.',
    '문화부 기자',
    '문화',
    ARRAY['한국문화', '축제', '치앙마이', 'K-pop'],
    NOW() - INTERVAL '2 days',
    '/placeholder.svg?height=200&width=400&text=문화축제',
    'https://example.com/culture-news',
    true,
    6,
    false,
    67
),
(
    '파타야 신규 한국식당 오픈 러시',
    '파타야 지역에 한국식당들이 연이어 오픈하며 교민들의 선택의 폭이 넓어지고 있습니다.',
    '파타야 지역에 최근 한 달 사이 5개의 새로운 한국식당이 오픈했습니다. 삼겹살 전문점부터 치킨집, 분식점까지 다양한 업종의 식당들이 문을 열어 현지 교민들과 한국 관광객들에게 큰 호응을 얻고 있습니다. 업계에서는 한류 붐과 함께 한국 음식에 대한 수요가 지속적으로 증가하고 있다고 분석했습니다.',
    '파타야 특파원',
    '업체',
    ARRAY['한국식당', '파타야', '교민', '음식'],
    NOW() - INTERVAL '3 days',
    '/placeholder.svg?height=200&width=400&text=한국식당',
    'https://example.com/restaurant-news',
    true,
    4,
    false,
    89
),
(
    '태국 우기 시즌 대비 안전 수칙',
    '태국의 우기 시즌을 맞아 교민들이 알아야 할 안전 수칙들을 정리했습니다.',
    '태국의 우기 시즌이 본격적으로 시작되면서 교민들의 각별한 주의가 필요합니다. 갑작스러운 폭우로 인한 침수, 교통 체증, 정전 등에 대비해야 합니다. 특히 저지대 거주자들은 비상용품을 미리 준비하고, 침수 위험 지역은 피하는 것이 좋습니다. 또한 우기철 모기 매개 질병 예방을 위해 방충제 사용을 권장합니다.',
    '안전부 기자',
    '현지',
    ARRAY['우기', '안전', '침수', '교민'],
    NOW() - INTERVAL '4 days',
    '/placeholder.svg?height=200&width=400&text=우기+안전',
    'https://example.com/safety-news',
    true,
    7,
    false,
    156
);

-- Create or replace the increment function for news
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE news_articles 
    SET view_count = COALESCE(view_count, 0) + 1 
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;
