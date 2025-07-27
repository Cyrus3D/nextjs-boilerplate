# 🚀 Vercel 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 필수 준비사항
- [ ] GitHub 계정 및 저장소 생성
- [ ] Vercel 계정 생성
- [ ] Supabase 프로젝트 생성
- [ ] 환경변수 준비

## 🔧 1단계: GitHub 저장소 준비

### 1.1 로컬 Git 초기화
\`\`\`bash
git init
git add .
git commit -m "Initial commit: Thai-Korean Business Directory"
\`\`\`

### 1.2 GitHub 저장소 생성
1. GitHub.com 접속
2. "New repository" 클릭
3. 저장소 이름: `thai-korean-business-directory`
4. Public/Private 선택
5. "Create repository" 클릭

### 1.3 원격 저장소 연결
\`\`\`bash
git remote add origin https://github.com/YOUR_USERNAME/thai-korean-business-directory.git
git branch -M main
git push -u origin main
\`\`\`

## 🚀 2단계: Vercel 배포

### 2.1 Vercel 계정 생성
1. https://vercel.com 접속
2. "Sign Up" → GitHub 계정으로 로그인
3. GitHub 연동 승인

### 2.2 프로젝트 Import
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 목록에서 `thai-korean-business-directory` 선택
3. "Import" 클릭

### 2.3 프로젝트 설정
- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `.` (기본값)
- **Build Command**: `npm run build` (자동 설정)
- **Output Directory**: `.next` (자동 설정)

## 🔐 3단계: 환경변수 설정

### 3.1 Vercel 환경변수 추가
**Settings → Environment Variables**에서 다음 변수들을 추가:

#### 필수 환경변수
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ADMIN_PASSWORD=your-secure-admin-password
\`\`\`

#### 선택적 환경변수
\`\`\`
OPENAI_API_KEY=sk-your-openai-api-key
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-your-adsense-id
NEXT_PUBLIC_ADSENSE_BANNER_SLOT=your-banner-slot-id
NEXT_PUBLIC_ADSENSE_NATIVE_SLOT=your-native-slot-id
NEXT_PUBLIC_ADSENSE_INFEED_SLOT=your-infeed-slot-id
\`\`\`

### 3.2 환경변수 적용 범위
모든 환경변수를 다음 환경에 적용:
- ✅ Production
- ✅ Preview  
- ✅ Development

## 🗄️ 4단계: Supabase 데이터베이스 설정

### 4.1 Supabase 프로젝트 생성
1. https://supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 이름: `thai-korean-directory`
4. 데이터베이스 비밀번호 설정
5. 지역 선택: `Southeast Asia (Singapore)`

### 4.2 API 키 확인
**Settings → API**에서 확인:
- **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 사용
- **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 사용

### 4.3 데이터베이스 스키마 생성
Supabase SQL Editor에서 다음 순서로 실행:

1. `scripts/00-create-tables.sql`
2. `scripts/01-insert-categories.sql`
3. `scripts/02-insert-tags.sql`
4. `scripts/03-add-premium-fields.sql`
5. `scripts/04-create-functions.sql`
6. `scripts/05-insert-sample-data.sql`
7. `scripts/06-create-admin-policies.sql`
8. `scripts/07-verify-setup.sql`

## 🚀 5단계: 배포 실행

### 5.1 자동 배포
1. Vercel에서 "Deploy" 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 대기 (약 2-3분)

### 5.2 배포 URL 확인
- **Production URL**: `https://your-project-name.vercel.app`
- **Custom Domain** 설정 가능

## ✅ 6단계: 배포 후 확인

### 6.1 기능 테스트
- [ ] 메인 페이지 로딩
- [ ] 비즈니스 카드 표시
- [ ] 카테고리 필터링
- [ ] 검색 기능
- [ ] 상세 모달 열기
- [ ] 관리자 페이지 접근 (`/dashboard-mgmt-2024`)

### 6.2 성능 확인
- [ ] 페이지 로딩 속도
- [ ] 모바일 반응형
- [ ] SEO 메타태그
- [ ] 이미지 최적화

## 🔧 7단계: 도메인 연결 (선택사항)

### 7.1 커스텀 도메인 추가
1. Vercel 프로젝트 → Settings → Domains
2. 도메인 입력 (예: `thai-korean-directory.com`)
3. DNS 설정 안내 따라하기

### 7.2 SSL 인증서
- Vercel에서 자동으로 Let's Encrypt SSL 인증서 발급
- HTTPS 자동 리다이렉트 설정

## 🚨 문제 해결

### 빌드 에러 발생 시
1. **Vercel 빌드 로그** 확인
2. **환경변수** 재확인
3. **Supabase 연결** 상태 점검
4. **TypeScript 에러**: `next.config.mjs`에서 무시 설정 확인

### 데이터베이스 연결 실패 시
1. Supabase URL과 API 키 재확인
2. RLS (Row Level Security) 정책 확인
3. 네트워크 연결 상태 확인

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- Vercel 빌드 로그
- 브라우저 개발자 도구 콘솔
- Supabase 대시보드 로그

---

**🎉 축하합니다! 태국-한국 비즈니스 디렉토리가 성공적으로 배포되었습니다!**
\`\`\`

```plaintext file="README.md"
# 🇹🇭🇰🇷 Thai-Korean Business Directory

태국 거주 한국인을 위한 비즈니스 카드 디렉토리 서비스

## ✨ 주요 기능

- 📱 **반응형 디자인**: 모바일 최적화
- 🔍 **스마트 검색**: 카테고리별, 키워드 검색
- 🏷️ **태그 시스템**: 다중 태그 필터링
- 👑 **프리미엄 기능**: 상단 노출, 특별 배지
- 🛡️ **보안 관리**: 암호화된 관리자 인터페이스
- 📊 **광고 시스템**: Google AdSense 통합

## 🚀 빠른 시작

### 로컬 개발 환경 설정

\`\`\`bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/thai-korean-business-directory.git
cd thai-korean-business-directory

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 실제 값으로 변경

# 개발 서버 실행
npm run dev
\`\`\`

### 환경변수 설정

`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

\`\`\`env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 관리자 비밀번호
ADMIN_PASSWORD=your_secure_password

# OpenAI API (선택사항)
OPENAI_API_KEY=your_openai_api_key

# Google AdSense (선택사항)
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=your_adsense_client_id
\`\`\`

## 🗄️ 데이터베이스 설정

Supabase에서 다음 SQL 스크립트들을 순서대로 실행하세요:

1. `scripts/00-create-tables.sql` - 기본 테이블 생성
2. `scripts/01-insert-categories.sql` - 카테고리 데이터
3. `scripts/02-insert-tags.sql` - 태그 데이터
4. `scripts/03-add-premium-fields.sql` - 프리미엄 필드
5. `scripts/04-create-functions.sql` - 데이터베이스 함수
6. `scripts/05-insert-sample-data.sql` - 샘플 데이터
7. `scripts/06-create-admin-policies.sql` - 보안 정책
8. `scripts/07-verify-setup.sql` - 설정 검증

## 📦 배포

### Vercel 배포

1. **GitHub에 코드 푸시**
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

2. **Vercel에서 프로젝트 Import**
   - https://vercel.com 접속
   - GitHub 저장소 연결
   - 환경변수 설정

3. **환경변수 설정**
   - Vercel 대시보드에서 Environment Variables 설정
   - 모든 필수 환경변수 추가

자세한 배포 가이드는 `DEPLOYMENT_GUIDE.md`를 참조하세요.

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom Admin Auth
- **Deployment**: Vercel
- **AI**: OpenAI GPT (관리자 기능)

## 📁 프로젝트 구조

\`\`\`
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── dashboard-mgmt-2024/ # 관리자 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── business-card.tsx # 비즈니스 카드
│   └── admin-interface.tsx # 관리자 인터페이스
├── lib/                  # 유틸리티 함수
│   ├── supabase.ts      # Supabase 클라이언트
│   └── utils.ts         # 공통 유틸리티
├── scripts/             # 데이터베이스 스크립트
└── types/              # TypeScript 타입 정의
\`\`\`

## 🔐 관리자 기능

관리자 페이지 접근: `/dashboard-mgmt-2024`

### 주요 관리 기능
- 📝 비즈니스 카드 추가/편집/삭제
- 🏷️ 카테고리 및 태그 관리
- 👑 프리미엄 설정 및 노출 관리
- 📊 통계 및 분석
- 🔒 보안 설정

## 🎯 주요 컴포넌트

### BusinessCard
- 비즈니스 정보 표시
- 프리미엄 배지 시스템
- 클릭 시 상세 모달

### AdminInterface
- 보안 로그인 시스템
- CRUD 작업 인터페이스
- 이미지 업로드 기능

### SearchAndFilter
- 실시간 검색
- 카테고리 필터링
- 태그 기반 필터링

## 🚨 보안 고려사항

- 관리자 페이지 비밀번호 보호
- XSS 방지 헤더 설정
- CSRF 토큰 검증
- 입력 데이터 검증 및 살균

## 📈 성능 최적화

- Next.js Image 최적화
- 컴포넌트 지연 로딩
- 데이터베이스 쿼리 최적화
- CDN을 통한 정적 자산 배포

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**🎉 태국에서의 성공적인 비즈니스를 응원합니다!**
\`\`\`

```plaintext file=".env.example"
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 관리자 비밀번호 (강력한 비밀번호로 변경하세요)
ADMIN_PASSWORD=your-secure-admin-password

# OpenAI API 키 (선택사항 - AI 기능 사용 시)
OPENAI_API_KEY=sk-your-openai-api-key

# Google AdSense 설정 (선택사항 - 승인 후 설정)
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-your-adsense-id
NEXT_PUBLIC_ADSENSE_BANNER_SLOT=your-banner-slot-id
NEXT_PUBLIC_ADSENSE_NATIVE_SLOT=your-native-slot-id
NEXT_PUBLIC_ADSENSE_INFEED_SLOT=your-infeed-slot-id
