'use client'

import Image from 'next/image'
import { useLocale } from '@/lib/i18n'

const FEATURE_STATIC = [
  { image: '/main/1.png', span: 'md:col-span-2 md:row-span-2', imageClass: 'aspect-[16/10]' },
  { image: '/main/2.png', span: '', imageClass: 'aspect-[4/3]' },
  { image: '/main/3.png', span: '', imageClass: 'aspect-[4/3]' },
  { image: '/main/4.png', span: 'md:col-span-2', imageClass: 'aspect-[21/9]' },
  { image: '/main/5.png', span: '', imageClass: 'aspect-[4/3]' },
] as const

export default function Features() {
  const { t } = useLocale()

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-3">
            {t.features.label}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {t.features.heading}
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-md mx-auto">
            {t.features.subheading}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURE_STATIC.map((feature, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] transition-colors hover:bg-white/[0.05] hover:border-white/[0.12] ${feature.span}`}
            >
              {/* Image */}
              <div className={`relative w-full overflow-hidden ${feature.imageClass}`}>
                <Image
                  src={feature.image}
                  alt={t.features.items[i].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Text */}
              <div className="p-5">
                <h3 className="text-white font-semibold text-base">
                  {t.features.items[i].title}
                </h3>
                <p className="mt-1.5 text-white/40 text-sm leading-relaxed">
                  {t.features.items[i].description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
