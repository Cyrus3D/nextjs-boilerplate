-- 뉴스 카테고리 데이터 삽입
INSERT INTO news_categories (name, color_class) VALUES
('정치', 'bg-red-100 text-red-800'),
('경제', 'bg-blue-100 text-blue-800'),
('사회', 'bg-green-100 text-green-800'),
('국제', 'bg-purple-100 text-purple-800'),
('문화', 'bg-pink-100 text-pink-800'),
('스포츠', 'bg-orange-100 text-orange-800'),
('IT/과학', 'bg-cyan-100 text-cyan-800'),
('교민소식', 'bg-yellow-100 text-yellow-800'),
('생활정보', 'bg-indigo-100 text-indigo-800'),
('기타', 'bg-gray-100 text-gray-800')
ON CONFLICT (name) DO UPDATE SET
    color_class = EXCLUDED.color_class,
    updated_at = NOW();

-- 카테고리 삽입 확인
SELECT 
    id,
    name,
    color_class,
    created_at
FROM news_categories 
ORDER BY id;
