-- 데이터베이스 설정 확인 쿼리
-- 이 쿼리들을 실행하여 모든 것이 올바르게 설정되었는지 확인하세요

-- 1. 테이블 존재 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. 카테고리 데이터 확인
SELECT id, name, color_class FROM categories ORDER BY id;

-- 3. 태그 데이터 확인 (처음 10개만)
SELECT id, name FROM tags ORDER BY id LIMIT 10;

-- 4. 비즈니스 카드 데이터 확인
SELECT 
    bc.id,
    bc.title,
    c.name as category,
    bc.is_premium,
    bc.is_promoted,
    bc.created_at
FROM business_cards bc
LEFT JOIN categories c ON bc.category_id = c.id
ORDER BY bc.id;

-- 5. 함수 존재 확인
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN ('increment_exposure', 'reset_exposure_stats', 'check_premium_expiry', 'daily_maintenance');

-- 6. 인덱스 확인
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 7. RLS 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
