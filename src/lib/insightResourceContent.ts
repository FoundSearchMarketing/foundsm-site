export interface InsightResourceCard {
  label: string;
  categories?: string[];
  title: string;
  href: string;
  image: string;
  imageAlt?: string;
  dateLabel: string;
  datetime: string;
  excerpt: string;
}

export interface InsightArchivePage {
  kind: 'archive';
  path: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  breadcrumbLabel: string;
  sectionTitle: string;
  columns: 2 | 3;
  cards: InsightResourceCard[];
}

export interface InsightWebinarPage {
  kind: 'webinar';
  path: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  heroTitle: string;
  kicker?: string;
  actionText?: string;
  formHeading: string;
  heroImage: string;
  heroImageAlt: string;
  bodyHeading: string;
  paragraphs: string[];
  takeawayHeading: string;
  takeawayIntro: string;
  takeaways: string[];
  topicsHeading: string;
  topics: string[];
  formId: string;
}

export interface InsightVideoPage {
  kind: 'video';
  path: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage?: string;
  heading: string;
  youtubeId: string;
}

export interface InsightThankYouPage {
  kind: 'thank-you';
  path: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  heading: string;
  linkHref: string;
}

export type InsightResourcePage = InsightArchivePage | InsightWebinarPage | InsightVideoPage | InsightThankYouPage;

export type InsightResourceMeta = Pick<
  InsightResourcePage,
  'title' | 'seoTitle' | 'seoDescription' | 'canonicalUrl'
> & {
  ogImage?: string;
};

const wpUploadBase = 'https://foundsm.com/found2025/wp-content/uploads';

const blogCards: InsightResourceCard[] = [
  {
    label: 'Blog',
    categories: ['Marketing Analytics & Tracking', 'Paid Media Strategy'],
    title: 'Bot Traffic and Bad Lookalikes: How Dirty Signals Can Wreck Your Funnel and Your Targeting',
    href: '/insights/dirty-signals-bot-traffic-junk-leads/',
    image: `${wpUploadBase}/2026/03/bot-traffic-sm-850x500.webp`,
    dateLabel: 'March 20, 2026',
    datetime: '2026-03-20',
    excerpt: 'Leads are up. Pipeline quality is down. Dirty signals can poison optimization and steer budget to the wrong audiences. Here’s what executives should watch.',
  },
  {
    label: 'Blog',
    categories: ['Industry Insights', 'Marketing Analytics & Tracking'],
    title: 'Google Ads API Update: A Critical Change for Customer Match',
    href: '/insights/customer-match-uploads-disabled-in-google-ads-api/',
    image: `${wpUploadBase}/2026/03/GA-API-update-hero-850x500.webp`,
    dateLabel: 'March 11, 2026',
    datetime: '2026-03-11',
    excerpt: 'Google Ads API Update could disrupt your Customer Match workflows starting April 2026. Here’s how to prepare.',
  },
  {
    label: 'Blog',
    categories: ['Industry Insights', 'Marketing Analytics & Tracking'],
    title: 'When Marketing Metrics and Financial Results Don’t Align: Understanding Signal Loss',
    href: '/insights/signal-loss-costs-real-revenue/',
    image: `${wpUploadBase}/2026/02/Untitled-1200-x-801-px-850x500.webp`,
    imageAlt: 'ROAS vs. Profit',
    dateLabel: 'March 6, 2026',
    datetime: '2026-03-06',
    excerpt: 'Marketing says ROAS is 3.5:1. Finance disagrees. The gap isn’t a reporting error, it’s signal loss. Here’s where to find it.',
  },
  {
    label: 'Blog',
    categories: ['Industry Insights', 'Marketing Analytics & Tracking', 'Paid Media Strategy'],
    title: 'Google’s Vision for 2026: Building a Revenue Engine Powered by Data',
    href: '/insights/googles-vision-for-2026-building-a-revenue-engine-powered-by-data/',
    image: `${wpUploadBase}/2026/02/dataengine-850x500.webp`,
    dateLabel: 'February 18, 2026',
    datetime: '2026-02-18',
    excerpt: 'Explore Google’s 2026 vision for building a scalable revenue engine powered by data, AI, and smarter monetization strategies.',
  },
  {
    label: 'Blog',
    categories: ['Industry Insights', 'Marketing Analytics & Tracking'],
    title: 'ICDPA Isn’t Just Compliance. It’s the Foundation of Smarter Data Strategy.',
    href: '/insights/indiana-consumer-data-protection-act/',
    image: `${wpUploadBase}/2026/02/ICDPA-blog-feature-850x500.webp`,
    imageAlt: "Indiana's New Data Privacy Laws",
    dateLabel: 'February 2, 2026',
    datetime: '2026-02-02',
    excerpt: 'Indiana’s ICDPA reshapes how businesses collect, consent to, and optimize first-party data for growth.',
  },
  {
    label: 'Blog',
    categories: ['AI', 'Paid Media Strategy'],
    title: 'Closing the Loop: How Conversion APIs and Value-Based Bidding Transform Performance Marketing',
    href: '/insights/closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing/',
    image: `${wpUploadBase}/2026/01/closing-the-loop-main-850x500.webp`,
    dateLabel: 'January 23, 2026',
    datetime: '2026-01-23',
    excerpt: 'Unlock the next evolution in performance marketing by moving beyond basic pixel tracking and embracing Conversion APIs (CAPI) and value-based bidding. In this post, we break down how server-to-server data integration helps advertisers send high-quality, first-party conversion signals back to ad platforms, enabling smarter machine learning and better bid optimization for real business value. Learn why revenue-focused marketers are shifting from traditional tracking to CAPI for more accurate measurement, how value-based bidding prioritizes high-value outcomes over volume, and actionable strategies to close the loop on conversion data to drive stronger ROI across campaigns.',
  },
  {
    label: 'Blog',
    categories: ['Life at Found'],
    title: 'Wrapping Up 19 Years With Purpose: Found’s Year-End Tradition of Giving Back',
    href: '/insights/wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back/',
    image: `${wpUploadBase}/2026/01/img_0446-850x500.jpg`,
    dateLabel: 'January 6, 2026',
    datetime: '2026-01-06',
    excerpt: 'Found has always believed that great work starts with great people, and great people make an even greater impact when they come together for good. This year, our team leaned into compassion, local involvement, and service.',
  },
  {
    label: 'Blog',
    categories: ['AI', 'Industry Insights'],
    title: 'A 3 Minute Implementation Guide to Segmenting AI Traffic in GA4',
    href: '/insights/a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4/',
    image: `${wpUploadBase}/2025/12/GA4-Blog-image-850x500.png`,
    dateLabel: 'January 2, 2026',
    datetime: '2026-01-02',
    excerpt: 'Segmenting AI search traffic in GA4 allows you to see traffic trends from answer engines over time and analyze correlations between other traffic sources (for example, organic search). This change in Google Analytics is very straightforward and should not take more than 3 minutes to implement.',
  },
  {
    label: 'Blog',
    categories: ['Industry Insights', 'Meta'],
    title: 'How Advantage+ Is Reshaping Student Recruitment, Insights from a Meta Education Summit',
    href: '/insights/how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit/',
    image: `${wpUploadBase}/2025/11/PXL_20251105_210949084-850x500.webp?ver=1773767518`,
    dateLabel: 'November 10, 2025',
    datetime: '2025-11-10',
    excerpt: 'Over the past few years, we’ve seen Meta’s Advantage+ Audience feature evolve from a simple reach-expanding tool into a powerful AI-driven solution for higher education marketers. It’s helping institutions move beyond manual segmentation to discover new, high-value audiences.',
  },
];

const webinarText = {
  paragraphs: [
    'Data privacy regulations are tightening. Browsers are limiting tracking. Ad platforms are evolving fast, and machine learning now depends on the quality of the data you feed it.',
    'In this webinar, industry experts at Found Search Marketing and InfoTrust take a forward-looking, practical look at how these changes are impacting paid media performance today, and what media teams should be doing now to future-proof their data architecture, measurement and ROI.',
    'You’ll learn how to move beyond fragile tracking setups toward a more resilient, privacy-first foundation that supports better optimization, attribution, and long-term growth.',
  ],
  takeaways: [
    'A clearer understanding of how data capture and privacy constraints are impacting your paid media performance',
    'Awareness of latest and upcoming key data, privacy, and platform changes coming in 2026 and beyond',
    'Areas of focus to strengthen your data architecture for improved marketing results and attribution',
    'A practical plan for how to operationalize these changes across teams and stakeholders',
  ],
  topics: [
    'Current State Environment',
    'Privacy-first data governance',
    'Server-side technologies',
    'From strategy to execution',
    'Overcoming organizational and technical barriers',
  ],
};

const archivePages: InsightArchivePage[] = [
  {
    kind: 'archive',
    path: '/insights/blog/',
    title: 'Blog',
    seoTitle: 'Blog | Found Search Marketing | Enterprise Paid Media Agency',
    seoDescription: 'Dive into our latest paid media strategies, industry trends, and data-driven insights to fuel your marketing performance.',
    canonicalUrl: 'https://foundsm.com/insights/blog/',
    ogImage: `${wpUploadBase}/2026/03/blog_insights_header_images.webp`,
    heroTitle: 'Performance Marketing Insights',
    heroDescription: 'Dive into our latest paid media strategies, industry trends, and data-driven insights to fuel your marketing performance.',
    heroImage: `${wpUploadBase}/2026/03/blog_insights_header_images.webp`,
    breadcrumbLabel: 'Blog',
    sectionTitle: 'Blogs',
    columns: 3,
    cards: blogCards,
  },
  {
    kind: 'archive',
    path: '/insights/toolsandguides/',
    title: 'Tools and Guides',
    seoTitle: 'Tools & Guides | Found Search Marketing | Enterprise Paid Media Agency',
    seoDescription: 'Leverage actionable resources, optimization checklists, and tracking guides to turn complex data into a predictable revenue engine.',
    canonicalUrl: 'https://foundsm.com/insights/toolsandguides/',
    ogImage: `${wpUploadBase}/2026/03/tools_insights_header_images.webp`,
    heroTitle: 'Actionable Tools & Resources',
    heroDescription: 'Leverage actionable resources, optimization checklists, and tracking guides to turn complex data into a predictable revenue engine.',
    heroImage: `${wpUploadBase}/2026/03/tools_insights_header_images.webp`,
    breadcrumbLabel: 'Tools and Guides',
    sectionTitle: 'Tools and Guides',
    columns: 2,
    cards: [
      {
        label: 'Quiz, Tools and Guides',
        title: 'Signal Quiz',
        href: '/signal-quiz/',
        image: `${wpUploadBase}/2026/03/signal-quiz-feature-850x500.webp`,
        dateLabel: 'January 20, 2026',
        datetime: '2026-01-20',
        excerpt: 'Are you scaling profit or just burning cash? Answer 7 questions to uncover your Revenue Engineering Score and identify the leaks in your paid media budget.',
      },
    ],
  },
  {
    kind: 'archive',
    path: '/insights/webinars/',
    title: 'Webinars',
    seoTitle: 'Webinars | Found Search Marketing | Enterprise Paid Media Agency',
    seoDescription: 'Join our agency leaders for strategic deep dives into advanced analytics, audience modeling, and profitable customer acquisition.',
    canonicalUrl: 'https://foundsm.com/insights/webinars/',
    ogImage: `${wpUploadBase}/2026/03/play_insights_header_images.webp`,
    heroTitle: 'On-Demand Expert Sessions',
    heroDescription: 'Join our agency leaders for strategic deep dives into advanced analytics, audience modeling, and profitable customer acquisition.',
    heroImage: `${wpUploadBase}/2026/03/play_insights_header_images.webp`,
    breadcrumbLabel: 'Webinars',
    sectionTitle: 'Webinars',
    columns: 2,
    cards: [
      {
        label: 'Webinars',
        title: 'Man vs Machine – SMX – On-Demand Webinar',
        href: '/insights/man-vs-machine-smx-webinar/',
        image: `${wpUploadBase}/2026/03/manvsmachine-smx-feature-850x500.webp`,
        dateLabel: 'March 26, 2026',
        datetime: '2026-03-26',
        excerpt: 'Man vs Machine: Finding the Right Balance for Winning Paid Media Strategies',
      },
      {
        label: 'Webinars',
        title: 'Modernize Your Data Architecture – On-Demand Webinar',
        href: '/insights/modernize-your-data-architecture-webinar/',
        image: `${wpUploadBase}/2026/02/infotrust-webinar-formheader-postevent-1-850x500.webp`,
        dateLabel: 'March 6, 2026',
        datetime: '2026-03-06',
        excerpt: 'Future-Proof Your Paid Media Strategy by Modernizing Your Data Architecture',
      },
    ],
  },
  {
    kind: 'archive',
    path: '/insights/whitepapers/',
    title: 'White Papers',
    seoTitle: 'White Papers | Found Search Marketing | Enterprise Paid Media Agency',
    seoDescription: 'Unlock comprehensive research and proprietary frameworks designed to eliminate paid media waste and scale your enterprise growth.',
    canonicalUrl: 'https://foundsm.com/insights/whitepapers/',
    ogImage: `${wpUploadBase}/2026/03/whitepapers_insights_header_images.webp`,
    heroTitle: 'In-Depth Industry Reports',
    heroDescription: 'Unlock comprehensive research and proprietary frameworks designed to eliminate paid media waste and scale your enterprise growth.',
    heroImage: `${wpUploadBase}/2026/03/whitepapers_insights_header_images.webp`,
    breadcrumbLabel: 'White Papers',
    sectionTitle: 'White Papers',
    columns: 2,
    cards: [
      {
        label: 'White Papers',
        title: 'Insights – Why First-Party Data Is Your Most Valuable Profit Lever',
        href: '/whitepapers/first-party-data/',
        image: `${wpUploadBase}/2026/03/first-party-whitepaper-feature-850x500.webp`,
        dateLabel: 'December 9, 2025',
        datetime: '2025-12-09',
        excerpt: 'Unlock the Profit Potential of Your First-Party Data',
      },
    ],
  },
];

const resourcePages: InsightResourcePage[] = [
  ...archivePages,
  {
    kind: 'webinar',
    path: '/insights/modernize-your-data-architecture-webinar/',
    title: 'Modernize Your Data Architecture – On-Demand Webinar',
    seoTitle: 'Modernize Your Data Architecture - On-Demand Webinar - Found Search Marketing',
    seoDescription: 'In this webinar, industry experts at Found Search Marketing and InfoTrust take a forward-looking, practical look at how these changes are impacting paid media performance today, and what media teams should be doing now to future-proof their data architecture, measurement and ROI.',
    canonicalUrl: 'https://foundsm.com/insights/modernize-your-data-architecture-webinar/',
    ogImage: `${wpUploadBase}/2026/02/infotrust-webinar-formheader-postevent-1.webp`,
    heroTitle: 'Modernize Your Data Architecture',
    kicker: 'On-Demand Webinar',
    actionText: 'Watch Now',
    formHeading: 'Unlock the Webinar',
    heroImage: `${wpUploadBase}/2026/02/infotrust-webinar-formheader-postevent-1-1024x576.webp`,
    heroImageAlt: '',
    bodyHeading: 'Future-Proof Your Paid Media Strategy by Modernizing Your Data Architecture',
    takeawayHeading: 'What You’ll Walk Away With',
    takeawayIntro: 'By the end of this session, you’ll have:',
    topicsHeading: 'Topics Covered',
    formId: '2c65e995-aba0-4239-955c-9beb15b0791d',
    ...webinarText,
  },
  {
    kind: 'webinar',
    path: '/insights/modernize-your-data-architecture/',
    title: 'Modernize Your Data Architecture',
    seoTitle: 'Modernize Your Data Architecture - Found Search Marketing',
    seoDescription: 'In this webinar, industry experts at Found Search Marketing and InfoTrust take a forward-looking, practical look at how these changes are impacting paid media performance today, and what media teams should be doing now to future-proof their data architecture, measurement and ROI.',
    canonicalUrl: 'https://foundsm.com/insights/modernize-your-data-architecture/',
    ogImage: `${wpUploadBase}/2026/02/infotrust-webinar-formheader-4.webp`,
    heroTitle: 'Modernizing Your Data Architecture for Successful Paid Media ROI',
    formHeading: 'Register Now',
    heroImage: `${wpUploadBase}/2026/02/infotrust-webinar-formheader-4-1024x640.webp`,
    heroImageAlt: '',
    bodyHeading: 'Future-Proof Your Paid Media Strategy',
    takeawayHeading: 'What You’ll Walk Away With',
    takeawayIntro: 'By the end of this session, you’ll have:',
    topicsHeading: 'Topics We’ll Cover',
    formId: '2c65e995-aba0-4239-955c-9beb15b0791d',
    ...webinarText,
  },
  {
    kind: 'video',
    path: '/insights/man-vs-machine-smx-webinar/',
    title: 'Man vs Machine – SMX – On-Demand Webinar',
    seoTitle: 'Man vs Machine - SMX - On-Demand Webinar | Found Search Marketing',
    seoDescription: 'Man vs Machine: Finding the Right Balance for Winning Paid Media Strategies',
    canonicalUrl: 'https://foundsm.com/insights/man-vs-machine-smx-webinar/',
    ogImage: `${wpUploadBase}/2026/03/manvsmachine-smx-feature.webp`,
    heading: 'Man vs Machine: Finding the Right Balance for Winning Paid Media Strategies',
    youtubeId: 'h3zhEVLPBBY',
  },
  {
    kind: 'video',
    path: '/insights/website-cookies-explained-on-demand-webinar/',
    title: 'Website Cookies Explained – On-Demand Webinar',
    seoTitle: 'Thank you for Registering | Enjoy the Webinar',
    seoDescription: 'Modernizing You Data Webinar Download',
    canonicalUrl: 'https://foundsm.com/insights/website-cookies-explained-on-demand-webinar/',
    ogImage: `${wpUploadBase}/2026/03/cookie-chat-sm.webp`,
    heading: 'Website Cookies Explained: Myths, Mistakes & What Marketers Need to Know',
    youtubeId: 'rkLathrzU94',
  },
  {
    kind: 'thank-you',
    path: '/insights/webinar/',
    title: 'Watch the webinar',
    seoTitle: 'Thank you for Registering | Enjoy the Webinar',
    seoDescription: 'Modernizing You Data Webinar Download',
    canonicalUrl: 'https://foundsm.com/insights/webinar/',
    heading: 'Thank You for Registering!',
    linkHref: 'https://www.youtube.com/watch?v=h3zhEVLPBBY',
  },
];

const byPath = new Map(resourcePages.map((page) => [page.path, page]));

export const blogArchivePage = archivePages[0];

export function getInsightResourcePage(path: string | undefined): InsightResourcePage | undefined {
  if (!path) return undefined;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return byPath.get(normalized.endsWith('/') ? normalized : `${normalized}/`);
}

export function getInsightResourceMeta(path: string | undefined): InsightResourceMeta | undefined {
  const page = getInsightResourcePage(path);
  if (!page) return undefined;

  return {
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    ogImage: page.ogImage,
  };
}
