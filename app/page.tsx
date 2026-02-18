import Navbar from '@/components/main/Navbar';
import AetherHero from '@/components/main/hero/AetherHero';

export default function Home() {
  return (
    <main>
      <Navbar />
      <AetherHero
        title="AI-Powered YouTube Thumbnails"
        subtitle="Enter your video topic and generate click-worthy thumbnails in seconds."
        ctaLabel="Get Started Free"
        ctaHref="#"
      />
    </main>
  );
}
