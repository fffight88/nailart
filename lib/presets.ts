export interface Preset {
  id: string
  icon: string
  template: string
}

export const PRESETS: Preset[] = [
  {
    id: 'viral-impact',
    icon: '/viral-impact.png',
    template:
      'Hyper-realistic close-up of [USER_PROMPT], featuring an exaggerated shocked facial expression with wide eyes and open mouth, vibrant saturated colors with intense orange and blue contrast, neon rim lighting, high-impact studio quality, extreme detail.',
  },
  {
    id: 'epic-story',
    icon: '/epic-story.png',
    template:
      'Cinematic digital illustration of [USER_PROMPT], dramatic low-angle shot to create a sense of scale, golden hour volumetric lighting with dust particles, epic atmospheric haze, high depth of field with blurred background, professional movie poster aesthetic.',
  },
  {
    id: 'k-webtoon-pop',
    icon: '/k-webtoon-pop.png',
    template:
      'Trendy Korean webtoon style illustration of [USER_PROMPT], bold clean outlines, vibrant and bright color palette, expressive character reaction, soft cel-shading, high-energy composition, clean and polished 2D aesthetic.',
  },
  {
    id: 'tech-future',
    icon: '/tech-future.png',
    template:
      'Sleek 3D octane render of [USER_PROMPT], cyberpunk neon aesthetic with electric blue and magenta accents, sharp textures and metallic reflections, futuristic studio lighting, centered and powerful composition, high-tech professional vibe.',
  },
  {
    id: 'versus-battle',
    icon: '/versus-battle.png',
    template:
      'Split-screen comparison layout featuring [USER_PROMPT], dynamic Level 1 vs Level 100 visual storytelling, high-contrast lighting differences between both sides, dramatic textures, clean vertical transition, ultra-sharp 2K resolution.',
  },
]

export function applyPreset(template: string, userPrompt: string): string {
  return template.replace('[USER_PROMPT]', userPrompt)
}
