import { block, type EditableImage, type SimplePortableTextBlock } from './simplePortableTextCore';

type Cta = { label?: string; href?: string };
type ImageField = { image?: EditableImage; imageAlt?: string };
type RichSection = { heading?: string; body?: SimplePortableTextBlock[] };
type Card = { title?: string; lead?: string; body?: SimplePortableTextBlock[]; icon?: EditableImage; image?: EditableImage; imageAlt?: string };
type Logo = { image?: EditableImage; alt?: string };
type FeatureTab = Card & { id?: string };

export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robots?: string;
};

export type AboutPageData = SeoFields & {
  hero: RichSection & ImageField;
  who: RichSection & ImageField & {
    eyebrow?: string;
    subheading?: string;
    credentials: Array<{ image?: EditableImage; alt?: string; text?: string }>;
  };
  mission: {
    eyebrow?: string;
    headingLines: string[];
    cards: Card[];
  };
  values: {
    heading?: string;
    tabs: FeatureTab[];
  };
  approach: RichSection & ImageField & { cta?: Cta };
  team: ImageField & { heading?: string };
  teamCta: { body?: SimplePortableTextBlock[]; cta?: Cta };
};

export type CapabilitiesPageData = SeoFields & {
  hero: RichSection & ImageField;
  outcomes: RichSection & ImageField & { eyebrow?: string };
  workflow: RichSection & ImageField & { prompt?: string };
  details: Array<RichSection & ImageField & { id?: string; cta?: Cta }>;
};

export type CapabilityDetailPageData = SeoFields & {
  hero: RichSection & ImageField;
  split?: RichSection & ImageField;
  statement?: { lead?: string; body?: SimplePortableTextBlock[] };
  featureTabs?: { idPrefix?: string; tabs: FeatureTab[] };
  primaryCards?: { title?: string; subtitle?: string; cards: Card[] };
  secondarySplit?: RichSection & ImageField;
  secondaryCards?: { title?: string; subtitle?: string; cards: Card[] };
  logoMarquee?: { title?: string; logos: Logo[] };
  cta?: { title?: string; body?: SimplePortableTextBlock[]; cta?: Cta };
};

const mergeObject = <T extends Record<string, any>>(fallback: T, value?: Partial<T> | null): T => ({
  ...fallback,
  ...(value || {}),
});

const mergeList = <T extends Record<string, any>>(fallback: T[], value?: Partial<T>[] | null): T[] => {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, index) => mergeObject(fallback[index] || ({} as T), item));
};

const keepBlocks = (value: SimplePortableTextBlock[] | undefined | null, fallback: SimplePortableTextBlock[] | undefined) => value ?? fallback;

export function mergeAboutPageData(value?: Partial<AboutPageData> | null): AboutPageData {
  const page = value || {};
  const defaults = defaultAboutPageData;
  return {
    ...defaults,
    ...page,
    hero: { ...defaults.hero, ...(page.hero || {}), body: keepBlocks(page.hero?.body, defaults.hero.body) },
    who: {
      ...defaults.who,
      ...(page.who || {}),
      body: keepBlocks(page.who?.body, defaults.who.body),
      credentials: mergeList(defaults.who.credentials, page.who?.credentials),
    },
    mission: {
      ...defaults.mission,
      ...(page.mission || {}),
      headingLines: page.mission?.headingLines || defaults.mission.headingLines,
      cards: mergeList(defaults.mission.cards, page.mission?.cards),
    },
    values: {
      ...defaults.values,
      ...(page.values || {}),
      tabs: mergeList(defaults.values.tabs, page.values?.tabs),
    },
    approach: { ...defaults.approach, ...(page.approach || {}), body: keepBlocks(page.approach?.body, defaults.approach.body) },
    team: mergeObject(defaults.team, page.team),
    teamCta: { ...defaults.teamCta, ...(page.teamCta || {}), body: keepBlocks(page.teamCta?.body, defaults.teamCta.body) },
  };
}

export function mergeCapabilitiesPageData(value?: Partial<CapabilitiesPageData> | null): CapabilitiesPageData {
  const page = value || {};
  const defaults = defaultCapabilitiesPageData;
  return {
    ...defaults,
    ...page,
    hero: { ...defaults.hero, ...(page.hero || {}), body: keepBlocks(page.hero?.body, defaults.hero.body) },
    outcomes: { ...defaults.outcomes, ...(page.outcomes || {}), body: keepBlocks(page.outcomes?.body, defaults.outcomes.body) },
    workflow: { ...defaults.workflow, ...(page.workflow || {}), body: keepBlocks(page.workflow?.body, defaults.workflow.body) },
    details: mergeList(defaults.details, page.details).map((detail, index) => ({
      ...detail,
      body: keepBlocks(detail.body, defaults.details[index]?.body),
    })),
  };
}

export function mergeCapabilityDetailPageData(
  fallback: CapabilityDetailPageData,
  value?: Partial<CapabilityDetailPageData> | null,
): CapabilityDetailPageData {
  const page = value || {};
  return {
    ...fallback,
    ...page,
    hero: { ...fallback.hero, ...(page.hero || {}), body: keepBlocks(page.hero?.body, fallback.hero.body) },
    split: fallback.split || page.split ? { ...(fallback.split || {}), ...(page.split || {}), body: keepBlocks(page.split?.body, fallback.split?.body) } : undefined,
    statement: fallback.statement || page.statement ? { ...(fallback.statement || {}), ...(page.statement || {}), body: keepBlocks(page.statement?.body, fallback.statement?.body) } : undefined,
    featureTabs: fallback.featureTabs || page.featureTabs ? { ...(fallback.featureTabs || {}), ...(page.featureTabs || {}), tabs: mergeList(fallback.featureTabs?.tabs || [], page.featureTabs?.tabs) } : undefined,
    primaryCards: fallback.primaryCards || page.primaryCards ? { ...(fallback.primaryCards || {}), ...(page.primaryCards || {}), cards: mergeList(fallback.primaryCards?.cards || [], page.primaryCards?.cards) } : undefined,
    secondarySplit: fallback.secondarySplit || page.secondarySplit ? { ...(fallback.secondarySplit || {}), ...(page.secondarySplit || {}), body: keepBlocks(page.secondarySplit?.body, fallback.secondarySplit?.body) } : undefined,
    secondaryCards: fallback.secondaryCards || page.secondaryCards ? { ...(fallback.secondaryCards || {}), ...(page.secondaryCards || {}), cards: mergeList(fallback.secondaryCards?.cards || [], page.secondaryCards?.cards) } : undefined,
    logoMarquee: fallback.logoMarquee || page.logoMarquee ? { ...(fallback.logoMarquee || {}), ...(page.logoMarquee || {}), logos: mergeList(fallback.logoMarquee?.logos || [], page.logoMarquee?.logos) } : undefined,
    cta: fallback.cta || page.cta ? { ...(fallback.cta || {}), ...(page.cta || {}), body: keepBlocks(page.cta?.body, fallback.cta?.body) } : undefined,
  };
}

export const defaultAboutPageData: AboutPageData = {
  seoTitle: 'About Found Search Marketing | An Enterprise Paid Media Agency',
  seoDescription: 'Founded in 2006, Found Search Marketing helps enterprise brands achieve consistent, measurable growth through trusted partnerships and precision media execution.',
  canonicalUrl: 'https://www.foundsm.com/about-us',
  hero: {
    heading: 'Built for Paid Media Performance',
    body: [
      block('Found Search Marketing is a full-service data engineering agency that leverages advanced analytics to drive smart, paid media strategies. By integrating data-driven insights, strategy and paid media execution under one roof, we deliver customized solutions that generate high-intent leads and measurable results.'),
      block("Our team values transparency, accountability, and innovative problem solving. That's why many of our clients have stuck with us for more than a decade."),
    ],
    imageAlt: '',
  },
  who: {
    eyebrow: 'EST. 2006',
    heading: 'Who We Are',
    body: [
      block('Our company was founded in 2006 by Julie Warnecke - the fourth employee on the Google Ads team. Based in the suburbs of Indianapolis, Indiana, Found has grown to include more than 50 employees - including three former Googlers - across 12 states.'),
    ],
    subheading: "We're Also:",
    imageAlt: 'Found Search Marketing team members collaborating',
    credentials: [
      { alt: 'Google Partner badge', text: 'Certified in many Google marketing products' },
      { alt: 'Indianapolis Business Journal badge', text: 'Named one of the largest Marketing Firms in Indianapolis' },
      { alt: 'Women-Owned Business Enterprise badge', text: 'Independently owned, certified Women-Owned Business' },
      { alt: 'Indiana badge', text: 'Multiple winners of Best Places to Work awards' },
    ],
  },
  mission: {
    eyebrow: 'Guided By Our Mission',
    headingLines: ['Scale Smarter, Move Faster,', 'Grow Together'],
    cards: [
      { title: 'Smarter', body: [block('by leveraging cutting-edge technology, first-party data, and custom methodologies to drive measurable business impact.')] },
      { title: 'Faster', body: [block('by providing full-service paid media solutions, from campaign strategy and execution to high-performing ads and landing pages that convert.')] },
      { title: 'Together', body: [block('by sitting on the same side of the table as our clients, while empowering our team to thrive, collaborate, and grow alongside them.')] },
    ],
  },
  values: {
    heading: 'Rooted In Our Values',
    tabs: [
      { id: 'client-aligned', title: 'Client Aligned', body: [block('We are more than partners - we sit on the same side of the table. We work alongside our clients, driven by trust, shared goals, and a commitment to long-term growth.')], imageAlt: 'Client Aligned' },
      { id: 'challenge-assumptions', title: 'Challenge Assumptions', body: [block('We encourage our team, agency, and clients to question the status quo. Innovation starts with curiosity - and better outcomes come from testing, learning, and evolving together.')], imageAlt: 'Challenge Assumptions' },
      { id: 'own-outcome', title: 'Own The Outcome', body: [block('We focus on what works, measure what matters, and are committed to quality and doing things the right way for our clients - always for the growth of our team and agency.')], imageAlt: 'Own The Outcome' },
      { id: 'scale-intent', title: 'Scale With Intent', body: [block('Smart growth is shared growth. Our strategies are built to drive measurable, sustainable impact - for our clients, for our agency, and for the people who make it happen.')], imageAlt: 'Scale With Intent' },
    ],
  },
  approach: {
    heading: 'Our Proven Approach',
    body: [block("First-party data. Custom playbooks. Automation. Innovative bid strategies. Bespoke dashboards. Our approach combines all of these things and more to create a self-reinforcing optimization cycle that gives us the complete picture of your paid media ecosystem. It's all about turning your data into better insights - and more clicks into more customers.")],
    imageAlt: 'Found Search Marketing planning process',
    cta: { label: 'See What Makes Us Unique', href: '/our-approach/' },
  },
  team: {
    heading: 'Meet The Team',
    imageAlt: 'The Found Search Marketing team',
  },
  teamCta: {
    body: [
      block("Over nearly two decades, our agency has grown substantially. The reason is our team - they're among the best in the world at what they do. That's because we're client-first thinkers. We move fast - but always with intention. We focus on working smarter, while executing through the minutia. We put our egos in the back seat. And we love what we do."),
      block('We also work together seamlessly for the benefit of our clients - a big reason many of our team members stay for five or even ten-plus years.'),
    ],
    cta: { label: 'Meet the Team', href: '/team/' },
  },
};

export const defaultCapabilitiesPageData: CapabilitiesPageData = {
  seoTitle: 'Capabilities | Found Search Marketing | Enterprise Paid Media Agency',
  seoDescription: 'Found Search Marketing brings deep channel expertise, custom analytics, and agile strategy together to maximize performance across your entire media ecosystem.',
  canonicalUrl: 'https://www.foundsm.com/capabilities/',
  robots: 'index, follow',
  hero: {
    heading: 'Smart Data. Smarter Media. Scalable Growth.',
    body: [block('Found Search Marketing is structured to be both strategic and agile, combining deep media channel expertise with expert talent and leading-edge tools.')],
    imageAlt: '',
  },
  outcomes: {
    eyebrow: 'Our Capabilities',
    heading: 'Outcomes that Outperform',
    body: [
      block('We build smart, custom systems for performance marketing by combining first-party data with our proven approach. That starts with a custom playbook where we map solutions tied directly to business outcomes. This includes development of initial KPIs and is our foundation for planning. We also create different versions for launch, expansion, and efficiency - always taking into account factors like brand strength, demand, revenue, profitability, and opportunity cost.'),
      block('We handle every aspect of your performance lead generation ecosystem, making sure strategy and execution are always aligned.'),
    ],
    imageAlt: '',
  },
  workflow: {
    heading: 'How We Work',
    body: [block("There are no silos here. Our Paid Media, Data Intelligence, and Performance Creative teams are deeply integrated with each other, creating a connected ecosystem designed to drive smarter decisions and stronger results. This collaboration extends far beyond our walls, as we aim to be a true extension of our clients' teams, partnering across their functional teams, and integrating within existing systems and workflows to ensure alignment, agility, and shared success.")],
    prompt: 'Explore Our Capabilities Below',
    imageAlt: 'Found Performance Media Ecosystem',
  },
  details: [
    { id: 'data', heading: 'Data, Reporting & Analytics', body: [block('Do you have multiple data sources to connect? Or multiple CRMs? No problem.'), block("For us, analytics and reporting go beyond tracking paid media, and everything we build is uniquely customized to your business goals, data, and workflows. No templates or generic dashboards. From attribution models to automated scripts, we help your team understand what's happening, why, and what to do next.")], cta: { label: 'Connect Data to Outcomes', href: '/capabilities/data-intelligence/' }, imageAlt: '' },
    { id: 'paid', heading: 'Paid Media', body: [block("We don't just manage campaigns. We engineer ecosystems.\nOur team brings 20+ years of performance experience and a clear view on how to structure, optimize, and scale lead gen across platforms, all while finding new channels for experimentation and growth. Whether you need to diversify your portfolio or double down on what's working, we'll help you reduce risk, maximize efficiency, and push performance further.")], cta: { label: "Let's Scale Smarter", href: '/capabilities/paid-media/' }, imageAlt: '' },
    { id: 'creative', heading: 'Performance Creative & CRO', body: [block("Performance creative bridges the gap between storytelling and sales. We design motion graphics, ad creative, and landing pages that don't just look good - they drive traffic and conversions. Everything we do is tested and built with intention: messaging tailored to your audience, strategic rapid experimentation, visuals designed specifically for the platform, and performance that keeps improving.")], cta: { label: 'Creative Ads That Convert', href: '/capabilities/performance-creative/' }, imageAlt: '' },
  ],
};

export const defaultCapabilityDetailPages: Record<string, CapabilityDetailPageData> = {
  dataActivation: {
    seoTitle: 'Data Activation | Found Search Marketing',
    seoDescription: 'Found Search Marketing brings your first-party customer data directly to the ad platforms where growth happens, creating a continuous feedback loop that improves targeting, reduces wasted spend, and scales qualified lead generation.',
    canonicalUrl: 'https://www.foundsm.com/capabilities/data-activation',
    hero: { heading: 'Activate Your Customer Data To Actually Drive Revenue', body: [block("In today's AI marketing landscape, data is your most valuable asset, yet many companies are not using it to its full potential. Found Search Marketing brings your first-party customer data directly to the ad platforms where growth happens, creating a continuous feedback loop that improves targeting, reduces wasted spend, and engineers revenue.")], imageAlt: 'Kitchen island used as a data activation visual metaphor' },
    primaryCards: { title: "What We'll Do", cards: [
      { title: 'Connect your first-party data to ad platforms', body: [block('Transform your fragmented customer data into a single, actionable source that powers every campaign.')] },
      { title: 'Create always-on data automation', body: [block('Make your data work for you 24/7 - continually updating audiences, refining targeting, and improving performance behind the scenes.')] },
      { title: 'Modernize your data foundation', body: [block('Modernize your data to take advantage of the ever-changing marketing world.')] },
      { title: 'Fuel AI with real customer insight', body: [block('Build upon the AI systems already driving these platforms, ensuring the algorithms are learning from your real customer insights, not generic lookalike data.')] },
    ] },
    statement: { lead: "Why It's Needed", body: [
      block("In today's AI-driven marketing world, your product, data, and creative are what truly set you apart. We're moving away from a time when marketers could manually tweak campaigns, handpick audiences, and rely on human judgment to outperform the competition."),
      block("AI and automation now drive performance, but their success depends entirely on the quality of the data they're given. If the system is fed incomplete, outdated or misaligned information, it will optimize toward the wrong outcomes, wasting ad spend and missing high-value opportunities."),
      block("Found solves this by bringing together first-party data and insights from across your organization into one centralized, actionable system. This unified data feeds directly into ad platforms, powering advanced targeting, better lead quality, and more efficient scaling."),
      block("Through Found's proven process, we pull valuable data from every corner of your business to fuel smarter automation, reduce waste, and create a foundation for continuous, AI-powered growth."),
    ] },
    cta: { title: "Let's Unlock Your Data's Potential", body: [block("In a world where everyone uses AI and data, it's too risky to fly blind. Clean, connected data fueling your systems and paid media is the only path to smarter growth. That's what we deliver.")], cta: { label: "Let's Chat Data", href: 'https://foundsm.com/dataconnect/' } },
  },
  dataIntelligence: {
    seoTitle: 'Data Intelligence | Found Search Marketing',
    seoDescription: 'Data sits at the core of our operations. From powering your CRM, to feeding downstream systems, it is used to inform channel mixes, create audience models and more. Your data lives everywhere. We bring it together: cross-platform, API-driven, and unified into a single view.',
    canonicalUrl: 'https://www.foundsm.com/capabilities/data-intelligence',
    hero: { heading: 'Transform Complex Data Into Growth', body: [block("Data sits at the core of our operations. From powering your CRM, to feeding downstream systems, it's used to inform channel mixes, create audience models, and more. Your data lives everywhere. We bring it together: cross-platform, API-driven, and unified into a single view.")], imageAlt: 'Cactus data intelligence illustration' },
    split: { heading: 'How We Work', body: [block("Our Data Intelligence team serves as a catalyst to paid media and creative solutions, ensuring campaigns are built on accuracy, agility, and insight. Certified in Google Analytics and Google Cloud, our DI specialists integrate seamlessly with client systems, whether it's IT, compliance, or sales, to ensure data integrity and alignment on what matters most. Our platform-agnostic approach allows us to easily adapt to your tools and workflows to create clarity, speed, and confidence in every move.")], imageAlt: 'Data intelligence workflow illustration' },
    primaryCards: { title: 'Your Data + Our Intelligence', subtitle: 'Let Found unlock the potential of your data.', cards: [
      { title: 'Discovery, Audit & Analysis', body: [block('The process begins by mapping your entire data landscape to get the full picture of your business. Then, we perform an in-depth analysis of your tech stack to uncover insights that drive clear recommendations and implementation plans.')] },
      { title: 'Tagging & Tracking', body: [block("To ensure maximum measurement durability, our team configures the tracking and validates every event and conversion. Whether it's deploying scripts through GTM or building accurate tracking parameters back to your CRM, we'll ensure your downstream outcomes are connected to marketing data.")] },
      { title: 'Engineering Audience Models', body: [block("We don't just use data to activate campaigns; we engineer high-intent audience models that uncover your most valuable customers with precision. Those audiences are activated across channels to drive efficiency, relevance, and growth.")] },
      { title: 'Customized Solutions & Reporting', body: [block('We create customized solutions for you and your stakeholders, so each report or dashboard speaks your language and tells a clear story based on your business goals. From clicks to downstream metrics, our expertise pulls your data into one clear, powerful view.')] },
      { title: 'Platform Agnostic', body: [block('We specialize in leveraging APIs that connect disparate, complex data sources into one unified view, no matter the platform or quantity of data sources. Our team is fluent across platforms, working within your existing stack to drive results.')] },
      { title: 'Privacy, Security & Governance', body: [block('As a certified OneTrust partner, our team has a strategic understanding of how privacy impacts your marketing. By partnering with Found, you gain a trusted advisor that will help you stay compliant and turn privacy into a competitive advantage.')] },
    ] },
    logoMarquee: { logos: [{ alt: 'Dynamics CRM' }, { alt: 'Funnel' }, { alt: 'Google Analytics' }, { alt: 'Google Analytics 360' }, { alt: 'Google Analytics certification' }, { alt: 'OneTrust' }, { alt: 'Google Marketing Platform certified' }, { alt: 'Salesforce' }, { alt: 'Vertex AI' }, { alt: 'Vertex AI logo' }, { alt: 'Google Cloud Partner' }] },
    secondarySplit: { heading: 'Getting the Most From Advanced Analytics & AI', body: [block('We go beyond dashboards, leveraging a variety of tools to turn complex data into decisions your team can act on.')], imageAlt: 'AI chip analytics illustration' },
    secondaryCards: { cards: [
      { title: 'Detect anomalies', body: [block('Detect anomalies in real time, enabling rapid media adjustments.')] },
      { title: 'Run predictive models', body: [block('Run predictive models for customer behavior.')] },
      { title: 'Perform causality analysis', body: [block('Perform causality analysis that pinpoints which tactics are getting the best results.')] },
      { title: 'Prove ROI', body: [block('Prove ROI by tying marketing performance directly to business outcomes.')] },
    ] },
    cta: { title: 'Your data gives you unlimited potential.', body: [block('Find out how we can work together to leverage the power of your data to generate consistent, predictable revenue for your business.')], cta: { label: "Let's Connect Data to Outcomes", href: '/contact-us/' } },
  },
  paidMedia: {
    seoTitle: 'Paid Media | Found Search Marketing',
    seoDescription: 'Found Search Marketing brings deep channel expertise, custom analytics, and agile strategy together to maximize performance across your entire media ecosystem.',
    canonicalUrl: 'https://www.foundsm.com/capabilities/paid-media',
    hero: { heading: 'Achieve the Perfect Mix of Paid Media', body: [block('Like a great cup of coffee, creating the ideal blend of paid media strategy requires true expertise. Our ability to engineer paid media solutions that convert higher-quality leads, eliminate waste, and drive consistent revenue growth is unmatched.'), block('Blending your data with our comprehensive understanding of the most effective paid media strategy delivers efficiency and continually improves your business outcomes.')], image: '/images/pages/paid-media/coffee-blend.webp', imageAlt: 'Coffee beans blended with Found Search Marketing paid media visuals' },
    split: { heading: 'How We Work', body: [block("At Found Search Marketing, Paid Media is far more than campaign management. It's the strategic core of an integrated system that works in lockstep with Data Intelligence, Landing Pages, and Performance Creative. Together, this ecosystem informs bid strategies, engineers audience models, drives creative and landing page testing, and refines channel mix to optimize marketing spend and drive profitable growth.")], image: '/images/pages/paid-media/paid-media-ecosystem.webp', imageAlt: 'Found Search Marketing paid media ecosystem diagram' },
    featureTabs: { idPrefix: 'paid-media-capabilities', tabs: [
      { title: 'Platform Mastery and Experimentation', body: [block("We don't just do what's worked in the past. Our team is always learning and testing every ad platform's latest features to find the best use cases.")], icon: '/images/pages/paid-media/tab-icon-platform.png', image: '/images/pages/paid-media/tab-art-platform.webp', imageAlt: 'Platform mastery and experimentation illustration' },
      { title: 'Data-Driven Bid Strategies', body: [block('From target-ROAS to Advantage+ bidding, strategies are intentionally crafted based on your specific business goals to balance volume with efficiency.')], icon: '/images/pages/paid-media/tab-icon-bid.png', image: '/images/pages/paid-media/tab-art-bid.webp', imageAlt: 'Data-driven bid strategy illustration' },
      { title: 'Cross-Channel Synergy', body: [block('We use data from each channel to inform the next, ensuring your customers see the right message at the right moment. By treating every platform as an interconnected engine, your media mix continuously optimizes to maximize returns.')], icon: '/images/pages/paid-media/tab-icon-synergy.png', image: '/images/pages/paid-media/tab-art-synergy.webp', imageAlt: 'Cross-channel synergy illustration' },
      { title: 'Transparent Reporting and Rapid Iteration', body: [block('Performance scorecards, dashboards, and real-time monitoring tools keep us aligned on spend, CPL, downstream performance, and more, allowing our team to quickly adapt while your team has visibility into performance.')], icon: '/images/pages/paid-media/tab-icon-reporting.png', image: '/images/pages/paid-media/tab-art-reporting.webp', imageAlt: 'Transparent reporting and rapid iteration illustration' },
    ] },
    primaryCards: { title: 'Maximize Impact Across the Full Customer Journey', subtitle: 'Found creates a diverse media mix that builds awareness, nurtures interest, and captures intent at the right moment.', cards: [
      { title: 'Paid Search', lead: 'Reach qualified prospects the moment they signal intent.', body: [block('By combining smart data engineering, value-based bidding, and first-party data, we design search strategies that maximize your investment and reach the right prospects at the most impactful point in their research process.')], icon: '/images/pages/paid-media/icon-paid-search.png' },
      { title: 'Paid Social', lead: 'Drive consideration and engagement across key platforms.', body: [block('Paid social can offset rising paid search costs, generate awareness, and help create demand. Layered audiences and creative tests help us identify the ads that drive performance.')], icon: '/images/pages/paid-media/icon-paid-social.png' },
      { title: 'Display', lead: 'Keep your brand top-of-mind and create demand during the research phase.', body: [block('We look beyond last-click attribution to understand the role display has on search and the broader customer journey, then tie every adjustment back to your data.')], icon: '/images/pages/paid-media/icon-display.png' },
      { title: 'Programmatic', lead: 'Expand your reach with precision on programmatic networks and native platforms.', body: [block('Audience-based bid multipliers, frequency capping, and dynamic creative optimization help control ad fatigue and scale efficiently, with every adjustment informed by data.')], icon: '/images/pages/paid-media/icon-programmatic.png' },
    ] },
    secondaryCards: { title: 'Advanced Analytics & AI', subtitle: "Found's Paid Media and Data Intelligence teams work hand-in-hand to leverage first-party data, media mix modeling, and real-time performance alerts.", cards: [
      { title: 'Attribution & Media Mix Modeling', body: [block("Using a powerful tech stack guided by our team's expertise, we identify what's working and reallocate budgets to the initiatives driving the strongest outcomes.")], icon: '/images/pages/paid-media/icon-attribution.svg' },
      { title: 'AI-Driven Optimization', body: [block('We use AI-driven optimization to detect outliers in CPC and conversion rate, triggering automated bid adjustments before costs spiral.')], icon: '/images/pages/paid-media/icon-optimization.svg' },
      { title: 'Predictive Forecasting', body: [block('Our projections help you anticipate spend pacing and ROI, so you can hit targets without guesswork.')], icon: '/images/pages/paid-media/icon-forecasting.svg' },
    ] },
    cta: { body: [block("With our paid media expertise, you'll never wonder if your budget is working optimally, because you'll see exactly how every dollar is being spent and driving growth.")], cta: { label: "Let's Talk Paid Media", href: '/contact-us/' } },
    logoMarquee: { logos: [
      { image: '/images/pages/paid-media/google-ads-4.png', alt: 'Google Ads partner badge' },
      { image: '/images/pages/paid-media/google-ads-1.png', alt: 'Google Ads logo' },
      { image: '/images/pages/paid-media/google-ads-2.png', alt: 'Google Ads certification badge' },
      { image: '/images/pages/paid-media/google-ads-3.png', alt: 'Google Ads certification wordmark' },
      { image: '/images/pages/paid-media/google-ads-5.png', alt: 'Google Ads search badge' },
      { image: '/images/pages/paid-media/google-ads-6.png', alt: 'Google Ads display badge' },
      { image: '/images/pages/paid-media/google-ads-7.png', alt: 'Google Ads shopping badge' },
      { image: '/images/pages/paid-media/google-ads-8.png', alt: 'Google Ads video badge' },
    ] },
  },
  performanceCreative: {
    seoTitle: 'Performance Creative | Found Search Marketing',
    seoDescription: 'Found Search Marketing brings deep channel expertise, custom analytics, and agile strategy together to maximize performance across your entire media ecosystem.',
    canonicalUrl: 'https://www.foundsm.com/capabilities/performance-creative',
    hero: { heading: 'Make Every Interaction Count.', body: [block('Our Performance Creative and CRO teams have one goal: transform prospects into customers. We understand the impact creative can have on CPL and your bottom line.'), block("It's not just about looking good. It's about making data-based decisions that optimize your investment. Creative and landing pages are powerful levers to improve performance, drive efficiencies, and control costs.")], image: '/images/pages/performance-creative/hero-tr-sketch.webp', imageAlt: '' },
    split: { heading: 'How We Work', body: [block('At Found, Performance Creative is where strategy meets storytelling. Our Creative and CRO teams collaborate closely with Paid Media and Data Intelligence to ensure every concept, variation, and landing page is informed by real-time data and optimized for measurable results. You have a significant investment in paid media, and we optimize each touch point to reduce CPL and improve CVR. We built our team to fast-track creative and landing page production specifically for paid media campaigns.')], image: '/images/pages/performance-creative/performance-creative-ecosystem.png', imageAlt: 'Performance media ecosystem diagram' },
    featureTabs: { idPrefix: 'performance-creative-methods', tabs: [
      { title: 'Understanding the "Why"', body: [block('We love digging into metrics and session behavior. From heat maps, click paths, and funnel drop-off points, all of these help us better understand your audiences, their motivations and what moves them down the funnel.')], icon: '/images/pages/performance-creative/icon-why.svg', image: '/images/pages/performance-creative/tab-question.webp', imageAlt: 'Understanding the "Why"' },
      { title: 'Agile Motion and Media Design', body: [block('No months-long VFX shoots here. We specialize in fast-tracked creative that has one goal - perform. Our team creates images, videos, and landing pages in days or hours, not weeks. Our project managers plug in with your internal team so you have full visibility and can review and approve all assets.')], icon: '/images/pages/performance-creative/icon-agile.svg', image: '/images/pages/performance-creative/tab-colorwave.webp', imageAlt: 'Agile Motion and Media Design' },
      { title: 'Data-Backed Iteration', body: [block('Using innovative tools that include eye-tracking and scroll-map data, we validate creative and page tweaks in real time. Each test is measured, refined, and expanded according to results.')], icon: '/images/pages/performance-creative/icon-iteration.svg', image: '/images/pages/performance-creative/tab-lightbeams.webp', imageAlt: 'Data-Backed Iteration' },
      { title: 'Fast-Track Creative and Testing', body: [block("Found's Performance Creative Team combines inventive motion design, data-driven landing page builds and conversion rate optimization into one seamless workflow. While we are no stranger to creative sprints, we hold brand safety and compliance to the highest standards.")], icon: '/images/pages/performance-creative/icon-testing.svg', image: '/images/pages/performance-creative/tab-computer.webp', imageAlt: 'Fast-Track Creative and Testing' },
    ] },
    secondarySplit: { heading: 'End to End Experience Design', body: [block('Our team has a detailed understanding of landing page UX/UI and how to use it to drive action, not just get attention. By incorporating CRO best practices, compliance intelligence, and data, we build landing pages that convert.')], image: '/images/pages/performance-creative/creative-sketch2.webp', imageAlt: '' },
    primaryCards: { cards: [
      { title: 'Data-Led Page Builds', body: [block('We design around proven CRO principles with your goals top of mind, while measuring every scroll, click, and drop-off.')] },
      { title: 'Iterative Improvements', body: [block('Form fields, button colors, and countless details are refined through rapid A/B cycles and multivariate testing to fuel continuous conversion gains.')] },
      { title: 'Root-Cause Analysis', body: [block('Using session recordings, click maps, and funnel insights, we identify points of hesitation on your landing page and eliminate friction to boost conversions.')] },
    ] },
  },
};
