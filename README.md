# 🇹🇭 태국 한인 비즈니스 정보 플랫폼

태국 거주 한인들을 위한 종합 비즈니스 정보 카드 플랫폼입니다. 음식점, 마사지, 배송, 법률 서비스 등 다양한 한인 비즈니스 정보를 한 곳에서 확인할 수 있습니다.

## ✨ 주요 기능

### 👥 사용자 기능
- **비즈니스 카드 검색** - 카테고리별, 태그별 필터링
- **상세 정보 보기** - 연락처, 위치, 서비스 내용 확인
- **프리미엄 업체 표시** - 우선 노출 및 특별 배지
- **반응형 디자인** - 모바일, 태블릿, 데스크톱 최적화
- **빠른 연락** - 전화, 카카오톡, 라인 등 직접 연결

### 🔧 관리자 기능
- **비즈니스 카드 관리** - 추가, 수정, 삭제
- **카테고리 관리** - 업종별 분류 관리
- **태그 관리** - 검색 키워드 관리
- **프리미엄 관리** - 유료 광고 업체 관리
- **통계 및 분석** - 조회수, 클릭수 추적
- **이미지 업로드** - 비즈니스 로고 및 이미지 관리

## 🛠 기술 스택

### Frontend
- **Next.js 14** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### Backend & Database
- **Supabase** - PostgreSQL 데이터베이스 및 인증
- **Server Actions** - Next.js 서버 사이드 로직
- **Row Level Security** - 데이터베이스 보안

### 광고 & 수익화
- **Google AdSense** - 디스플레이 광고
- **네이티브 광고** - 콘텐츠 통합 광고
- **프리미엄 배치** - 유료 업체 우선 노출

### 배포 & 호스팅
- **Vercel** - 프론트엔드 배포
- **Vercel Blob** - 이미지 스토리지
- **환경 변수** - 보안 설정 관리

## 🚀 설치 및 실행

### 1. 저장소 클론
\`\`\`bash
git clone https://github.com/your-username/thai-business-cards.git
cd thai-business-cards
\`\`\`

### 2. 의존성 설치
\`\`\`bash
npm install
# 또는
yarn install
\`\`\`

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

\`\`\`env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 관리자 인증
ADMIN_PASSWORD=your_secure_admin_password

# Google AdSense (선택사항)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=your_adsense_client_id

# Vercel Blob (이미지 업로드용)
BLOB_READ_WRITE_TOKEN=your_blob_token
\`\`\`

### 4. 데이터베이스 설정
Supabase SQL Editor에서 다음 스크립트들을 순서대로 실행하세요:

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

-- 7. 관리자 정책 생성
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
\`\`\`

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

## 🔐 관리자 접근

### 기본 관리자 페이지
- **URL**: `/admin`
- **인증**: 비밀번호만 입력
- **기능**: 기본적인 CRUD 작업

### 고급 관리자 페이지
- **URL**: `/dashboard-mgmt-2024`
- **인증**: 강화된 보안 인증
- **기능**: 고급 관리 및 통계

### 로그인 프로세스
1. 관리자 페이지 접속
2. 관리자 비밀번호 입력
3. 2시간 세션 유지
4. 5회 실패 시 5분 대기

## 📊 데이터베이스 구조

### 주요 테이블

#### `business_cards`
- `id` - 고유 식별자
- `title` - 비즈니스 이름
- `description` - 설명
- `category_id` - 카테고리 참조
- `contact_info` - 연락처 정보 (JSON)
- `is_premium` - 프리미엄 여부
- `is_promoted` - 추천 여부
- `view_count` - 조회수
- `created_at` - 생성일시

#### `categories`
- `id` - 카테고리 ID
- `name` - 카테고리 이름
- `icon` - 아이콘 이름
- `color` - 테마 색상

#### `tags`
- `id` - 태그 ID
- `name` - 태그 이름
- `category_id` - 카테고리 참조

#### `business_card_tags`
- 비즈니스 카드와 태그의 다대다 관계

## 💰 광고 시스템

### Google AdSense 통합
- **배너 광고** - 페이지 상단
- **인피드 광고** - 카드 목록 사이
- **네이티브 광고** - 콘텐츠 통합형

### 프리미엄 배치
- **우선 노출** - 검색 결과 상단
- **특별 배지** - "프리미엄" 표시
- **강조 스타일** - 시각적 차별화

## 🔒 보안 기능

### 인증 시스템
- **세션 기반 인증** - 2시간 자동 만료
- **시도 제한** - 5회 실패 시 대기
- **쿠키 보안** - HttpOnly, Secure 설정

### 데이터 보안
- **Row Level Security** - Supabase RLS 정책
- **환경 변수** - 민감 정보 보호
- **API 보안** - 서버 사이드 검증

## 🚀 배포 가이드

### Vercel 배포
1. **GitHub 연결**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Vercel 프로젝트 생성**
   - Vercel 대시보드에서 새 프로젝트 생성
   - GitHub 저장소 연결

3. **환경 변수 설정**
   - Vercel 대시보드에서 Environment Variables 설정
   - 모든 `.env.local` 변수들을 추가

4. **도메인 설정**
   - 커스텀 도메인 연결 (선택사항)
   - SSL 인증서 자동 설정

### 배포 후 확인사항
- [ ] 데이터베이스 연결 확인
- [ ] 관리자 로그인 테스트
- [ ] 이미지 업로드 테스트
- [ ] 광고 표시 확인
- [ ] 모바일 반응형 확인

## ⚡ 성능 최적화

### 이미지 최적화
- **Next.js Image** - 자동 최적화 및 지연 로딩
- **Vercel Blob** - CDN을 통한 빠른 이미지 제공
- **WebP 변환** - 자동 포맷 최적화

### 코드 최적화
- **Tree Shaking** - 불필요한 코드 제거
- **Code Splitting** - 페이지별 코드 분할
- **Static Generation** - 정적 페이지 생성

### 데이터베이스 최적화
- **인덱싱** - 검색 성능 향상
- **쿼리 최적화** - 효율적인 데이터 조회
- **캐싱** - 자주 사용되는 데이터 캐시

## 🤝 기여하기

1. **Fork** 저장소를 포크하세요
2. **Branch** 새로운 기능 브랜치를 생성하세요
3. **Commit** 변경사항을 커밋하세요
4. **Push** 브랜치에 푸시하세요
5. **Pull Request** PR을 생성하세요

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원 및 문의

- **이슈 리포트**: GitHub Issues
- **기능 요청**: GitHub Discussions
- **이메일**: your-email@example.com

## 🔄 업데이트 로그

### v1.0.0 (2024-01-27)
- 초기 릴리스
- 기본 CRUD 기능
- 관리자 인증 시스템
- Google AdSense 통합
- CardTypes.txt 데이터 통합

---

**🇹🇭 태국에서 한인 비즈니스를 쉽게 찾아보세요!**
