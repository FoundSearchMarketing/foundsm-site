export interface LegacyImage {
  src: string;
  width?: number;
  height?: number;
  alt: string;
}

export interface LegacyResourceCard {
  title: string;
  href: string;
  categories: string[];
  dateLabel: string;
  datetime: string;
  excerpt: string;
  image?: LegacyImage;
  ctaLabel?: string;
}

export interface LegacyResourceHub {
  title: string;
  description: string;
  canonicalPath: string;
  intro: string;
  image: LegacyImage;
  eyebrow?: string;
  cards: LegacyResourceCard[];
  filters?: string[];
}

export interface LegacyDetailSection {
  title: string;
  intro?: string;
  items?: string[];
  paragraphs?: string[];
}

export interface LegacyLandingPage {
  title: string;
  seoTitle: string;
  description: string;
  canonicalPath: string;
  eyebrow?: string;
  lead: string;
  paragraphs: string[];
  image?: LegacyImage;
  formTitle: string;
  formId: string;
  cta?: {
    label: string;
    href: string;
  };
  sections: LegacyDetailSection[];
}

export interface LegacyVideoPage {
  title: string;
  seoTitle: string;
  description: string;
  canonicalPath: string;
  youtubeId: string;
  fallbackHref?: string;
  intro?: string;
  tone?: "thank-you" | "watch";
}

export interface LegacyAuthorArticle {
  title: string;
  href: string;
  dateLabel: string;
  datetime: string;
}

export interface LegacyAuthor {
  slug: string;
  name: string;
  role: string;
  team: string;
  startDate: string;
  expertise: string;
  image: LegacyImage;
  bio: string[];
  directoryBio: string;
  linkedin?: string;
  articles: LegacyAuthorArticle[];
}

const uploadBase = "https://foundsm.com/found2025/wp-content/uploads";

const dateToDatetime: Record<string, string> = {
  "March 26, 2026": "2026-03-26",
  "March 20, 2026": "2026-03-20",
  "March 11, 2026": "2026-03-11",
  "March 6, 2026": "2026-03-06",
  "February 18, 2026": "2026-02-18",
  "February 2, 2026": "2026-02-02",
  "January 23, 2026": "2026-01-23",
  "January 20, 2026": "2026-01-20",
  "January 6, 2026": "2026-01-06",
  "January 2, 2026": "2026-01-02",
  "December 9, 2025": "2025-12-09",
  "November 10, 2025": "2025-11-10",
  "June 10, 2025": "2025-06-10",
};

const localizeHref = (href: string) => {
  try {
    const url = new URL(href, "https://foundsm.com");
    return url.hostname === "foundsm.com" ? url.pathname : href;
  } catch {
    return href;
  }
};

export const legacyResourceCards: Record<string, LegacyResourceCard> = {
  dirtySignals: {
    title: "Bot Traffic and Bad Lookalikes: How Dirty Signals Can Wreck Your Funnel and Your Targeting",
    href: "/insights/dirty-signals-bot-traffic-junk-leads/",
    categories: ["Blog", "Marketing Analytics & Tracking", "Paid Media Strategy"],
    dateLabel: "March 20, 2026",
    datetime: dateToDatetime["March 20, 2026"],
    excerpt: "Leads are up. Pipeline quality is down. Dirty signals can poison optimization and steer budget to the wrong audiences. Here's what executives should watch.",
    image: {
      src: `${uploadBase}/2026/03/bot-traffic-sm-850x500.webp`,
      width: 850,
      height: 500,
      alt: "Abstract bot traffic illustration",
    },
  },
  customerMatch: {
    title: "Google Ads API Update: A Critical Change for Customer Match",
    href: "/insights/customer-match-uploads-disabled-in-google-ads-api/",
    categories: ["Blog", "Industry Insights", "Marketing Analytics & Tracking"],
    dateLabel: "March 11, 2026",
    datetime: dateToDatetime["March 11, 2026"],
    excerpt: "Google Ads API Update could disrupt your Customer Match workflows starting April 2026. Here's how to prepare.",
    image: {
      src: `${uploadBase}/2026/03/GA-API-update-hero-850x500.webp`,
      width: 850,
      height: 500,
      alt: "Google Ads API update visual",
    },
  },
  signalLoss: {
    title: "When Marketing Metrics and Financial Results Don't Align: Understanding Signal Loss",
    href: "/insights/signal-loss-costs-real-revenue/",
    categories: ["Blog", "Industry Insights", "Marketing Analytics & Tracking"],
    dateLabel: "March 6, 2026",
    datetime: dateToDatetime["March 6, 2026"],
    excerpt: "Marketing says ROAS is 3.5:1. Finance disagrees. The gap is not a reporting error, it is signal loss. Here's where to find it.",
    image: {
      src: `${uploadBase}/2026/02/Untitled-1200-x-801-px-850x500.webp`,
      width: 850,
      height: 500,
      alt: "Signal loss concept graphic",
    },
  },
  signalQuiz: {
    title: "Signal Quiz",
    href: "/signal-quiz/",
    categories: ["Quiz", "Tools and Guides"],
    dateLabel: "January 20, 2026",
    datetime: dateToDatetime["January 20, 2026"],
    excerpt: 'Are you scaling profit or just burning cash? Answer 7 questions to uncover your Revenue Engineering Score and identify the "leaks" in your paid media budget.',
    image: {
      src: `${uploadBase}/2026/03/signal-quiz-feature-850x500.webp`,
      width: 850,
      height: 500,
      alt: "Signal quiz feature graphic",
    },
    ctaLabel: "Take the Quiz",
  },
  firstPartyData: {
    title: "Insights - Why First-Party Data Is Your Most Valuable Profit Lever",
    href: "/whitepapers/first-party-data/",
    categories: ["White Papers"],
    dateLabel: "December 9, 2025",
    datetime: dateToDatetime["December 9, 2025"],
    excerpt: "Unlock the Profit Potential of Your First-Party Data.",
    image: {
      src: `${uploadBase}/2026/03/first-party-whitepaper-feature-850x500.webp`,
      width: 850,
      height: 500,
      alt: "First-party data white paper feature graphic",
    },
    ctaLabel: "Get the Whitepaper",
  },
  manVsMachine: {
    title: "Man vs Machine - SMX - On-Demand Webinar",
    href: "/insights/man-vs-machine-smx-webinar/",
    categories: ["Webinars"],
    dateLabel: "March 26, 2026",
    datetime: dateToDatetime["March 26, 2026"],
    excerpt: "Man vs Machine: Finding the Right Balance for Winning Paid Media Strategies.",
    image: {
      src: `${uploadBase}/2026/03/manvsmachine-smx-feature-850x500.webp`,
      width: 850,
      height: 500,
      alt: "Man vs Machine webinar feature graphic",
    },
    ctaLabel: "Watch Video",
  },
  dataArchitectureWebinar: {
    title: "Modernize Your Data Architecture - On-Demand Webinar",
    href: "/insights/modernize-your-data-architecture-webinar/",
    categories: ["Webinars"],
    dateLabel: "March 6, 2026",
    datetime: dateToDatetime["March 6, 2026"],
    excerpt: "Future-Proof Your Paid Media Strategy by Modernizing Your Data Architecture.",
    image: {
      src: `${uploadBase}/2026/02/infotrust-webinar-formheader-postevent-1-850x500.webp`,
      width: 850,
      height: 500,
      alt: "Data architecture webinar feature graphic",
    },
    ctaLabel: "Watch Video",
  },
  cookiesWebinar: {
    title: "Website Cookies Explained: Myths, Mistakes & What Marketers Need to Know",
    href: "/insights/website-cookies-explained-on-demand-webinar/",
    categories: ["Webinars"],
    dateLabel: "March 6, 2026",
    datetime: dateToDatetime["March 6, 2026"],
    excerpt: "A practical webinar on cookie myths, common mistakes, and what marketers need to know.",
    image: {
      src: `${uploadBase}/2026/03/cookie-chat-sm-850x500.webp`,
      width: 850,
      height: 500,
      alt: "Website cookies webinar feature graphic",
    },
    ctaLabel: "Watch Video",
  },
};

export const allLegacyResources = [
  legacyResourceCards.dirtySignals,
  legacyResourceCards.customerMatch,
  legacyResourceCards.signalLoss,
  legacyResourceCards.signalQuiz,
  legacyResourceCards.firstPartyData,
  legacyResourceCards.manVsMachine,
  legacyResourceCards.dataArchitectureWebinar,
  legacyResourceCards.cookiesWebinar,
];

export const legacyResourceHubs: Record<string, LegacyResourceHub> = {
  "insights-march-update": {
    title: "Where Bold Ideas Are Found.",
    description: "Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.",
    canonicalPath: "/insights-march-update/",
    intro: "Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.",
    image: {
      src: `${uploadBase}/2025/11/insights_bulb-1.webp?ver=1773664791`,
      width: 434,
      height: 609,
      alt: "Lightbulb and ideas illustration",
    },
    filters: ["Blogs", "Tools and Guides", "White Papers", "Webinars"],
    cards: allLegacyResources.slice(0, 7),
  },
  "insights-march-update-v2": {
    title: "Where Bold Ideas Are Found.",
    description: "Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.",
    canonicalPath: "/insights-march-update-v2/",
    intro: "Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.",
    image: {
      src: `${uploadBase}/2025/11/insights_bulb-1.webp?ver=1773664791`,
      width: 434,
      height: 609,
      alt: "Lightbulb and ideas illustration",
    },
    filters: ["Blogs", "Tools and Guides", "White Papers", "Webinars & Videos"],
    cards: allLegacyResources,
  },
  "insights-filter-results": {
    title: "Where Bold Ideas Are Found.",
    description: "Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.",
    canonicalPath: "/insights-filter-results/",
    intro: "Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.",
    image: {
      src: `${uploadBase}/2025/11/insights_bulb-1.webp?ver=1773664791`,
      width: 434,
      height: 609,
      alt: "Lightbulb and ideas illustration",
    },
    eyebrow: "Filtered Insights",
    cards: [legacyResourceCards.dirtySignals, legacyResourceCards.customerMatch],
  },
  toolsandguides: {
    title: "Actionable Tools & Resources",
    description: "Leverage actionable resources, optimization checklists, and tracking guides to turn complex data into a predictable revenue engine.",
    canonicalPath: "/insights/toolsandguides/",
    intro: "Leverage actionable resources, optimization checklists, and tracking guides to turn complex data into a predictable revenue engine.",
    image: {
      src: `${uploadBase}/2026/03/tools_insights_header_images.webp`,
      width: 434,
      height: 609,
      alt: "Tools and guides illustration",
    },
    cards: [legacyResourceCards.signalQuiz],
  },
  webinars: {
    title: "On-Demand Expert Sessions",
    description: "Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.",
    canonicalPath: "/insights/webinars/",
    intro: "Join our agency leaders for strategic deep dives into advanced analytics, audience modeling, and profitable customer acquisition.",
    image: {
      src: `${uploadBase}/2026/03/play_insights_header_images.webp`,
      width: 434,
      height: 609,
      alt: "Webinars play button illustration",
    },
    cards: [legacyResourceCards.manVsMachine, legacyResourceCards.dataArchitectureWebinar],
  },
  whitepapers: {
    title: "In-Depth Industry Reports",
    description: "Unlock comprehensive research and proprietary frameworks designed to eliminate paid media waste and scale your enterprise growth.",
    canonicalPath: "/insights/whitepapers/",
    intro: "Unlock comprehensive research and proprietary frameworks designed to eliminate paid media waste and scale your enterprise growth.",
    image: {
      src: `${uploadBase}/2026/03/whitepapers_insights_header_images.webp`,
      width: 434,
      height: 609,
      alt: "White papers illustration",
    },
    cards: [legacyResourceCards.firstPartyData],
  },
};

const architectureWalkaways = [
  "A clearer understanding of how data capture and privacy constraints are impacting your paid media performance",
  "Awareness of latest and upcoming key data, privacy, and platform changes coming in 2026 and beyond",
  "Areas of focus to strengthen your data architecture for improved marketing results and attribution",
  "A practical plan for how to operationalize these changes across teams and stakeholders",
];

const architectureTopics = [
  "Current state environment",
  "Privacy-first data governance",
  "Server-side technologies",
  "From strategy to execution",
  "Overcoming organizational and technical barriers",
];

const architectureDescription =
  "In this webinar, industry experts at Found Search Marketing and InfoTrust take a forward-looking, practical look at how these changes are impacting paid media performance today, and what media teams should be doing now to future-proof their data architecture, measurement and ROI.";

export const legacyLandingPages: Record<string, LegacyLandingPage> = {
  "modernize-your-data-architecture": {
    title: "Modernizing Your Data Architecture for Successful Paid Media ROI",
    seoTitle: "Modernize Your Data Architecture - Found Search Marketing",
    description: architectureDescription,
    canonicalPath: "/insights/modernize-your-data-architecture/",
    lead: "Future-Proof Your Paid Media Strategy",
    paragraphs: [
      "Data privacy regulations are tightening. Browsers are limiting tracking. Ad platforms are evolving fast, and machine learning now depends on the quality of the data you feed it.",
      architectureDescription,
      "You'll learn how to move beyond fragile tracking setups toward a more resilient, privacy-first foundation that supports better optimization, attribution, and long-term growth.",
    ],
    image: {
      src: `${uploadBase}/2026/02/infotrust-webinar-formheader-4-1024x640.webp`,
      width: 1024,
      height: 640,
      alt: "Modernize Your Data Architecture webinar graphic",
    },
    formTitle: "Register Now",
    formId: "8da3331a-0b72-4ab9-9333-60b69e9c8985",
    sections: [
      {
        title: "What You'll Walk Away With",
        intro: "By the end of this session, you'll have:",
        items: architectureWalkaways,
      },
      {
        title: "Topics We'll Cover",
        items: architectureTopics,
      },
    ],
  },
  "modernize-your-data-architecture-webinar": {
    title: "Modernize Your Data Architecture",
    seoTitle: "Modernize Your Data Architecture - On-Demand Webinar - Found Search Marketing",
    description: architectureDescription,
    canonicalPath: "/insights/modernize-your-data-architecture-webinar/",
    eyebrow: "On-Demand Webinar",
    lead: "Future-Proof Your Paid Media Strategy by Modernizing Your Data Architecture",
    paragraphs: [
      "Data privacy regulations are tightening. Browsers are limiting tracking. Ad platforms are evolving fast, and machine learning now depends on the quality of the data you feed it.",
      architectureDescription,
      "You'll learn how to move beyond fragile tracking setups toward a more resilient, privacy-first foundation that supports better optimization, attribution, and long-term growth.",
    ],
    image: {
      src: `${uploadBase}/2026/02/infotrust-webinar-formheader-postevent-1-1024x576.webp`,
      width: 1024,
      height: 576,
      alt: "Modernize Your Data Architecture on-demand webinar graphic",
    },
    formTitle: "Unlock the Webinar",
    formId: "8302ef10-2b2c-4602-b5df-a538465f86fd",
    sections: [
      {
        title: "What You'll Walk Away With",
        intro: "By the end of this session, you'll have:",
        items: architectureWalkaways,
      },
      {
        title: "Topics Covered",
        items: architectureTopics,
      },
    ],
  },
  "first-party-data": {
    title: "Why First-Party Data Is Your Most Valuable Profit Lever",
    seoTitle: "Why First-Party Data Is Your Most Valuable Profit Lever",
    description:
      "In this comprehensive technical guide, you'll learn how to architect a closed-loop data system that feeds real revenue intelligence back into your ad platforms.",
    canonicalPath: "/whitepapers/first-party-data/",
    lead: "Unlock the Profit Potential of Your First-Party Data",
    paragraphs: [
      "AI has permanently rewritten the rules of digital advertising. With Google, Meta, and other major ad platforms shifting to black-box, machine-learning systems, marketers can no longer rely on manual optimization, pixel-based tracking, or surface-level conversion events. The brands that win in this new landscape will be the ones that control and activate their own first-party data.",
      "This white paper is your blueprint for doing exactly that.",
      "In this comprehensive technical guide, you'll learn how to architect a closed-loop data system that feeds real revenue intelligence back into your ad platforms. You'll discover how to capture durable identifiers, store them in a resilient first-party framework, and push enriched, truth-based events directly into Google, Meta, LinkedIn, and beyond.",
    ],
    formTitle: "Download Now",
    formId: "2c65e995-aba0-4239-955c-9beb15b0791d",
    cta: {
      label: "Schedule a Call with our Team",
      href: "https://meetings.hubspot.com/austen-pitman",
    },
    sections: [
      {
        title: "What You'll Gain",
        intro: "Marketers, revenue leaders, and technical operators will walk away with a deep understanding of:",
        items: [
          "Why browser-side tracking is collapsing and how to build a signal-resilient infrastructure that survives ITP, ETP, and cookie loss.",
          "How to design a first-party data capture layer that collects the identifiers AI algorithms need to optimize correctly.",
          "How to unify marketing and sales data so that revenue, not form fills, becomes the core training signal for your ad platforms.",
          "How server-to-server APIs transform campaign performance, attribution accuracy, and bidding efficiency.",
          "How to implement value-based and propensity-based bidding, enabling algorithms to prioritize high-value customers over low-intent noise.",
          "A full technical readiness audit to assess whether your organization is structurally prepared for AI-era advertising.",
        ],
      },
      {
        title: "Who This Is For",
        paragraphs: [
          "This resource is designed for Revenue Operations, Marketing Operations, Data Engineering, and Paid Media leaders who need more than conceptual advice and recognize the need for a detailed architectural plan.",
          "If you're responsible for scaling revenue, improving measurement, or modernizing your marketing infrastructure, this white paper will give you the strategic clarity and technical depth required to build an AI-ready organization.",
        ],
      },
    ],
  },
};

export const legacyVideoPages: Record<string, LegacyVideoPage> = {
  "man-vs-machine-smx-webinar": {
    title: "Man vs Machine: Finding the Right Balance for Winning Paid Media Strategies",
    seoTitle: "Man vs Machine - SMX - On-Demand Webinar | Found Search Marketing",
    description: "Man vs Machine: Finding the Right Balance for Winning Paid Media Strategies",
    canonicalPath: "/insights/man-vs-machine-smx-webinar/",
    youtubeId: "h3zhEVLPBBY",
    tone: "watch",
  },
  "website-cookies-explained-on-demand-webinar": {
    title: "Website Cookies Explained: Myths, Mistakes & What Marketers Need to Know",
    seoTitle: "Thank you for Registering | Enjoy the Webinar",
    description: "Website Cookies Explained: Myths, Mistakes & What Marketers Need to Know",
    canonicalPath: "/insights/website-cookies-explained-on-demand-webinar/",
    youtubeId: "rkLathrzU94",
    tone: "watch",
  },
  webinar: {
    title: "Thank You for Registering!",
    seoTitle: "Thank you for Registering | Enjoy the Webinar",
    description: "Modernizing Your Data Webinar Download",
    canonicalPath: "/insights/webinar/",
    youtubeId: "LTj-Em9KPRU",
    fallbackHref: "https://youtu.be/LTj-Em9KPRU",
    intro: "Please use this link if the video does not automatically pop up.",
    tone: "thank-you",
  },
};

const commonAuthorArticles: LegacyAuthorArticle[] = [
  {
    title: legacyResourceCards.dirtySignals.title,
    href: legacyResourceCards.dirtySignals.href,
    dateLabel: legacyResourceCards.dirtySignals.dateLabel,
    datetime: legacyResourceCards.dirtySignals.datetime,
  },
  {
    title: legacyResourceCards.customerMatch.title,
    href: legacyResourceCards.customerMatch.href,
    dateLabel: legacyResourceCards.customerMatch.dateLabel,
    datetime: legacyResourceCards.customerMatch.datetime,
  },
  {
    title: legacyResourceCards.signalLoss.title,
    href: legacyResourceCards.signalLoss.href,
    dateLabel: legacyResourceCards.signalLoss.dateLabel,
    datetime: legacyResourceCards.signalLoss.datetime,
  },
  {
    title: "Google's Vision for 2026: Building a Revenue Engine Powered by Data",
    href: "/insights/googles-vision-for-2026-building-a-revenue-engine-powered-by-data/",
    dateLabel: "February 18, 2026",
    datetime: dateToDatetime["February 18, 2026"],
  },
];

export const legacyAuthors: LegacyAuthor[] = [
  {
    slug: "julie",
    name: "Julie Warnecke",
    role: "CEO",
    team: "Executive Leadership",
    startDate: "2006",
    expertise: "Measurement Strategy, Operational Excellence, Strategic Growth",
    image: {
      src: `${uploadBase}/2026/02/Julie-Warnecke-FoundSM-au.webp`,
      width: 300,
      height: 375,
      alt: "Julie Warnecke",
    },
    directoryBio:
      "Julie Warnecke is the Founder and CEO of Found Search Marketing, a Midwest firm managing over $200M in annual media spend. An early Google employee instrumental in launching AdWords, she established Found in 2006.",
    bio: [
      "After getting her start at Google in 2001 as one of the first employees on the AdWords Ad Operations team, Julie helped launch initiatives that shaped the future of paid media and search.",
      "In 2006, Julie returned to the Midwest with a mission: build a new kind of agency that serves as a seamless extension of existing client teams. Found was born from that idea and it continues to fuel the company's success today.",
      "Julie is known for prioritizing client outcomes, empowering her teams to thrive, and building trust through transparency and measurable results.",
    ],
    linkedin: "https://www.linkedin.com/in/julie-warnecke-9313651/",
    articles: [
      {
        title: "How Advantage+ Is Reshaping Student Recruitment, Insights from a Meta Education Summit",
        href: "/insights/how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit/",
        dateLabel: "November 10, 2025",
        datetime: dateToDatetime["November 10, 2025"],
      },
    ],
  },
  {
    slug: "kelley",
    name: "Kelley Swart",
    role: "VP, Strategy & Growth",
    team: "Executive Leadership",
    startDate: "2014",
    expertise: "Client Alignment, Growth Architecture, Scalable Systems",
    image: {
      src: `${uploadBase}/2026/02/Kelley_author_profile-240x300.webp`,
      width: 300,
      height: 375,
      alt: "Kelley Swart",
    },
    directoryBio:
      "Kelley brings 25+ years of experience, starting at Google Ads. She has led strategic planning for Fortune 1000 clients across CPG, Retail, and Higher Ed.",
    bio: [
      "Kelley is the VP of Strategy & Growth at Found, bringing over 25 years of digital marketing experience to the team.",
      "She started her career as a member of the Google Ads team and has since developed data-driven marketing strategies for both small businesses and Fortune 1000 clients.",
      "With expertise in CPG, Retail, Travel, and Higher Education, Kelley provides strategic oversight and builds strong client relationships.",
    ],
    linkedin: "https://www.linkedin.com/in/kelleyswart/",
    articles: [
      {
        title: "Our Top Takeaways From Search Marketing Expo Advanced 2025",
        href: "/insights/our-top-takeaways-from-search-marketing-expo-advanced-2025/",
        dateLabel: "June 10, 2025",
        datetime: dateToDatetime["June 10, 2025"],
      },
    ],
  },
  {
    slug: "nicholas",
    name: "Nicholas Hoium",
    role: "Head of Data Engineering",
    team: "Innovation",
    startDate: "2010",
    expertise: "Google Cloud Certified Data Engineer",
    image: {
      src: `${uploadBase}/2026/03/Nicholas_author_profile.webp`,
      width: 300,
      height: 375,
      alt: "Nicholas Hoium",
    },
    directoryBio:
      "With over 15 years of experience, Head of Data Engineering Nicholas Hoium builds advanced pipelines and web analytics solutions.",
    bio: [
      "Leading our technical strategy as Head of Data Engineering, Nicholas Hoium brings over 15 years of dedicated experience to the team, architecting the digital foundations that drive our partners' growth.",
      "A Google Cloud Certified Data Engineer with a B.S. in Informatics from IU Bloomington, Nicholas combines technical precision with an innate curiosity for emerging technologies.",
      "Nicholas thrives in Found's supportive environment, valuing the mutual trust and knowledge-sharing that defines the team culture.",
    ],
    linkedin: "https://www.linkedin.com/in/nicholas-hoium/",
    articles: commonAuthorArticles,
  },
  {
    slug: "ryan",
    name: "Ryan Eme",
    role: "Head of Data Intelligence",
    team: "Innovation",
    startDate: "2014",
    expertise: "Audience Intelligence, Data Strategy, Attribution Modeling",
    image: {
      src: `${uploadBase}/2026/02/Ryan_author_profile-240x300.webp`,
      width: 300,
      height: 375,
      alt: "Ryan Eme",
    },
    directoryBio:
      "Ryan Eme is the Head of Data Intelligence at Found, bringing 20 years of experience in data-driven marketing.",
    bio: [
      "With nearly 20 years of expertise in data-driven marketing and analytics, Ryan Eme is known for turning complex data into innovative solutions.",
      "As the Head of Data Intelligence, Ryan leads innovative projects and helps the agency and clients solve problems while maximizing the value of marketing budgets.",
      "A Certified Google Cloud Data Engineer with advanced skills in Google Analytics and tag management, he helps clients unlock growth and drive business results.",
    ],
    linkedin: "https://www.linkedin.com/in/ryaneme/",
    articles: [
      {
        title: "ICDPA Isn't Just Compliance. It's the Foundation of Smarter Data Strategy.",
        href: "/insights/indiana-consumer-data-protection-act/",
        dateLabel: "February 2, 2026",
        datetime: dateToDatetime["February 2, 2026"],
      },
      {
        title: "A 3 Minute Implementation Guide to Segmenting AI Traffic in GA4",
        href: "/insights/a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4/",
        dateLabel: "January 2, 2026",
        datetime: dateToDatetime["January 2, 2026"],
      },
    ],
  },
  {
    slug: "adam",
    name: "Adam Persinger",
    role: "Head of Strategic Media",
    team: "Innovation",
    startDate: "2016",
    expertise: "Strategic Media, Performance Forecasting, Channel Strategy",
    image: {
      src: `${uploadBase}/2026/02/Adam_author_profile-240x300.webp`,
      width: 300,
      height: 375,
      alt: "Adam Persinger",
    },
    directoryBio:
      "Adam joined Found Search Marketing in 2016, leveraging his media strategy background to drive client results through research and testing.",
    bio: [
      "Adam joined Found Search Marketing in June 2016 and brings a strong background in media strategy and innovative marketing solutions.",
      "A graduate of Brown University with a degree in Cognitive Neuroscience and Economics, Adam focuses on research and testing to drive successful outcomes for clients and the agency.",
      "Adam's superpower is turning ambiguity into clear, confident decisions by connecting complex media systems to real-world business outcomes.",
    ],
    linkedin: "https://www.linkedin.com/in/adampersinger/",
    articles: [
      {
        title: "Google's Vision for 2026: Building a Revenue Engine Powered by Data",
        href: "/insights/googles-vision-for-2026-building-a-revenue-engine-powered-by-data/",
        dateLabel: "February 18, 2026",
        datetime: dateToDatetime["February 18, 2026"],
      },
      {
        title: "Closing the Loop: How Conversion APIs and Value-Based Bidding Transform Performance Marketing",
        href: "/insights/closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing/",
        dateLabel: "January 23, 2026",
        datetime: dateToDatetime["January 23, 2026"],
      },
    ],
  },
  {
    slug: "caroline",
    name: "Caroline Stoner",
    role: "Head of User Experience",
    team: "Innovation",
    startDate: "2017",
    expertise: "User Experience & Strategy, CRO, Unbounce Expert",
    image: {
      src: `${uploadBase}/2026/02/Caroline_author_profile-240x300.webp`,
      width: 300,
      height: 375,
      alt: "Caroline Stoner",
    },
    directoryBio:
      "As one of only 10 Unbounce Experts worldwide, Caroline specializes in creating high-performing landing pages and optimizing conversion rates.",
    bio: [
      "Caroline is our in-house Unbounce Expert, and one of only 10 experts worldwide.",
      "She's passionate about creating high-performing landing pages and spends her time optimizing conversion rates for clients.",
      "With a strong background in marketing and advertising, Caroline brings expertise in CRO, web design, SEO, and landing page development.",
    ],
    linkedin: "https://www.linkedin.com/in/caroline-stoner/",
    articles: [
      {
        title: legacyResourceCards.dirtySignals.title,
        href: legacyResourceCards.dirtySignals.href,
        dateLabel: legacyResourceCards.dirtySignals.dateLabel,
        datetime: legacyResourceCards.dirtySignals.datetime,
      },
      {
        title: legacyResourceCards.customerMatch.title,
        href: legacyResourceCards.customerMatch.href,
        dateLabel: legacyResourceCards.customerMatch.dateLabel,
        datetime: legacyResourceCards.customerMatch.datetime,
      },
      {
        title: legacyResourceCards.signalLoss.title,
        href: legacyResourceCards.signalLoss.href,
        dateLabel: legacyResourceCards.signalLoss.dateLabel,
        datetime: legacyResourceCards.signalLoss.datetime,
      },
      commonAuthorArticles[3],
    ],
  },
  {
    slug: "kylie",
    name: "Kylie Colquitt",
    role: "Group Account Director",
    team: "Client Partnership",
    startDate: "2017",
    expertise: "Client Services",
    image: {
      src: `${uploadBase}/2026/02/Kylie_author_profile.webp`,
      width: 300,
      height: 375,
      alt: "Kylie Colquitt",
    },
    directoryBio:
      "As Group Account Director, Kylie leverages 15+ years of experience to orchestrate cross-channel strategies that drive client growth.",
    bio: [
      "As a Group Account Director, Kylie Colquitt leads with a client-first mindset, orchestrating cross-channel strategies that drive meaningful growth for our partners.",
      "With over 15 years of experience in the industry, including seven formative years at top agencies in Chicago, Kylie brings a wealth of knowledge in client services.",
      "Her collaborative leadership style emphasizes deep partnership, aligning our agency's efforts with client goals to maximize impact.",
    ],
    linkedin: "https://www.linkedin.com/in/kyliecolquitt/",
    articles: commonAuthorArticles,
  },
  {
    slug: "matt",
    name: "Matt Dragoo",
    role: "Senior Data Analyst",
    team: "Client Partnership",
    startDate: "2019",
    expertise: "Reporting, Analysis, Paid Media Management",
    image: {
      src: `${uploadBase}/2026/02/Matt_author_profile.webp`,
      width: 300,
      height: 375,
      alt: "Matt Dragoo",
    },
    directoryBio:
      "Since joining Found in 2019, Purdue graduate Matt crafts data-driven paid media strategies across reporting, analysis, and paid media management.",
    bio: [
      "Matt Dragoo has been with Found since 2019, starting his career in paid media right out of Purdue University, where he earned dual majors in Marketing and Management.",
      "Certified in Google Ads, Google Analytics, Meta Ads, Microsoft Advertising, and Applied Bayesian Modeling, Matt has worked on a wide range of accounts throughout his career.",
      "Matt combines analytics with creativity to help clients maximize their ROI and achieve business goals.",
    ],
    linkedin: "https://www.linkedin.com/in/matthew-dragoo-a64011107/",
    articles: commonAuthorArticles,
  },
  {
    slug: "emily",
    name: "Emily Williams-Hempstead",
    role: "Strategist",
    team: "Client Partnership",
    startDate: "2020",
    expertise: "Communication, collaboration & problem solving",
    image: {
      src: `${uploadBase}/2026/03/Emily-FoundSM.webp`,
      width: 300,
      height: 375,
      alt: "Emily Williams-Hempstead",
    },
    directoryBio:
      "Strategist Emily Williams-Hempstead untangles complex challenges by applying her Psychology and Marketing background to understand human behavior.",
    bio: [
      "As a Strategist, Emily Williams-Hempstead excels at bringing clarity and direction to complex challenges, guiding teams toward practical and impactful solutions.",
      "With a unique academic background in Psychology and Marketing from Indiana State University, she leverages a deep understanding of human behavior to inform her strategic approach.",
      "Her strengths in communication and collaboration make her an essential partner in solving problems and driving results.",
    ],
    linkedin: "https://www.linkedin.com/in/emily-j-williams/",
    articles: commonAuthorArticles,
  },
  {
    slug: "maria",
    name: "Maria Escobedo",
    role: "Associate Data Analyst",
    team: "Client Partnership",
    startDate: "2022",
    expertise: "Data Analysis",
    image: {
      src: `${uploadBase}/2026/02/Maria_author_profile-240x300.webp`,
      width: 300,
      height: 375,
      alt: "Maria Escobedo",
    },
    directoryBio:
      "Maria leverages her Purdue MS in Business Analytics to transform complex datasets into actionable, strategic insights.",
    bio: [
      "With a strong foundation in mathematics and a Master of Science in Business Analytics from Purdue University, Maria brings analytical rigor, precision, and ownership to every project at Found.",
      "As an Associate Data Analyst, she leads our data efforts and specializes in transforming complex performance data into strategic, scalable insights.",
      "Google Search and Display-certified, Maria translates complex datasets into clear, actionable recommendations that align with broader business objectives.",
    ],
    linkedin: "https://www.linkedin.com/in/maria-escobedo-01/",
    articles: commonAuthorArticles,
  },
  {
    slug: "kelsey",
    name: "Kelsey Connor",
    role: "Director, Marketing & Brand Strategy",
    team: "Agency Operations",
    startDate: "2025",
    expertise: "Marketing, Brand & Positioning",
    image: {
      src: `${uploadBase}/2026/02/Kelsey_author_profile-240x300.webp`,
      width: 300,
      height: 375,
      alt: "Kelsey Connor",
    },
    directoryBio:
      "Kelsey brings nearly 20 years of expertise as Director of Agency Marketing and Brand Strategy.",
    bio: [
      "Kelsey brings nearly 20 years of marketing expertise to the table, currently leading the charge as Director of Agency Marketing and Brand Strategy.",
      "With experience on both the client and agency sides, Kelsey thrives on building bridges between the two, fostering collaboration to drive exceptional results.",
      "After graduating from Syracuse University, Kelsey returned to Indiana in 2009 to kick off her career and later earned her MBA from Butler University.",
    ],
    articles: [
      {
        title: "Wrapping Up 19 Years With Purpose: Found's Year-End Tradition of Giving Back",
        href: "/insights/wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back/",
        dateLabel: "January 6, 2026",
        datetime: dateToDatetime["January 6, 2026"],
      },
    ],
  },
];

export const getAuthorBySlug = (slug: string | undefined) => legacyAuthors.find((author) => author.slug === slug);
export const getResourceHubBySlug = (slug: string) => legacyResourceHubs[slug];
export const getLandingPageBySlug = (slug: string) => legacyLandingPages[slug];
export const getVideoPageBySlug = (slug: string) => legacyVideoPages[slug];
export const localizedHref = localizeHref;
