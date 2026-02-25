import Navbar from '@/components/main/Navbar';
import AetherHero from '@/components/main/hero/AetherHero';
import Features from '@/components/main/Features';
import Pricing from '@/components/main/Pricing';
import CTA from '@/components/main/CTA';
import Footer from '@/components/main/Footer';

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <AetherHero
        title="AI-Powered YouTube Thumbnails"
        subtitle="Enter your video topic and generate click-worthy thumbnails in seconds."
        ctaLabel="Get Started Free"
        ctaHref="/auth"
      />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
