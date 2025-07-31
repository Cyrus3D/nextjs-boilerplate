-- 뉴스 카테고리 데이터 삽입
INSERT INTO news_categories (name, color_class, description) VALUES
('정치', 'bg-red-100 text-red-800', '태국 정치 관련 뉴스'),
('경제', 'bg-blue-100 text-blue-800', '태국 경제 및 비즈니스 뉴스'),
('사회', 'bg-green-100 text-green-800', '태국 사회 이슈 및 사건사고'),
('국제', 'bg-purple-100 text-purple-800', '국제 관계 및 외교 뉴스'),
('문화', 'bg-pink-100 text-pink-800', '문화, 예술, 엔터테인먼트 뉴스'),
('스포츠', 'bg-orange-100 text-orange-800', '스포츠 관련 뉴스'),
('IT/과학', 'bg-cyan-100 text-cyan-800', 'IT, 과학기술 관련 뉴스'),
('교민소식', 'bg-yellow-100 text-yellow-800', '한국 교민 관련 소식'),
('생활정보', 'bg-indigo-100 text-indigo-800', '생활에 유용한 정보'),
('기타', 'bg-gray-100 text-gray-800', '기타 분류되지 않은 뉴스')
ON CONFLICT (name) DO UPDATE SET
    color_class = EXCLUDED.color_class,
    description = EXCLUDED.description,
    updated_at = NOW();
