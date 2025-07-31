-- Insert news categories
INSERT INTO news_categories (name, color_class, description) VALUES
('정책', 'bg-blue-100 text-blue-800', '정부 정책 및 법률 관련 뉴스'),
('교통', 'bg-green-100 text-green-800', '교통 및 인프라 관련 뉴스'),
('커뮤니티', 'bg-purple-100 text-purple-800', '한인 커뮤니티 및 행사 소식'),
('경제', 'bg-orange-100 text-orange-800', '경제 및 비즈니스 뉴스'),
('문화', 'bg-pink-100 text-pink-800', '문화 및 엔터테인먼트 소식'),
('생활', 'bg-yellow-100 text-yellow-800', '일상 생활 정보 및 팁'),
('사회', 'bg-gray-100 text-gray-800', '사회 이슈 및 사건'),
('스포츠', 'bg-red-100 text-red-800', '스포츠 관련 뉴스'),
('건강', 'bg-emerald-100 text-emerald-800', '건강 및 의료 정보'),
('기술', 'bg-indigo-100 text-indigo-800', '기술 및 IT 관련 뉴스')
ON CONFLICT (name) DO NOTHING;
