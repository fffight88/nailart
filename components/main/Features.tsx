import Image from 'next/image'

const FEATURES = [
  {
    title: 'AI-Powered Generation',
    description: 'Describe your video and get stunning thumbnails generated instantly with Gemini AI.',
    image: '/main/1.jpg',
    span: 'md:col-span-2 md:row-span-2',
    imageClass: 'aspect-[16/10]',
  },
  {
    title: 'Multi-Language Support',
    description: 'Generate thumbnails with text in any language — English, Korean, Japanese, and more.',
    image: '/main/2.jpg',
    span: '',
    imageClass: 'aspect-[4/3]',
  },
  {
    title: 'Click-Worthy Design',
    description: 'Bold compositions following proven thumbnail best practices.',
    image: '/main/3.jpg',
    span: '',
    imageClass: 'aspect-[4/3]',
  },
  {
    title: 'Reference Images',
    description: 'Attach existing thumbnails or photos for style-matched generation.',
    image: '/main/4.jpg',
    span: 'md:col-span-2',
    imageClass: 'aspect-[21/9]',
  },
  {
    title: 'Instant Results',
    description: 'From prompt to thumbnail in seconds, not hours.',
    image: '/main/5.jpg',
    span: '',
    imageClass: 'aspect-[4/3]',
  },
] as const

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-3">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Everything you need
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-md mx-auto">
            Professional thumbnails powered by AI, designed for creators.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] transition-colors hover:bg-white/[0.05] hover:border-white/[0.12] ${feature.span}`}
            >
              {/* Image */}
              <div className={`relative w-full overflow-hidden ${feature.imageClass}`}>
                <Image
                  src={feature.image}
                  alt={feature.title}
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
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-white/40 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
