# 태국 정보카드 플랫폼 디자인 가이드라인

## 📋 목차
1. [디자인 철학](#디자인-철학)
2. [컬러 시스템](#컬러-시스템)
3. [타이포그래피](#타이포그래피)
4. [컴포넌트 디자인](#컴포넌트-디자인)
5. [레이아웃 시스템](#레이아웃-시스템)
6. [반응형 디자인](#반응형-디자인)
7. [인터랙션 패턴](#인터랙션-패턴)
8. [접근성](#접근성)
9. [다국어 지원](#다국어-지원)
10. [성능 최적화](#성능-최적화)

---

## 🎯 디자인 철학

### 핵심 원칙
- **명확성 (Clarity)**: 정보를 명확하고 이해하기 쉽게 전달
- **신뢰성 (Reliability)**: 일관된 디자인으로 사용자 신뢰 구축
- **효율성 (Efficiency)**: 빠른 정보 접근과 효율적인 탐색
- **현지화 (Localization)**: 태국 거주 한국인 커뮤니티에 최적화

### 디자인 가치
1. **정보 우선**: 콘텐츠가 디자인보다 우선
2. **일관성**: 모든 페이지와 컴포넌트에서 일관된 경험
3. **접근성**: 모든 사용자가 쉽게 사용할 수 있는 인터페이스
4. **성능**: 빠른 로딩과 부드러운 인터랙션

---

## 🎨 컬러 시스템

### Primary Colors
\`\`\`css
/* 메인 브랜드 컬러 - 파란색 계열 */
--primary: #3B82F6;           /* Blue 500 */
--primary-foreground: #FFFFFF;
--primary-hover: #2563EB;     /* Blue 600 */
--primary-light: #DBEAFE;     /* Blue 100 */
--primary-dark: #1E40AF;      /* Blue 700 */
\`\`\`

### Secondary Colors
\`\`\`css
/* 보조 컬러 - 회색 계열 */
--secondary: #F1F5F9;         /* Slate 100 */
--secondary-foreground: #0F172A; /* Slate 900 */
--secondary-hover: #E2E8F0;   /* Slate 200 */
\`\`\`

### Status Colors
\`\`\`css
/* 성공 */
--success: #10B981;           /* Emerald 500 */
--success-light: #D1FAE5;     /* Emerald 100 */
--success-dark: #047857;      /* Emerald 700 */

/* 경고 */
--warning: #F59E0B;           /* Amber 500 */
--warning-light: #FEF3C7;     /* Amber 100 */
--warning-dark: #D97706;      /* Amber 600 */

/* 오류 */
--error: #EF4444;             /* Red 500 */
--error-light: #FEE2E2;       /* Red 100 */
--error-dark: #DC2626;        /* Red 600 */

/* 정보 */
--info: #3B82F6;              /* Blue 500 */
--info-light: #DBEAFE;        /* Blue 100 */
--info-dark: #1D4ED8;         /* Blue 700 */
\`\`\`

### Business Card Status Colors
\`\`\`css
/* 프리미엄 카드 */
--premium: #F59E0B;           /* Gold/Amber 500 */
--premium-light: #FEF3C7;     /* Amber 100 */
--premium-gradient: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);

/* 프로모션 카드 */
--promoted: #3B82F6;          /* Blue 500 */
--promoted-light: #DBEAFE;    /* Blue 100 */
--promoted-gradient: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);

/* 일반 카드 */
--regular: #F8FAFC;           /* Slate 50 */
--regular-border: #E2E8F0;    /* Slate 200 */
\`\`\`

### Text Colors
\`\`\`css
--text-primary: #0F172A;      /* Slate 900 */
--text-secondary: #475569;    /* Slate 600 */
--text-muted: #94A3B8;        /* Slate 400 */
--text-inverse: #FFFFFF;
\`\`\`

### Background Colors
\`\`\`css
--background: #FFFFFF;
--background-secondary: #F8FAFC; /* Slate 50 */
--background-muted: #F1F5F9;     /* Slate 100 */
--background-accent: #F0F9FF;    /* Sky 50 */
\`\`\`

---

## ✍️ 타이포그래피

### 폰트 패밀리
\`\`\`css
/* 기본 폰트 스택 */
font-family: 
  "Pretendard Variable", 
  Pretendard, 
  -apple-system, 
  BlinkMacSystemFont, 
  system-ui, 
  Roboto, 
  "Helvetica Neue", 
  "Segoe UI", 
  "Apple SD Gothic Neo", 
  "Noto Sans KR", 
  "Malgun Gothic", 
  "Apple Color Emoji", 
  "Segoe UI Emoji", 
  "Segoe UI Symbol", 
  sans-serif;
\`\`\`

### 제목 스타일
\`\`\`css
/* H1 - 페이지 메인 제목 */
.heading-1 {
  font-size: 2rem;        /* 32px */
  font-weight: 700;       /* Bold */
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

/* H2 - 섹션 제목 */
.heading-2 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;       /* SemiBold */
  line-height: 1.3;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

/* H3 - 서브섹션 제목 */
.heading-3 {
  font-size: 1.25rem;     /* 20px */
  font-weight: 600;       /* SemiBold */
  line-height: 1.4;
  color: var(--text-primary);
}

/* H4 - 카드 제목 */
.heading-4 {
  font-size: 1.125rem;    /* 18px */
  font-weight: 600;       /* SemiBold */
  line-height: 1.4;
  color: var(--text-primary);
}
\`\`\`

### 본문 스타일
\`\`\`css
/* 큰 본문 텍스트 */
.text-large {
  font-size: 1rem;        /* 16px */
  font-weight: 400;       /* Regular */
  line-height: 1.6;
  color: var(--text-primary);
}

/* 기본 본문 텍스트 */
.text-base {
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;       /* Regular */
  line-height: 1.5;
  color: var(--text-primary);
}

/* 작은 본문 텍스트 */
.text-small {
  font-size: 0.75rem;     /* 12px */
  font-weight: 400;       /* Regular */
  line-height: 1.4;
  color: var(--text-secondary);
}

/* 캡션 텍스트 */
.text-caption {
  font-size: 0.6875rem;   /* 11px */
  font-weight: 400;       /* Regular */
  line-height: 1.3;
  color: var(--text-muted);
}
\`\`\`

### 특수 텍스트 스타일
\`\`\`css
/* 강조 텍스트 */
.text-emphasis {
  font-weight: 600;       /* SemiBold */
  color: var(--primary);
}

/* 링크 텍스트 */
.text-link {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.text-link:hover {
  color: var(--primary-hover);
  text-decoration: none;
}

/* 메타 정보 텍스트 */
.text-meta {
  font-size: 0.75rem;     /* 12px */
  font-weight: 400;       /* Regular */
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
\`\`\`

---

## 🧩 컴포넌트 디자인

### 비즈니스 카드 (Business Card)

#### 기본 구조
\`\`\`css
.business-card {
  background: var(--background);
  border: 1px solid var(--regular-border);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease-in-out;
}

.business-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
\`\`\`

#### 프리미엄 카드 스타일
\`\`\`css
.business-card--premium {
  background: var(--premium-gradient);
  border: 2px solid var(--premium);
  color: white;
}

.business-card--premium .card-title {
  color: white;
}

.business-card--premium .card-description {
  color: rgba(255, 255, 255, 0.9);
}
\`\`\`

#### 프로모션 카드 스타일
\`\`\`css
.business-card--promoted {
  background: var(--promoted-light);
  border: 2px solid var(--promoted);
  position: relative;
}

.business-card--promoted::before {
  content: "추천";
  position: absolute;
  top: -1px;
  right: 12px;
  background: var(--promoted);
  color: white;
  padding: 4px 8px;
  border-radius: 0 0 6px 6px;
  font-size: 0.75rem;
  font-weight: 600;
}
\`\`\`

### 뉴스 카드 (News Card)

#### 기본 구조
\`\`\`css
.news-card {
  background: var(--background);
  border: 1px solid var(--regular-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.news-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--background-muted);
}

.news-card__content {
  padding: 16px;
}

.news-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.news-card__summary {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.news-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--text-muted);
}
\`\`\`

#### 속보 뉴스 스타일
\`\`\`css
.news-card--breaking {
  border-left: 4px solid var(--error);
}

.news-card--breaking .news-card__title::before {
  content: "🔥 속보";
  display: inline-block;
  background: var(--error);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  margin-right: 8px;
  vertical-align: middle;
}
\`\`\`

### 버튼 (Buttons)

#### Primary 버튼
\`\`\`css
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
\`\`\`

#### Secondary 버튼
\`\`\`css
.btn-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--regular-border);
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-secondary:hover {
  background: var(--secondary-hover);
  border-color: var(--primary);
}
\`\`\`

#### Outline 버튼
\`\`\`css
.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-outline:hover {
  background: var(--primary);
  color: var(--primary-foreground);
}
\`\`\`

### 배지 (Badges)

#### 카테고리 배지
\`\`\`css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

.badge--category {
  background: var(--background-muted);
  color: var(--text-secondary);
}

.badge--premium {
  background: var(--premium-light);
  color: var(--premium-dark);
}

.badge--promoted {
  background: var(--promoted-light);
  color: var(--promoted-dark);
}

.badge--breaking {
  background: var(--error-light);
  color: var(--error-dark);
}
\`\`\`

---

## 📐 레이아웃 시스템

### 그리드 시스템
\`\`\`css
/* 컨테이너 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 그리드 레이아웃 */
.grid {
  display: grid;
  gap: 24px;
}

.grid--cards {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.grid--news {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

/* 플렉스 레이아웃 */
.flex {
  display: flex;
}

.flex--center {
  align-items: center;
  justify-content: center;
}

.flex--between {
  align-items: center;
  justify-content: space-between;
}

.flex--wrap {
  flex-wrap: wrap;
}
\`\`\`

### 간격 시스템
\`\`\`css
/* 마진 */
.m-0 { margin: 0; }
.m-1 { margin: 4px; }
.m-2 { margin: 8px; }
.m-3 { margin: 12px; }
.m-4 { margin: 16px; }
.m-5 { margin: 20px; }
.m-6 { margin: 24px; }
.m-8 { margin: 32px; }
.m-10 { margin: 40px; }
.m-12 { margin: 48px; }

/* 패딩 */
.p-0 { padding: 0; }
.p-1 { padding: 4px; }
.p-2 { padding: 8px; }
.p-3 { padding: 12px; }
.p-4 { padding: 16px; }
.p-5 { padding: 20px; }
.p-6 { padding: 24px; }
.p-8 { padding: 32px; }
.p-10 { padding: 40px; }
.p-12 { padding: 48px; }

/* 방향별 간격 */
.mt-4 { margin-top: 16px; }
.mb-4 { margin-bottom: 16px; }
.ml-4 { margin-left: 16px; }
.mr-4 { margin-right: 16px; }
.mx-4 { margin-left: 16px; margin-right: 16px; }
.my-4 { margin-top: 16px; margin-bottom: 16px; }
\`\`\`

---

## 📱 반응형 디자인

### 브레이크포인트
\`\`\`css
/* 모바일 우선 접근법 */
/* Extra Small: 0px ~ 575px */
@media (max-width: 575px) {
  .container {
    padding: 0 12px;
  }
  
  .grid--cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .business-card {
    padding: 16px;
  }
}

/* Small: 576px ~ 767px */
@media (min-width: 576px) and (max-width: 767px) {
  .grid--cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Medium: 768px ~ 991px */
@media (min-width: 768px) and (max-width: 991px) {
  .grid--cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Large: 992px ~ 1199px */
@media (min-width: 992px) and (max-width: 1199px) {
  .grid--cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

/* Extra Large: 1200px+ */
@media (min-width: 1200px) {
  .grid--cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
\`\`\`

### 모바일 최적화
\`\`\`css
/* 터치 타겟 최소 크기 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* 모바일 네비게이션 */
@media (max-width: 767px) {
  .nav-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--background);
    border-top: 1px solid var(--regular-border);
    padding: 8px 0;
    z-index: 1000;
  }
  
  .nav-mobile__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    font-size: 0.75rem;
    color: var(--text-muted);
    text-decoration: none;
  }
  
  .nav-mobile__item--active {
    color: var(--primary);
  }
}
\`\`\`

---

## 🎭 인터랙션 패턴

### 호버 효과
\`\`\`css
/* 카드 호버 */
.card-hover {
  transition: all 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 버튼 호버 */
.btn-hover {
  transition: all 0.2s ease-in-out;
}

.btn-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 링크 호버 */
.link-hover {
  position: relative;
  transition: color 0.2s ease-in-out;
}

.link-hover::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.2s ease-in-out;
}

.link-hover:hover::after {
  width: 100%;
}
\`\`\`

### 로딩 상태
\`\`\`css
/* 스켈레톤 로딩 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 스피너 */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--background-muted);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 로딩 오버레이 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
\`\`\`

### 포커스 상태
\`\`\`css
/* 포커스 링 */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary);
  border-radius: 4px;
}

/* 키보드 네비게이션 */
.keyboard-nav:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* 스킵 링크 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary);
  color: var(--primary-foreground);
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
\`\`\`

---

## ♿ 접근성

### 색상 대비
- 일반 텍스트: 최소 4.5:1 대비율
- 큰 텍스트 (18px+): 최소 3:1 대비율
- UI 컴포넌트: 최소 3:1 대비율

### 키보드 네비게이션
\`\`\`css
/* 탭 순서 */
.tab-order {
  tab-index: 0;
}

/* 포커스 표시 */
.focusable:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* 숨김 콘텐츠 (스크린 리더용) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\`\`\`

### ARIA 레이블
\`\`\`html
<!-- 버튼 -->
<button aria-label="검색" aria-describedby="search-help">
  <SearchIcon />
</button>

<!-- 링크 -->
<a href="/business/123" aria-label="윤키친 상세 정보 보기">
  윤키친
</a>

<!-- 상태 -->
<div role="status" aria-live="polite">
  검색 결과 12개
</div>

<!-- 탭 -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">
    비즈니스
  </button>
</div>
\`\`\`

---

## 🌏 다국어 지원

### 한국어 최적화
\`\`\`css
/* 한국어 텍스트 */
.text-korean {
  font-family: "Pretendard Variable", "Noto Sans KR", sans-serif;
  line-height: 1.6; /* 한글은 충분한 행간 필요 */
  word-break: keep-all; /* 단어 단위로 줄바꿈 */
  overflow-wrap: break-word;
}

/* 한국어 제목 */
.heading-korean {
  line-height: 1.4;
  letter-spacing: -0.025em;
}
\`\`\`

### 태국어 지원
\`\`\`css
/* 태국어 텍스트 */
.text-thai {
  font-family: "Noto Sans Thai", "Sarabun", sans-serif;
  line-height: 1.8; /* 태국어는 더 높은 행간 필요 */
}
\`\`\`

### RTL 언어 준비
\`\`\`css
/* RTL 지원 */
[dir="rtl"] .text-align-start {
  text-align: right;
}

[dir="ltr"] .text-align-start {
  text-align: left;
}

/* 논리적 속성 사용 */
.margin-inline-start {
  margin-inline-start: 16px;
}

.padding-inline-end {
  padding-inline-end: 12px;
}
\`\`\`

---

## ⚡ 성능 최적화

### CSS 최적화
\`\`\`css
/* 하드웨어 가속 */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* 애니메이션 최적화 */
.optimized-animation {
  animation-fill-mode: both;
  animation-duration: 0.2s;
  animation-timing-function: ease-out;
}

/* 레이아웃 스래싱 방지 */
.no-layout-thrashing {
  transform: translateX(0);
  opacity: 1;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

/* 컴포지트 레이어 */
.composite-layer {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
\`\`\`

### 이미지 최적화
\`\`\`css
/* 반응형 이미지 */
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  loading: lazy;
}

/* 이미지 플레이스홀더 */
.image-placeholder {
  background: var(--background-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* WebP 지원 */
.webp .image-webp {
  background-image: url('image.webp');
}

.no-webp .image-webp {
  background-image: url('image.jpg');
}
\`\`\`

### 로딩 최적화
\`\`\`css
/* Critical CSS */
.above-fold {
  /* 중요한 스타일만 인라인으로 */
  display: block;
  visibility: visible;
}

/* 지연 로딩 */
.lazy-load {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.lazy-load.loaded {
  opacity: 1;
  transform: translateY(0);
}
\`\`\`

---

## 📏 개발 가이드라인

### CSS 클래스 명명 규칙
\`\`\`css
/* BEM 방법론 사용 */
.block {}
.block__element {}
.block--modifier {}

/* 예시 */
.business-card {}
.business-card__title {}
.business-card__description {}
.business-card--premium {}
.business-card--promoted {}

.news-card {}
.news-card__image {}
.news-card__content {}
.news-card__title {}
.news-card--breaking {}
\`\`\`

### 컴포넌트 구조
\`\`\`typescript
// 컴포넌트 파일 구조
interface ComponentProps {
  // Props 타입 정의
}

export function Component({ ...props }: ComponentProps) {
  // 1. 상태 관리
  // 2. 이벤트 핸들러
  // 3. 렌더링
  
  return (
    <div className="component">
      {/* JSX */}
    </div>
  )
}

// 기본값 설정
Component.defaultProps = {
  // 기본값
}
\`\`\`

### Tailwind CSS 사용 규칙
\`\`\`css
/* 유틸리티 클래스 우선 사용 */
.card {
  @apply bg-white border border-gray-200 rounded-lg p-6 shadow-sm;
  @apply hover:shadow-lg transition-shadow duration-200;
}

/* 복잡한 스타일은 컴포넌트 클래스로 */
.business-card-premium {
  @apply bg-gradient-to-br from-amber-400 to-amber-600;
  @apply text-white border-2 border-amber-500;
}
\`\`\`

---

## 📊 성능 메트릭스

### Core Web Vitals 목표
- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 추가 메트릭스
- **FCP (First Contentful Paint)**: < 1.8초
- **TTI (Time to Interactive)**: < 3.8초
- **Speed Index**: < 3.4초

### 최적화 체크리스트
- [ ] 이미지 최적화 (WebP, 적절한 크기)
- [ ] CSS/JS 번들 최적화
- [ ] 폰트 로딩 최적화
- [ ] 지연 로딩 구현
- [ ] 캐싱 전략 수립
- [ ] CDN 사용
- [ ] 압축 활성화

---

## 🎯 KPI 및 측정

### 사용자 경험 KPI
- 페이지 로딩 시간
- 바운스 율
- 세션 지속 시간
- 페이지뷰 수
- 클릭률 (CTR)

### 접근성 KPI
- 키보드 네비게이션 성공률
- 스크린 리더 호환성
- 색상 대비 준수율
- WCAG 2.1 AA 준수율

### 성능 모니터링 도구
- Google PageSpeed Insights
- Lighthouse
- WebPageTest
- GTmetrix
- Real User Monitoring (RUM)

---

## 🔄 업데이트 및 유지보수

### 디자인 시스템 버전 관리
- 메이저 변경: 전체 리뉴얼
- 마이너 변경: 새로운 컴포넌트 추가
- 패치 변경: 버그 수정, 미세 조정

### 문서화 규칙
- 모든 컴포넌트는 Storybook 문서화
- 디자인 토큰 변경 시 문서 업데이트
- 접근성 가이드라인 준수 확인

### 테스트 전략
- 시각적 회귀 테스트
- 접근성 자동 테스트
- 성능 테스트
- 크로스 브라우저 테스트

---

이 디자인 가이드라인은 태국 정보카드 플랫폼의 일관된 사용자 경험을 보장하고, 개발 효율성을 높이며, 접근성과 성능을 최적화하기 위한 종합적인 가이드입니다. 모든 팀원은 이 가이드라인을 준수하여 고품질의 사용자 인터페이스를 구축해야 합니다.
