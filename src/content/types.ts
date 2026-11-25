export type Locale = 'it' | 'en';

export interface SiteMeta {
  title: string;
  description: string;
}

export interface SiteContent {
  locale: Locale;
  meta: SiteMeta;
  nav: {
    cta: string;
    switchLang: string;
    specimenLink: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    tagline: string;
    subcopy: string;
    primaryCta: string;
  };
  footer: {
    rights: string;
    privacy: string;
    cookie: string;
    legal: string;
  };
}