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
      'Hyper-realistic close-up of [USER_PROMPT], extreme shocked facial expression with wide eyes and crystal-clear iris detail, 50% exaggerated reaction, vibrant saturated colors, intense neon rim lighting to separate subject from background, background with beautiful circular bokeh, high-impact studio quality.',
  },
  {
    id: 'epic-story',
    icon: '/epic-story.png',
    template:
      'Cinematic wide-angle shot of [USER_PROMPT], featuring a tiny silhouette against a massive and overwhelming environment, dramatic rule-of-thirds composition, golden hour volumetric lighting with visible light shafts, atmospheric haze, professional movie poster aesthetic, deep depth of field.',
  },
  {
    id: 'k-webtoon-pop',
    icon: '/k-webtoon-pop.png',
    template:
      'Trendy Korean webtoon style of [USER_PROMPT], dynamic speed lines and expressive stylized shock symbols around the character, bold clean outlines, high-saturation cel shading, bright and energetic color palette, polished 2D digital art with variety show energy.',
  },
  {
    id: 'tech-future',
    icon: '/tech-future.png',
    template:
      'Premium 3D octane render of [USER_PROMPT], minimalist cyberpunk aesthetic, matte metallic textures and sharp reflections, soft-box studio lighting with elegant shadows, macro lens focus on fine details, clean monochromatic background with a single neon accent color, futuristic professional vibe.',
  },
  {
    id: 'versus-battle',
    icon: '/versus-battle.png',
    template:
      'Aggressive split-screen layout of [USER_PROMPT], sharp lightning bolt divider between two sides, extreme lighting contrast (Mundane vs Extraordinary), \'Level 1 vs Level 100\' visual storytelling, high-contrast textures, ultra-sharp 4K resolution, compelling curiosity gap design.',
  },
]

export function applyPreset(template: string, userPrompt: string): string {
  return template.replace('[USER_PROMPT]', userPrompt)
}
