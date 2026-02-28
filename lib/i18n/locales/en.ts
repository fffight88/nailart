export const en = {
  // Landing page navbar
  nav: {
    features: 'Features',
    pricing: 'Pricing',
    contact: 'Contact',
    getStarted: 'Get Started',
  },

  // Landing page hero
  hero: {
    title: 'AI-Powered YouTube Thumbnails',
    subtitle: 'Thumbnail Generator',
    description: 'Enter your video topic and generate click-worthy thumbnails in seconds.',
    cta: 'Get Started Free',
    features: [
      { title: 'Realistic Results', description: 'Photos that look professionally crafted' },
      { title: 'Fast Generation', description: 'Turn ideas into images in seconds.' },
      { title: 'Diverse Styles', description: 'Choose from a wide range of artistic options.' },
    ],
  },

  // Features section
  features: {
    label: 'Features',
    heading: 'More Views. Zero Editing.',
    subheading: 'Ditch the complex software. Everything you need to craft professional, algorithm-breaking thumbnails is just one click away.',
    items: [
      {
        title: 'Zero-Effort Magic Brush',
        description: 'Type a single word, and our AI crafts a viral, high-stakes scene. No complex prompt engineering required.',
      },
      {
        title: 'Flawless Native Typography',
        description: 'Say goodbye to broken AI text. Generate crisp, perfectly integrated English and Korean text straight into your image.',
      },
      {
        title: 'Engineered to Click',
        description: 'Built on visual psychology. We optimize color contrast, focal points, and emotional expressions to dominate the algorithm.',
      },
      {
        title: 'Ultra-Sharp 2K Fidelity',
        description: 'No blurry AI artifacts. Deliver stunning, professional-grade 2K visuals that look flawless on the biggest screens.',
      },
      {
        title: 'Seamless Style Mastery',
        description: 'From photorealism and 3D renders to vibrant anime. Match your channel\'s unique aesthetic with a single click.',
      },
    ],
  },

  // Landing page pricing
  landingPricing: {
    label: 'Pricing',
    heading: 'Simple, transparent pricing',
    subheading: 'Start free, upgrade when you need more power.',
    mostPopular: 'Most Popular',
    month: '/month',
    creditsIncluded: 'credits included',
    features: {
      creditsPerMonth: '{n} credits per month',
      aiThumbnailGeneration: 'AI thumbnail generation',
      referenceImageSupport: 'Reference image support',
      multiLanguageTextRendering: 'Multi-language text rendering',
      bestValuePerCredit: 'Best value per credit',
    },
    getPlan: 'Get {name}',
  },

  // CTA section
  cta: {
    heading: 'Start creating thumbnails that get clicks',
    subheading: '',
    button: 'Get Started Free',
  },

  // Footer
  footer: {
    features: 'Features',
    pricing: 'Pricing',
    privacy: 'Privacy',
    terms: 'Terms',
    allRightsReserved: 'All rights reserved.',
  },

  // Auth page
  auth: {
    welcome: 'Welcome',
    welcomeBack: 'Welcome Back',
    signInDesktop: 'Sign in to create AI-powered thumbnails',
    signInMobile: 'Sign in to create amazing thumbnails',
    continueWithGoogle: 'Continue with Google',
    agreeDesktop: 'By signing in, you agree to our',
    agreeMobile: 'By continuing, you agree to our',
    terms: 'Terms',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
  },

  // Dashboard navbar
  dashboard: {
    toggleSidebar: 'Toggle sidebar',
    plan: 'Plan',
    credits: 'credits',
    upgrade: 'Upgrade',
    manageSubscription: 'Manage Subscription',
    loading: 'Loading...',
    signOut: 'Sign out',
    toggleTheme: 'Toggle theme',
    toggleLanguage: 'Toggle language',
  },

  // Prompt area
  prompt: {
    heading: 'What thumbnail do you want to create?',
    placeholders: [
      'A cat wearing sunglasses on a neon background...',
      'Epic gaming moment with dramatic lighting...',
      'Minimalist tech review thumbnail...',
      'Before and after transformation split...',
      'Shocking reaction face with bold text...',
    ],
    notAnImage: 'not an image',
    exceeds5MB: 'exceeds 5MB',
    maxAttachments: 'Maximum {n} attachments reached',
    timedOut: 'Generation timed out. Please try again.',
    somethingWentWrong: 'Something went wrong',
    download: 'Download',
    generationFailed: 'Generation Failed',
    tryAgain: 'Try Again',
    myThumbnails: 'My thumbnails',
    attachExisting: 'Attach existing',
    attachImages: 'Attach images',
    uploadImages: 'Upload images',
    voiceInput: 'Voice input',
    generating: 'Generating...',
    generate: 'Generate',
    helper: 'Describe your thumbnail idea and let AI do the rest',
    removeAttachment: 'Remove attachment',
  },

  // Sidebar
  sidebar: {
    myThumbnails: 'My Thumbnails',
    noThumbnails: 'No thumbnails yet',
    generateFirst: 'Generate your first one!',
    copied: 'Copied!',
    copyPrompt: 'Copy prompt',
  },

  // Pricing modal
  pricing: {
    chooseYourPlan: 'Choose your plan',
    close: 'Close',
    current: 'Current',
    currentPlan: 'Current Plan',
    downgrade: 'Downgrade',
    getPlan: 'Get {name}',
    upgradeConfirm: 'Upgrade to {plan}?',
    upgradeMessage: "The prorated difference will be charged to your card immediately. You'll receive 200 bonus credits right away.",
    cancel: 'Cancel',
    upgrading: 'Upgrading...',
    confirmUpgrade: 'Confirm Upgrade',
    credits: 'credits',
  },
}

export type Translations = typeof en
