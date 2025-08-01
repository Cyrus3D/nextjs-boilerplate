-- Create function to increment news view count
CREATE OR REPLACE FUNCTION increment_news_view_count(article_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE news_articles 
    SET view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_news_view_count(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_news_view_count(INTEGER) TO anon;

-- Add index on view_count for better performance
CREATE INDEX IF NOT EXISTS idx_news_articles_view_count ON news_articles(view_count DESC);

-- Add index on published_at for better sorting performance
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);

-- Add index on status for filtering published articles
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);

-- Add composite index for category and status filtering
CREATE INDEX IF NOT EXISTS idx_news_articles_category_status ON news_articles(category, status);
