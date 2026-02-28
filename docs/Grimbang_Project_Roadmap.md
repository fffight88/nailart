# 💎 Project Grimbang: Next-Gen AI YouTube Thumbnail Service

**Slogan:** *"Your Sentence, Becomes Art."*
**Core Vision:** A high-efficiency AI service that blends Gemini 3.1 Flash's cutting-edge performance with premium YouTube-specific aesthetics and Korean-market optimization.

---

## 1. Technical Stack & Model Strategy
A hybrid model architecture designed for maximum stability, cost-efficiency, and visual fidelity.

### **Model Configuration**
| Role | Model Name | Primary Objective |
| :--- | :--- | :--- |
| **Primary** | `gemini-3.1-flash-image-preview` | 2K resolution, 3-Pro level intelligence, high-speed generation. |
| **Fallback** | `gemini-2.5-flash-image` | High availability during quota limits or server congestion. |

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
Based on Gemini API Paid Tier cost structures.

| Tier | API Cost (Est.) | Retail Price (Suggested) | Target User |
| :--- | :--- | :--- | :--- |
| **Standard (1K)** | ~$0.07 (90 KRW) | **300 ~ 500 KRW** | Hobbyists, daily vloggers |
| **Premium (2K)** | ~$0.10 (136 KRW) | **700 ~ 1,000 KRW** | Professional Creators |
| **Batch Mode** | 50% Cost reduction | **200 ~ 400 KRW** | Bulk uploaders (Scheduling) |

---

## 4. Feature Roadmap

### **Phase 1: Foundation (MVP)**
- **Magic Brush (Prompt Expansion):** AI-driven enrichment of simple user queries into high-impact visual descriptions.
- **Style Presets:** One-click styles (Photorealistic, 3D Render, Anime, Cyberpunk).
- **Auto-Formatting:** Native 16:9 output optimized for YouTube sidebar visibility.

### **Phase 2: Precision Editing**
- **Smart In-painting:** Selective regeneration of specific areas (e.g., swapping backgrounds or fixing faces).
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
