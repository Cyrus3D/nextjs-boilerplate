-- 소셜 미디어 필드 추가
ALTER TABLE business_cards 
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS tiktok_url TEXT,
ADD COLUMN IF NOT EXISTS threads_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_business_cards_facebook ON business_cards(facebook_url) WHERE facebook_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_business_cards_instagram ON business_cards(instagram_url) WHERE instagram_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_business_cards_tiktok ON business_cards(tiktok_url) WHERE tiktok_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_business_cards_threads ON business_cards(threads_url) WHERE threads_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_business_cards_youtube ON business_cards(youtube_url) WHERE youtube_url IS NOT NULL;

-- 업데이트 시간 갱신
UPDATE business_cards SET updated_at = NOW() WHERE id > 0;

-- 확인 쿼리
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'business_cards' 
AND column_name IN ('facebook_url', 'instagram_url', 'tiktok_url', 'threads_url', 'youtube_url');
