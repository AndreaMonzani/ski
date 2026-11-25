export type Locale = 'it' | 'en';

export interface SiteMeta {
  title: string;
  description: string;
}

export interface MethodTool {
  id: 'whisper' | 'carv' | 'frameio';
  index: string;
  name: string;
  layer: string;
  oneLiner: string;
  benefit: string;
  url: string | null;
  urlPlaceholder?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  tag: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  locale: Locale;
  meta: SiteMeta;
  nav: {
    cta: string;
    switchLang: string;
    specimenLink: string;
    links: {
      about: string;
      method: string;
      services: string;
      faq: string;
    };
  };
  hero: {
    eyebrow: string;
    headline: string;
    tagline: string;
    subcopy: string;
    primaryCta: string;
    secondaryCta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    highlights: { label: string; value: string }[];
  };
  method: {
    eyebrow: string;
    title: string;
    subtitle: string;
    visitSite: string;
    tools: MethodTool[];
  };
  services: {
    eyebrow: string;
    title: string;
    rateNote: string;
    items: ServiceItem[];
  };
  gear: {
    eyebrow: string;
    title: string;
    description: string;
    partnerName: string;
    partnerUrl: string | null;
    cta: string;
  };
  locations: {
    eyebrow: string;
    title: string;
    description: string;
    todoNote: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    placeholderCaption: string;
  };
  process: {
    eyebrow: string;
    title: string;
    steps: ProcessStep[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
  bookingPlaceholder: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaNote: string;
  };
  footer: {
    rights: string;
    privacy: string;
    cookie: string;
    legal: string;
  };
}
