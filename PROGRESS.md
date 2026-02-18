# NailArt 프로젝트 진행 현황

## 완료된 작업

### 1. 랜딩 페이지
- WebGL 히어로 섹션, 메인 Navbar, Tailwind v4 세팅

### 2. 인증
- Supabase Google OAuth 로그인/로그아웃
- AuthProvider 컨텍스트, 미인증 시 /auth 리다이렉트

### 3. 대시보드
- DashboardNavbar + PromptArea (타이프라이터 플레이스홀더, BorderBeam 애니메이션)
- thumbnails 테이블 + Storage 버킷 (Supabase)

### 4. AI 썸네일 생성 (Gemini API)
- `app/api/generate/route.ts` — POST Route Handler
- 모델 전략: `gemini-3-pro-image-preview` (2K) 1회 시도 → 실패 시 `gemini-2.5-flash-image` 최대 2회 재시도
- 흐름: 인증 확인 → DB INSERT (generating) → Gemini 호출 → Storage 업로드 → DB UPDATE (completed) → 응답
- `lib/gemini.ts` — Gemini 클라이언트 + YouTube 썸네일 시스템 프롬프트
- `lib/types.ts` — Thumbnail, GenerateResponse 타입

### 5. PromptArea UI
- textarea 소프트랩 + Shift+Enter 줄바꿈
- 생성 중: Quantum Pulse Loader (Generating 글자 3D 회전 애니메이션 + shimmer 프로그레스 바)
- 성공: 16:9 이미지 카드 + 다운로드 버튼
- 실패: 빨간 X 아이콘 + "Generation Failed" + "Try Again" 버튼
- 결과/에러/로딩 모두 프롬프트 위에 표시

### 6. 로고
- nailart_logo.png 적용 (DashboardNavbar + Main Navbar)

## 기술 스택
- Next.js 16, React 19, Tailwind v4, Supabase (Auth/DB/Storage), Google Gemini API (@google/genai)

## 다음 작업
- 튜토리얼 영상 이어보기: https://www.youtube.com/watch?v=mhVgh640FUw&list=PLKL3Ar7lG1Dg-5RAqcSDbYP00Vfz5sGI1&index=28
  - **25분 57초**부터 이어서 볼 차례
