import type { SiteContent } from '../types';

export const contentEn: SiteContent = {
  locale: 'en',
  meta: {
    title: 'MONZ — Andrea Monzani | Private Ski Instructor & Advanced Coaching in Lombardy',
    description:
      'Private ski lessons and technical coaching for advanced skiers with Andrea Monzani. Live Whisper radio, Carv telemetry, and same-day Frame.io video analysis.',
  },
  nav: {
    cta: 'Request a lesson',
    switchLang: 'IT',
    specimenLink: 'Font',
    links: {
      about: 'Approach',
      method: 'Method',
      services: 'Services',
      faq: 'FAQ',
    },
  },
  hero: {
    eyebrow: 'ANDREA MONZANI · SKI INSTRUCTOR & COACH',
    headline: 'MONZ',
    tagline: 'Feel it. Measure it. See it.',
    subcopy:
      'Private coaching for advanced skiers across Lombardy. Live voice input, telemetry data, and same-day frame-by-frame video analysis.',
    primaryCta: 'Request a lesson',
    secondaryCta: 'Explore the method',
  },
  about: {
    eyebrow: '01 / ABOUT',
    title: 'Not a ski school. Precision coaching built around you.',
    paragraphs: [
      'I am Andrea Monzani, an independent ski instructor and technical coach. I work with skiers who want measurable gains in carving, edge control, and performance—far from generic group-school scripts.',
      'Having studied in Canada and the United States, I teach fluently in English. Every session connects live on-snow feel, objective telemetry, and frame-by-frame video review.',
    ],
    highlights: [
      { label: 'Focus', value: 'Advanced & performance skiers' },
      { label: 'Languages', value: 'English (fluent) & Italian' },
      { label: 'Area', value: 'Lombardy (on-demand)' },
    ],
  },
  method: {
    eyebrow: '02 / THE METHOD',
    title: 'Three layers. One coherent coaching system.',
    subtitle:
      'Every tool reinforces the next: immediate voice cues while you ski, objective turn metrics, and visual feedback you keep.',
    visitSite: 'Official site',
    tools: [
      {
        id: 'whisper',
        index: '01',
        name: 'Whisper',
        layer: 'FEEL IT · LIVE RADIO',
        oneLiner: 'Live radio system for real-time voice cues during the run.',
        benefit:
          'Corrections are clear, immediate, and tied directly to what you feel in that exact turn—no waiting until the lift.',
        url: null,
        urlPlaceholder: 'TODO_ANDREA: official Whisper producer URL',
      },
      {
        id: 'carv',
        index: '02',
        name: 'Carv',
        layer: 'MEASURE IT · TELEMETRY',
        oneLiner: 'Ski telemetry sensors measuring every turn.',
        benefit:
          'I coach you to read your own data and self-analyse, so your progress continues even when skiing solo.',
        url: 'https://getcarv.com',
      },
      {
        id: 'frameio',
        index: '03',
        name: 'Frame.io',
        layer: 'SEE IT · VIDEO ANALYSIS',
        oneLiner: 'Same-day frame-by-frame video breakdown.',
        benefit:
          'I film the session and deliver precise written notes on individual frames the same day—always available and downloadable.',
        url: 'https://frame.io',
      },
    ],
  },
  services: {
    eyebrow: '03 / SERVICES',
    title: 'Private sessions tailored to your goals.',
    rateNote: 'Rates on request depending on resort, duration, and session type.',
    items: [
      {
        title: 'Private lessons',
        tag: '1-to-1 / Private',
        description: 'Custom technical work on balance, edge engagement, and speed control.',
      },
      {
        title: 'Individual lessons',
        tag: 'Full focus',
        description: 'Maximum feedback density on every turn with live radio and targeted review.',
      },
      {
        title: 'Small groups',
        tag: 'Matched level',
        description: 'Private sessions for small groups of similar-level skiers progressing together.',
      },
      {
        title: 'Technical coaching',
        tag: 'Performance',
        description: 'Advanced carving, edge transition timing, rhythm, and variable-terrain mastery.',
      },
      {
        title: 'Same-day video analysis',
        tag: 'Frame.io',
        description: 'On-snow filming with frame-accurate written notes delivered the same day.',
      },
      {
        title: 'Full-day sessions',
        tag: 'Full day',
        description: 'Deep immersion to lock in new movement patterns across varied slopes.',
      },
    ],
  },
  gear: {
    eyebrow: '04 / PREMIUM GEAR',
    title: 'High-end ski rental by prior booking.',
    description:
      'Need top-tier equipment? I coordinate premium gear rental through partner shop Buzzetti Sport. There is no e-commerce—I manage the request directly so your setup is ready for your session.',
    partnerName: 'Buzzetti Sport',
    partnerUrl: null,
    cta: 'Opt in via the booking form',
  },
  locations: {
    eyebrow: '05 / WHERE I WORK',
    title: 'I travel to you across Lombardy.',
    description:
      'I operate independently and meet clients across Lombardy’s ski areas. Share your preferred area in your request to plan the session.',
    todoNote: 'TODO_ANDREA: confirmed list of Lombardy resorts and areas.',
  },
  gallery: {
    eyebrow: '06 / GALLERY',
    title: 'On snow.',
    placeholderCaption: 'TODO_ANDREA: original photos & clips (uploaded via VS Code + git push in /public/assets/).',
  },
  process: {
    eyebrow: '07 / HOW IT WORKS',
    title: 'Four steps, zero friction.',
    steps: [
      {
        number: '01',
        title: 'Request',
        description: 'Submit your skiing level, preferred area, dates, and optional premium gear request.',
      },
      {
        number: '02',
        title: 'Confirmation',
        description: 'I reply personally to confirm timing, meeting point, and session details.',
      },
      {
        number: '03',
        title: 'On-snow session',
        description: 'Live Whisper radio coaching, Carv telemetry, and targeted filming.',
      },
      {
        number: '04',
        title: 'Same-day analysis',
        description: 'Receive your frame-by-frame Frame.io breakdown—always accessible and downloadable.',
      },
    ],
  },
  faq: {
    eyebrow: '08 / FAQ',
    title: 'Frequently asked questions.',
    items: [
      {
        question: 'What skiing level is MONZ coaching designed for?',
        answer:
          'My primary focus is strong intermediate, advanced, expert, and competitive skiers looking for sharper carving, control, and technical clarity.',
      },
      {
        question: 'How do rates and bookings work?',
        answer:
          'There are no online payments or automated calendars. Send a booking request and we confirm the schedule and rate directly.',
      },
      {
        question: 'Do you teach fluently in English?',
        answer:
          'Yes. I studied in Canada and the United States and deliver both on-snow coaching and video analysis fluently in English.',
      },
      {
        question: 'How does premium gear rental work?',
        answer:
          'Tick the premium gear option in the booking form and I will coordinate your setup directly with our partner shop Buzzetti Sport.',
      },
    ],
  },
  bookingPlaceholder: {
    eyebrow: '09 / BOOKING',
    title: 'Request your session.',
    subtitle:
      'Booking form, Resend email delivery, and obfuscated phone/WhatsApp reveal coming in Phase 4.',
    ctaNote: 'Phase 4: Booking form + Phone/WhatsApp reveal',
  },
  footer: {
    rights: '© Andrea Monzani — MONZ. All rights reserved.',
    privacy: 'Privacy Policy',
    cookie: 'Cookie Policy',
    legal: 'Legal Notice',
  },
};
