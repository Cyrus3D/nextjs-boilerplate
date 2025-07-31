-- 뉴스 기사 페이지네이션 조회 함수
CREATE OR REPLACE FUNCTION get_news_articles_paginated(
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20,
    category_filter VARCHAR DEFAULT NULL,
    search_term VARCHAR DEFAULT NULL,
    include_inactive BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    summary TEXT,
    content TEXT,
    category_name VARCHAR,
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR,
    author VARCHAR,
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN,
    tags VARCHAR[],
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
            COALESCE(nc.name, '기타') as category_name,
            na.published_at,
            COALESCE(na.source, '알 수 없음') as source,
            na.author,
            na.image_url,
            na.external_url,
            COALESCE(na.view_count, 0) as view_count,
            COALESCE(na.is_breaking, false) as is_breaking,
            COALESCE(na.is_pinned, false) as is_pinned,
            COALESCE(
                array_agg(nt.name ORDER BY nt.name) FILTER (WHERE nt.name IS NOT NULL),
                ARRAY[]::VARCHAR[]
            ) as tags
        FROM news_articles na
        LEFT JOIN news_categories nc ON na.category_id = nc.id
        LEFT JOIN news_article_tags nat ON na.id = nat.article_id
        LEFT JOIN news_tags nt ON nat.tag_id = nt.id AND nt.is_active = true
        WHERE 
            (include_inactive OR na.is_active = true)
            AND (category_filter IS NULL OR nc.name = category_filter)
            AND (search_term IS NULL OR 
                 na.title ILIKE '%' || search_term || '%' OR 
                 na.summary ILIKE '%' || search_term || '%' OR
                 na.content ILIKE '%' || search_term || '%')
        GROUP BY na.id, nc.name
        ORDER BY 
            na.is_pinned DESC,
            na.is_breaking DESC,
            na.published_at DESC
        LIMIT page_size
        OFFSET offset_val
    ),
    total_count_query AS (
        SELECT COUNT(*) as total
        FROM news_articles na
        LEFT JOIN news_categories nc ON na.category_id = nc.id
        WHERE 
            (include_inactive OR na.is_active = true)
            AND (category_filter IS NULL OR nc.name = category_filter)
            AND (search_term IS NULL OR 
                 na.title ILIKE '%' || search_term || '%' OR 
                 na.summary ILIKE '%' || search_term || '%' OR
                 na.content ILIKE '%' || search_term || '%')
    )
    SELECT 
        fa.*,
        tc.total
    FROM filtered_articles fa
    CROSS JOIN total_count_query tc;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 카테고리 조회 함수
CREATE OR REPLACE FUNCTION get_news_categories()
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    color_class VARCHAR,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nc.id,
        nc.name,
        COALESCE(nc.color_class, 'bg-gray-100 text-gray-800') as color_class,
        nc.description
    FROM news_categories nc
    WHERE nc.is_active = true
    ORDER BY nc.name;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE news_articles 
    SET 
        view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE 
        id = article_id 
        AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- 인기 뉴스 조회 함수
CREATE OR REPLACE FUNCTION get_popular_news(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    summary TEXT,
    category_name VARCHAR,
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR,
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
        COALESCE(nc.name, '기타') as category_name,
        na.published_at,
        COALESCE(na.source, '알 수 없음') as source,
        COALESCE(na.view_count, 0) as view_count,
        COALESCE(na.is_breaking, false) as is_breaking,
        COALESCE(na.is_pinned, false) as is_pinned
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE na.is_active = true
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
    title VARCHAR,
    summary TEXT,
    category_name VARCHAR,
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR,
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
        COALESCE(nc.name, '기타') as category_name,
        na.published_at,
        COALESCE(na.source, '알 수 없음') as source,
        COALESCE(na.view_count, 0) as view_count,
        COALESCE(na.is_breaking, false) as is_breaking,
        COALESCE(na.is_pinned, false) as is_pinned
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE na.is_active = true
    ORDER BY na.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 기사 상세 조회 함수
CREATE OR REPLACE FUNCTION get_news_article_by_id(article_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    summary TEXT,
    content TEXT,
    category_name VARCHAR,
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR,
    author VARCHAR,
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN,
    tags VARCHAR[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.id,
        na.title,
        na.summary,
        na.content,
        COALESCE(nc.name, '기타') as category_name,
        na.published_at,
        COALESCE(na.source, '알 수 없음') as source,
        na.author,
        na.image_url,
        na.external_url,
        COALESCE(na.view_count, 0) as view_count,
        COALESCE(na.is_breaking, false) as is_breaking,
        COALESCE(na.is_pinned, false) as is_pinned,
        COALESCE(
            array_agg(nt.name ORDER BY nt.name) FILTER (WHERE nt.name IS NOT NULL),
            ARRAY[]::VARCHAR[]
        ) as tags
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    LEFT JOIN news_article_tags nat ON na.id = nat.article_id
    LEFT JOIN news_tags nt ON nat.tag_id = nt.id AND nt.is_active = true
    WHERE 
        na.id = article_id 
        AND na.is_active = true
    GROUP BY na.id, nc.name;
END;
$$ LANGUAGE plpgsql;

-- 관련 뉴스 조회 함수
CREATE OR REPLACE FUNCTION get_related_news(
    article_id INTEGER,
    limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    summary TEXT,
    category_name VARCHAR,
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR,
    view_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH article_info AS (
        SELECT na.category_id, na.published_at
        FROM news_articles na
        WHERE na.id = article_id AND na.is_active = true
    )
    SELECT 
        na.id,
        na.title,
        na.summary,
        COALESCE(nc.name, '기타') as category_name,
        na.published_at,
        COALESCE(na.source, '알 수 없음') as source,
        COALESCE(na.view_count, 0) as view_count
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    CROSS JOIN article_info ai
    WHERE 
        na.id != article_id
        AND na.is_active = true
        AND (
            na.category_id = ai.category_id OR
            na.published_at BETWEEN ai.published_at - INTERVAL '7 days' AND ai.published_at + INTERVAL '7 days'
        )
    ORDER BY 
        CASE WHEN na.category_id = ai.category_id THEN 1 ELSE 2 END,
        ABS(EXTRACT(EPOCH FROM (na.published_at - ai.published_at))),
        na.view_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 검색 함수 (전문 검색)
CREATE OR REPLACE FUNCTION search_news_articles(
    search_query VARCHAR,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 20
)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    summary TEXT,
    category_name VARCHAR,
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR,
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN,
    rank REAL,
    total_count BIGINT
) AS $$
DECLARE
    offset_val INTEGER;
BEGIN
    offset_val := (page_num - 1) * page_size;
    
    RETURN QUERY
    WITH search_results AS (
        SELECT 
            na.id,
            na.title,
            na.summary,
            COALESCE(nc.name, '기타') as category_name,
            na.published_at,
            COALESCE(na.source, '알 수 없음') as source,
            COALESCE(na.view_count, 0) as view_count,
            COALESCE(na.is_breaking, false) as is_breaking,
            COALESCE(na.is_pinned, false) as is_pinned,
            ts_rank(
                to_tsvector('korean', COALESCE(na.title, '') || ' ' || COALESCE(na.summary, '') || ' ' || COALESCE(na.content, '')),
                plainto_tsquery('korean', search_query)
            ) as rank
        FROM news_articles na
        LEFT JOIN news_categories nc ON na.category_id = nc.id
        WHERE 
            na.is_active = true
            AND (
                to_tsvector('korean', COALESCE(na.title, '') || ' ' || COALESCE(na.summary, '') || ' ' || COALESCE(na.content, ''))
                @@ plainto_tsquery('korean', search_query)
                OR na.title ILIKE '%' || search_query || '%'
                OR na.summary ILIKE '%' || search_query || '%'
            )
        ORDER BY 
            na.is_pinned DESC,
            na.is_breaking DESC,
            rank DESC,
            na.published_at DESC
        LIMIT page_size
        OFFSET offset_val
    ),
    total_count_query AS (
        SELECT COUNT(*) as total
        FROM news_articles na
        WHERE 
            na.is_active = true
            AND (
                to_tsvector('korean', COALESCE(na.title, '') || ' ' || COALESCE(na.summary, '') || ' ' || COALESCE(na.content, ''))
                @@ plainto_tsquery('korean', search_query)
                OR na.title ILIKE '%' || search_query || '%'
                OR na.summary ILIKE '%' || search_query || '%'
            )
    )
    SELECT 
        sr.*,
        tc.total
    FROM search_results sr
    CROSS JOIN total_count_query tc;
END;
$$ LANGUAGE plpgsql;

-- 뉴스 통계 조회 함수
CREATE OR REPLACE FUNCTION get_news_statistics()
RETURNS TABLE (
    total_articles BIGINT,
    total_categories BIGINT,
    total_tags BIGINT,
    total_views BIGINT,
    breaking_news_count BIGINT,
    pinned_news_count BIGINT,
    today_articles BIGINT,
    this_week_articles BIGINT,
    this_month_articles BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM news_articles WHERE is_active = true) as total_articles,
        (SELECT COUNT(*) FROM news_categories WHERE is_active = true) as total_categories,
        (SELECT COUNT(*) FROM news_tags WHERE is_active = true) as total_tags,
        (SELECT COALESCE(SUM(view_count), 0) FROM news_articles WHERE is_active = true) as total_views,
        (SELECT COUNT(*) FROM news_articles WHERE is_active = true AND is_breaking = true) as breaking_news_count,
        (SELECT COUNT(*) FROM news_articles WHERE is_active = true AND is_pinned = true) as pinned_news_count,
        (SELECT COUNT(*) FROM news_articles WHERE is_active = true AND DATE(published_at) = CURRENT_DATE) as today_articles,
        (SELECT COUNT(*) FROM news_articles WHERE is_active = true AND published_at >= CURRENT_DATE - INTERVAL '7 days') as this_week_articles,
        (SELECT COUNT(*) FROM news_articles WHERE is_active = true AND published_at >= CURRENT_DATE - INTERVAL '30 days') as this_month_articles;
END;
$$ LANGUAGE plpgsql;

-- 함수들에 대한 권한 설정
GRANT EXECUTE ON FUNCTION get_news_articles_paginated TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_news_categories TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_news_view_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_popular_news TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_latest_news TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_news_article_by_id TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_related_news TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_news_articles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_news_statistics TO anon, authenticated;

-- 함수들에 대한 코멘트 추가
COMMENT ON FUNCTION get_news_articles_paginated IS '뉴스 기사 페이지네이션 조회 함수';
COMMENT ON FUNCTION get_news_categories IS '뉴스 카테고리 조회 함수';
COMMENT ON FUNCTION increment_news_view_count IS '뉴스 조회수 증가 함수';
COMMENT ON FUNCTION get_popular_news IS '인기 뉴스 조회 함수';
COMMENT ON FUNCTION get_latest_news IS '최신 뉴스 조회 함수';
COMMENT ON FUNCTION get_news_article_by_id IS '뉴스 기사 상세 조회 함수';
COMMENT ON FUNCTION get_related_news IS '관련 뉴스 조회 함수';
COMMENT ON FUNCTION search_news_articles IS '뉴스 전문 검색 함수';
COMMENT ON FUNCTION get_news_statistics IS '뉴스 통계 조회 함수';
