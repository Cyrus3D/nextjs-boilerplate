-- 뉴스 테이블에 번역 관련 필드 추가
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS original_language VARCHAR(10) DEFAULT 'ko',
ADD COLUMN IF NOT EXISTS translated BOOLEAN DEFAULT FALSE;

-- 기존 데이터에 대한 기본값 설정
UPDATE news_articles 
SET original_language = 'ko', translated = FALSE 
WHERE original_language IS NULL OR translated IS NULL;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_news_articles_original_language ON news_articles(original_language);
CREATE INDEX IF NOT EXISTS idx_news_articles_translated ON news_articles(translated);

COMMENT ON COLUMN news_articles.original_language IS '원본 언어 코드 (ko, en, th 등)';
COMMENT ON COLUMN news_articles.translated IS '번역 여부';
