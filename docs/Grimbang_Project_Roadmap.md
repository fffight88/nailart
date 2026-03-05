# 💎 Project Grimbang: Next-Gen AI YouTube Thumbnail Service

**Slogan:** *"Your Sentence, Becomes Art."*
**Core Vision:** A high-efficiency AI service that blends Gemini 3.1 Flash's cutting-edge performance with premium YouTube-specific aesthetics and Korean-market optimization.

---

## 1. Technical Stack & Model Strategy
A tiered model architecture designed for maximum cost-efficiency and visual fidelity.

### **Model Configuration (Updated 2026-03-05)**
| Role | Model Name | Provider | Cost | Primary Objective |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Generation** | `Imagen 4 Fast` | Google (Gemini API) | $0.02/장 (고정) | 2~4초 생성, 16:9 지원, 포토리얼리즘 최고 |
| **Edit / Refinement** | `gemini-3.1-flash-image-preview` | Google (Gemini API) | $0.101/장 (2K) | 자연어 기반 마스크 없는 편집, 외부 이미지 편집 가능, 텍스트 렌더링 ~90% |
| **Fallback Generation** | `gemini-2.5-flash-image` | Google (Gemini API) | $0.039/장 (1K) | Imagen 4 장애 시 대체 |
| **Image Analysis** | `gemini-2.5-flash` | Google (Gemini API) | 토큰 기반 | 레퍼런스 이미지 분석 (생성 전) |
| **Precision Inpainting** | `FLUX Fill Dev` | fal.ai API | ~$0.025/장 | 마스크 기반 정밀 수정 (애드온) |

### **Tiered Architecture Rationale**
- **1차 생성은 Imagen 4 Fast**: 기존 Gemini 3.1 Flash 대비 80% 비용 절감 ($0.101 → $0.02), 속도 2배
- **수정은 Gemini 3.1 Flash**: Imagen 4 Fast는 편집/인페인팅 미지원 → 수정 단계에서 3.1 Flash 활용
- **Gemini 3.1 Flash는 외부 이미지 편집 가능**: Imagen 4가 생성한 이미지도 자연어로 수정 가능

### **Request Parameters**
- **Modalities:** `["IMAGE"]` (Primary output)
- **Aspect Ratio:** `16:9` (YouTube Standard)
- **Resolution:** `2K` (Default)
- **Prompt Structure:** Complex multi-modal integration (System Prompt + User Text + Base64 Reference Images).

---

## 2. Market Positioning & USP (Unique Selling Points)
Strategically positioned between DIY tools and expensive human agencies.

- **Direct Competitors:** `vidIQ`, `1of10.com`, `Canva`.
- **The "Grimbang" Edge:**
    - **K-Market Optimization:** Deep understanding of Korean variety show (예능) aesthetics and typography.
    - **Zero-friction Workflow:** "One-click" generation vs. complex manual editing.
    - **Expert Quality at Scale:** Delivering $50-value professional thumbnails for <$1 in seconds.

---

## 3. Pricing Strategy (Updated 2026-03-05)
Based on Imagen 4 Fast + Gemini 3.1 Flash + fal.ai cost structures.

### Per-Credit Cost Breakdown
1 Credit = Imagen 4 Fast 생성 1회 + Gemini 3.1 Flash 수정 최대 3회

| 시나리오 | 생성 (Imagen 4 Fast) | 수정 (3.1 Flash 2K) | 합계 |
| :--- | :--- | :--- | :--- |
| **최악 (3회 전부 사용)** | $0.02 | $0.101 x 3 = $0.303 | **$0.323** |
| **평균 (~1.5회 수정)** | $0.02 | $0.101 x 1.5 = $0.152 | **$0.172** |
| **최선 (수정 없음)** | $0.02 | $0 | **$0.020** |

### Subscription Plans

| Plan | Credits | Price | API 원가 (평균) | 마진 | Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pro** | 30/month | **$9.99/month** | $5.16 | ~43% | 주 1~2회 제작 |
| **Ultra** | 100/month | **$24.99/month** | $17.20 | ~29% | 전업 크리에이터, 매일 제작 |

> 1인 운영 시 고정비(Vercel+Supabase ~$45/월)만 커버하면 매출총이익 ≈ 순이익.
> 스케일 시 Batch API 50% 할인 등으로 원가 추가 절감 가능.
> 상세 분석: `docs/pricing-analysis.md` 참조.

### Precision Edit Add-on (fal.ai 인페인팅)
기본 수정(Gemini 3.1 Flash 자연어 편집)은 플랜에 포함. 마스크 기반 정밀 인페인팅은 별도 애드온.
구독 플랜과 독립적으로 자유 선택 가능 (Pro/Ultra 무관).

| Add-on | 횟수 | Price | API 원가 | 마진 |
| :--- | :--- | :--- | :--- | :--- |
| **Precision 30** | 30회/월 | **$4.99/month** | $0.96 | ~81% |
| **Precision 100** | 100회/월 | **$9.99/month** | $3.20 | ~68% |

> fal.ai FLUX.1 [dev] Inpainting: $0.035/메가픽셀, 썸네일(1280x720) 기준 ~$0.032/회

| 수정 방식 비교 | 기본 수정 (포함) | 정밀 수정 (애드온) |
| :--- | :--- | :--- |
| 엔진 | Gemini 3.1 Flash (자연어) | fal.ai FLUX.1 [dev] Inpainting |
| 방식 | 이미지 + 자연어 지시 → 자동 영역 인식 수정 | 원본 + 마스크 → 선택 영역만 수정 |
| 정밀도 | 중 (마스크 없이 자동 인식) | 높음 (마스크 밖 원본 100% 보존) |
| 원가/회 | $0.101 (2K) | ~$0.032 |

### Top-up 충전 (일회성)
구독 크레딧/Precision 소진 시 추가 충전. 만료 없음. 구독 대비 단가 높게 설정하여 구독 유인 유지.

| 상품 | 수량 | Price | 단가 | 마진 |
| :--- | :--- | :--- | :--- | :--- |
| **Credit 5** | 5크레딧 | **$2.99** | $0.60 | ~71% |
| **Credit 15** | 15크레딧 | **$7.99** | $0.53 | ~68% |
| **Precision 10** | 10회 | **$2.49** | $0.25 | ~87% |
| **Precision 30** | 30회 | **$5.99** | $0.20 | ~84% |

> 상세 분석: `docs/pricing-analysis.md` 참조.

---

## 4. Feature Roadmap

### **Phase 1: Foundation (MVP)**
- **Magic Brush (Prompt Expansion):** AI-driven enrichment of simple user queries into high-impact visual descriptions.
- **Style Presets:** One-click styles (Photorealistic, 3D Render, Anime, Cyberpunk).
- **Auto-Formatting:** Native 16:9 output optimized for YouTube sidebar visibility.

### **Phase 2: Precision Editing**
- **Smart In-painting (fal.ai FLUX Fill Dev):**
    - **엔진:** fal.ai API — FLUX Fill Dev 모델 (~$0.025/장)
    - **선정 이유:** 현존 최고 품질 오픈소스 인페인팅, Next.js 공식 SDK 지원, API 키만으로 도입 가능
    - **대안 검토 결과:**
        - Imagen API ($0.02/장) — 더 저렴하나 Developer Preview 상태 + Vertex AI 인증 필요 → 보류
        - FLUX Fill Pro ($0.05/장) — 품질 최상이나 비용 2배 → 사용자 불만 시 전환
        - 셀프 호스팅 FLUX Dev — 라이선스 $999/월 + GPU 비용 → 월 4만장 이상 시 검토
    - **기능:** Canvas 브러시로 마스크 영역 지정 → 해당 영역만 재생성, 나머지 원본 보존
    - **구현 계획:**
        1. 프론트엔드: Canvas 오버레이 마스크 그리기 UI (브러시/지우개)
        2. API: `/api/inpaint/route.ts` — 원본 이미지 + 마스크 → fal.ai 호출 → 결과 저장
        3. DB: `thumbnails` 테이블에 `parent_id` 컬럼 추가 (원본-수정 관계 추적)
        4. SDK: `@fal-ai/client` 패키지 설치
    - **비즈니스 모델:** 기본 플랜에는 Gemini 재생성 수정 포함, 정밀 인페인팅은 $5~10/월 애드온
- **AI Text Overlay:** Native typographic rendering of headlines with high contrast and readability.
- **Subject Consistency:** Face-preservation technology for recurring creators using reference images.

### **Phase 3: Data-Driven Intelligence**
- **CTR Prediction:** AI scoring system to predict thumbnail performance before uploading.
- **YouTube API Sync:** Automatic style recommendations based on historical channel performance.

---

## 5. Brand Identity
- **Brand Name:** **Grimbang (그림방)** - Merging traditional Korean social spaces ("Bang") with digital art.
- **Logo Concept:** Minimalist fusion of a Korean traditional window frame (`Changhoji`) and digital pixels.
- **Tone & Voice:** Professional yet accessible; acting as a "Creative Director" for the user.

---

## 📄 Implementation Note for AI Agents
When generating prompts for Grimbang, always prioritize:
1. **The Hook:** Create a curiosity gap or emotional narrative.
2. **Readability:** High contrast, minimal clutter, large focal points.
3. **Safety:** Strictly adhere to YouTube's community guidelines.
