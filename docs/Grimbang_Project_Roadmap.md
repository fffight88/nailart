# 💎 Project Grimbang: Next-Gen AI YouTube Thumbnail Service

**Slogan:** *"Your Sentence, Becomes Art."*
**Core Vision:** A high-efficiency AI service that blends Gemini 3.1 Flash's cutting-edge performance with premium YouTube-specific aesthetics and Korean-market optimization.

---

## 1. Technical Stack & Model Strategy
A hybrid model architecture designed for maximum stability, cost-efficiency, and visual fidelity.

### **Model Configuration**
| Role | Model Name | Provider | Primary Objective |
| :--- | :--- | :--- | :--- |
| **Primary Generation** | `gemini-3.1-flash-image-preview` | Google (Gemini API) | 2K resolution, 3-Pro level intelligence, high-speed generation. |
| **Fallback Generation** | `gemini-2.5-flash-image` | Google (Gemini API) | High availability during quota limits or server congestion. |
| **Image Analysis** | `gemini-2.5-flash` | Google (Gemini API) | Reference image analysis before generation. |
| **Precision Inpainting** | `FLUX Fill Dev` | fal.ai API | Mask-based selective region editing. Phase 2 feature. |

### **Request Parameters**
- **Modalities:** `["IMAGE"]` (Primary output)
- **Aspect Ratio:** `16:9` (YouTube Standard)
- **Resolution:** `2K` (Default for high-quality tier)
- **Prompt Structure:** Complex multi-modal integration (97-line System Prompt + User Text + Base64 Reference Images).

---

## 2. Market Positioning & USP (Unique Selling Points)
Strategically positioned between DIY tools and expensive human agencies.

- **Direct Competitors:** `vidIQ`, `1of10.com`, `Canva`.
- **The "Grimbang" Edge:**
    - **K-Market Optimization:** Deep understanding of Korean variety show (예능) aesthetics and typography.
    - **Zero-friction Workflow:** "One-click" generation vs. complex manual editing.
    - **Expert Quality at Scale:** Delivering $50-value professional thumbnails for <$1 in seconds.

---

## 3. Pricing Strategy (Estimated 2026 Paid Tier)
Based on Gemini API + fal.ai Paid Tier cost structures.

### Per-Credit Cost Breakdown
1 Credit = Gemini 2K 생성 1회 + 기본 수정 3회 (generateContent 재생성)

| Tier | API Cost (Est.) | Retail Price (Suggested) | Target User |
| :--- | :--- | :--- | :--- |
| **Standard (1K)** | ~$0.07 (90 KRW) | **300 ~ 500 KRW** | Hobbyists, daily vloggers |
| **Premium (2K)** | ~$0.10 (136 KRW) | **700 ~ 1,000 KRW** | Professional Creators |
| **Batch Mode** | 50% Cost reduction | **200 ~ 400 KRW** | Bulk uploaders (Scheduling) |

### Subscription Plans

| Plan | Credits | Price | Per Credit | Target |
| :--- | :--- | :--- | :--- | :--- |
| **Pro** | 100/month | **$20/month** | $0.20 | 주 1~2회 제작 |
| **Ultra** | 300/month | **$45/month** | $0.15 | 전업 크리에이터, 매일 제작 |

### Precision Edit Add-on (fal.ai 인페인팅)
기본 수정(generateContent 재생성)은 플랜에 포함. 마스크 기반 정밀 인페인팅은 별도 애드온.

| Add-on | Price | Content |
| :--- | :--- | :--- |
| **Precision Edit** | **$5~10/month** | 마스크 기반 인페인팅 (fal.ai FLUX Fill Dev), 수정 영역만 변경하고 나머지 보존 |

| 수정 방식 비교 | 기본 수정 (포함) | 정밀 수정 (애드온) |
| :--- | :--- | :--- |
| 엔진 | Gemini generateContent | fal.ai FLUX Fill Dev |
| 방식 | 원본 + 프롬프트 → 전체 재생성 | 원본 + 마스크 → 선택 영역만 수정 |
| 정밀도 | 중 (다른 부분도 바뀔 수 있음) | 높음 (마스크 밖 원본 100% 보존) |
| 원가/회 | $0 (생성 비용에 포함) | ~$0.025 |

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
