-- 뉴스 관련 테이블에 대한 관리자 전체 접근 권한 정책 추가
-- 실제 운영 환경에서는 더 세밀한 권한 관리가 필요합니다

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Admin full access news_categories" ON news_categories;
DROP POLICY IF EXISTS "Admin full access news" ON news;
DROP POLICY IF EXISTS "Admin full access news_tags" ON news_tags;
DROP POLICY IF EXISTS "Admin full access news_tag_relations" ON news_tag_relations;

-- 뉴스 카테고리 관리 정책
CREATE POLICY "Admin full access news_categories" ON news_categories FOR ALL USING (true);

-- 뉴스 관리 정책  
CREATE POLICY "Admin full access news" ON news FOR ALL USING (true);

-- 뉴스 태그 관리 정책
CREATE POLICY "Admin full access news_tags" ON news_tags FOR ALL USING (true);

-- 뉴스 태그 관계 관리 정책
CREATE POLICY "Admin full access news_tag_relations" ON news_tag_relations FOR ALL USING (true);

-- 정책 적용 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('news_categories', 'news', 'news_tags', 'news_tag_relations')
ORDER BY tablename, policyname;
