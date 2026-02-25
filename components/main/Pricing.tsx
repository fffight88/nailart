'use client'

import { BorderBeam } from '@/components/ui/border-beam'

const PLANS = [
  {
    name: 'Pro',
    price: 20,
    credits: 100,
    popular: false,
    features: [
      '100 credits per month',
      'AI thumbnail generation',
      'Reference image support',
      'Multi-language text rendering',
    ],
  },
  {
    name: 'Ultra',
    price: 45,
    credits: 300,
    popular: true,
    features: [
      '300 credits per month',
      'AI thumbnail generation',
      'Reference image support',
      'Multi-language text rendering',
      'Best value per credit',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-3">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-md mx-auto">
            Start free, upgrade when you need more power.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.popular
                  ? 'bg-white/[0.06] border border-white/[0.12]'
                  : 'bg-white/[0.03] border border-white/[0.08]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/[0.12] text-white/80 text-xs font-semibold uppercase tracking-wider border border-white/[0.1]">
                  Most Popular
                </span>
              )}

              {/* Plan name */}
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                {plan.name}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>

              {/* Credits */}
              <p className="mt-2 text-white/40 text-sm">
                {plan.credits} credits included
              </p>

              {/* Divider */}
              <div className="mt-6 mb-6 h-px bg-white/[0.08]" />

              {/* Features */}
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/60">
                    <svg
                      className="w-4 h-4 mt-0.5 shrink-0 text-white/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="/auth"
                className={`mt-8 block text-center py-3 rounded-xl text-sm font-semibold no-underline transition-opacity hover:opacity-90 ${
                  plan.popular
                    ? 'bg-white text-[#181818]'
                    : 'bg-white/[0.08] text-white border border-white/[0.1]'
                }`}
              >
                Get {plan.name}
              </a>

              {/* Border beam for popular plan */}
              {plan.popular && (
                <>
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
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
