'use client'

import { useRouter } from 'next/navigation';
import Navbar from '@/components/main/Navbar';
import { ImageCarouselHero } from '@/components/main/hero/ImageCarouselHero';
import Features from '@/components/main/Features';
import Pricing from '@/components/main/Pricing';
import CTA from '@/components/main/CTA';
import Footer from '@/components/main/Footer';
import { useLocale } from '@/lib/i18n';

const HERO_IMAGES = [
  { id: '1', src: '/main/1.png', alt: 'Thumbnail example 1', rotation: -8 },
  { id: '2', src: '/main/2.png', alt: 'Thumbnail example 2', rotation: 5 },
  { id: '3', src: '/main/3.png', alt: 'Thumbnail example 3', rotation: -3 },
  { id: '4', src: '/main/4.png', alt: 'Thumbnail example 4', rotation: 7 },
  { id: '5', src: '/main/5.png', alt: 'Thumbnail example 5', rotation: -5 },
];

export default function Home() {
  const { t } = useLocale();
  const router = useRouter();

  return (
    <main className="dark bg-black">
      <Navbar />
      <ImageCarouselHero
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        description={t.hero.description}
        ctaText={t.hero.cta}
        onCtaClick={() => router.push('/auth')}
        images={HERO_IMAGES}
        features={t.hero.features}
      />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
