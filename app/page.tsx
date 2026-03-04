'use client'

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/main/Navbar';
import { ImageCarouselHero } from '@/components/main/hero/ImageCarouselHero';
import Features from '@/components/main/Features';
import Pricing from '@/components/main/Pricing';
import CTA from '@/components/main/CTA';
import Footer from '@/components/main/Footer';
import LoginModal from '@/components/main/LoginModal';
import { useLocale } from '@/lib/i18n';

const HERO_IMAGES = [
  { id: '1', src: '/main/1.webp', alt: 'Thumbnail example 1', rotation: -8 },
  { id: '2', src: '/main/2.webp', alt: 'Thumbnail example 2', rotation: 5 },
  { id: '3', src: '/main/3.webp', alt: 'Thumbnail example 3', rotation: -3 },
  { id: '4', src: '/main/4.webp', alt: 'Thumbnail example 4', rotation: 7 },
  { id: '5', src: '/main/5.webp', alt: 'Thumbnail example 5', rotation: -5 },
];

function HomeContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setLoginOpen(true);
    }
  }, [searchParams]);

  const handleLoginClick = () => setLoginOpen(true);

  return (
    <main className="dark bg-black">
      <Navbar onLoginClick={handleLoginClick} />
      <ImageCarouselHero
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        description={t.hero.description}
        ctaText={t.hero.cta}
        onCtaClick={handleLoginClick}
        images={HERO_IMAGES}
        features={t.hero.features}
      />
      <Features />
      <Pricing onLoginClick={handleLoginClick} />
      <CTA onLoginClick={handleLoginClick} />
      <Footer />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
