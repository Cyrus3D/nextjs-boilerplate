-- 프리미엄 카테고리 추가
INSERT INTO categories (name, color_class) VALUES
('프리미엄', 'bg-yellow-100 text-yellow-800')
ON CONFLICT (name) DO NOTHING;
