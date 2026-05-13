import { block, type EditableImage, type SimplePortableTextBlock } from './simplePortableTextCore';

export type Cta = { label?: string; href?: string };

export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robots?: string;
};

type ImageField = { image?: EditableImage; imageAlt?: string };
type RichSection = { heading?: string; body?: SimplePortableTextBlock[] };

export type FormPageData = SeoFields & {
  variant?: 'contact' | 'newsletter' | 'dataconnect';
  eyebrow?: string;
  heading?: string;
  intro?: SimplePortableTextBlock[];
  formId?: string;
  portalId?: string;
  summary?: SimplePortableTextBlock[];
};

export type TeamLeader = {
  name?: string;
  role?: string;
  image?: EditableImage;
};

export type TeamPageData = SeoFields & {
  hero: RichSection & ImageField & { cta?: Cta };
  statement: { lead?: string; body?: SimplePortableTextBlock[] };
  leadership: { heading?: string; body?: SimplePortableTextBlock[] };
  cta: { heading?: string; body?: SimplePortableTextBlock[]; cta?: Cta };
  leaders: TeamLeader[];
};

export type NotFoundPageData = SeoFields & {
  code?: string;
  heading?: string;
  body?: SimplePortableTextBlock[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
};

export type ApproachPageData = SeoFields & {
  hero: RichSection & ImageField;
  intro: RichSection & ImageField & { eyebrow?: string; headingLines?: string[] };
  callout: { heading?: string; cta?: Cta };
  advantages: { eyebrow?: string; heading?: string; body?: SimplePortableTextBlock[]; items: Array<RichSection & { icon?: EditableImage }> };
  partnerships: {
    eyebrow?: string;
    headingLines?: string[];
    body?: SimplePortableTextBlock[];
    tabs: Array<RichSection & ImageField & { label?: string }>;
    ctaHeadingLines?: string[];
    cta?: Cta;
  };
};

export type PolicyListItem = { title?: string; body?: string };
export type PolicySection = {
  heading?: string;
  body?: SimplePortableTextBlock[];
  items?: PolicyListItem[];
  contact?: {
    organization?: string;
    lines?: string[];
    email?: string;
    phone?: string;
  };
};

export type PrivacyPolicyPageData = SeoFields & {
  heading?: string;
  lastUpdated?: string;
  intro?: SimplePortableTextBlock[];
  sections: PolicySection[];
};

export type EventLandingPageData = SeoFields & {
  ogImage?: string;
  event: {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    locationLabel?: string;
    locationUrl?: string;
  };
  nav: { topicsLabel?: string; benefitsLabel?: string; ctaLabel?: string };
  hero: {
    eyebrow?: string;
    titleLines?: string[];
    accentLine?: string;
    description?: string;
    meta: Array<{ icon?: string; label?: string; value?: string }>;
    primaryCta?: Cta;
    secondaryCta?: Cta;
    cardTitle?: string;
    stats: Array<{ value?: string; label?: string }>;
    chips: string[];
  };
  topics: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    items: Array<{ icon?: string; title?: string; description?: string; time?: string }>;
  };
  benefits: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    items: Array<{ number?: string; title?: string; description?: string }>;
  };
  registration: {
    eyebrow?: string;
    headingLines?: string[];
    description?: string;
    perks: string[];
    buttonLabel?: string;
    fields: Array<{ label?: string; type?: 'text' | 'email' | 'select'; placeholder?: string; options?: string[] }>;
  };
  footer: { copyright?: string; links: Cta[] };
};

const teamAssetPath = '/images/pages/team';

const keepBlocks = (value: SimplePortableTextBlock[] | undefined | null, fallback: SimplePortableTextBlock[] | undefined) => value ?? fallback;

const mergeObject = <T extends Record<string, any>>(fallback: T, value?: Partial<T> | null): T => ({
  ...fallback,
  ...(value || {}),
});

const mergeList = <T extends Record<string, any>>(fallback: T[], value?: Partial<T>[] | null): T[] => {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, index) => mergeObject(fallback[index] || ({} as T), item));
};

export function mergeFormPageData(fallback: FormPageData, value?: Partial<FormPageData> | null): FormPageData {
  const page = value || {};
  return {
    ...fallback,
    ...page,
    intro: keepBlocks(page.intro, fallback.intro),
    summary: keepBlocks(page.summary, fallback.summary),
  };
}

export function mergeTeamPageData(value?: Partial<TeamPageData> | null): TeamPageData {
  const page = value || {};
  const fallback = defaultTeamPageData;
  return {
    ...fallback,
    ...page,
    hero: { ...fallback.hero, ...(page.hero || {}), body: keepBlocks(page.hero?.body, fallback.hero.body) },
    statement: { ...fallback.statement, ...(page.statement || {}), body: keepBlocks(page.statement?.body, fallback.statement.body) },
    leadership: { ...fallback.leadership, ...(page.leadership || {}), body: keepBlocks(page.leadership?.body, fallback.leadership.body) },
    cta: { ...fallback.cta, ...(page.cta || {}), body: keepBlocks(page.cta?.body, fallback.cta.body) },
    leaders: mergeList(fallback.leaders, page.leaders),
  };
}

export function mergeNotFoundPageData(value?: Partial<NotFoundPageData> | null): NotFoundPageData {
  const page = value || {};
  const fallback = defaultNotFoundPageData;
  return {
    ...fallback,
    ...page,
    body: keepBlocks(page.body, fallback.body),
  };
}

export function mergeApproachPageData(value?: Partial<ApproachPageData> | null): ApproachPageData {
  const page = value || {};
  const fallback = defaultApproachPageData;
  return {
    ...fallback,
    ...page,
    hero: { ...fallback.hero, ...(page.hero || {}), body: keepBlocks(page.hero?.body, fallback.hero.body) },
    intro: { ...fallback.intro, ...(page.intro || {}), body: keepBlocks(page.intro?.body, fallback.intro.body), headingLines: page.intro?.headingLines || fallback.intro.headingLines },
    callout: mergeObject(fallback.callout, page.callout),
    advantages: {
      ...fallback.advantages,
      ...(page.advantages || {}),
      body: keepBlocks(page.advantages?.body, fallback.advantages.body),
      items: mergeList(fallback.advantages.items, page.advantages?.items).map((item, index) => ({
        ...item,
        body: keepBlocks(item.body, fallback.advantages.items[index]?.body),
      })),
    },
    partnerships: {
      ...fallback.partnerships,
      ...(page.partnerships || {}),
      body: keepBlocks(page.partnerships?.body, fallback.partnerships.body),
      headingLines: page.partnerships?.headingLines || fallback.partnerships.headingLines,
      ctaHeadingLines: page.partnerships?.ctaHeadingLines || fallback.partnerships.ctaHeadingLines,
      tabs: mergeList(fallback.partnerships.tabs, page.partnerships?.tabs).map((item, index) => ({
        ...item,
        body: keepBlocks(item.body, fallback.partnerships.tabs[index]?.body),
      })),
    },
  };
}

export function mergePrivacyPolicyPageData(value?: Partial<PrivacyPolicyPageData> | null): PrivacyPolicyPageData {
  const page = value || {};
  const fallback = defaultPrivacyPolicyPageData;
  return {
    ...fallback,
    ...page,
    intro: keepBlocks(page.intro, fallback.intro),
    sections: mergeList(fallback.sections, page.sections).map((section, index) => ({
      ...section,
      body: keepBlocks(section.body, fallback.sections[index]?.body),
      items: section.items || fallback.sections[index]?.items,
      contact: mergeObject(fallback.sections[index]?.contact || {}, section.contact),
    })),
  };
}

export function mergeEventLandingPageData(value?: Partial<EventLandingPageData> | null): EventLandingPageData {
  const page = value || {};
  const fallback = defaultEventLandingPageData;
  return {
    ...fallback,
    ...page,
    event: mergeObject(fallback.event, page.event),
    nav: mergeObject(fallback.nav, page.nav),
    hero: {
      ...fallback.hero,
      ...(page.hero || {}),
      meta: mergeList(fallback.hero.meta, page.hero?.meta),
      stats: mergeList(fallback.hero.stats, page.hero?.stats),
      chips: page.hero?.chips || fallback.hero.chips,
    },
    topics: { ...fallback.topics, ...(page.topics || {}), items: mergeList(fallback.topics.items, page.topics?.items) },
    benefits: { ...fallback.benefits, ...(page.benefits || {}), items: mergeList(fallback.benefits.items, page.benefits?.items) },
    registration: {
      ...fallback.registration,
      ...(page.registration || {}),
      perks: page.registration?.perks || fallback.registration.perks,
      fields: mergeList(fallback.registration.fields, page.registration?.fields),
    },
    footer: { ...fallback.footer, ...(page.footer || {}), links: mergeList(fallback.footer.links, page.footer?.links) },
  };
}

export const defaultContactPageData: FormPageData = {
  variant: 'contact',
  seoTitle: 'Contact Us - Found Search Marketing',
  seoDescription: "Bring us your biggest challenge. We don't want to be your agency of record. We want to be your agency of results. Let's see what we can achieve together.",
  canonicalUrl: 'https://foundsm.com/contact-us/',
  heading: 'Bring Us Your Biggest Challenge.',
  intro: [
    block([
      { _type: 'span', text: "We don't want to be your agency of record. " },
      { _type: 'span', text: 'We want to be your agency of results.', marks: ['strong'] },
      { _type: 'span', text: " Let's see what we can achieve together." },
    ]),
  ],
  formId: '4f48ec0c-d036-4c2f-b461-4b5f4c03c3fc',
  portalId: '5045186',
  summary: [block("We're ready to learn more about your business goals and talk about all the ways we can work together to find solutions that drive impact and lead to profitable revenue. Whether it's smarter paid media strategy, creative that converts, or finding clarity in your data, we're ready to sit on the same side of the table and get to work.")],
};

export const defaultNewsletterPageData: FormPageData = {
  variant: 'newsletter',
  seoTitle: "Sign Up For Found's Newsletter",
  seoDescription: 'Found Search Marketing brings deep channel expertise, custom analytics, and agile strategy together to maximize performance across your entire media ecosystem.',
  canonicalUrl: 'https://www.foundsm.com/newsletter',
  eyebrow: 'Get Found in Your Inbox',
  heading: 'Sign Up for Our Newsletter',
  intro: [block('Get monthly insights, real-world strategies, and expert takes from the Found team.')],
  formId: 'f757bd34-b8c5-4f2a-a1ef-19c3a364683b',
  portalId: '5045186',
  summary: [block('Get monthly insights, real-world strategies, and expert takes from the Found team - plus the latest on upcoming events and recaps on any you missed.')],
};

export const defaultTeamPageData: TeamPageData = {
  seoTitle: 'Our Team | Found Search Marketing',
  seoDescription: 'Found Search Marketing brings deep channel expertise, custom analytics, and agile strategy together to maximize performance across your entire media ecosystem.',
  canonicalUrl: 'https://www.foundsm.com/team',
  hero: {
    heading: 'Together, We Solve.',
    body: [block("In an industry that never stops evolving, Found Search Marketing stands out as an agency that knows exactly who we are. Grounded in a deep commitment to our clients, we combine precision with agility to thrive in a fast-moving world. We're proud cool nerds, energized by the pursuit of high-ceiling, complex problems that drive significant business impact.")],
    image: `${teamAssetPath}/hero-tr-andy-ryan.webp`,
    imageAlt: 'Found Search Marketing team members collaborating',
    cta: { label: 'Join Our Team', href: '/about-us/' },
  },
  statement: {
    lead: 'While many chase the next shiny idea, we stay focused, unapologetically ourselves.',
    body: [block('Our clients have access to the people behind their brand. Unlike traditional agencies, Found is built to foster cross-functional expertise. Our integrated team structure breaks down silos and acts as a catalyst for client-focused strategy, deep analysis, and results-driven execution.')],
  },
  leadership: {
    heading: 'Leadership',
    body: [
      block("At Found, leadership isn't just about setting direction: it's about driving innovation, empowering each other to ask hard questions, and navigating complexity with care and intent to transform challenges into breakthroughs. Our executive team brings decades of hands-on experience in paid media, data engineering and analytics, and customer acquisition strategy, including foundational roles at Google."),
      block("Found's leadership stays close to the work, thinks like clients, and focuses on results. That's helped build an agency culture rooted in innovation, precision, and high-impact collaboration."),
    ],
  },
  leaders: [
    { name: 'Julie Warnecke', role: 'CEO', image: `${teamAssetPath}/julie-warnecke.webp` },
    { name: 'Adam Persinger', role: 'Head of Strategic Media', image: `${teamAssetPath}/adam-persinger.webp` },
    { name: 'Brandon Cangany', role: 'Director, Finance', image: `${teamAssetPath}/brandon-cangany.webp` },
    { name: 'Brian Walker', role: 'Group Account Director', image: `${teamAssetPath}/brian-walker.webp` },
    { name: 'Caroline Stoner', role: 'Head of User Experience', image: `${teamAssetPath}/caroline-stoner.webp` },
    { name: 'Kate Sadowski', role: 'Group Account Director', image: `${teamAssetPath}/kate-sadowski.webp` },
    { name: 'Kelley Swart', role: 'VP, Strategy & Growth', image: `${teamAssetPath}/kelley-swart.webp` },
    { name: 'Kelsey Connor', role: 'Director, Marketing & Brand Strategy', image: `${teamAssetPath}/kelsey-connor.webp` },
    { name: 'Kylie Colquitt', role: 'Group Account Director', image: `${teamAssetPath}/kylie-colquitt.webp` },
    { name: 'Megan Hackman', role: 'VP, Agency Operations', image: `${teamAssetPath}/megan-hackman.webp` },
    { name: 'Nicholas Hoium', role: 'Head of Data Engineering', image: `${teamAssetPath}/nicholas-hoium.webp` },
    { name: 'Rachel Puls', role: 'VP, Delivery', image: `${teamAssetPath}/rachel-puls.webp` },
    { name: 'Ryan Eme', role: 'Head of Data Intelligence', image: `${teamAssetPath}/ryan-eme.webp` },
    { name: 'Stephanie Van Deven', role: 'Director, Integrated Delivery Operations', image: `${teamAssetPath}/stephanie-van-deven.webp` },
    { name: 'T.R. Scrivner', role: 'Director, Agency Creative', image: `${teamAssetPath}/tr-scrivner.webp` },
  ],
  cta: {
    heading: 'Want to Join Our Team?',
    body: [block("We're always looking for people who share our passion for finding smart, innovative solutions for our clients and are excited to grow with a company. Sound like you? Let's chat.")],
    cta: { label: 'Discover Your New Career', href: '/about-us/#careers' },
  },
};

export const defaultNotFoundPageData: NotFoundPageData = {
  seoTitle: 'Page Not Found | Found Search Marketing',
  seoDescription: "The page you're looking for doesn't exist or has been moved. Return to Found Search Marketing's homepage or explore our latest insights.",
  canonicalUrl: 'https://www.foundsm.com/404',
  robots: 'noindex, follow',
  code: '404',
  heading: 'Page Not Found',
  body: [block("The page you're looking for doesn't exist or has been moved.")],
  primaryCta: { label: 'Return to Homepage', href: '/' },
  secondaryCta: { label: 'View Our Insights', href: '/insights' },
};

export const defaultApproachPageData: ApproachPageData = {
  seoTitle: 'Our Proven Paid Media Approach | Found Search Marketing',
  seoDescription: 'At Found Search Marketing, our proven paid media approach transforms complex data into actionable insights that fuel smarter strategy and measurable results.',
  canonicalUrl: 'https://www.foundsm.com/our-approach',
  hero: {
    heading: "It's Not What We Do.\nIt's How We Do It.",
    body: [
      block('Found Search Marketing exists because we saw a need for a new kind of agency. One that not only had background in the industry with an expert understanding of paid media, but that could also serve as a true extension of client teams through creative problem solving and customized solutions.'),
      block("We've used that formula for nearly two decades to consistently build strategies and campaigns that convert, while driving maximum profitability for our clients."),
    ],
    imageAlt: '',
  },
  intro: {
    eyebrow: 'Our Approach',
    heading: 'Your Search for an\nUnfair Advantage is Over',
    body: [block("Over the past 20 years, we've perfected a unique, proprietary approach that has consistently elevated performance for many top brands, driving measurable results and sustained growth. It works by combining first-party data, automation, innovative bid strategies, custom playbook formulation, audience modeling, and a unique understanding of our client's paid media ecosystem. Our approach is a fully custom, self-reinforcing optimization cycle designed to achieve predictable and profitable outcomes while relentlessly eliminating paid media waste.")],
    imageAlt: '',
  },
  callout: {
    heading: 'Every piece of your lead generation ecosystem complementing another - perpetually adapting and improving with each iteration - is what our formula is all about.',
    cta: { label: 'Start the Conversation', href: '/contact-us/' },
  },
  advantages: {
    eyebrow: 'The Found Difference',
    heading: 'Eight Key Advantages',
    body: [block("We drive value by seamlessly integrating with your team, applying our unique approach, and delivering industry-leading performance that drives customer acquisition at scale. But that's easier said than done. We'll help you succeed with unique competitive edges that put your business goals first.")],
    items: [
      { title: '1. Google Background', body: [block("Our team includes three former Google employees. That means we're not only well versed in the entire Google suite of analytics and paid media channels - we're also leveraging the latest trends in ad tech. Julie Warnecke, our CEO, was the fourth employee on the Google AdWords Ad Operations team, and has experienced the evolution of digital marketing firsthand.")] },
      { title: '2. Big Picture View', body: [block("Your performance lead generation ecosystem has lots of interworking parts that need to synergize to create better quality leads. We see your lead generation ecosystem from every angle - from performance paid media to engineering audience models to creative and landing pages, and beyond - making sure you're always moving in alignment with your business objectives.")] },
      { title: '3. Singular Focus', body: [block("We aren't here to help create new logos, build custom fonts, or reposition your branding. We're here to drive leads through performance paid media, protect your brand, and deliver consistent, measurable wins that maximize profitability.")] },
      { title: '4. Uniquely Dedicated People', body: [block('Not many companies can say their people stay for more than six years on average - or that they actually love to solve problems without seeking credit. With no hourly billing or upselling, our outcomes-obsessed team focuses solely on delivering measurable results through a transparent, customized, and innovative process.')] },
      { title: '5. Simplicity', body: [block("A single scope of work and point of contact. Transparent pricing. No hourly billing. We take on the complexity - whether it's navigating data privacy policies, engineering dashboards, or reconciling media spend - so our clients can experience simplicity and confidence in every aspect of their campaigns. Bottom line: Our partnership will be simple, agile, and above all, value-and-performance driven.")] },
      { title: '6. Results Without Fluff', body: [block("Our team doesn't get caught up in vanity metrics, cherry pick the best stats, or build fancy presentations. But we do give you the clearest possible picture of exactly what's working and what isn't with powerful analytics models and custom dashboards - and we tie everything back to what you're trying to accomplish internally.")] },
      { title: '7. Leading Tech Stack', body: [block("AI is transforming the way we work. New, more powerful analytics platforms are available almost daily. Methods of data visualization are becoming more intuitive. We're on the leading edge of paid media strategies and we make sure our clients are, too.")] },
      { title: '8. Extreme Customization', body: [block("We don't like templates. Everything we do is built and customized just for you, because there's no other business exactly like yours. Unique problems need unique solutions - and an outside, expert perspective focused on your business goals. We're glad you found us.")] },
    ],
  },
  partnerships: {
    eyebrow: 'Top-Tier Partnerships',
    headingLines: ['Your VIP Access to', 'Premium Benefits'],
    body: [block("We have industry-leading partnerships giving you a huge range of benefits - which means you can trust your media investment to an agency that's proven to maximize campaign success.")],
    tabs: [
      { label: 'Google Marketing Platform Certified', heading: 'Google Marketing Platform Certified', body: [block('Our team is trained across GMP tools, with decades of experience using the platform. That gives you lots of perks, including early access to Google alpha and beta programs, advanced targeting and measurement strategies, and optimization tools to drive smarter campaigns.')], imageAlt: 'Google Marketing Platform Certified' },
      { label: 'Microsoft Advertising Elite Partner', heading: 'Microsoft Advertising Elite Partner', body: [block("Elite Partner status is Microsoft's highest recognition, granted only to a select group of top-performing agencies globally. This status translates to many benefits for you, including exclusive access to new programs, and early visibility into product roadmaps, search trends, and audience insights.")], imageAlt: 'Microsoft Advertising Elite Partner' },
      { label: 'Google Partner', heading: 'Google Partner', body: [block('Being named a Google Partner is recognition for maximizing campaign success for our clients by driving growth and demonstrating Google Ads skills and expertise. You can rest assured that many of our team members are certified in Google Ads and its products.')], imageAlt: 'Google Partner' },
      { label: 'Meta Business Partner', heading: 'Meta Business Partner', body: [block("Earning a partnership with Meta means doing more than just demonstrating excellence across Meta platforms. It means giving our clients early access to Meta alpha and beta programs, a direct connection to Meta's evolving roadmap, and assurance that our team is leveraging exclusive tools that drive higher-performing campaigns.")], imageAlt: 'Meta Business Partner' },
      { label: 'OneTrust Privacy Professional', heading: 'OneTrust Privacy Professional', body: [block("At Found, we have a deep understanding of how privacy impacts marketing. As a certified OneTrust partner, we bring expertise in privacy, security, and data governance - empowering your organization to confidently navigate today's complex regulatory landscape.")], imageAlt: 'OneTrust Privacy Professional' },
    ],
    ctaHeadingLines: ['Comprehensive Capabilities.', 'Designed for Your Business.'],
    cta: { label: "Let's Find A Solution", href: '/contact-us/' },
  },
};

export const defaultPrivacyPolicyPageData: PrivacyPolicyPageData = {
  seoTitle: 'Privacy Policy | Found Search Marketing',
  seoDescription: "Found Search Marketing's privacy policy describes how we collect, use, and protect your personal information when you visit our website or engage with our services.",
  canonicalUrl: 'https://www.foundsm.com/privacy-policy',
  robots: 'index, follow',
  heading: 'Privacy Policy',
  lastUpdated: 'March 2026',
  intro: [block('Found Search Marketing ("Found," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at www.foundsm.com (the "Site") and when you engage with our services. Please read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Site.')],
  sections: [
    {
      heading: '1. Information We Collect',
      body: [block('We may collect information about you in a variety of ways. The information we may collect on the Site includes:')],
      items: [
        { title: 'Personal Data.', body: 'When you voluntarily provide it, we collect personally identifiable information such as your name, email address, phone number, company name, and job title. This typically occurs when you fill out a contact form, subscribe to our newsletter, download a resource, or otherwise communicate with us through the Site.' },
        { title: 'Derivative Data.', body: 'Our servers and third-party analytics tools automatically collect certain information when you access the Site, including your IP address, browser type, operating system, access times, referring website addresses, and the pages you visit on our Site. This information is used in aggregate form to help us understand how visitors use the Site and to improve our content and services.' },
        { title: 'Financial Data.', body: 'We do not collect financial information such as credit card numbers through our Site. If we engage in a business relationship, payment processing is handled through secure third-party providers.' },
      ],
    },
    {
      heading: '2. How We Use Your Information',
      body: [block('We use the information we collect about you for a variety of business purposes, including:')],
      items: [
        { body: 'Responding to inquiries, service requests, and providing customer support' },
        { body: 'Sending you marketing and promotional communications, such as newsletters, industry insights, and information about our services (you may opt out at any time)' },
        { body: 'Improving our website, services, and marketing efforts through usage analysis' },
        { body: 'Compiling anonymous statistical data and analytics for internal use or with third parties' },
        { body: 'Preventing fraudulent activity and ensuring the security of our Site' },
        { body: 'Complying with legal obligations and enforcing our terms and conditions' },
      ],
    },
    {
      heading: '3. Cookies and Tracking Technologies',
      body: [
        block('We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. Cookies are small data files stored on your device that help us remember your preferences, understand how you interact with our Site, and serve relevant advertising.'),
        block('We use the following types of cookies:'),
      ],
      items: [
        { title: 'Strictly Necessary Cookies:', body: 'Required for the Site to function properly, such as session management and security features.' },
        { title: 'Performance and Analytics Cookies:', body: 'Help us understand how visitors interact with our Site by collecting and reporting information anonymously.' },
        { title: 'Functional Cookies:', body: 'Enable enhanced functionality and personalization, such as remembering your preferences.' },
        { title: 'Targeting and Advertising Cookies:', body: 'Used to deliver relevant advertisements and track campaign performance across platforms.' },
      ],
    },
    {
      heading: '4. Third-Party Services',
      body: [block('We use third-party service providers to help us operate our business and the Site. These providers may have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose. Key third-party services include:')],
      items: [
        { title: 'HubSpot:', body: 'We use HubSpot as our customer relationship management (CRM) platform and marketing automation tool. HubSpot processes form submissions, manages email communications, and tracks website interactions to help us deliver relevant content and improve our services.' },
        { title: 'Google Analytics:', body: 'We use Google Analytics to collect and analyze website traffic data, including page views, session duration, bounce rates, and user demographics. This data helps us understand how visitors use our Site and informs improvements to our content and user experience.' },
        { title: 'OneTrust:', body: 'We use OneTrust to manage cookie consent and privacy preferences on our Site. OneTrust provides the cookie banner and preference center that allows you to control which categories of cookies are active during your visit.' },
        { title: 'Google Tag Manager:', body: 'We use Google Tag Manager to manage and deploy marketing and analytics tags on the Site without modifying the site code directly.' },
      ],
    },
    {
      heading: '5. Data Sharing and Disclosure',
      body: [block('We do not sell, trade, or rent your personal information to third parties. We may share information we have collected about you in certain situations, including:')],
      items: [
        { title: 'Service Providers:', body: 'We may share your information with third-party vendors who provide services on our behalf, such as email delivery, analytics, hosting, and CRM management.' },
        { title: 'Legal Compliance:', body: 'We may disclose your information if required to do so by law or in the good-faith belief that such action is necessary to comply with applicable laws, respond to a court order, or protect our rights and safety.' },
        { title: 'Business Transfers:', body: 'In the event of a merger, acquisition, reorganization, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email or a prominent notice on our Site of any change in ownership or uses of your personal information.' },
        { title: 'With Your Consent:', body: 'We may share your information for any other purpose with your explicit consent.' },
      ],
    },
    {
      heading: '6. Your Rights and Choices',
      body: [block('Depending on your location, you may have certain rights regarding your personal information, including:')],
      items: [
        { title: 'Access:', body: 'You may request a copy of the personal information we hold about you.' },
        { title: 'Correction:', body: 'You may request that we correct any inaccurate or incomplete personal information.' },
        { title: 'Deletion:', body: 'You may request that we delete your personal information, subject to certain legal exceptions.' },
        { title: 'Opt-Out:', body: 'You may opt out of receiving marketing communications from us at any time by clicking the unsubscribe link in our emails or by contacting us directly.' },
        { title: 'Data Portability:', body: 'Where applicable, you may request a copy of your data in a structured, commonly used, and machine-readable format.' },
        { title: 'Restriction:', body: 'You may request that we restrict the processing of your personal information under certain circumstances.' },
      ],
    },
    {
      heading: '7. Data Security',
      body: [
        block('We use administrative, technical, and physical security measures designed to protect your personal information from unauthorized access, use, alteration, and disclosure. Our security practices include encrypted data transmission (SSL/TLS), access controls, regular security assessments, and secure data storage through our third-party hosting and CRM providers.'),
        block('While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or method of electronic storage is completely secure. We cannot guarantee absolute security of your data, but we are committed to implementing and maintaining reasonable safeguards to protect it.'),
      ],
    },
    { heading: "8. Children's Privacy", body: [block('Our Site and services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information. If you believe we may have collected information from a child under 16, please contact us immediately using the information provided below.')] },
    { heading: '9. Changes to This Policy', body: [block('We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the Last updated date at the top of this page and, where appropriate, notify you by email or through a notice on our Site. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.')] },
    {
      heading: '10. Contact Us',
      body: [block('If you have questions or concerns about this Privacy Policy, your personal information, or our data practices, please contact us at:')],
      contact: {
        organization: 'Found Search Marketing',
        lines: ['8475 Nightfall Lane, Suite 200', 'Fishers, IN 46037'],
        email: 'info@foundsm.com',
        phone: '1.317.721.2229',
      },
    },
  ],
};

export const defaultEventLandingPageData: EventLandingPageData = {
  seoTitle: 'Lunch & Learn: Scale Smarter with AI-Powered Paid Media | Found Search Marketing',
  seoDescription: 'Join Found Search Marketing for a free 60-minute virtual session on AI-powered paid media strategy. April 15, 2026 at 12:00 PM ET.',
  canonicalUrl: 'https://www.foundsm.com/events/lunch-and-learn',
  robots: 'index, follow',
  ogImage: 'https://www.foundsm.com/images/og-lunch-and-learn.jpg',
  event: {
    name: 'Scale Smarter with AI-Powered Paid Media',
    description: 'An interactive session exploring how AI and automation are reshaping lead generation strategy across education, healthcare, and B2B verticals.',
    startDate: '2026-04-15T12:00:00-04:00',
    endDate: '2026-04-15T13:00:00-04:00',
    locationLabel: 'Virtual (Zoom)',
    locationUrl: 'https://www.foundsm.com/events/lunch-and-learn',
  },
  nav: { topicsLabel: 'Topics', benefitsLabel: 'Why Attend', ctaLabel: 'Register Now' },
  hero: {
    eyebrow: 'Upcoming Event',
    titleLines: ['Scale Smarter with', 'Paid Media'],
    accentLine: 'AI-Powered',
    description: 'Join Found Search Marketing for an interactive session exploring how AI and automation are reshaping lead generation strategy across education, healthcare, and B2B verticals.',
    meta: [
      { icon: 'Date', label: 'Date', value: 'April 15, 2026' },
      { icon: 'Time', label: 'Time', value: '12:00 - 1:00 PM ET' },
      { icon: 'Location', label: 'Location', value: 'Virtual (Zoom)' },
    ],
    primaryCta: { label: 'Reserve Your Spot', href: '#register' },
    secondaryCta: { label: 'View Agenda', href: '#topics' },
    cardTitle: "What You'll Walk Away With",
    stats: [
      { value: '6', label: 'Topics' },
      { value: '60', label: 'Minutes' },
      { value: '3+', label: 'Frameworks' },
    ],
    chips: ['AI Strategy', 'Lead Gen', 'Automation', 'Data Engineering', 'Bid Optimization', 'Creative Testing'],
  },
  topics: {
    eyebrow: 'Session Agenda',
    heading: "What We'll Cover",
    description: 'A curated deep-dive into the strategies, tools, and frameworks driving measurable impact for performance-focused teams.',
    items: [
      { icon: 'AI', title: 'AI-Native Campaign Management', description: 'How agentic workflows using LangGraph and n8n are automating bid management, budget allocation, and negative keyword discovery.', time: '12 min' },
      { icon: 'Target', title: 'First-Party Data Activation', description: 'Leveraging CRM-integrated bidding and audience models to improve lead quality and reduce wasted spend.', time: '10 min' },
      { icon: 'Data', title: 'Cross-Client Intelligence', description: 'How vertical specialization creates an unfair advantage - pattern matching across education, insurance, healthcare, and B2B.', time: '10 min' },
      { icon: 'Test', title: 'Performance Creative & CRO', description: 'Multivariate testing frameworks and UI/UX-focused landing page optimization that converts clicks into customers.', time: '8 min' },
      { icon: 'Privacy', title: 'Attribution in a Privacy-First World', description: 'Navigating long attribution windows and regulatory complexity with custom playbooks and privacy-compliant measurement.', time: '10 min' },
      { icon: 'Q&A', title: 'Live Q&A', description: 'Open floor to bring your toughest paid media challenges. Our team of former Googlers and data engineers will be on hand.', time: '10 min' },
    ],
  },
  benefits: {
    eyebrow: 'Why Attend',
    heading: 'Built for Performance-Minded Teams',
    description: "Whether you're leading marketing at a national brand or managing campaigns in a specialized vertical, this session is designed to give you actionable frameworks.",
    items: [
      { number: '01', title: 'Proven Frameworks, Not Theory', description: 'Every strategy shared has been tested across millions in annual media spend - with results tracked from click to enrolled student, bound policy, or signed contract.' },
      { number: '02', title: 'Vertical-Specific Insights', description: 'Benchmarks and playbooks tailored to education, healthcare, insurance, and B2B facility services - not generic cross-industry advice.' },
      { number: '03', title: 'AI That Actually Moves the Needle', description: 'See how AI goes beyond chatbots - from predictive budget reallocation to automated quality score monitoring and anomaly detection.' },
      { number: '04', title: 'Direct Access to Former Googlers', description: 'Our team includes three former Google Ads employees, including our founder who was the fourth hire on the AdWords team. Ask anything.' },
    ],
  },
  registration: {
    eyebrow: 'Reserve Your Spot',
    headingLines: ['Get Found.', 'Get Smarter.'],
    description: 'Space is limited to keep the session interactive. Register now to secure your seat at the table.',
    perks: ['Free 60-minute session', 'Recording sent to all registrants', 'Downloadable playbook included', 'Live Q&A with Found leadership'],
    buttonLabel: 'Register Now',
    fields: [
      { label: 'First Name', type: 'text', placeholder: 'Julie' },
      { label: 'Last Name', type: 'text', placeholder: 'Warnecke' },
      { label: 'Work Email', type: 'email', placeholder: 'you@company.com' },
      { label: 'Company', type: 'text', placeholder: 'Your organization' },
      { label: 'Your Role', type: 'select', placeholder: 'Select your role', options: ['CMO / VP Marketing', 'Director of Marketing', 'Digital Marketing Manager', 'Media Buyer / Strategist', 'Agency Partner', 'Other'] },
      { label: 'Primary Vertical', type: 'select', placeholder: 'Select your vertical', options: ['Education', 'Healthcare', 'Insurance', 'B2B / Facility Services', 'Other'] },
    ],
  },
  footer: {
    copyright: '© 2026 Found Search Marketing. All rights reserved.',
    links: [
      { label: 'foundsm.com', href: '/' },
      { label: 'Contact Us', href: '/contact-us' },
      { label: 'Newsletter', href: '/newsletter' },
    ],
  },
};
