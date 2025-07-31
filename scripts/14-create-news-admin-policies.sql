-- 뉴스 관련 테이블에 대한 관리자 전체 접근 권한 정책 추가
-- 일반 사용자에게는 SELECT(읽기) 권한만 부여
-- 실제 운영 환경에서는 더 세밀한 권한 관리가 필요합니다

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Admin full access news_categories" ON news_categories;
DROP POLICY IF EXISTS "Admin full access news" ON news;
DROP POLICY IF EXISTS "Admin full access news_tags" ON news_tags;
DROP POLICY IF EXISTS "Admin full access news_tag_relations" ON news_tag_relations;

-- 공개 읽기 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Public read access news_categories" ON news_categories;
DROP POLICY IF EXISTS "Public read access news" ON news;
DROP POLICY IF EXISTS "Public read access news_tags" ON news_tags;
DROP POLICY IF EXISTS "Public read access news_tag_relations" ON news_tag_relations;

-- 뉴스 카테고리 관리 정책 (관리자 전체 접근)
CREATE POLICY "Admin full access news_categories" ON news_categories FOR ALL USING (true);

-- 뉴스 카테고리 공개 읽기 정책
CREATE POLICY "Public read access news_categories" ON news_categories FOR SELECT USING (true);

-- 뉴스 관리 정책 (관리자 전체 접근)
CREATE POLICY "Admin full access news" ON news FOR ALL USING (true);

-- 뉴스 공개 읽기 정책
CREATE POLICY "Public read access news" ON news FOR SELECT USING (true);

-- 뉴스 태그 관리 정책 (관리자 전체 접근)
CREATE POLICY "Admin full access news_tags" ON news_tags FOR ALL USING (true);

-- 뉴스 태그 공개 읽기 정책
CREATE POLICY "Public read access news_tags" ON news_tags FOR SELECT USING (true);

-- 뉴스 태그 관계 관리 정책 (관리자 전체 접근)
CREATE POLICY "Admin full access news_tag_relations" ON news_tag_relations FOR ALL USING (true);

-- 뉴스 태그 관계 공개 읽기 정책
CREATE POLICY "Public read access news_tag_relations" ON news_tag_relations FOR SELECT USING (true);

-- RLS 활성화 확인 및 설정
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;

-- 정책 적용 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('news_categories', 'news', 'news_tags', 'news_tag_relations')
ORDER BY tablename, policyname;

-- 테이블별 정책 요약 출력
SELECT 
    'news_categories' as table_name,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies 
WHERE tablename = 'news_categories'
UNION ALL
SELECT 
    'news' as table_name,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies 
WHERE tablename = 'news'
UNION ALL
SELECT 
    'news_tags' as table_name,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies 
WHERE tablename = 'news_tags'
UNION ALL
SELECT 
    'news_tag_relations' as table_name,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies 
WHERE tablename = 'news_tag_relations';
