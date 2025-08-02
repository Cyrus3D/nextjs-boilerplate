# 태국 정보카드 플랫폼 디자인 가이드라인

## 📋 목차
1. [디자인 철학](#디자인-철학)
2. [컬러 시스템](#컬러-시스템)
3. [타이포그래피](#타이포그래피)
4. [컴포넌트 디자인](#컴포넌트-디자인)
5. [레이아웃 원칙](#레이아웃-원칙)
6. [반응형 디자인](#반응형-디자인)
7. [UI/UX 패턴](#uiux-패턴)
8. [접근성](#접근성)
9. [다국어 지원](#다국어-지원)

---

## 🎨 디자인 철학

### 핵심 가치
- **명확성**: 정보를 명확하고 직관적으로 전달
- **신뢰성**: 비즈니스 정보의 신뢰성을 시각적으로 표현
- **효율성**: 사용자가 빠르게 원하는 정보를 찾을 수 있도록 지원
- **현지화**: 태국 현지 문화와 언어에 최적화

### 디자인 원칙
1. **정보 우선**: 콘텐츠가 가장 중요하며, 디자인은 이를 돋보이게 함
2. **일관성**: 모든 페이지와 컴포넌트에서 일관된 디자인 언어 사용
3. **접근성**: 모든 사용자가 쉽게 사용할 수 있는 인터페이스
4. **성능**: 빠른 로딩과 부드러운 인터랙션

---

## 🎨 컬러 시스템

### 주요 컬러 팔레트

#### Primary Colors (파란색 계열)
\`\`\`css
--primary: 220 90% 56%;           /* #3B82F6 - 메인 브랜드 컬러 */
--primary-foreground: 0 0% 100%;  /* #FFFFFF - 주요 텍스트 */
\`\`\`

#### Secondary Colors
\`\`\`css
--secondary: 210 40% 96%;         /* #F8FAFC - 보조 배경 */
--secondary-foreground: 222.2 47.4% 11.2%; /* #1E293B - 보조 텍스트 */
\`\`\`

#### Status Colors
\`\`\`css
--destructive: 0 84.2% 60.2%;     /* #EF4444 - 오류/삭제 */
--success: 142 76% 36%;           /* #10B981 - 성공 */
--warning: 38 92% 50%;            /* #F59E0B - 경고 */
--info: 199 89% 48%;              /* #0EA5E9 - 정보 */
\`\`\`

#### Premium/Promoted Colors
\`\`\`css
--premium-gold: 45 93% 58%;       /* #F59E0B - 프리미엄 카드 */
--promoted-blue: 217 91% 60%;     /* #3B82F6 - 추천 카드 */
\`\`\`

### 컬러 사용 가이드

#### 비즈니스 카드
- **일반 카드**: 흰색 배경 (`--background`)
- **프리미엄 카드**: 골드 그라데이션 (`from-yellow-50 to-white`, `ring-yellow-400`)
- **추천 카드**: 블루 그라데이션 (`from-blue-50 to-white`, `ring-blue-400`)

#### 뉴스 카드
- **일반 뉴스**: 흰색 배경
- **속보**: 빨간색 배지 (`bg-red-500`)
- **카테고리**: 회색 배지 (`bg-gray-100`)

---

## 📝 타이포그래피

### 폰트 스택
\`\`\`css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
\`\`\`

### 텍스트 크기 시스템

#### 제목 (Headlines)
- **H1**: `text-3xl` (30px) - 페이지 메인 제목
- **H2**: `text-2xl` (24px) - 섹션 제목
- **H3**: `text-xl` (20px) - 서브섹션 제목
- **H4**: `text-lg` (18px) - 카드 제목

#### 본문 (Body Text)
- **Large**: `text-base` (16px) - 주요 본문
- **Regular**: `text-sm` (14px) - 일반 본문
- **Small**: `text-xs` (12px) - 보조 정보

#### 특수 텍스트
- **Caption**: `text-xs text-gray-500` - 캡션, 메타데이터
- **Label**: `text-sm font-medium` - 폼 라벨
- **Button**: `text-sm font-medium` - 버튼 텍스트

### 한국어/태국어 텍스트 고려사항
- 한국어: 충분한 행간 (`leading-relaxed`)
- 태국어: 문자 높이를 고려한 여백 조정
- 혼합 텍스트: 언어별 폰트 fallback 설정

---

## 🧩 컴포넌트 디자인

### 비즈니스 카드 컴포넌트

#### 기본 구조
\`\`\`
┌─────────────────────────────────┐
│ [Premium Badge]    [Image 64px] │
│ Title (18px, bold)              │
│ [Category Badge]                │
│                                 │
│ Description (14px, 3 lines)     │
│                                 │
│ 📞 Phone Number                 │
│ 📍 Address                      │
│                                 │
│ [Social Icons] [+N more]        │
│ #tag1 #tag2 #tag3 [+N]         │
│                                 │
│ 👁 1,234 조회 | 노출 5,678      │
└─────────────────────────────────┘
\`\`\`

#### 상태별 스타일
- **기본**: `hover:shadow-lg transition-shadow`
- **프리미엄**: `ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50`
- **추천**: `ring-2 ring-blue-400 bg-gradient-to-br from-blue-50`
- **로딩**: `opacity-75`

### 뉴스 카드 컴포넌트

#### 기본 구조
\`\`\`
┌─────────────────────────────────┐
│                                 │
│        Image (400x200)          │
│ [Breaking] [Category]    [Link] │
│                                 │
│ News Title (18px, 2 lines)      │
│ Summary (14px, 3 lines)         │
│                                 │
│ 🕐 2시간 전 | 👁 1,234         │
│ by Author Name                  │
│                                 │
│ #tag1 #tag2 #tag3 [+N]         │
│                                 │
│ [자세히 보기 버튼]               │
└─────────────────────────────────┘
\`\`\`

### 버튼 디자인

#### Primary Button
\`\`\`css
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}
\`\`\`

#### Secondary Button
\`\`\`css
.btn-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}
\`\`\`

#### Outline Button
\`\`\`css
.btn-outline {
  @apply border border-input bg-background hover:bg-accent;
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}
\`\`\`

### 배지 (Badge) 디자인

#### 카테고리 배지
\`\`\`css
.badge-category {
  @apply bg-secondary text-secondary-foreground;
  @apply px-2 py-1 rounded-full text-xs font-medium;
}
\`\`\`

#### 상태 배지
- **프리미엄**: `bg-yellow-500 text-white`
- **추천**: `bg-blue-500 text-white`
- **속보**: `bg-red-500 text-white animate-pulse`

---

## 📐 레이아웃 원칙

### 그리드 시스템

#### 데스크톱 (1024px+)
- **컨테이너**: `max-w-7xl mx-auto px-4`
- **카드 그리드**: `grid-cols-3 gap-6`
- **사이드바**: `w-80` (320px)

#### 태블릿 (768px - 1023px)
- **컨테이너**: `max-w-4xl mx-auto px-4`
- **카드 그리드**: `grid-cols-2 gap-4`

#### 모바일 (< 768px)
- **컨테이너**: `px-4`
- **카드 그리드**: `grid-cols-1 gap-4`

### 여백 시스템

#### 섹션 간격
- **Large**: `py-16` (64px) - 메인 섹션
- **Medium**: `py-8` (32px) - 서브 섹션
- **Small**: `py-4` (16px) - 컴포넌트 내부

#### 컴포넌트 간격
- **Card Padding**: `p-6` (24px)
- **Card Gap**: `gap-6` (24px) 데스크톱, `gap-4` (16px) 모바일
- **Button Spacing**: `space-x-4` (16px)

---

## 📱 반응형 디자인

### 브레이크포인트
\`\`\`css
/* Mobile First Approach */
sm: 640px   /* 작은 태블릿 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 큰 데스크톱 */
2xl: 1536px /* 초대형 화면 */
\`\`\`

### 반응형 패턴

#### 카드 레이아웃
\`\`\`css
/* 모바일: 1열 */
.card-grid {
  @apply grid grid-cols-1 gap-4;
}

/* 태블릿: 2열 */
@media (min-width: 768px) {
  .card-grid {
    @apply grid-cols-2 gap-6;
  }
}

/* 데스크톱: 3열 */
@media (min-width: 1024px) {
  .card-grid {
    @apply grid-cols-3 gap-6;
  }
}
\`\`\`

#### 텍스트 크기 조정
\`\`\`css
.responsive-title {
  @apply text-xl md:text-2xl lg:text-3xl;
}

.responsive-body {
  @apply text-sm md:text-base;
}
\`\`\`

---

## 🎯 UI/UX 패턴

### 인터랙션 패턴

#### 호버 효과
- **카드**: `hover:shadow-lg transition-shadow duration-300`
- **버튼**: `hover:bg-primary/90 transition-colors`
- **링크**: `hover:text-primary transition-colors`

#### 로딩 상태
- **스켈레톤**: `animate-pulse bg-gray-200`
- **스피너**: `animate-spin`
- **오버레이**: `opacity-75`

#### 포커스 상태
\`\`\`css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}
\`\`\`

### 네비게이션 패턴

#### 메인 네비게이션
- 고정 헤더 (`sticky top-0`)
- 로고 + 검색 + 메뉴
- 모바일에서 햄버거 메뉴

#### 페이지네이션
- 이전/다음 버튼
- 페이지 번호 (최대 7개 표시)
- 무한 스크롤 (카드 리스트)

### 검색 패턴

#### 검색 입력
\`\`\`css
.search-input {
  @apply w-full px-4 py-2 border border-input rounded-md;
  @apply focus:ring-2 focus:ring-primary focus:border-transparent;
}
\`\`\`

#### 필터
- 드롭다운 선택
- 태그 기반 필터
- 카테고리 필터

---

## ♿ 접근성

### 키보드 네비게이션
- 모든 인터랙티브 요소에 `tabindex` 설정
- 포커스 표시 (`focus:ring-2`)
- 논리적 탭 순서

### 스크린 리더 지원
\`\`\`html
<!-- 의미있는 alt 텍스트 -->
<img src="..." alt="비즈니스 로고" />

<!-- ARIA 라벨 -->
<button aria-label="검색">🔍</button>

<!-- 상태 정보 -->
<div aria-live="polite">검색 결과 123개</div>
\`\`\`

### 색상 대비
- 텍스트: 최소 4.5:1 대비율
- 큰 텍스트: 최소 3:1 대비율
- 색상에만 의존하지 않는 정보 전달

### 반응형 접근성
- 터치 타겟 최소 44px
- 충분한 여백과 간격
- 가독성 있는 폰트 크기

---

## 🌏 다국어 지원

### 한국어 최적화
- 충분한 행간 (`leading-relaxed`)
- 적절한 문자 간격
- 한글 폰트 fallback

### 태국어 지원
- 태국어 문자 높이 고려
- 적절한 여백 조정
- 태국어 폰트 지원

### 영어 지원
- 기본 시스템 폰트 사용
- 적절한 단어 간격
- 하이픈 처리

### RTL 언어 준비
\`\`\`css
[dir="rtl"] .card {
  @apply text-right;
}

[dir="rtl"] .icon {
  @apply scale-x-[-1];
}
\`\`\`

---

## 🎨 광고 통합 디자인

### 네이티브 광고
- 콘텐츠와 자연스럽게 통합
- 명확한 "광고" 표시
- 일관된 카드 디자인 유지

### 배너 광고
\`\`\`css
.ad-banner {
  @apply w-full max-w-4xl mx-auto my-8;
  @apply border border-gray-200 rounded-lg overflow-hidden;
}
\`\`\`

### 인피드 광고
- 3-5개 카드마다 삽입
- 콘텐츠와 유사한 디자인
- 호버 효과 제한

---

## 🔧 개발 가이드라인

### CSS 클래스 명명 규칙
\`\`\`css
/* 컴포넌트 기반 */
.business-card { }
.business-card__title { }
.business-card__description { }
.business-card--premium { }

/* 유틸리티 우선 (Tailwind) */
.btn-primary { @apply bg-primary text-white px-4 py-2 rounded; }
\`\`\`

### 컴포넌트 구조
\`\`\`typescript
interface ComponentProps {
  // 필수 props
  data: DataType
  
  // 선택적 props
  className?: string
  onClick?: () => void
  
  // 상태 props
  isLoading?: boolean
  isError?: boolean
}
\`\`\`

### 성능 최적화
- 이미지 lazy loading
- 컴포넌트 메모이제이션
- CSS 최적화 (critical CSS)
- 번들 크기 최적화

---

## 📊 메트릭스 및 KPI

### 디자인 성능 지표
- **로딩 시간**: < 3초 (First Contentful Paint)
- **인터랙션**: < 100ms 응답 시간
- **접근성**: WCAG 2.1 AA 준수
- **모바일 친화성**: Google Mobile-Friendly 통과

### 사용자 경험 지표
- **클릭률**: 카드 클릭률 > 15%
- **체류 시간**: 평균 > 2분
- **이탈률**: < 60%
- **전환율**: 연락처 클릭 > 5%

---

## 🚀 향후 개선 계획

### 단기 계획 (1-3개월)
- 다크 모드 지원
- 애니메이션 개선
- 접근성 강화

### 중기 계획 (3-6개월)
- PWA 기능 추가
- 오프라인 지원
- 고급 필터링

### 장기 계획 (6개월+)
- AI 기반 추천
- 개인화 UI
- 다국어 확장

---

*이 가이드라인은 프로젝트의 발전과 함께 지속적으로 업데이트됩니다.*
*최종 업데이트: 2025년 1월*
