-- 뉴스 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE news_articles 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = article_id AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 뉴스 검색 함수 (페이지네이션 포함)
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
    category_id INTEGER,
    category_name VARCHAR(50),
    category_color_class VARCHAR(100),
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(200),
    author VARCHAR(200),
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN,
    is_active BOOLEAN,
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
            na.category_id,
            COALESCE(nc.name, '기타') as category_name,
            COALESCE(nc.color_class, 'bg-gray-100 text-gray-800') as category_color_class,
            na.published_at,
            na.source,
            na.author,
            na.image_url,
            na.external_url,
            na.view_count,
            na.is_breaking,
            na.is_pinned,
            na.is_active,
            COALESCE(
                ARRAY_AGG(DISTINCT nt.name ORDER BY nt.name) FILTER (WHERE nt.name IS NOT NULL), 
                ARRAY[]::TEXT[]
            ) as tags
        FROM news_articles na
        LEFT JOIN news_categories nc ON na.category_id = nc.id
        LEFT JOIN news_article_tags nat ON na.id = nat.article_id
        LEFT JOIN news_tags nt ON nat.tag_id = nt.id
        WHERE 
            (include_inactive OR na.is_active = true)
            AND (category_filter IS NULL OR nc.name = category_filter)
            AND (
                search_term IS NULL 
                OR na.title ILIKE '%' || search_term || '%'
                OR na.summary ILIKE '%' || search_term || '%'
                OR na.content ILIKE '%' || search_term || '%'
                OR EXISTS (
                    SELECT 1 FROM news_article_tags nat2
                    JOIN news_tags nt2 ON nat2.tag_id = nt2.id
                    WHERE nat2.article_id = na.id 
                    AND nt2.name ILIKE '%' || search_term || '%'
                )
            )
        GROUP BY na.id, nc.name, nc.color_class
    ),
    total_count_cte AS (
        SELECT COUNT(*) as total_count FROM filtered_articles
    )
    SELECT 
        fa.*,
        tc.total_count
    FROM filtered_articles fa
    CROSS JOIN total_count_cte tc
    ORDER BY 
        fa.is_pinned DESC,
        fa.is_breaking DESC,
        fa.published_at DESC
    LIMIT page_size
    OFFSET offset_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 뉴스 카테고리 조회 함수
CREATE OR REPLACE FUNCTION get_news_categories()
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(50),
    color_class VARCHAR(100),
    article_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nc.id,
        nc.name,
        nc.color_class,
        COUNT(na.id) as article_count
    FROM news_categories nc
    LEFT JOIN news_articles na ON nc.id = na.category_id AND na.is_active = true
    GROUP BY nc.id, nc.name, nc.color_class
    ORDER BY nc.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 인기 뉴스 조회 함수
CREATE OR REPLACE FUNCTION get_popular_news(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    category_name VARCHAR(50),
    category_color_class VARCHAR(100),
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
        COALESCE(nc.color_class, 'bg-gray-100 text-gray-800') as category_color_class,
        na.published_at,
        na.source,
        na.view_count,
        na.is_breaking,
        na.is_pinned
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE na.is_active = true
    ORDER BY na.view_count DESC, na.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 최신 뉴스 조회 함수
CREATE OR REPLACE FUNCTION get_latest_news(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    category_name VARCHAR(50),
    category_color_class VARCHAR(100),
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
        COALESCE(nc.color_class, 'bg-gray-100 text-gray-800') as category_color_class,
        na.published_at,
        na.source,
        na.view_count,
        na.is_breaking,
        na.is_pinned
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    WHERE na.is_active = true
    ORDER BY 
        na.is_pinned DESC,
        na.is_breaking DESC,
        na.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 뉴스 상세 조회 함수
CREATE OR REPLACE FUNCTION get_news_article_by_id(article_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(500),
    summary TEXT,
    content TEXT,
    category_id INTEGER,
    category_name VARCHAR(50),
    category_color_class VARCHAR(100),
    published_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(200),
    author VARCHAR(200),
    image_url TEXT,
    external_url TEXT,
    view_count INTEGER,
    is_breaking BOOLEAN,
    is_pinned BOOLEAN,
    is_active BOOLEAN,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        na.id,
        na.title,
        na.summary,
        na.content,
        na.category_id,
        COALESCE(nc.name, '기타') as category_name,
        COALESCE(nc.color_class, 'bg-gray-100 text-gray-800') as category_color_class,
        na.published_at,
        na.source,
        na.author,
        na.image_url,
        na.external_url,
        na.view_count,
        na.is_breaking,
        na.is_pinned,
        na.is_active,
        COALESCE(
            ARRAY_AGG(DISTINCT nt.name ORDER BY nt.name) FILTER (WHERE nt.name IS NOT NULL), 
            ARRAY[]::TEXT[]
        ) as tags
    FROM news_articles na
    LEFT JOIN news_categories nc ON na.category_id = nc.id
    LEFT JOIN news_article_tags nat ON na.id = nat.article_id
    LEFT JOIN news_tags nt ON nat.tag_id = nt.id
    WHERE na.id = article_id AND na.is_active = true
    GROUP BY na.id, nc.name, nc.color_class;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
