'use client'

import { BorderBeam } from '@/components/ui/border-beam'
import { useLocale } from '@/lib/i18n'

const PLANS_STATIC = [
  { name: 'Pro', price: 20, credits: 100, popular: false, featureKeys: ['creditsPerMonth', 'aiThumbnailGeneration', 'referenceImageSupport', 'multiLanguageTextRendering'] as const },
  { name: 'Ultra', price: 45, credits: 300, popular: true, featureKeys: ['creditsPerMonth', 'aiThumbnailGeneration', 'referenceImageSupport', 'multiLanguageTextRendering', 'bestValuePerCredit'] as const },
]

export default function Pricing() {
  const { t } = useLocale()

  const plans = PLANS_STATIC.map(p => ({
    ...p,
    features: p.featureKeys.map(key =>
      key === 'creditsPerMonth'
        ? t.landingPricing.features.creditsPerMonth.replace('{n}', String(p.credits))
        : t.landingPricing.features[key]
    ),
  }))

  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-3">
            {t.landingPricing.label}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {t.landingPricing.heading}
          </h2>
          <p className="mt-4 text-lg text-white/50 max-w-md mx-auto">
            {t.landingPricing.subheading}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
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
                  {t.landingPricing.mostPopular}
                </span>
              )}

              {/* Plan name */}
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                {plan.name}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-white/40 text-sm">{t.landingPricing.month}</span>
              </div>

              {/* Credits */}
              <p className="mt-2 text-white/40 text-sm">
                {plan.credits} {t.landingPricing.creditsIncluded}
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
                {t.landingPricing.getPlan.replace('{name}', plan.name)}
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
