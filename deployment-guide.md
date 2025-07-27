# 🚀 웹 배포 가이드

## 📋 배포 옵션

### 🌟 **추천: Vercel (무료)**
- Next.js 최적화
- 자동 배포
- 글로벌 CDN
- 무료 도메인

### 🔧 **기타 옵션**
- Netlify (무료)
- Railway (무료 티어)
- Heroku (유료)
- AWS/Google Cloud (복잡)

---

## 🎯 **Vercel 배포 (추천)**

### 1️⃣ **GitHub에 코드 업로드**

1. **GitHub 계정 생성** (없다면)
   - https://github.com 방문
   - 계정 생성

2. **새 Repository 생성**
   \`\`\`
   Repository name: thai-business-cards
   Description: 태국 한인 비즈니스 정보 사이트
   Public 선택
   \`\`\`

3. **코드 업로드**
   - "Download Code" 버튼 클릭
   - 압축 해제 후 GitHub에 업로드

### 2️⃣ **Vercel 계정 생성 및 연결**

1. **Vercel 가입**
   - https://vercel.com 방문
   - "Sign up" → "Continue with GitHub"

2. **프로젝트 Import**
   - "New Project" 클릭
   - GitHub repository 선택
   - "Import" 클릭

### 3️⃣ **환경 변수 설정**

Vercel 대시보드에서 Environment Variables 설정:

\`\`\`env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google AdSense (선택사항)
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-your-id
NEXT_PUBLIC_ADSENSE_BANNER_SLOT=your-slot-id

# OpenAI API (관리자 기능용)
OPENAI_API_KEY=sk-your-openai-key
\`\`\`

### 4️⃣ **배포 완료**
- 자동으로 빌드 및 배포
- `https://your-project.vercel.app` 도메인 제공

---

## 🗄️ **데이터베이스 설정 (Supabase)**

### 1️⃣ **Supabase 프로젝트 생성**

1. **계정 생성**
   - https://supabase.com 방문
   - "Start your project" 클릭

2. **새 프로젝트 생성**
   \`\`\`
   Project name: thai-business-cards
   Database password: 강력한 비밀번호 설정
   Region: Southeast Asia (Singapore) 선택
   \`\`\`

### 2️⃣ **데이터베이스 설정**

1. **SQL Editor에서 스크립트 실행**
   - 왼쪽 메뉴 "SQL Editor" 클릭
   - 앞서 제공한 SQL 스크립트들을 순서대로 실행

2. **API 키 확인**
   - Settings → API
   - URL과 anon key 복사

---

## 🎨 **커스터마이징**

### 1️⃣ **사이트 정보 수정**
