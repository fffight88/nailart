const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-8 h-16 bg-black/40 backdrop-blur-[12px] backdrop-saturate-[120%] border-b border-white/[0.08] font-handwriting text-white">
      {/* Left: Logo + Text */}
      <a href="/" className="flex items-center gap-2.5 no-underline text-white">
        <img
          src="/nailart.png"
          alt="Nailart AI logo"
          width={32}
          height={32}
          className="object-contain"
        />
        <span className="text-lg font-bold tracking-tight">
          Nailart AI
        </span>
      </a>

      {/* Center: Nav links */}
      <div className="flex gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-white/75 no-underline text-sm font-medium transition-colors duration-200 hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right: CTA */}
      <a
        href="#"
        className="py-2 px-5 rounded-[10px] bg-white/12 text-white no-underline text-sm font-semibold border border-white/18 backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
      >
        Get Started
      </a>
    </nav>
  );
}
