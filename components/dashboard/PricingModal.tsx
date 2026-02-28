'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { BorderBeam } from '@/components/ui/border-beam'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { useLocale } from '@/lib/i18n'

interface PricingModalProps {
  open: boolean
  onClose: () => void
}

const PLANS = [
  { name: 'Pro', price: 20, credits: 100, plan: 'pro' },
  { name: 'Ultra', price: 45, credits: 300, plan: 'ultra' },
] as const

const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, ultra: 2 }

export default function PricingModal({ open, onClose }: PricingModalProps) {
  const { user } = useAuth()
  const { t } = useLocale()
  const supabase = useMemo(() => createClient(), [])
  const backdropRef = useRef<HTMLDivElement>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [confirmPlan, setConfirmPlan] = useState<string | null>(null)

  // Fetch current plan when modal opens
  useEffect(() => {
    if (!open || !user) return
    supabase
      .from('users')
      .select('plan, subscription_status')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setCurrentPlan(
            data.subscription_status === 'active' ? data.plan : 'free'
          )
        }
      })
  }, [open, user, supabase])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmPlan) setConfirmPlan(null)
        else onClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose, confirmPlan])

  const handleCheckout = useCallback(async (plan: string) => {
    setLoadingPlan(plan)
    setConfirmPlan(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Checkout failed')

      if (data.upgraded) {
        window.location.reload()
        return
      }

      window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
      setLoadingPlan(null)
    }
  }, [])

  const handlePlanClick = useCallback(
    (plan: string) => {
      const newRank = PLAN_RANK[plan] ?? 0
      const curRank = PLAN_RANK[currentPlan] ?? 0

      if (newRank > curRank && curRank > 0) {
        // Upgrade from paid plan — show confirmation
        setConfirmPlan(plan)
      } else {
        // New subscription or downgrade
        handleCheckout(plan)
      }
    },
    [currentPlan, handleCheckout]
  )

  if (!open) return null

  return createPortal(
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          if (confirmPlan) setConfirmPlan(null)
          else onClose()
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      {/* Confirm upgrade dialog */}
      {confirmPlan ? (
        <div className="relative rounded-2xl bg-[#1e1e1e] p-8 w-full max-w-sm">
          <h2 className="text-white text-lg font-bold text-center mb-2">
            {t.pricing.upgradeConfirm.replace('{plan}', confirmPlan === 'ultra' ? 'Ultra' : 'Pro')}
          </h2>
          <p className="text-white/50 text-sm text-center mb-6">
            {t.pricing.upgradeMessage}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmPlan(null)}
              className="flex-1 py-2.5 rounded-lg bg-white/[0.06] text-white/60 text-sm font-medium cursor-pointer transition-colors hover:bg-white/[0.1]"
            >
              {t.pricing.cancel}
            </button>
            <button
              type="button"
              disabled={loadingPlan !== null}
              onClick={() => handleCheckout(confirmPlan)}
              className="flex-1 py-2.5 rounded-lg bg-white text-[#181818] text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loadingPlan === confirmPlan ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#181818]/20 border-t-[#181818]/80 rounded-full animate-spin" />
                  {t.pricing.upgrading}
                </span>
              ) : (
                t.pricing.confirmUpgrade
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl bg-[#1e1e1e] p-8 w-full max-w-md">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.pricing.close}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/30 cursor-pointer transition-colors hover:text-white/70 hover:bg-white/[0.06]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h2 className="text-white text-xl font-bold text-center mb-6">
            {t.pricing.chooseYourPlan}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {PLANS.map((p) => {
              const isCurrent = p.plan === currentPlan
              const isDowngrade =
                (PLAN_RANK[p.plan] ?? 0) < (PLAN_RANK[currentPlan] ?? 0)

              return (
                <div
                  key={p.plan}
                  className={`relative rounded-xl p-5 flex flex-col items-center text-center ${
                    isCurrent
                      ? 'bg-white/[0.08] border border-white/[0.15]'
                      : 'bg-white/[0.04] border border-white/[0.08]'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/[0.15] text-white/60 text-[10px] font-semibold uppercase tracking-wider">
                      {t.pricing.current}
                    </span>
                  )}
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                    {p.name}
                  </p>
                  <p className="mt-3 text-white text-3xl font-bold">${p.price}</p>
                  <p className="mt-2 text-white/40 text-sm">{p.credits} {t.pricing.credits}</p>
                  <button
                    type="button"
                    disabled={isCurrent || loadingPlan !== null}
                    onClick={() => handlePlanClick(p.plan)}
                    className={`mt-5 w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity ${
                      isCurrent
                        ? 'bg-white/[0.06] text-white/30 cursor-default'
                        : 'bg-white text-[#181818] cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {loadingPlan === p.plan ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#181818]/20 border-t-[#181818]/80 rounded-full animate-spin" />
                        {t.dashboard.loading}
                      </span>
                    ) : isCurrent ? (
                      t.pricing.currentPlan
                    ) : isDowngrade ? (
                      t.pricing.downgrade
                    ) : (
                      t.pricing.getPlan.replace('{name}', p.name)
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          <BorderBeam
            duration={6}
            size={400}
            className="from-transparent via-[#FFD700] to-transparent"
          />
          <BorderBeam
            duration={6}
            delay={3}
            size={400}
            borderWidth={2}
            className="from-transparent via-[#C0C0C0] to-transparent"
          />
        </div>
      )}
    </div>,
    document.body,
  )
}
