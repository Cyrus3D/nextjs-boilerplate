# 태국 한인 비즈니스 정보 카드 (Thainfo)

태국 거주 한인들을 위한 종합 비즈니스 정보 플랫폼입니다. 음식점, 서비스업, 전문직 등 다양한 한인 비즈니스 정보를 카드 형태로 제공합니다.

## 🌟 주요 기능

### 📱 사용자 기능
- **비즈니스 카드 목록**: 카테고리별 한인 비즈니스 정보 제공
- **상세 정보 모달**: 연락처, 위치, 서비스 내용 등 상세 정보
- **카테고리 필터링**: 음식점, 서비스, 전문직 등 카테고리별 분류
- **태그 시스템**: 세부 서비스별 태그 검색
- **프리미엄 배지**: 프리미엄 비즈니스 하이라이트
- **반응형 디자인**: 모바일/데스크톱 최적화
- **Google 광고 통합**: 네이티브 광고 및 배너 광고

### 🛡️ 관리자 기능
- **보안 인증 시스템**: 2단계 인증 및 세션 관리
- **비즈니스 카드 관리**: CRUD 작업 (생성, 읽기, 수정, 삭제)
- **이미지 업로드**: 비즈니스 로고 및 이미지 관리
- **카테고리 관리**: 카테고리 및 태그 관리
- **프리미엄 관리**: 프리미엄 상태 및 노출 순서 관리
- **통계 및 분석**: 노출 횟수 및 클릭 통계
- **일괄 작업**: 여러 카드 동시 수정/삭제

## 🚀 기술 스택

### Frontend
- **Next.js 15**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **shadcn/ui**: 모던 UI 컴포넌트 라이브러리
- **Lucide React**: 아이콘 라이브러리

### Backend & Database
- **Supabase**: PostgreSQL 데이터베이스 및 인증
- **Server Actions**: Next.js 서버 사이드 로직
- **Row Level Security (RLS)**: 데이터베이스 보안

### 광고 & 분석
- **Google AdSense**: 광고 수익화
- **Google Analytics**: 사용자 분석
- **네이티브 광고**: 콘텐츠 통합형 광고

## 📦 설치 및 실행

### 1. 프로젝트 클론
\`\`\`bash
git clone <repository-url>
cd thainfo
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
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
ADMIN_SECRET_KEY=your_secret_key

# Google 광고 (선택사항)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
\`\`\`

### 4. 데이터베이스 설정
Supabase SQL Editor에서 다음 스크립트들을 순서대로 실행하세요:

\`\`\`sql
-- 기본 테이블 생성
\i scripts/00-create-tables.sql

-- 카테고리 데이터 삽입
\i scripts/01-insert-categories.sql

-- 태그 데이터 삽입
\i scripts/02-insert-tags.sql

-- 프리미엄 필드 추가
\i scripts/03-add-premium-fields.sql

-- 함수 생성
\i scripts/04-create-functions.sql

-- 샘플 데이터 삽입
\i scripts/05-insert-sample-data.sql

-- 관리자 정책 생성
\i scripts/06-create-admin-policies.sql

-- 설정 검증
\i scripts/07-verify-setup.sql

-- CardTypes 데이터 가져오기
\i scripts/08-insert-cardtypes-data.sql
\i scripts/09-insert-cardtypes-tags.sql
\i scripts/10-link-cardtypes-tags.sql
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

### 관리자 로그인
1. `/admin` 경로로 접속
2. 설정한 관리자 계정으로 로그인
3. 2단계 인증 완료

### 보안 관리자 페이지
- **URL**: `/dashboard-mgmt-2024`
- **기능**: 고급 보안 기능이 적용된 관리자 인터페이스
- **접근**: 관리자 로그인 후 자동 리다이렉트

### 주요 관리 기능
- **카드 관리**: 비즈니스 카드 추가/수정/삭제
- **이미지 업로드**: 로고 및 이미지 파일 관리
- **카테고리 관리**: 새 카테고리 및 태그 추가
- **프리미엄 설정**: 프리미엄 상태 및 노출 순서 관리
- **통계 확인**: 노출 및 클릭 데이터 분석

## 📊 데이터베이스 구조

### 주요 테이블
- **business_cards**: 비즈니스 카드 정보
- **categories**: 카테고리 정보
- **tags**: 태그 정보
- **business_card_tags**: 카드-태그 연결 테이블

### 주요 필드
\`\`\`sql
business_cards:
- id: UUID (Primary Key)
- title: 비즈니스 이름
- description: 설명
- contact_info: 연락처 정보
- category_id: 카테고리 ID
- image_url: 이미지 URL
- map_url: 지도 URL
- is_premium: 프리미엄 여부
- premium_order: 프리미엄 정렬 순서
- exposure_count: 노출 횟수
- created_at: 생성일시
- updated_at: 수정일시
\`\`\`

## 🎯 광고 시스템

### Google AdSense 통합
- **배너 광고**: 페이지 상단 및 하단
- **네이티브 광고**: 카드 목록 사이 자연스러운 배치
- **인피드 광고**: 콘텐츠 흐름에 맞는 광고

### 광고 최적화
- **지연 로딩**: 성능 최적화를 위한 광고 지연 로딩
- **반응형 광고**: 다양한 화면 크기 대응
- **네이티브 스타일**: 콘텐츠와 자연스러운 통합

## 🔒 보안 기능

### 인증 및 권한
- **2단계 인증**: 관리자 로그인 보안 강화
- **세션 관리**: 안전한 세션 처리
- **CSRF 보호**: 크로스 사이트 요청 위조 방지

### 데이터베이스 보안
- **Row Level Security (RLS)**: 데이터 접근 제어
- **SQL Injection 방지**: 매개변수화된 쿼리
- **입력 검증**: 모든 사용자 입력 검증

## 📱 반응형 디자인

### 모바일 최적화
- **터치 친화적 UI**: 모바일 사용자 경험 최적화
- **빠른 로딩**: 이미지 최적화 및 지연 로딩
- **오프라인 지원**: PWA 기능 (선택사항)

### 다양한 화면 크기 지원
- **모바일**: 320px ~ 768px
- **태블릿**: 768px ~ 1024px
- **데스크톱**: 1024px 이상

## 🚀 배포

### Vercel 배포 (권장)
1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포 완료

### 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수들을 설정하세요:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SECRET_KEY`

## 📈 성능 최적화

### 이미지 최적화
- **Next.js Image**: 자동 이미지 최적화
- **WebP 변환**: 최신 이미지 포맷 지원
- **지연 로딩**: 필요시에만 이미지 로드

### 코드 최적화
- **Tree Shaking**: 불필요한 코드 제거
- **Code Splitting**: 페이지별 코드 분할
- **Static Generation**: 정적 페이지 생성

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원 및 문의

- **이슈 리포트**: GitHub Issues 사용
- **기능 요청**: GitHub Discussions 사용
- **보안 문제**: 비공개로 연락

## 🔄 업데이트 로그

### v1.0.0 (2024-01-27)
- ✅ 기본 비즈니스 카드 시스템 구현
- ✅ 관리자 인터페이스 구현
- ✅ Google 광고 통합
- ✅ 보안 시스템 구현
- ✅ CardTypes.txt 데이터 가져오기
- ✅ 프리미엄 기능 구현
- ✅ 반응형 디자인 완성

---

**🇹🇭 태국 한인 커뮤니티를 위한 비즈니스 정보 플랫폼**

Made with ❤️ for the Korean community in Thailand
