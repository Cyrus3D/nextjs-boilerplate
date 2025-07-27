-- 현재 데이터베이스 스키마 확인 스크립트
-- 이 스크립트를 실행하여 어떤 컬럼이 존재하는지 확인할 수 있습니다.

-- business_cards 테이블의 컬럼 정보 확인
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'business_cards' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 테이블 존재 여부 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 함수 존재 여부 확인
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN ('increment_exposure', 'reset_exposure_stats', 'check_premium_expiry', 'daily_maintenance');
