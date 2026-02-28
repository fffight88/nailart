# Grimbang (그림방) — Project Guide

## Rebranding
- Project is transitioning from "NailArt" to **Grimbang (그림방)**
- Full roadmap: `docs/Grimbang_Project_Roadmap.md` — covers model strategy, pricing, feature phases, and brand identity
- Slogan: *"Your Sentence, Becomes Art."*

## Service Overview
- AI-powered YouTube thumbnail generator
- Gemini API: `gemini-3.1-flash-image-preview` (primary, 2K) / `gemini-2.5-flash-image` (fallback with retry)
- Stack: Next.js 16, React 19, Tailwind v4, Supabase (Auth / DB / Storage)

## Key Files
| Path | Purpose |
|------|---------|
| `lib/system-prompt.ts` | Gemini system prompt — thumbnail generation guidelines |
| `lib/gemini.ts` | Gemini client (`GoogleGenAI`) export only |
| `app/api/generate/route.ts` | POST: auth → DB insert → Gemini (multimodal) → Storage → DB update |
| `components/dashboard/PromptArea.tsx` | Prompt UI with image attachments, existing thumbnails popover, loading/success/error states |
| `components/dashboard/Sidebar.tsx` | Left sidebar gallery with realtime thumbnail history |
| `components/dashboard/DashboardNavbar.tsx` | Top navbar with profile popover and mobile sidebar toggle |
| `app/dashboard/page.tsx` | Dashboard layout: sidebar + main content area |
| `lib/types.ts` | Shared TypeScript types (`Thumbnail`, etc.) |
| `lib/supabase/client.ts` | Browser-side Supabase client |
| `lib/supabase/server.ts` | Server-side Supabase client with cookie management |

## System Prompt Rules (`lib/system-prompt.ts`)
- Default: NO text in generated images
- Text allowed only when user **explicitly requests** it → render in English by default, other languages only when specified
- 16:9 aspect ratio, bold high-contrast colors (2-3 max)
- Rule of thirds composition, clear focal point readable at 168x94px
- Based on: Nano Banana prompting guide + YouTube thumbnail best practices

## Conventions
- User prompts can be in any language; system prompt is written in English
- `quantum-pulse-loade.tsx` filename has typo (missing 'r') — known, not breaking
- Use `next/image` for all images; remote patterns configured in `next.config.ts`
- Supabase browser client: always memoize with `useMemo(() => createClient(), [])`
- Popover components that live inside `backdrop-blur` containers must use `createPortal` to escape containing block
- Glassmorphism style: `bg-white/[0.03-0.06]`, `border-white/[0.06-0.1]`, `backdrop-blur-xl`
- Dashboard background: `#181818`, sidebar: `#202020`

## Tutorial Reference
- Video: https://www.youtube.com/watch?v=mhVgh640FUw (resume at **25:57**)


