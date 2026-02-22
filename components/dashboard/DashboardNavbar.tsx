'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/components/providers/AuthProvider'

interface DashboardNavbarProps {
  onToggleSidebar?: () => void
}

export default function DashboardNavbar({ onToggleSidebar }: DashboardNavbarProps) {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'
  const avatarUrl = user?.user_metadata?.avatar_url

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none">
      {/* Left: toggle + logo */}
      <div className="pointer-events-auto flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/50 cursor-pointer transition-colors hover:text-white/80 hover:bg-white/[0.06]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <a
          href="/dashboard"
          className="transition-opacity duration-200 hover:opacity-80"
        >
          <Image
            src="/nailart_logo.png"
            alt="Nailart AI logo"
            width={34}
            height={34}
            className="object-contain"
          />
        </a>
      </div>

      {/* Profile — floating pill with popover */}
      <div ref={popoverRef} className="pointer-events-auto relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={34}
              height={34}
              className="rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-[34px] h-[34px] rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* Popover dropdown */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#232323] border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white/80 text-sm truncate">{displayName}</p>
                {user?.email && (
                  <p className="text-white/40 text-xs truncate">{user.email}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="w-full text-left px-4 py-2.5 text-white/50 text-sm cursor-pointer transition-colors hover:bg-white/[0.04] hover:text-white/80"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
