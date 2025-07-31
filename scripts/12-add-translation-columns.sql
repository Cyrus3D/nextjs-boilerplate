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

-- 컬럼 코멘트 추가
COMMENT ON COLUMN news.original_language IS '원본 언어 코드 (ko: 한국어, en: 영어, th: 태국어)';
COMMENT ON COLUMN news.is_translated IS '번역된 뉴스 여부 (true: 번역됨, false: 원본)';
