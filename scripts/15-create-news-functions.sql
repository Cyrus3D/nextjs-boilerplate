-- 뉴스 기사 페이지네이션 조회 함수
CREATE OR REPLACE FUNCTION get_news_articles_paginated(
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20,
    category_filter TEXT DEFAULT NULL,
    search_term TEXT DEFAULT NULL,
    include_inactive BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    content TEXT,
    category_name VARCHAR(50),
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100),
    author VARCHAR(100),
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN,
    tags TEXT[],
    total_count BIGINT
) AS $$
DECLARE
    offset_val INTEGER;
BEGIN
    offset_val := (page_num - 1) * page_size;
    
    RETURN QUERY
    WITH filtered_articles AS (
        SELECT 
            na.id,
            na.title,
            na.summary,
            na.content,
            nc.name as category_name,
            na.published_at,
            na.source,
            na.author,
            na.image_url,
            na.external_url,
            na.view_count,
            na.is_breaking,
            na.is_pinned,
            ARRAY_AGG(DISTINCT nt.name) FILTER (WHERE nt.name IS NOT NULL) as tags
        FROM news_articles na
        LEFT JOIN news_categories nc ON na.category_id = nc.id
        LEFT JOIN news_article_tags nat ON na.id = nat.article_id
        LEFT JOIN news_tags nt ON nat.tag_id = nt.id
        WHERE 
            (include_inactive OR na.is_active = TRUE)
            AND (category_filter IS NULL OR nc.name = category_filter)
            AND (search_term IS NULL OR 
                 na.title ILIKE '%' || search_term || '%' OR 
                 na.summary ILIKE '%' || search_term || '%' OR
                 na.content ILIKE '%' || search_term || '%')
        GROUP BY na.id, nc.name
    ),
    total_count_cte AS (
        SELECT COUNT(*) as total FROM filtered_articles
    )
    SELECT 
        fa.*,
        tc.total
    FROM filtered_articles fa
    CROSS JOIN total_count_cte tc
    ORDER BY 
        fa.is_pinned DESC,
        fa.is_breaking DESC,
        fa.published_at DESC
    LIMIT page_size
    OFFSET offset_val;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 카테고리 조회 함수
CREATE OR REPLACE FUNCTION get_news_categories()
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(50),
    color_class VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nc.id,
        nc.name,
        nc.color_class
    FROM news_categories nc
    ORDER BY nc.name;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE news_articles 
    SET 
        view_count = view_count + 1,
        updated_at = NOW()
    WHERE 
        id = article_id 
        AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- 인기 뉴스 조회 함수
CREATE OR REPLACE FUNCTION get_popular_news(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    category_name VARCHAR(50),
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100),
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.id,
        na.title,
        na.summary,
        nc.name as category_name,
        na.published_at,
        na.source,
        na.view_count,
        na.is_breaking,
        na.is_pinned
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE na.is_active = TRUE
    ORDER BY 
        na.view_count DESC,
        na.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 최신 뉴스 조회 함수
CREATE OR REPLACE FUNCTION get_latest_news(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    category_name VARCHAR(50),
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100),
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.id,
        na.title,
        na.summary,
        nc.name as category_name,
        na.published_at,
        na.source,
        na.view_count,
        na.is_breaking,
        na.is_pinned
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE na.is_active = TRUE
    ORDER BY 
        na.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 상세 조회 함수
CREATE OR REPLACE FUNCTION get_news_article_by_id(article_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    content TEXT,
    category_name VARCHAR(50),
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100),
    author VARCHAR(100),
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.id,
        na.title,
        na.summary,
        na.content,
        nc.name as category_name,
        na.published_at,
        na.source,
        na.author,
        na.image_url,
        na.external_url,
        na.view_count,
        na.is_breaking,
        na.is_pinned,
        ARRAY_AGG(DISTINCT nt.name) FILTER (WHERE nt.name IS NOT NULL) as tags
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    LEFT JOIN news_article_tags nat ON na.id = nat.article_id
    LEFT JOIN news_tags nt ON nat.tag_id = nt.id
    WHERE 
        na.id = article_id 
        AND na.is_active = TRUE
    GROUP BY na.id, nc.name;
END;
$$ LANGUAGE plpgsql;

-- 속보 뉴스 조회 함수
CREATE OR REPLACE FUNCTION get_breaking_news(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    category_name VARCHAR(50),
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100),
    view_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.id,
        na.title,
        na.summary,
        nc.name as category_name,
        na.published_at,
        na.source,
        na.view_count
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE 
        na.is_active = TRUE 
        AND na.is_breaking = TRUE
    ORDER BY 
        na.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 고정 뉴스 조회 함수
CREATE OR REPLACE FUNCTION get_pinned_news()
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    category_name VARCHAR(50),
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100),
    view_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.id,
        na.title,
        na.summary,
        nc.name as category_name,
        na.published_at,
        na.source,
        na.view_count
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE 
        na.is_active = TRUE 
        AND na.is_pinned = TRUE
    ORDER BY 
        na.published_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 함수 권한 설정
GRANT EXECUTE ON FUNCTION get_news_articles_paginated TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_news_categories TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_news_view_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_news TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_latest_news TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_news_article_by_id TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_breaking_news TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_pinned_news TO anon, authenticated;

-- 함수 생성 확인
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%news%'
ORDER BY routine_name;
