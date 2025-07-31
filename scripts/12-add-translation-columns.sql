-- Add translation columns to news table
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS original_language VARCHAR(10) DEFAULT 'ko',
ADD COLUMN IF NOT EXISTS is_translated BOOLEAN DEFAULT FALSE;

-- Add index for language filtering
CREATE INDEX IF NOT EXISTS idx_news_language ON news(original_language);
CREATE INDEX IF NOT EXISTS idx_news_translated ON news(is_translated);

-- Update existing records
UPDATE news 
SET original_language = 'ko', is_translated = FALSE 
WHERE original_language IS NULL;
