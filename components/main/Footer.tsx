'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

const SOCIAL_LINKS = [
  {
    label: 'X',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Threads',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.083.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.343-.783-.955-1.42-1.756-1.867-.18 3.63-1.88 5.909-5.293 5.909-1.93 0-3.528-.73-4.394-2.005-.69-1.02-.937-2.305-.694-3.612.489-2.617 2.652-4.42 5.39-4.49.964-.014 1.858.124 2.67.396l.18-1.725 2.016.21-.396 3.788c.865.68 1.552 1.552 1.997 2.57.71 1.618.78 4.401-1.32 6.456-1.795 1.76-4.067 2.544-7.263 2.568zm1.57-8.67c-.16 0-.327.007-.497.02-1.648.043-3.038 1.025-3.342 2.655-.16.862-.022 1.66.39 2.268.518.766 1.432 1.187 2.578 1.187 2.558 0 3.5-1.893 3.5-4.036a5.846 5.846 0 00-.866-.55c-.554-.29-1.159-.478-1.763-.544z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const { t } = useLocale()

  const navLinks = [
    { label: t.footer.features, href: '#features' },
    { label: t.footer.pricing, href: '#pricing' },
    { label: t.footer.privacy, href: '/privacy' },
    { label: t.footer.terms, href: '/terms' },
  ]

  return (
    <footer className="px-6 pb-8 pt-16">
      <div className="max-w-6xl mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.08] px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo + Socials */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 no-underline text-white">
              <img
                src="/grimbang_logo_dark.png"
                alt="Grimbang logo"
                width={20}
                height={20}
                className="object-contain"
              />
              <span className="text-sm font-bold tracking-tight text-white/80">
                Grimbang
              </span>
            </a>

            {/* Divider */}
            <div className="hidden md:block w-px h-4 bg-white/[0.1]" />

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-white/30 transition-colors hover:text-white/60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Nav links */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/40 text-sm no-underline transition-colors hover:text-white/70"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Grimbang. {t.footer.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  )
}
