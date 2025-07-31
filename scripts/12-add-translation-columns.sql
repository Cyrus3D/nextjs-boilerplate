-- 뉴스 테이블에 번역 관련 컬럼 추가
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS original_language VARCHAR(10) DEFAULT 'ko',
ADD COLUMN IF NOT EXISTS is_translated BOOLEAN DEFAULT false;

-- 기존 데이터에 대한 기본값 설정
UPDATE news 
SET original_language = 'ko', is_translated = false 
WHERE original_language IS NULL OR is_translated IS NULL;

-- 인덱스 추가 (성능 향상을 위해)
CREATE INDEX IF NOT EXISTS idx_news_original_language ON news(original_language);
CREATE INDEX IF NOT EXISTS idx_news_is_translated ON news(is_translated);

-- 뉴스 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'news' 
ORDER BY ordinal_position;
