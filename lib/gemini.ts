import { GoogleGenAI } from '@google/genai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable')
}

export const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const THUMBNAIL_SYSTEM_PROMPT = `You are a YouTube thumbnail designer. Generate a visually striking, attention-grabbing YouTube thumbnail image based on the user's description.

Guidelines:
- Use bold, saturated colors with high contrast
- Create a clear focal point that reads well at small sizes
- DO NOT include any text, words, or letters in the image
- Use dramatic lighting and composition
- Make it eye-catching enough to stand out in a YouTube feed
- Optimize for 16:9 aspect ratio

User's thumbnail idea:`
