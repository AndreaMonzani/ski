import type { SiteContent } from '../types';

export const contentIt: SiteContent = {
  locale: 'it',
  meta: {
    title: 'MONZ — Andrea Monzani | Maestro di Sci & Coaching Avanzato in Lombardia',
    description:
      'Lezioni private di sci e coaching tecnico avanzato con Andrea Monzani. Radio live Whisper, telemetria Carv e analisi video Frame.io in giornata.',
  },
  nav: {
    cta: 'Richiedi una lezione',
    switchLang: 'EN',
    specimenLink: 'Font',
    links: {
      about: 'Approccio',
      method: 'Metodo',
      services: 'Servizi',
      faq: 'FAQ',
    },
  },
  hero: {
    eyebrow: 'ANDREA MONZANI · MAESTRO DI SCI',
    headline: 'MONZ',
    tagline: 'Sentilo. Misuralo. Vedilo.',
    subcopy:
      'Coaching privato per sciatori avanzati in Lombardia. Feedback vocale in tempo reale, telemetria e analisi video frame-by-frame in giornata.',
    primaryCta: 'Richiedi una lezione',
    secondaryCta: 'Scopri il metodo',
  },
  about: {
    eyebrow: '01 / CHI SONO',
    title: 'Non una scuola sci. Un percorso tecnico su misura.',
    paragraphs: [
      'Sono Andrea Monzani, maestro di sci indipendente. Lavoro con sciatori che vogliono fare un salto netto di precisione, conduzione e controllo, senza formule standard da corso collettivo.',
      'Ho studiato in Canada e negli Stati Uniti e insegno correntemente anche in inglese. Ogni uscita combina sensazione in pista, dati oggettivi e revisione video, così capisci davvero cosa cambia da una curva all’altra.',
    ],
    highlights: [
      { label: 'Focus', value: 'Sciatori avanzati & performance' },
      { label: 'Lingue', value: 'Italiano & English (fluent)' },
      { label: 'Area', value: 'Lombardia (on-demand)' },
    ],
  },
  method: {
    eyebrow: '02 / IL METODO',
    title: 'Tre livelli. Un unico sistema di coaching.',
    subtitle:
      'Ogni strumento lavora insieme agli altri due: correzione immediata mentre scii, misura oggettiva della curva e analisi visiva che resta tua.',
    visitSite: 'Sito ufficiale',
    tools: [
      {
        id: 'whisper',
        index: '01',
        name: 'Whisper',
        layer: 'SENTILO · RADIO LIVE',
        oneLiner: 'Sistema radio live per feedback vocale continuo durante la discesa.',
        benefit:
          'Ricevi indicazioni chiare, immediate e legate esattamente a ciò che senti in quella curva, senza aspettare la fine della pista.',
        url: null,
        urlPlaceholder: 'TODO_ANDREA: link ufficiale produttore Whisper',
      },
      {
        id: 'carv',
        index: '02',
        name: 'Carv',
        layer: 'MISURALO · TELEMETRIA',
        oneLiner: 'Sensori di telemetria che misurano la tua sciata in tempo reale.',
        benefit:
          'Ti aiuto a leggere i dati e ad auto-analizzarti, così il miglioramento continua anche quando scii da solo.',
        url: 'https://getcarv.com',
      },
      {
        id: 'frameio',
        index: '03',
        name: 'Frame.io',
        layer: 'VEDILO · ANALISI VIDEO',
        oneLiner: 'Analisi video frame-by-frame consegnata in giornata.',
        benefit:
          'Filmo la sessione e carico feedback scritti precisi sui singoli fotogrammi: sempre disponibili sulla piattaforma e scaricabili.',
        url: 'https://frame.io',
      },
    ],
  },
  services: {
    eyebrow: '03 / SERVIZI',
    title: 'Sessioni private progettate intorno al tuo obiettivo.',
    rateNote: 'Tariffe su richiesta in base a località, durata e tipologia di sessione.',
    items: [
      {
        title: 'Lezioni private',
        tag: '1-to-1 / Privato',
        description: 'Percorsi personalizzati su tecnica, centralità, presa di spigolo e gestione della velocità.',
      },
      {
        title: 'Lezioni individuali',
        tag: 'Focus totale',
        description: 'Massima densità di feedback su ogni singola curva, con radio live e revisione mirata.',
      },
      {
        title: 'Piccoli gruppi',
        tag: 'Livello omogeneo',
        description: 'Sessioni riservate a piccoli gruppi di sciatori di livello simile che vogliono crescere insieme.',
      },
      {
        title: 'Coaching tecnico',
        tag: 'Performance',
        description: 'Lavoro avanzato su conduzione, cambio spigolo, ritmo e adattamento ai diversi terreni.',
      },
      {
        title: 'Analisi video in giornata',
        tag: 'Frame.io',
        description: 'Riprese in pista e consegna il giorno stesso con commenti precisi frame-by-frame.',
      },
      {
        title: 'Sessioni full-day',
        tag: 'Giornata intera',
        description: 'Immersione completa per consolidare gli automatismi su piste e condizioni diverse.',
      },
    ],
  },
  gear: {
    eyebrow: '04 / ATTREZZATURA PREMIUM',
    title: 'Noleggio sci di alta gamma su prenotazione.',
    description:
      'Se vuoi sciare con attrezzatura di livello superiore, coordino per te il noleggio tramite il negozio partner Buzzetti Sport. Non è un e-commerce: gestisco io il contatto e la prenotazione così trovi il setup pronto per la tua giornata.',
    partnerName: 'Buzzetti Sport',
    partnerUrl: null,
    cta: 'Richiedi nel modulo prenotazione',
  },
  locations: {
    eyebrow: '05 / DOVE LAVORO',
    title: 'Mi sposto io, principalmente in Lombardia.',
    description:
      'Opero in autonomia e raggiungo i miei clienti nelle principali località lombarde. Indica la tua zona preferita nella richiesta per organizzare la giornata.',
    todoNote: 'TODO_ANDREA: elenco confermato delle località/comprensori in Lombardia.',
  },
  gallery: {
    eyebrow: '06 / GALLERY',
    title: 'Sul campo.',
    placeholderCaption: 'TODO_ANDREA: foto e clip originali (caricate via VS Code + git push in /public/assets/).',
  },
  process: {
    eyebrow: '07 / COME FUNZIONA',
    title: 'Quattro passaggi, zero attriti.',
    steps: [
      {
        number: '01',
        title: 'Richiesta',
        description: 'Compili il modulo indicando livello, località, date preferite ed eventuale noleggio premium.',
      },
      {
        number: '02',
        title: 'Conferma',
        description: 'Ti rispondo personalmente per definire orari, punto di ritrovo e dettagli della sessione.',
      },
      {
        number: '03',
        title: 'Lezione in pista',
        description: 'Lavoriamo con radio live Whisper, telemetria Carv e riprese mirate.',
      },
      {
        number: '04',
        title: 'Analisi in giornata',
        description: 'Ricevi l’analisi video frame-by-frame su Frame.io, sempre consultabile e scaricabile.',
      },
    ],
  },
  faq: {
    eyebrow: '08 / FAQ',
    title: 'Domande frequenti.',
    items: [
      {
        question: 'A che livello di sciata è rivolto il coaching MONZ?',
        answer:
          'Il focus principale è su sciatori intermedi evoluti, avanzati, esperti e agonisti che vogliono migliorare precisione, conduzione e consapevolezza tecnica.',
      },
      {
        question: 'Come funzionano le tariffe e la prenotazione?',
        answer:
          'Non ci sono pagamenti online né calendari automatici: invii una richiesta dal modulo e definiamo insieme programma e tariffa su richiesta.',
      },
      {
        question: 'Posso prenotare la lezione interamente in inglese?',
        answer:
          'Sì. Ho studiato in Canada e negli Stati Uniti e tengo lezioni e analisi video fluentemente in inglese.',
      },
      {
        question: 'Come funziona il noleggio attrezzatura premium?',
        answer:
          'Seleziona l’opzione dedicata nel modulo di richiesta: coordino io la prenotazione con il partner Buzzetti Sport in base al tuo livello e agli obiettivi della giornata.',
      },
    ],
  },
  bookingPlaceholder: {
    eyebrow: '09 / PRENOTAZIONE',
    title: 'Richiedi la tua sessione.',
    subtitle:
      'Modulo di richiesta, invio email tramite Resend e pulsante protetto per telefono e WhatsApp in arrivo nella Fase 4.',
    ctaNote: 'Fase 4: Form prenotazione + Phone/WhatsApp reveal',
  },
  footer: {
    rights: '© Andrea Monzani — MONZ. Tutti i diritti riservati.',
    privacy: 'Privacy Policy',
    cookie: 'Cookie Policy',
    legal: 'Note Legali',
  },
};
