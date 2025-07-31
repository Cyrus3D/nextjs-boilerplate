-- 뉴스 카테고리 초기 데이터 삽입
INSERT INTO news_categories (name, color_class) VALUES
('정치', 'bg-red-100 text-red-800'),
('경제', 'bg-blue-100 text-blue-800'),
('사회', 'bg-green-100 text-green-800'),
('문화', 'bg-purple-100 text-purple-800'),
('스포츠', 'bg-orange-100 text-orange-800'),
('국제', 'bg-indigo-100 text-indigo-800'),
('교민소식', 'bg-pink-100 text-pink-800'),
('생활정보', 'bg-yellow-100 text-yellow-800'),
('건강', 'bg-emerald-100 text-emerald-800'),
('교통', 'bg-cyan-100 text-cyan-800')
ON CONFLICT (name) DO NOTHING;
