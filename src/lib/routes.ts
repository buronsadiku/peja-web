export const appRoutes = {
  home: "/",

  marketing: {
    howItWorks: "/how-it-works",
    goldBook: "/gold-book",
    keepsakes: "/keepsakes",
    pricing: "/pricing",
    stories: "/stories",
    forPlanners: "/for-planners",
    sample: "/sample",
    changelog: "/changelog",
    about: "/about",
    careers: "/careers",
    sustainability: "/sustainability",
    pressKit: "/press-kit",
    contact: "/contact",
  },

  legal: {
    privacy: "/legal/privacy",
    terms: "/legal/terms",
    cookies: "/legal/cookies",
    gdpr: "/legal/gdpr",
    dpaForPlanners: "/legal/dpa-for-planners",
  },

  auth: {
    signIn: "/sign-in",
    signInVerify: "/sign-in/verify",
    signInWelcome: "/sign-in/welcome",
    signUp: "/sign-up",
    signUpStep: (step: number) => `/sign-up/step/${step}`,
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },

  app: {
    root: "/app",
    settings: "/settings",
    keepsakes: "/app/keepsakes",
    qrCode: "/app/qr-code",
    qrCodeOrder: "/app/qr-code/order",
    activate: "/app/activate",
    messages: "/app/messages",
    message: (messageId: string) => `/app/messages/${messageId}`,
    photos: "/app/photos",
    guests: "/app/guests",
    kiosk: "/app/kiosk",
    account: "/app/account",
  },

  settings: {
    root: "/settings",
    profile: "/settings/profile",
    notifications: "/settings/notifications",
    privacy: "/settings/privacy",
    data: "/settings/data",
    danger: "/settings/danger",
    link: "/settings/link",
    branding: "/settings/branding",
    access: "/settings/access",
    billing: "/settings/billing",
  },

  guest: {
    base: (slug: string) => `/g/${slug}`,
    record: (slug: string) => `/g/${slug}/record`,
    compose: (slug: string) => `/g/${slug}/compose`,
    review: (slug: string) => `/g/${slug}/review`,
    photo: (slug: string) => `/g/${slug}/photo`,
    thankYou: (slug: string) => `/g/${slug}/thank-you`,
  },

  kiosk: {
    page: (slug: string) => `/kiosk/${slug}`,
  },

  checkout: {
    success: (orderId: string) => `/checkout/${orderId}/success`,
    cancel: (orderId: string) => `/checkout/${orderId}/cancel`,
  },
} as const;
