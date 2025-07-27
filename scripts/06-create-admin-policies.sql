-- 관리자용 정책 추가 (모든 작업 허용)
-- 실제 운영 환경에서는 더 세밀한 권한 관리가 필요합니다

-- 카테고리 관리 정책
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (true);

-- 비즈니스 카드 관리 정책  
CREATE POLICY "Admin full access business_cards" ON business_cards FOR ALL USING (true);

-- 태그 관리 정책
CREATE POLICY "Admin full access tags" ON tags FOR ALL USING (true);

-- 비즈니스 카드-태그 관계 관리 정책
CREATE POLICY "Admin full access business_card_tags" ON business_card_tags FOR ALL USING (true);
