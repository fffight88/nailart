'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import PricingModal from '@/components/dashboard/PricingModal'

interface DashboardNavbarProps {
  onToggleSidebar?: () => void
}

export default function DashboardNavbar({ onToggleSidebar }: DashboardNavbarProps) {
  const { user, signOut } = useAuth()
  const supabase = useMemo(() => createClient(), [])
  const [open, setOpen] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)
  const [userPlan, setUserPlan] = useState<{ plan: string; status: string }>({
    plan: 'free',
    status: 'inactive',
  })
  const [portalLoading, setPortalLoading] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'
  const avatarUrl = user?.user_metadata?.avatar_url

  const hasPaidPlan =
    userPlan.plan !== 'free' &&
    (userPlan.status === 'active' || userPlan.status === 'canceled')

  // Fetch user plan
  useEffect(() => {
    if (!user) return
    supabase
      .from('users')
      .select('plan, subscription_status')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setUserPlan({ plan: data.plan, status: data.subscription_status })
        }
      })
  }, [user, supabase])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePortal = useCallback(async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.open(data.url, '_blank')
    } catch (err) {
      console.error('Portal error:', err)
    } finally {
      setPortalLoading(false)
    }
  }, [])

  return (
  <>
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
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#232323] border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
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
            <div className="px-3 py-2">
              <button
                type="button"
                onClick={() => {
                  setPricingOpen(true)
                  setOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-[#1e1e1e] text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Upgrade
              </button>
            </div>
            {hasPaidPlan && (
              <button
                type="button"
                disabled={portalLoading}
                onClick={() => {
                  handlePortal()
                  setOpen(false)
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/50 text-sm cursor-pointer transition-colors hover:bg-white/[0.04] hover:text-white/80 disabled:opacity-50"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                {portalLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            )}
            <button
              type="button"
              onClick={signOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/50 text-sm cursor-pointer transition-colors hover:bg-white/[0.04] hover:text-white/80"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>

    <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
  </>
  )
}
