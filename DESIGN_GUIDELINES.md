# 태국 정보카드 플랫폼 디자인 가이드라인

## 목차
1. [디자인 철학](#디자인-철학)
2. [색상 시스템](#색상-시스템)
3. [타이포그래피](#타이포그래피)
4. [컴포넌트 디자인](#컴포넌트-디자인)
5. [레이아웃 시스템](#레이아웃-시스템)
6. [반응형 디자인](#반응형-디자인)
7. [UI/UX 패턴](#uiux-패턴)
8. [접근성 가이드라인](#접근성-가이드라인)
9. [다국어 지원](#다국어-지원)
10. [성능 최적화](#성능-최적화)

## 디자인 철학

### 핵심 원칙
1. **명확성** - 정보 전달이 명확하고 직관적이어야 함
2. **신뢰성** - 안정적이고 일관된 사용자 경험 제공
3. **효율성** - 빠른 정보 접근과 탐색이 가능해야 함
4. **현지화** - 태국 거주 한국인의 니즈에 최적화

### 디자인 가치
- **정보 우선**: 콘텐츠가 디자인보다 우선
- **일관성**: 모든 페이지와 컴포넌트에서 통일된 경험
- **접근성**: 모든 사용자가 쉽게 이용할 수 있는 인터페이스
- **성능**: 빠른 로딩과 부드러운 인터랙션

## 색상 시스템

### 기본 색상 팔레트

#### Primary Colors (주요 색상)
\`\`\`css
/* 기본 파란색 */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* 메인 컬러 */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;
\`\`\`

#### Secondary Colors (보조 색상)
\`\`\`css
/* 회색 계열 */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
\`\`\`

#### Status Colors (상태 색상)
\`\`\`css
/* 성공 */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;

/* 경고 */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* 오류 */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* 정보 */
--info-50: #f0f9ff;
--info-500: #06b6d4;
--info-600: #0891b2;
\`\`\`

#### Special Colors (특수 색상)
\`\`\`css
/* 프리미엄 골드 */
--premium-50: #fffbeb;
--premium-100: #fef3c7;
--premium-200: #fde68a;
--premium-300: #fcd34d;
--premium-400: #fbbf24;
--premium-500: #f59e0b;  /* 프리미엄 메인 */
--premium-600: #d97706;
--premium-700: #b45309;
--premium-800: #92400e;
--premium-900: #78350f;

/* 프로모션 블루 */
--promoted-500: #3b82f6;
--promoted-600: #2563eb;
\`\`\`

### 색상 사용 규칙

#### 비즈니스 카드 색상 매핑
- **일반 카드**: `bg-white border-gray-200`
- **프리미엄 카드**: `bg-gradient-to-br from-premium-50 to-premium-100 border-premium-300`
- **프로모션 카드**: `bg-gradient-to-br from-primary-50 to-blue-50 border-primary-300`

#### 뉴스 카테고리 색상
- **현지 뉴스**: `bg-blue-500 text-white`
- **교민 업체**: `bg-green-500 text-white`
- **정책**: `bg-purple-500 text-white`
- **교통**: `bg-orange-500 text-white`
- **비자**: `bg-red-500 text-white`
- **경제**: `bg-indigo-500 text-white`
- **문화**: `bg-pink-500 text-white`
- **스포츠**: `bg-teal-500 text-white`
- **일반**: `bg-gray-500 text-white`

## 타이포그래피

### 폰트 스택
\`\`\`css
font-family: 
  'Pretendard Variable', 
  'Pretendard', 
  -apple-system, 
  BlinkMacSystemFont, 
  system-ui, 
  Roboto, 
  'Helvetica Neue', 
  'Segoe UI', 
  'Apple SD Gothic Neo', 
  'Noto Sans KR', 
  'Malgun Gothic', 
  'Apple Color Emoji', 
  'Segoe UI Emoji', 
  'Segoe UI Symbol', 
  sans-serif;
\`\`\`

### 타이포그래피 스케일

#### 제목 (Headings)
\`\`\`css
/* H1 - 페이지 제목 */
.text-h1 {
  font-size: 2.25rem; /* 36px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

/* H2 - 섹션 제목 */
.text-h2 {
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.025em;
}

/* H3 - 서브 섹션 제목 */
.text-h3 {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  line-height: 1.4;
}

/* H4 - 카드 제목 */
.text-h4 {
  font-size: 1.125rem; /* 18px */
  font-weight: 600;
  line-height: 1.4;
}
\`\`\`

#### 본문 (Body Text)
\`\`\`css
/* Large Body - 주요 설명 */
.text-body-large {
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.6;
}

/* Regular Body - 일반 텍스트 */
.text-body {
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  line-height: 1.5;
}

/* Small Body - 부가 정보 */
.text-body-small {
  font-size: 0.75rem; /* 12px */
  font-weight: 400;
  line-height: 1.4;
}
\`\`\`

#### 라벨 및 버튼 (Labels & Buttons)
\`\`\`css
/* Button Text */
.text-button {
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.025em;
}

/* Label Text */
.text-label {
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
\`\`\`

### 한국어/태국어 최적화
- 한국어 텍스트는 `leading-relaxed` (1.625) 사용
- 태국어 텍스트는 추가적인 line-height 고려
- 긴 단어 처리를 위한 `word-break: keep-all` 적용

## 컴포넌트 디자인

### 비즈니스 카드 컴포넌트

#### 기본 구조
\`\`\`tsx
<Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
  <CardHeader className="pb-3">
    <CardTitle className="flex items-start justify-between">
      <span>{title}</span>
      <Badge variant={getBadgeVariant(type)}>{category}</Badge>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-gray-600 mb-4">{description}</p>
    <ContactInfo />
    <SocialLinks />
  </CardContent>
</Card>
\`\`\`

#### 상태별 스타일
\`\`\`css
/* 일반 카드 */
.card-normal {
  @apply bg-white border border-gray-200 shadow-sm;
}

/* 프리미엄 카드 */
.card-premium {
  @apply bg-gradient-to-br from-premium-50 to-premium-100 
         border border-premium-300 shadow-md
         relative before:absolute before:top-0 before:right-0 
         before:w-0 before:h-0 before:border-l-[20px] 
         before:border-b-[20px] before:border-l-transparent 
         before:border-b-premium-500;
}

/* 프로모션 카드 */
.card-promoted {
  @apply bg-gradient-to-br from-primary-50 to-blue-50 
         border border-primary-300 shadow-md
         ring-2 ring-primary-200;
}
\`\`\`

### 뉴스 카드 컴포넌트

#### 기본 구조
\`\`\`tsx
<Card className="overflow-hidden group">
  <div className="aspect-video overflow-hidden">
    <img 
      src={imageUrl || "/placeholder.svg"} 
      alt={title}
      className="w-full h-full object-cover transition-transform 
                 duration-200 group-hover:scale-105"
    />
  </div>
  <CardContent className="p-4">
    <CategoryBadge category={category} />
    <h3 className="font-semibold text-lg mt-2 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-3">{excerpt}</p>
    <ArticleMeta author={author} publishedAt={publishedAt} viewCount={viewCount} />
  </CardContent>
</Card>
\`\`\`

### 버튼 컴포넌트

#### 버튼 변형
\`\`\`css
/* Primary Button */
.btn-primary {
  @apply bg-primary-500 hover:bg-primary-600 text-white 
         px-4 py-2 rounded-md font-medium 
         transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

/* Secondary Button */
.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-900 
         px-4 py-2 rounded-md font-medium 
         transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

/* Outline Button */
.btn-outline {
  @apply border border-primary-500 text-primary-500 
         hover:bg-primary-500 hover:text-white 
         px-4 py-2 rounded-md font-medium 
         transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
\`\`\`

### 배지 컴포넌트

#### 카테고리 배지
\`\`\`tsx
const getBadgeVariant = (category: string) => {
  const variants = {
    '현지 뉴스': 'bg-blue-500 text-white',
    '교민 업체': 'bg-green-500 text-white',
    '정책': 'bg-purple-500 text-white',
    '교통': 'bg-orange-500 text-white',
    '비자': 'bg-red-500 text-white',
    '경제': 'bg-indigo-500 text-white',
    '문화': 'bg-pink-500 text-white',
    '스포츠': 'bg-teal-500 text-white',
    '일반': 'bg-gray-500 text-white'
  }
  return variants[category] || variants['일반']
}
\`\`\`

#### 상태 배지
\`\`\`css
/* 프리미엄 배지 */
.badge-premium {
  @apply bg-premium-500 text-white px-2 py-1 text-xs font-medium rounded-full;
}

/* 프로모션 배지 */
.badge-promoted {
  @apply bg-primary-500 text-white px-2 py-1 text-xs font-medium rounded-full;
}

/* 속보 배지 */
.badge-breaking {
  @apply bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full
         animate-pulse;
}
\`\`\`

## 레이아웃 시스템

### 그리드 시스템
\`\`\`css
/* 메인 컨테이너 */
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* 카드 그리드 */
.card-grid {
  @apply grid gap-6 
         grid-cols-1 
         md:grid-cols-2 
         lg:grid-cols-3 
         xl:grid-cols-4;
}

/* 뉴스 그리드 */
.news-grid {
  @apply grid gap-6 
         grid-cols-1 
         md:grid-cols-2 
         lg:grid-cols-3;
}
\`\`\`

### 간격 시스템
\`\`\`css
/* 표준 간격 */
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
--spacing-3xl: 4rem;    /* 64px */
\`\`\`

### 섹션 레이아웃
\`\`\`tsx
// 섹션 구조
<section className="py-12 lg:py-16">
  <div className="container">
    <div className="text-center mb-12">
      <h2 className="text-h2 text-gray-900 mb-4">{title}</h2>
      <p className="text-body-large text-gray-600 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
    <div className="card-grid">
      {content}
    </div>
  </div>
</section>
\`\`\`

## 반응형 디자인

### 브레이크포인트
\`\`\`css
/* Tailwind CSS 기본 브레이크포인트 */
sm: 640px;   /* 모바일 가로 */
md: 768px;   /* 태블릿 */
lg: 1024px;  /* 데스크톱 */
xl: 1280px;  /* 대형 데스크톱 */
2xl: 1536px; /* 초대형 화면 */
\`\`\`

### 모바일 우선 접근법
- 기본 스타일은 모바일부터 시작
- 점진적으로 큰 화면에 대한 스타일 추가
- 터치 친화적인 인터페이스 요소 크기

### 반응형 패턴
\`\`\`css
/* 반응형 텍스트 크기 */
.responsive-title {
  @apply text-2xl sm:text-3xl lg:text-4xl;
}

/* 반응형 그리드 */
.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

/* 반응형 간격 */
.responsive-spacing {
  @apply p-4 md:p-6 lg:p-8;
}
\`\`\`

## UI/UX 패턴

### 인터랙션 패턴

#### 호버 효과
\`\`\`css
/* 카드 호버 */
.card-hover {
  @apply transition-all duration-200 
         hover:shadow-lg hover:-translate-y-1;
}

/* 버튼 호버 */
.button-hover {
  @apply transition-colors duration-200 
         hover:bg-opacity-90;
}

/* 링크 호버 */
.link-hover {
  @apply transition-colors duration-200 
         hover:text-primary-600;
}
\`\`\`

#### 포커스 상태
\`\`\`css
/* 포커스 링 */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

/* 입력 필드 포커스 */
.input-focus {
  @apply focus:border-primary-500 focus:ring-1 focus:ring-primary-500;
}
\`\`\`

### 로딩 상태

#### 스켈레톤 로더
\`\`\`css
.skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}

.skeleton-text {
  @apply h-4 bg-gray-200 rounded animate-pulse;
}

.skeleton-avatar {
  @apply w-10 h-10 bg-gray-200 rounded-full animate-pulse;
}
\`\`\`

#### 스피너
\`\`\`css
.spinner {
  @apply animate-spin rounded-full border-2 border-gray-200 border-t-primary-500;
}
\`\`\`

### 피드백 패턴

#### 토스트 알림
\`\`\`tsx
const ToastPattern = {
  success: "bg-green-50 text-green-800 border-green-200",
  error: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  info: "bg-blue-50 text-blue-800 border-blue-200"
}
\`\`\`

#### 빈 상태
\`\`\`tsx
<div className="text-center py-12">
  <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
    <EmptyStateIcon />
  </div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    {emptyTitle}
  </h3>
  <p className="text-gray-500 mb-6">
    {emptyDescription}
  </p>
  <Button onClick={onAction}>
    {actionText}
  </Button>
</div>
\`\`\`

## 접근성 가이드라인

### 키보드 네비게이션
- 모든 인터랙티브 요소는 키보드로 접근 가능
- Tab 순서가 논리적이고 직관적
- Skip links 제공으로 메인 콘텐츠로 빠른 이동

### 스크린 리더 지원
\`\`\`tsx
// 올바른 ARIA 라벨 사용
<button aria-label="메뉴 열기" aria-expanded={isOpen}>
  <MenuIcon />
</button>

// 의미있는 제목 구조
<h1>페이지 제목</h1>
<h2>섹션 제목</h2>
<h3>서브섹션 제목</h3>

// 이미지 대체 텍스트
<img src={imageUrl || "/placeholder.svg"} alt="비즈니스 로고 - 태국 한식당" />
\`\`\`

### 색상 대비
- WCAG AA 기준 4.5:1 이상의 대비율 유지
- 색상만으로 정보를 전달하지 않음
- 색맹 사용자를 고려한 색상 조합

### 터치 타겟
- 최소 44x44px 크기의 터치 영역
- 터치 요소 간 충분한 간격 유지
- 모바일에서 엄지손가락으로 쉽게 접근 가능한 위치

## 다국어 지원

### 한국어 최적화
\`\`\`css
/* 한국어 텍스트 최적화 */
.korean-text {
  font-family: 'Pretendard Variable', 'Pretendard', 'Noto Sans KR', sans-serif;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
}
\`\`\`

### 태국어 지원
\`\`\`css
/* 태국어 텍스트 최적화 */
.thai-text {
  font-family: 'Noto Sans Thai', 'Sarabun', system-ui, sans-serif;
  line-height: 1.8; /* 태국 문자의 높이를 고려한 추가 여백 */
}
\`\`\`

### RTL 언어 준비
\`\`\`css
/* RTL 지원 준비 */
.rtl-support {
  direction: ltr;
}

[dir="rtl"] .rtl-support {
  direction: rtl;
}
\`\`\`

## 성능 최적화

### CSS 최적화
- Critical CSS 인라인 배치
- 사용하지 않는 스타일 제거
- CSS-in-JS 최소화

### 이미지 최적화
\`\`\`tsx
// Next.js Image 컴포넌트 활용
<Image
  src={imageUrl || "/placeholder.svg"}
  alt={altText}
  width={400}
  height={300}
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  loading="lazy"
/>
\`\`\`

### 폰트 최적화
\`\`\`css
/* 폰트 로딩 최적화 */
@font-face {
  font-family: 'Pretendard Variable';
  src: url('/fonts/pretendard-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
\`\`\`

## 컴포넌트 라이브러리 활용

### shadcn/ui 컴포넌트 커스터마이징
\`\`\`tsx
// 기본 Button 컴포넌트 확장
const ButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-premium-400 to-premium-600 text-white hover:from-premium-500 hover:to-premium-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
\`\`\`

## 개발 가이드라인

### CSS 클래스 명명 규칙
\`\`\`css
/* BEM 방법론 기반 */
.card {} /* Block */
.card__header {} /* Element */
.card--premium {} /* Modifier */

/* Tailwind 유틸리티 클래스 우선 사용 */
.btn-primary {
  @apply bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md;
}
\`\`\`

### 컴포넌트 구조
\`\`\`tsx
// 표준 컴포넌트 구조
interface ComponentProps {
  variant?: 'default' | 'premium' | 'promoted'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          componentVariants({ variant, size }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Component.displayName = "Component"
\`\`\`

### 상태 관리 패턴
\`\`\`tsx
// 로컬 상태 관리
const [isLoading, setIsLoading] = useState(false)
const [data, setData] = useState<T[]>([])
const [error, setError] = useState<string | null>(null)

// 서버 상태 관리 (React Query 권장)
const { data, isLoading, error } = useQuery({
  queryKey: ['business-cards'],
  queryFn: getBusinessCards,
  staleTime: 5 * 60 * 1000, // 5분
})
\`\`\`

## 메트릭스 및 KPI

### 성능 메트릭스
- **FCP (First Contentful Paint)**: < 1.5초
- **LCP (Largest Contentful Paint)**: < 2.5초
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms

### 사용자 경험 메트릭스
- **페이지 로딩 시간**: < 3초
- **검색 응답 시간**: < 500ms
- **이미지 로딩 시간**: < 2초
- **모바일 사용성 점수**: > 95점

### 접근성 메트릭스
- **Lighthouse 접근성 점수**: > 95점
- **WCAG 2.1 AA 준수율**: 100%
- **키보드 네비게이션 가능 요소**: 100%

## 버전 관리 및 업데이트

### 디자인 시스템 버전
- **Major**: 기본 색상, 타이포그래피, 레이아웃 변경
- **Minor**: 새로운 컴포넌트, 변형 추가
- **Patch**: 버그 수정, 미세 조정

### 업데이트 프로세스
1. 디자인 가이드라인 문서 업데이트
2. 컴포넌트 라이브러리 반영
3. 기존 페이지 호환성 확인
4. 테스트 및 검증
5. 배포 및 문서화

---

이 디자인 가이드라인은 태국 정보카드 플랫폼의 일관되고 사용자 친화적인 경험을 위한 기준을 제시합니다. 모든 개발자와 디자이너는 이 가이드라인을 참조하여 작업해주시기 바랍니다.

**마지막 업데이트**: 2024년 1월
**버전**: 1.0.0
**담당자**: v0 Development Team
