/**
 * Translation data for Wine Encyclopedia landing page
 * Supports Italian (default) and English
 */

export type Language = 'it' | 'en';

export interface Translations {
  [key: string]: {
    it: string;
    en: string;
  };
}

export const translations: Translations = {
  // Header / Hero Section
  'hero.tagline': {
    it: 'Un viaggio digitale nel mondo del vino',
    en: 'A digital journey into the world of wine'
  },
  'hero.description': {
    it: 'Wine Encyclopedia nasce dalla passione per il vino e dal desiderio di creare una piattaforma strutturata, accessibile e formativa sul mondo del vino e delle cantine, con un forte focus sulla cultura vinicola italiana.',
    en: 'Wine Encyclopedia was born from a passion for wine and the desire to create a structured, accessible, and educational platform about wines and wineries, with a strong focus on Italian wine culture.'
  },
  'hero.cta.primary': {
    it: 'Scopri il progetto',
    en: 'Discover the project'
  },
  'hero.cta.secondary': {
    it: 'Visualizza su GitHub',
    en: 'View on GitHub'
  },

  // Why Section
  'why.title': {
    it: 'Perché Wine Encyclopedia',
    en: 'Why Wine Encyclopedia'
  },
  'why.subtitle': {
    it: 'Un progetto nato dalla passione, costruito con competenza',
    en: 'A project born from passion, built with expertise'
  },
  'why.reason1.title': {
    it: 'Informazioni frammentate',
    en: 'Fragmented information'
  },
  'why.reason1.description': {
    it: 'Le informazioni sui vini sono spesso sparse tra molteplici fonti, rendendo difficile trovare contenuti affidabili e completi in un unico posto.',
    en: 'Wine information is often scattered across multiple sources, making it difficult to find reliable and comprehensive content in one place.'
  },
  'why.reason2.title': {
    it: 'Base di conoscenza strutturata',
    en: 'Structured knowledge base'
  },
  'why.reason2.description': {
    it: 'Creiamo una risorsa organizzata e facilmente navigabile che raccoglie informazioni su vini, cantine, vitigni e territori in modo sistematico.',
    en: 'We create an organized and easily navigable resource that collects information about wines, wineries, grape varieties, and territories systematically.'
  },
  'why.reason3.title': {
    it: 'Passione e competenza',
    en: 'Passion and expertise'
  },
  'why.reason3.description': {
    it: 'Un progetto guidato dalla passione per il vino, supportato da solide fondamenta tecniche e dalla volontà di condividere conoscenza con la comunità.',
    en: 'A project driven by passion for wine, supported by solid technical foundations and the desire to share knowledge with the community.'
  },

  // Features Section
  'features.title': {
    it: 'Cosa puoi trovare',
    en: 'What you can find'
  },
  'features.subtitle': {
    it: 'Esplora un mondo di contenuti dedicati al vino',
    en: 'Explore a world of wine-dedicated content'
  },
  'features.wineries.title': {
    it: 'Cantine e Vini',
    en: 'Wineries & Wines'
  },
  'features.wineries.description': {
    it: 'Database completo di cantine italiane e internazionali, con schede dettagliate sui vini prodotti, dalla storia alla vinificazione.',
    en: 'Comprehensive database of Italian and international wineries, with detailed sheets on produced wines, from history to winemaking.'
  },
  'features.tasting.title': {
    it: 'Schede di Degustazione',
    en: 'Tasting Sheets'
  },
  'features.tasting.description': {
    it: 'Strumenti professionali per la degustazione, con guide strutturate per analizzare aspetto visivo, olfattivo e gustativo dei vini.',
    en: 'Professional tasting tools with structured guides to analyze visual, olfactory, and taste aspects of wines.'
  },
  'features.grapes.title': {
    it: 'Vitigni e Territori',
    en: 'Grape Varieties & Territories'
  },
  'features.grapes.description': {
    it: 'Esplora le varietà di uva autoctone e internazionali, scopri i territori vinicoli e le loro peculiarità climatiche e geologiche.',
    en: 'Explore native and international grape varieties, discover wine territories and their climatic and geological characteristics.'
  },
  'features.education.title': {
    it: 'Contenuti Educativi',
    en: 'Educational Content'
  },
  'features.education.description': {
    it: 'Articoli, guide e approfondimenti per chi vuole imparare di più sul mondo del vino, dalla storia alle tecniche moderne.',
    en: 'Articles, guides, and insights for those who want to learn more about wine, from history to modern techniques.'
  },
  'features.ai.title': {
    it: 'Intelligenza Artificiale',
    en: 'Artificial Intelligence'
  },
  'features.ai.description': {
    it: 'In arrivo: raccomandazioni personalizzate basate sui tuoi gusti, suggerimenti di abbinamenti cibo-vino e molto altro.',
    en: 'Coming soon: personalized recommendations based on your tastes, food-wine pairing suggestions, and much more.'
  },
  'features.community.title': {
    it: 'Profili Utente',
    en: 'User Profiles'
  },
  'features.community.description': {
    it: 'Crea il tuo profilo, salva i vini preferiti, traccia le tue degustazioni e condividi esperienze con altri appassionati.',
    en: 'Create your profile, save favorite wines, track your tastings, and share experiences with other enthusiasts.'
  },
  'features.comingsoon': {
    it: 'Prossimamente',
    en: 'Coming Soon'
  },

  // Vision Section
  'vision.title': {
    it: 'Visione e Futuro',
    en: 'Vision & Future'
  },
  'vision.subtitle': {
    it: 'Il nostro obiettivo a lungo termine',
    en: 'Our long-term goal'
  },
  'vision.reference.title': {
    it: 'Punto di Riferimento',
    en: 'Reference Point'
  },
  'vision.reference.description': {
    it: 'Diventare la risorsa principale per chiunque voglia approfondire la propria conoscenza del vino, da principianti a professionisti del settore.',
    en: 'Become the main resource for anyone who wants to deepen their wine knowledge, from beginners to industry professionals.'
  },
  'vision.expansion.title': {
    it: 'Espansione Internazionale',
    en: 'International Expansion'
  },
  'vision.expansion.description': {
    it: 'Partendo dalla ricca tradizione vinicola italiana, espanderemo la copertura per includere regioni vinicole di tutto il mondo.',
    en: 'Starting from the rich Italian wine tradition, we will expand coverage to include wine regions from around the world.'
  },
  'vision.community.title': {
    it: 'Crescita della Community',
    en: 'Community Growth'
  },
  'vision.community.description': {
    it: 'Costruire una comunità attiva di appassionati, sommelier e produttori che contribuiscano alla crescita della piattaforma.',
    en: 'Build an active community of enthusiasts, sommeliers, and producers who contribute to the platform\'s growth.'
  },

  // Tech Section
  'tech.title': {
    it: 'Tecnologia e Filosofia',
    en: 'Tech & Philosophy'
  },
  'tech.subtitle': {
    it: 'Costruito con tecnologie moderne e approccio aperto',
    en: 'Built with modern technologies and an open approach'
  },
  'tech.modern.title': {
    it: 'Tecnologie Moderne',
    en: 'Modern Technologies'
  },
  'tech.modern.description': {
    it: 'Sviluppato con Angular, TypeScript e le migliori pratiche del settore per garantire performance, scalabilità e manutenibilità.',
    en: 'Developed with Angular, TypeScript, and industry best practices to ensure performance, scalability, and maintainability.'
  },
  'tech.architecture.title': {
    it: 'Architettura Pulita',
    en: 'Clean Architecture'
  },
  'tech.architecture.description': {
    it: 'Codice organizzato, modulare e ben documentato che segue i principi SOLID e le best practice di sviluppo software.',
    en: 'Organized, modular, and well-documented code that follows SOLID principles and software development best practices.'
  },
  'tech.open.title': {
    it: 'Approccio Aperto',
    en: 'Open Approach'
  },
  'tech.open.description': {
    it: 'Trasparenza nel processo di sviluppo, apertura ai contributi della community e mentalità developer-friendly.',
    en: 'Transparency in the development process, openness to community contributions, and developer-friendly mindset.'
  },

  // CTA Section
  'cta.title': {
    it: 'Unisciti al viaggio',
    en: 'Join the journey'
  },
  'cta.description': {
    it: 'Wine Encyclopedia è un progetto in continua evoluzione. Seguici su GitHub, contribuisci con le tue idee o semplicemente esplora quello che abbiamo costruito finora.',
    en: 'Wine Encyclopedia is a constantly evolving project. Follow us on GitHub, contribute with your ideas, or simply explore what we\'ve built so far.'
  },
  'cta.github': {
    it: 'Esplora su GitHub',
    en: 'Explore on GitHub'
  },
  'cta.contact': {
    it: 'Contattaci',
    en: 'Contact us'
  },
  'cta.feedback': {
    it: 'Il tuo feedback è prezioso per noi. Ogni suggerimento ci aiuta a migliorare.',
    en: 'Your feedback is valuable to us. Every suggestion helps us improve.'
  },

  // Footer
  'footer.tagline': {
    it: 'Un viaggio digitale nel mondo del vino',
    en: 'A digital journey into the world of wine'
  },
  'footer.links.title': {
    it: 'Link Utili',
    en: 'Useful Links'
  },
  'footer.contact.title': {
    it: 'Contatti',
    en: 'Contact'
  },
  'footer.copyright': {
    it: 'Tutti i diritti riservati.',
    en: 'All rights reserved.'
  },
  'footer.madeWith': {
    it: 'Fatto con',
    en: 'Made with'
  },
  'footer.and': {
    it: 'e',
    en: 'and'
  },

  // Navigation
  'nav.why': {
    it: 'Perché',
    en: 'Why'
  },
  'nav.features': {
    it: 'Funzionalità',
    en: 'Features'
  },
  'nav.vision': {
    it: 'Visione',
    en: 'Vision'
  },
  'nav.tech': {
    it: 'Tecnologia',
    en: 'Tech'
  },
  'nav.login': {
    it: 'Accedi',
    en: 'Login'
  }
};
