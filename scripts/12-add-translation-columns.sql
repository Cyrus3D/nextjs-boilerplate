-- Add translation columns to news table
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS original_language VARCHAR(10) DEFAULT 'ko',
ADD COLUMN IF NOT EXISTS is_translated BOOLEAN DEFAULT false;

-- Update existing records
UPDATE news 
SET original_language = 'ko', is_translated = false 
WHERE original_language IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_news_language ON news(original_language);
CREATE INDEX IF NOT EXISTS idx_news_translated ON news(is_translated);
