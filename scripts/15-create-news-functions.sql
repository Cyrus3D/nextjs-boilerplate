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
    source VARCHAR(200),
    author VARCHAR(200),
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
            COALESCE(nc.name, '기타') as category_name,
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
            AND (
                search_term IS NULL 
                OR na.title ILIKE '%' || search_term || '%'
                OR na.summary ILIKE '%' || search_term || '%'
                OR na.content ILIKE '%' || search_term || '%'
            )
        GROUP BY na.id, na.title, na.summary, na.content, nc.name, 
                 na.published_at, na.source, na.author, na.image_url, 
                 na.external_url, na.view_count, na.is_breaking, na.is_pinned
    ),
    total_count_cte AS (
        SELECT COUNT(*) as total FROM filtered_articles
    )
    SELECT 
        fa.id,
        fa.title,
        fa.summary,
        fa.content,
        fa.category_name,
        fa.published_at,
        fa.source,
        fa.author,
        fa.image_url,
        fa.external_url,
        fa.view_count,
        fa.is_breaking,
        fa.is_pinned,
        COALESCE(fa.tags, ARRAY[]::TEXT[]) as tags,
        tc.total as total_count
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
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = article_id AND is_active = TRUE;
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
    source VARCHAR(200),
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
        na.source,
        na.view_count,
        na.is_breaking,
        na.is_pinned
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE na.is_active = TRUE
    ORDER BY na.view_count DESC, na.published_at DESC
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
    source VARCHAR(200),
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
        na.source,
        na.view_count,
        na.is_breaking,
        na.is_pinned
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE na.is_active = TRUE
    ORDER BY na.published_at DESC
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
    source VARCHAR(200),
    author VARCHAR(200),
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
        COALESCE(nc.name, '기타') as category_name,
        na.published_at,
        na.source,
        na.author,
        na.image_url,
        na.external_url,
        na.view_count,
        na.is_breaking,
        na.is_pinned,
        COALESCE(ARRAY_AGG(DISTINCT nt.name) FILTER (WHERE nt.name IS NOT NULL), ARRAY[]::TEXT[]) as tags
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    LEFT JOIN news_article_tags nat ON na.id = nat.article_id
    LEFT JOIN news_tags nt ON nat.tag_id = nt.id
    WHERE na.id = article_id AND na.is_active = TRUE
    GROUP BY na.id, na.title, na.summary, na.content, nc.name, 
             na.published_at, na.source, na.author, na.image_url, 
             na.external_url, na.view_count, na.is_breaking, na.is_pinned;
END;
$$ LANGUAGE plpgsql;
