# Grimbang (그림방) 프로젝트 진행 현황

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

### 7. 로그인 모달 전환
- `/auth` 별도 페이지 → 랜딩페이지 글래스모피즘 로그인 모달로 전환
- `components/main/LoginModal.tsx` — createPortal, Escape/배경클릭 닫기, Google OAuth
- Navbar/Hero/CTA/Pricing 모든 로그인 버튼 → 모달 오픈으로 변경
- `/auth` 접속 시 `/?login=true`로 리다이렉트 (북마크 호환)
- 대시보드 미인증 시 `/?login=true`로 리다이렉트

### 8. 이미지 첨부/다운로드 버그 수정
- 기존 썸네일 첨부 시 400 에러 → `compressImageBlob()` 추가 (OffscreenCanvas로 1024px 리사이즈 + JPEG 85%)
- 다운로드 버튼 cross-origin 이슈 → fetch → blob → objectURL 방식으로 수정
- 생성 성공 시 기존 썸네일 팝오버 목록 즉시 갱신

## 다음 작업

### Phase 2: 정밀 인페인팅 (fal.ai FLUX Fill Dev)
- `@fal-ai/client` 패키지 설치
- `/api/inpaint/route.ts` 라우트 추가
- Canvas 마스크 그리기 UI 구현
- DB: `thumbnails.parent_id` 컬럼 추가
- 정밀 수정 애드온 결제 연동

### 참고