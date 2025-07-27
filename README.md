# 🇹🇭 태국 한인 비즈니스 정보 플랫폼

태국 거주 한인들을 위한 종합 비즈니스 정보 카드 플랫폼입니다. 음식점, 서비스업, 전문직 등 다양한 한인 비즈니스 정보를 한눈에 확인할 수 있습니다.

## ✨ 주요 기능

### 👥 사용자 기능
- **비즈니스 카드 검색** - 카테고리별, 태그별 필터링
- **상세 정보 보기** - 연락처, 위치, 서비스 내용 확인
- **지도 연동** - Google Maps 링크로 위치 확인
- **반응형 디자인** - 모바일/데스크톱 최적화
- **실시간 검색** - 키워드 기반 즉시 검색

### 🔧 관리자 기능
- **비즈니스 카드 관리** - 추가, 수정, 삭제
- **카테고리 관리** - 업종별 분류 관리
- **태그 시스템** - 다중 태그 지원
- **프리미엄 관리** - 프리미엄 업체 설정
- **노출 통계** - 조회수 및 클릭 추적
- **이미지 업로드** - 비즈니스 로고/사진 관리

### 💰 광고 시스템
- **Google AdSense 통합** - 자동 광고 배치
- **네이티브 광고** - 콘텐츠와 자연스럽게 통합
- **인피드 광고** - 카드 리스트 사이 광고 삽입
- **반응형 광고** - 디바이스별 최적화

## 🛠 기술 스택

### Frontend
- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### Backend
- **Supabase** - PostgreSQL 데이터베이스
- **Next.js API Routes** - 서버리스 API
- **Server Actions** - 서버 사이드 로직

### 배포 & 인프라
- **Vercel** - 호스팅 플랫폼
- **Vercel Blob** - 이미지 스토리지
- **Google AdSense** - 광고 수익화

## 🚀 설치 및 실행

### 1. 저장소 클론
\`\`\`bash
git clone https://github.com/your-username/thai-korean-business-platform.git
cd thai-korean-business-platform
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
# 또는
yarn install
# 또는
pnpm install
\`\`\`

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

\`\`\`env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 관리자 인증
ADMIN_PASSWORD=your-secure-admin-password-2024

# Google AdSense (선택사항)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx

# Vercel Blob (이미지 업로드용)
BLOB_READ_WRITE_TOKEN=your_blob_token
\`\`\`

### 4. 데이터베이스 설정
Supabase 프로젝트를 생성하고 다음 SQL 스크립트들을 순서대로 실행하세요:

\`\`\`sql
-- 1. 기본 테이블 생성
\i scripts/00-create-tables.sql

-- 2. 카테고리 데이터 삽입
\i scripts/01-insert-categories.sql

-- 3. 태그 데이터 삽입
\i scripts/02-insert-tags.sql

-- 4. 프리미엄 필드 추가
\i scripts/03-add-premium-fields.sql

-- 5. 함수 생성
\i scripts/04-create-functions.sql

-- 6. 샘플 데이터 삽입
\i scripts/05-insert-sample-data.sql

-- 7. 관리자 정책 설정
\i scripts/06-create-admin-policies.sql

-- 8. CardTypes 데이터 삽입
\i scripts/08-insert-cardtypes-data.sql

-- 9. 설정 검증
\i scripts/07-verify-setup.sql
\`\`\`

### 5. 개발 서버 실행
\`\`\`bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🔐 관리자 접근

### 기본 관리자 페이지
- **URL**: `/admin`
- **인증**: 비밀번호만 입력
- **기능**: 기본적인 비즈니스 카드 관리

### 고급 관리자 페이지
- **URL**: `/dashboard-mgmt-2024`
- **인증**: 강화된 보안 인증
- **기능**: 고급 관리 기능 및 통계

### 관리자 로그인 방법
1. 관리자 페이지 접속
2. 환경변수에 설정된 관리자 비밀번호 입력
3. 로그인 후 2시간 세션 유지
4. 로그아웃 버튼으로 세션 종료

## 📊 데이터베이스 구조

### 주요 테이블

#### `business_cards`
- `id` - 고유 식별자
- `title` - 비즈니스 이름
- `description` - 설명
- `category_id` - 카테고리 참조
- `contact_info` - 연락처 정보
- `website` - 웹사이트 URL
- `map_url` - 지도 URL
- `image_url` - 이미지 URL
- `is_premium` - 프리미엄 여부
- `exposure_count` - 노출 횟수
- `click_count` - 클릭 횟수

#### `categories`
- `id` - 카테고리 ID
- `name` - 카테고리 이름
- `description` - 설명

#### `tags`
- `id` - 태그 ID
- `name` - 태그 이름

#### `business_card_tags`
- 비즈니스 카드와 태그의 다대다 관계

## 🎯 광고 시스템

### Google AdSense 설정
1. Google AdSense 계정 생성
2. 사이트 승인 받기
3. 광고 단위 생성
4. 환경변수에 클라이언트 ID 설정

### 광고 배치
- **상단 배너**: 페이지 최상단
- **인피드 광고**: 카드 리스트 사이
- **네이티브 광고**: 콘텐츠와 자연스럽게 통합

## 🔒 보안 기능

### 관리자 인증
- 비밀번호 기반 인증
- 세션 기반 상태 관리
- 자동 세션 만료 (2시간)
- 로그인 시도 제한 (5회)

### 데이터 보안
- Supabase RLS (Row Level Security)
- 환경변수를 통한 민감 정보 관리
- HTTPS 강제 적용 (프로덕션)

## 📱 반응형 디자인

### 지원 디바이스
- **모바일**: 320px ~ 768px
- **태블릿**: 768px ~ 1024px
- **데스크톱**: 1024px 이상

### 최적화 기능
- 터치 친화적 UI
- 빠른 로딩 속도
- 오프라인 지원 (PWA 준비)

## 🚀 배포

### Vercel 배포
1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경변수 설정
4. 자동 배포 설정

\`\`\`bash
# Vercel CLI 사용
npm i -g vercel
vercel --prod
\`\`\`

### 환경변수 설정 (Vercel)
Vercel 대시보드에서 다음 환경변수들을 설정하세요:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `BLOB_READ_WRITE_TOKEN`

## ⚡ 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 형식 자동 변환
- 지연 로딩 (Lazy Loading)

### 코드 분할
- 동적 임포트 사용
- 페이지별 코드 분할
- 컴포넌트 레벨 분할

### 캐싱 전략
- Vercel Edge Network
- 브라우저 캐싱
- API 응답 캐싱

## 🧪 테스트

### 개발 환경 테스트
\`\`\`bash
# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 빌드 테스트
npm run build
\`\`\`

## 📈 모니터링

### 성능 모니터링
- Vercel Analytics
- Core Web Vitals 추적
- 사용자 행동 분석

### 오류 추적
- Next.js 내장 오류 처리
- 프로덕션 오류 로깅
- 사용자 피드백 수집

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면:
- GitHub Issues 생성
- 이메일: support@example.com
- 문서: [배포 가이드](./DEPLOYMENT_GUIDE.md)

## 🔄 업데이트 로그

### v1.0.0 (2024-01-27)
- 초기 릴리즈
- 기본 비즈니스 카드 시스템
- 관리자 인터페이스
- Google AdSense 통합
- CardTypes.txt 데이터 임포트

---

**🇹🇭 태국 한인 커뮤니티를 위한 디지털 플랫폼**

*Made with ❤️ for Korean community in Thailand*
