# Grimbang Work Summary

## 2월 9일 (토)
- **프로젝트 초기화** — `create-next-app`으로 Next.js 프로젝트 생성

## 2월 18일 (화) — 핵심 기능 구축 (~4시간+)
- 랜딩 페이지 (WebGL 히어로, Navbar, Tailwind v4 세팅)
- Supabase Google OAuth 인증, AuthContext, users 테이블
- 대시보드 UI (PromptArea, thumbnails 테이블, Storage 버킷)
- Gemini API 연동 AI 썸네일 생성 + UI 개선

## 2월 22일 (토) — 결제 및 갤러리 (~5시간+)
- 사이드바 갤러리, 이미지 첨부, 시스템 프롬프트 강화
- CLAUDE.md 프로젝트 가이드 추가
- Polar 결제 연동 (웹훅, 구독 관리, 고객 포털)
- 크레딧 시스템, 개인정보/이용약관 페이지, UI 개선

## 2월 25일 (화)
- 랜딩 페이지 섹션 추가, 모바일 반응형, API 타임아웃 처리

## 2월 28일 (금)
- NailArt → **Grimbang 리브랜딩** (다크 테마, i18n 한/영, 히어로 캐러셀, UI 전면 개편)

## 3월 2일 (일) — 프롬프트 최적화 및 프리셋 (~3시간+)
- 시스템 프롬프트 대규모 리팩토링 (116줄 → 62줄, 카피라이팅/레이아웃 가이드 추가)
- 스타일 프리셋 셀렉터 5종 구현 (Viral Impact, Epic Story, K-Webtoon Pop, Tech Future, Versus Battle)
- 이미지 PNG → WebP 변환 (42MB → 4.2MB)

## 3월 3일 (월)
- Vercel 배포 OAuth 리다이렉트 이슈 수정 (localhost → 프로덕션 도메인)
- Supabase Site URL 로컬/프로덕션 공존 설정

## 3월 4일 (화)
- 레퍼런스 이미지 자동 분석 기능 구현, 프리셋 v2.0 업데이트, 로고 새로고침
- 로그인 모달 전환 (`/auth` → 글래스모피즘 모달), 이미지 첨부/다운로드 버그 수정
- 개인정보/이용약관 연락처 이메일 업데이트

## 3월 5일 (수) — 요금제 설계 및 버그 수정
- 티어드 모델 아키텍처 설계 (Imagen 4 Fast 생성 + Gemini 3.1 Flash 수정)
- 요금제 원가 분석 및 구독 플랜 확정 (Pro $9.99/30크레딧, Ultra $24.99/100크레딧)
- Precision Edit 애드온 설계 ($4.99/30회, $9.99/100회, 구독 무관 자유 선택)
- Top-up 충전 요금제 설계 (Credit 5/15, Precision 10/30)
- 썸네일 삭제 시 Supabase Storage 이미지 파일도 함께 삭제하도록 버그 수정
- 사이드바 갤러리 표시 제한 50 → 100장으로 증가
- `docs/pricing-analysis.md` 신규 작성, 로드맵 요금제 섹션 업데이트
