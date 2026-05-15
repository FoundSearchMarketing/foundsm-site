import { block, type SimplePortableTextBlock } from './simplePortableTextCore';

export type LegacyPageGroup = 'root' | 'insights' | 'authorIndex' | 'whitepapers';

export interface LegacyPageDefinition {
  id: string;
  path: string;
  title: string;
  description: string;
  group: LegacyPageGroup;
}

export interface LegacyAuthorDefinition {
  slug: string;
  name: string;
  title?: string;
  team?: string;
  foundStartDate?: string;
  expertise?: string;
  bio?: string;
  image?: string;
}

export interface LegacyAuthorLatestPost {
  title: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  date?: string;
}

export interface LegacyCta {
  label?: string;
  href?: string;
}

export interface LegacyPageCard {
  title: string;
  body?: SimplePortableTextBlock[];
  cta?: LegacyCta;
}

export interface LegacyPageForm {
  heading?: string;
  body?: SimplePortableTextBlock[];
  hubspotFormId?: string;
}

export interface LegacyPageData {
  _id?: string;
  title: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  robots: string;
  ogImage?: string;
  hero: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    image?: unknown;
    imageAlt?: string;
  };
  body: SimplePortableTextBlock[];
  cards?: LegacyPageCard[];
  listing?: {
    latestHeading?: string;
    heading?: string;
    body?: SimplePortableTextBlock[];
    filterLabel?: string;
  };
  cta?: {
    heading?: string;
    body?: SimplePortableTextBlock[];
    label?: string;
    href?: string;
  };
  form?: LegacyPageForm;
}

export interface LegacyAuthorData {
  _id?: string;
  slug: string;
  name: string;
  title?: string;
  team?: string;
  foundStartDate?: string;
  expertise?: string;
  bio?: string;
  linkedin?: string;
  image?: string;
  wpId?: number;
  profileHeading?: string;
  profileImage?: string;
  profileImageAlt?: string;
  profileTeam?: string;
  profileFoundStartDate?: string;
  profileExpertise?: string;
  profileBody?: SimplePortableTextBlock[];
  latestPosts?: LegacyAuthorLatestPost[];
}

export const legacyPageDefinitions: LegacyPageDefinition[] = [
  {
    id: 'legacy-dataconnect',
    path: '/dataconnect/',
    title: 'Data Connect',
    description: 'Connect customer, media, and conversion data so your team can make decisions from cleaner marketing signals.',
    group: 'root',
  },
  {
    id: 'legacy-insights-filter-results',
    path: '/insights-filter-results/',
    title: 'Insights Filter Results',
    description: 'Explore filtered perspectives from Found on paid media, analytics, data strategy, and performance marketing.',
    group: 'root',
  },
  {
    id: 'legacy-insights-march-update-v2',
    path: '/insights-march-update-v2/',
    title: 'Insights March Update v2',
    description: 'Read the latest March update from the Found team, including timely perspectives for modern marketing teams.',
    group: 'root',
  },
  {
    id: 'legacy-insights-march-update',
    path: '/insights-march-update/',
    title: 'Insights March Update',
    description: 'Read the March update from the Found team, including timely perspectives for modern marketing teams.',
    group: 'root',
  },
  {
    id: 'legacy-insights-authors',
    path: '/insights/authors/',
    title: 'Authors',
    description: 'Meet the people behind Found insights and explore their latest thinking on performance marketing.',
    group: 'authorIndex',
  },
  {
    id: 'legacy-man-vs-machine-smx-webinar',
    path: '/insights/man-vs-machine-smx-webinar/',
    title: 'Man vs Machine - SMX On-Demand Webinar',
    description: 'Watch the on-demand webinar on how marketers can balance automation, human strategy, and performance.',
    group: 'insights',
  },
  {
    id: 'legacy-modernize-your-data-architecture-webinar',
    path: '/insights/modernize-your-data-architecture-webinar/',
    title: 'Modernize Your Data Architecture - On-Demand Webinar',
    description: 'Watch the on-demand webinar on building a more durable marketing data architecture.',
    group: 'insights',
  },
  {
    id: 'legacy-modernize-your-data-architecture',
    path: '/insights/modernize-your-data-architecture/',
    title: 'Modernize Your Data Architecture',
    description: 'Learn how better marketing data architecture can improve measurement, activation, and decision-making.',
    group: 'insights',
  },
  {
    id: 'legacy-tools-and-guides',
    path: '/insights/toolsandguides/',
    title: 'Tools and Guides',
    description: 'Browse practical tools and guides from Found for paid media, analytics, and data activation teams.',
    group: 'insights',
  },
  {
    id: 'legacy-webinar',
    path: '/insights/webinar/',
    title: 'Watch the Webinar',
    description: 'Access webinar content from Found covering marketing data, paid media, analytics, and performance strategy.',
    group: 'insights',
  },
  {
    id: 'legacy-webinars',
    path: '/insights/webinars/',
    title: 'Webinars',
    description: 'Browse Found webinars and on-demand sessions for performance marketers and data-driven teams.',
    group: 'insights',
  },
  {
    id: 'legacy-website-cookies-explained-webinar',
    path: '/insights/website-cookies-explained-on-demand-webinar/',
    title: 'Website Cookies Explained - On-Demand Webinar',
    description: 'Watch the on-demand session explaining website cookies, tracking changes, and marketing measurement impact.',
    group: 'insights',
  },
  {
    id: 'legacy-insights-whitepapers',
    path: '/insights/whitepapers/',
    title: 'White Papers',
    description: 'Browse Found white papers and long-form resources for marketing analytics, data, and paid media strategy.',
    group: 'insights',
  },
  {
    id: 'legacy-safelist',
    path: '/safelist/',
    title: 'Safelist',
    description: 'Find sender and domain details that help your team receive important communication from Found.',
    group: 'root',
  },
  {
    id: 'legacy-signal-quiz',
    path: '/signal-quiz/',
    title: 'Signal Quiz',
    description: 'Assess how much signal loss may be hiding in your marketing measurement and activation workflows.',
    group: 'root',
  },
  {
    id: 'legacy-thank-you',
    path: '/thank-you/',
    title: 'Thank You',
    description: 'Thanks for connecting with Found. Our team will follow up with you soon.',
    group: 'root',
  },
  {
    id: 'legacy-whitepapers',
    path: '/whitepapers/',
    title: 'Whitepapers',
    description: 'Browse Found whitepapers and resources for marketers working across paid media, analytics, and data strategy.',
    group: 'whitepapers',
  },
  {
    id: 'legacy-first-party-data-whitepaper',
    path: '/whitepapers/first-party-data/',
    title: 'Why First-Party Data Is Your Most Valuable Profit Lever',
    description: 'Learn why first-party data is one of the most durable assets for better marketing performance and measurement.',
    group: 'whitepapers',
  },
];

export const legacyAuthorDefinitions: LegacyAuthorDefinition[] = [
  {
    slug: 'julie',
    name: 'Julie Warnecke',
    title: 'CEO',
    team: 'Executive Leadership',
    foundStartDate: '2006',
    expertise: 'Measurement Strategy, Operational Excellence, Strategic Growth',
    bio: 'Julie Warnecke is the Founder and CEO of Found Search Marketing, a Midwest firm managing over $200M in annual media spend. An early Google employee instrumental in launching AdWords, she established Found in 2006. Today, she leads a team of 50+ that serves as a seamless extension of client teams.',
    image: '/images/pages/team/julie-warnecke.webp',
  },
  {
    slug: 'kelley',
    name: 'Kelley Swart',
    title: 'VP, Strategy & Growth',
    team: 'Executive Leadership',
    foundStartDate: '2014',
    expertise: 'Client Alignment, Growth Architecture, Scalable Systems',
    bio: "Kelley, Found's VP of Strategy & Growth, brings 25+ years of experience, starting at Google Ads. She has led strategic planning for Fortune 1000 clients like Home Depot and Staples across CPG, Retail, and Higher Ed. Her focus is on strategic oversight and building strong relationships that exceed client goals.",
    image: '/images/pages/team/kelley-swart.webp',
  },
  {
    slug: 'nicholas',
    name: 'Nicholas Hoium',
    title: 'Head of Data Engineering',
    team: 'Innovation',
    foundStartDate: '2010',
    expertise: 'Google Cloud Certified Data Engineer',
    bio: 'With over 15 years of experience, Head of Data Engineering Nicholas Hoium builds advanced pipelines and web analytics solutions. The IU Bloomington graduate and Google Cloud Certified Engineer transforms raw information into accessible intelligence. Off the clock, Nicholas enjoys indie games, traveling, and watching soccer.',
    image: '/images/pages/team/nicholas-hoium.webp',
  },
  {
    slug: 'ryan',
    name: 'Ryan Eme',
    title: 'Head of Data Intelligence',
    team: 'Innovation',
    foundStartDate: '2014',
    expertise: 'Audience Intelligence, Data Strategy, Attribution Modeling',
    bio: 'Ryan Eme is the Head of Data Intelligence at Found, bringing 20 years of experience in data-driven marketing. A Certified Google Cloud Data Engineer, he helps clients in higher ed and healthcare unlock business growth. Known for his innovative problem-solving, Ryan is so effective that clients frequently ask to clone him.',
    image: '/images/pages/team/ryan-eme.webp',
  },
  {
    slug: 'adam',
    name: 'Adam Persinger',
    title: 'Head of Strategic Media',
    team: 'Innovation',
    foundStartDate: '2016',
    expertise: 'Strategic Media, Performance Forecasting, Channel Strategy',
    bio: 'Adam joined Found Search Marketing in 2016, leveraging his media strategy background to drive client results through research and testing. A Brown University graduate in Cognitive Neuroscience and Economics, he began his career with the Indianapolis Colts. Outside the office, Adam stays active through CrossFit, backpacking, and various team sports.',
    image: '/images/pages/team/adam-persinger.webp',
  },
  {
    slug: 'caroline',
    name: 'Caroline Stoner',
    title: 'Head of User Experience',
    team: 'Innovation',
    foundStartDate: '2017',
    expertise: 'User Experience & Strategy, CRO, Unbounce Expert',
    bio: 'As one of only 10 Unbounce Experts worldwide, Caroline specializes in creating high-performing landing pages and optimizing conversion rates. Her background spans CRO, web design, and SEO, with a focus on higher education. When not driving client results, Caroline enjoys gardening, cozy video games, and exploring the city with her family.',
    image: '/images/pages/team/caroline-stoner.webp',
  },
  {
    slug: 'kylie',
    name: 'Kylie Colquitt',
    title: 'Group Account Director',
    team: 'Client Partnership',
    foundStartDate: '2017',
    expertise: 'Client Services',
    bio: 'As Group Account Director, Kylie leverages 15+ years of experience to orchestrate cross-channel strategies that drive client growth. Having supported brands like General Motors at top Chicago agencies, she brings calm, collaborative leadership to her team. Outside work, Kylie enjoys life with her daughter and dog.',
    image: '/images/pages/team/kylie-colquitt.webp',
  },
  {
    slug: 'matt',
    name: 'Matt Dragoo',
    title: 'Senior Data Analyst',
    team: 'Client Partnership',
    foundStartDate: '2019',
    expertise: 'Reporting, Analysis, Paid Media Management',
    bio: 'Since joining Found in 2019, Purdue graduate Matt crafts data-driven paid media strategies. Certified across multiple platforms, he leverages his expertise in B2B and Higher Education to maximize client ROI. Known for predicting problems, Matt spends his free time gaming, cooking, and exploring Indianapolis.',
  },
  {
    slug: 'emily',
    name: 'Emily Williams-Hempstead',
    title: 'Strategist',
    team: 'Client Partnership',
    foundStartDate: '2020',
    expertise: 'Communication, collaboration & problem solving',
    bio: 'Strategist Emily Williams-Hempstead untangles complex challenges by applying her Indiana State Psychology and Marketing background to understand human behavior. Her knack for organizing chaos drives clear results for many clients at Found. Away from the agency, she enjoys traveling, hosting game nights, and relaxing with her two dogs.',
  },
  {
    slug: 'maria',
    name: 'Maria Escobedo',
    title: 'Associate Data Analyst',
    team: 'Client Partnership',
    foundStartDate: '2022',
    expertise: 'Data Analysis',
    bio: 'Maria leverages her Purdue MS in Business Analytics to transform complex datasets into actionable, strategic insights. With over three years at Found, this Google-certified expert effectively bridges technical analysis with business goals. Outside work, Maria enjoys teaching spin classes, cooking, and reading.',
  },
  {
    slug: 'kelsey',
    name: 'Kelsey Connor',
    title: 'Director, Marketing & Brand Strategy',
    team: 'Agency Operations',
    foundStartDate: '2025',
    expertise: 'Marketing, Brand & Positioning',
    bio: 'Kelsey brings nearly 20 years of expertise as Director of Agency Marketing and Brand Strategy. She fosters seamless client-agency collaboration to drive results through authentic leadership. A proud Hoosier with an MBA, Kelsey serves the community as REV Committee Chair and enjoys flipping houses and cheering on her family.',
    image: '/images/pages/team/kelsey-connor.webp',
  },
];

const profileBlocks = (paragraphs: string[]) => paragraphs.map((paragraph) => block(paragraph));

const sharedRecentPosts: LegacyAuthorLatestPost[] = [
  {
    title: 'Bot Traffic and Bad Lookalikes: How Dirty Signals Can Wreck Your Funnel and Your Targeting',
    href: '/insights/dirty-signals-bot-traffic-junk-leads/',
    imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/bot-traffic-sm-768x513.webp',
    imageAlt: '',
    imageWidth: 768,
    imageHeight: 513,
    date: 'March 20, 2026',
  },
  {
    title: 'Google Ads API Update: A Critical Change for Customer Match',
    href: '/insights/customer-match-uploads-disabled-in-google-ads-api/',
    imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/GA-API-update-hero-768x513.webp',
    imageAlt: '',
    imageWidth: 768,
    imageHeight: 513,
    date: 'March 11, 2026',
  },
  {
    title: 'When Marketing Metrics and Financial Results Don’t Align: Understanding Signal Loss',
    href: '/insights/signal-loss-costs-real-revenue/',
    imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Untitled-1200-x-801-px-768x513.webp',
    imageAlt: 'ROAS vs. Profit',
    imageWidth: 768,
    imageHeight: 513,
    date: 'March 6, 2026',
  },
  {
    title: 'Google’s Vision for 2026: Building a Revenue Engine Powered by Data',
    href: '/insights/googles-vision-for-2026-building-a-revenue-engine-powered-by-data/',
    imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/dataengine-768x432.webp',
    imageAlt: '',
    imageWidth: 768,
    imageHeight: 432,
    date: 'February 18, 2026',
  },
];

const legacyAuthorProfileDetails: Record<string, Partial<LegacyAuthorData>> = {
  caroline: {
    wpId: 5202,
    profileHeading: 'Caroline Stoner | Head of user experience',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Caroline_author_profile-240x300.webp',
    profileImageAlt: '',
    profileTeam: 'Innovation',
    profileFoundStartDate: '2017',
    profileExpertise: 'User Experience and Strategy, CRO, Unbounce Expert',
    profileBody: profileBlocks([
      'Caroline is our in-house Unbounce Expert, and one of only 10 experts worldwide.',
      'She’s passionate about creating high-performing landing pages and spends her time optimizing conversion rates for clients. With a strong background in marketing and advertising, Caroline brings expertise in CRO, web design, SEO, and landing page development, particularly in the higher education space. Her focus on learning and testing drives exceptional results.',
      'When Caroline is not at Found, you can find her….',
      'Right now? Tending to the every need of my little boy, Callum (and loving every minute of it). As a family, were big on exploring the city together, whether that’s going on walks or trying new restaurants. When I get free time, I’m usually listening to a book, gardening, cooking, playing cozy video games, or picking up whatever new hobby has caught my attention lately.',
    ]),
    linkedin: 'https://www.linkedin.com/in/caroline-stoner/',
    latestPosts: sharedRecentPosts,
  },
  emily: {
    wpId: 5986,
    profileHeading: 'Emily Williams-Hempstead | Strategist',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/Emily-FoundSM.webp',
    profileImageAlt: '',
    profileTeam: 'Client Partnership',
    profileFoundStartDate: '2020',
    profileExpertise: 'Communication, collaboration & problem solving',
    profileBody: profileBlocks([
      'As a Strategist, Emily Williams-Hempstead excels at bringing clarity and direction to complex challenges, guiding teams toward practical and impactful solutions. With a unique academic background—a double major in Psychology and Marketing from Indiana State University—she leverages a deep understanding of human behavior to inform her strategic approach. Her strengths in communication and collaboration make her an essential partner in solving problems and driving results.',
      'Emily thrives in dynamic environments, using her ability to organize chaotic situations to bring people together and forge a clear path forward. This skill has been instrumental in her work with major clients including Roche and Indiana Wesleyan University. She is adept at aligning team efforts to ensure every action makes a tangible impact for our partners.',
      'A true team player, Emily values the authentic partnership and shared focus that define the culture at Found. When she’s not collaborating with the team, she can be found traveling, reading, or hosting game nights with friends. She also enjoys spending time with her two dogs, Marshall and Mabel.',
    ]),
    linkedin: 'https://www.linkedin.com/in/emily-j-williams/',
    latestPosts: sharedRecentPosts,
  },
  julie: {
    wpId: 5007,
    profileHeading: 'Julie Warnecke | CEO',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Julie-Warnecke-FoundSM-au.webp',
    profileImageAlt: '',
    profileTeam: 'Executive Leadership',
    profileFoundStartDate: '2006',
    profileExpertise: 'Measurement Strategy, Operational Excellence, Strategic Growth',
    profileBody: profileBlocks([
      'After getting her start at Google in 2001 as one of the first employees on the AdWords Ad Operations team, Julie helped launch initiatives that shaped the future of paid media and search.',
      'This included AdWords Select, a groundbreaking CPC platform, as well as the industry-changing AOL syndication deal. She was also a key figure in helping open Google’s Paris office in 2002.',
      'In 2006, Julie returned to the Midwest with a mission: build a new kind of agency that serves as a seamless extension of existing client teams. Found was born from that idea—and it continues to fuel the company’s success today.',
      'Julie is known for prioritizing client outcomes, empowering her teams to thrive, and building trust through transparency and measurable results. Under her leadership, Found has grown to more than 50 employees, manages more than $215M in media spend annually, and maintains a 95% client retention rate. She continues to be hands-on with client strategy—deeply focused on building the right teams and custom solutions for every client—so growth feels intentional, not lucky.',
      'As a leader, Julie has helped create a strong company culture. Long before remote work became the norm, she designed policies to support flexibility, mental health, and work/life balance. Her goal is to create space for people to do great work and love doing it. That’s always been her key to building a successful business.',
    ]),
    linkedin: 'https://www.linkedin.com/in/julie-warnecke-9313651/',
    latestPosts: [
      {
        title: 'How Advantage+ Is Reshaping Student Recruitment, Insights from a Meta Education Summit',
        href: '/insights/how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit/',
        imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2025/11/PXL_20251105_210949084-768x579.webp?ver=1773767518',
        imageAlt: '',
        imageWidth: 768,
        imageHeight: 579,
        date: 'November 10, 2025',
      },
    ],
  },
  kelley: {
    wpId: 5196,
    profileHeading: 'kelley swart | VP, Strategy & Growth',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Kelley_author_profile-240x300.webp',
    profileImageAlt: '',
    profileTeam: 'Executive Leadership',
    profileFoundStartDate: '2014',
    profileExpertise: 'Client Alignment, Growth Architecture, Scalable Systems',
    profileBody: profileBlocks([
      'Kelley is the VP of Strategy & Growth at Found, bringing over 25 years of digital marketing experience to the team.',
      'She started her career as a member of the Google Ads team and has since developed data-driven marketing strategies for both small businesses and Fortune 1000 clients, including CareerBuilder, Home Depot, Staples, Orbitz, and American Greetings Interactive.',
      'With expertise in CPG, Retail, Travel, and Higher Education, Kelley provides strategic oversight and builds strong client relationships, ensuring goals are met and expectations are exceeded.',
    ]),
    linkedin: 'https://www.linkedin.com/in/kelleyswart/',
    latestPosts: [
      {
        title: 'Our Top Takeaways From Search Marketing Expo Advanced 2025',
        href: '/insights/our-top-takeaways-from-search-marketing-expo-advanced-2025/',
        imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2025/06/SMX-Conference-2025-1-sm-768x576.webp',
        imageAlt: '',
        imageWidth: 768,
        imageHeight: 576,
        date: 'June 10, 2025',
      },
    ],
  },
  kelsey: {
    wpId: 5194,
    profileHeading: 'kelsey connor | Director, Marketing & Brand Strategy',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Kelsey_author_profile-240x300.webp',
    profileImageAlt: '',
    profileTeam: 'Agency Operations',
    profileFoundStartDate: '2025',
    profileExpertise: 'Content, Brand and Positioning Strategy',
    profileBody: profileBlocks([
      'Kelsey brings nearly 20 years of marketing expertise to the table, currently leading the charge as Director of Agency Marketing and Brand Strategy.',
      'With experience on both the client and agency sides, Kelsey thrives on building bridges between the two—fostering seamless collaboration to drive exceptional results and achieve big-picture goals. While she’s all about the fast-paced agency world, she also has a knack for slowing things down to practice intentional, authentic leadership. She is a brand connoisseur, and a proud Hoosier that loves giving back to her community – whether it’s serving as Leadership Chair on the REV Committee (Indianapolis’ largest event to kickoff the month of May) or flipping houses in Indianapolis with her husband, she stays busy.',
      'After graduating from Syracuse University, Kelsey returned to Indiana in 2009 to kick off her career as an account coordinator at JWT. Since then, she’s earned her MBA from Butler University and honed her skills in advertising, blending business smarts with a passion for impactful leadership.',
      'When she’s not at Found, you’ll probably find Kelsey cheering on her 9-year-old at basketball games, watching her youngest crush it in tae kwon do, or spending quality time with her family.',
      'Her superpower? Being organized while getting sh*t done.',
    ]),
    linkedin: '',
    latestPosts: [
      {
        title: 'Wrapping Up 19 Years With Purpose: Found’s Year-End Tradition of Giving Back',
        href: '/insights/wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back/',
        imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2026/01/img_0446-768x576.jpg',
        imageAlt: '',
        imageWidth: 768,
        imageHeight: 576,
        date: 'January 6, 2026',
      },
    ],
  },
  kylie: {
    wpId: 5563,
    profileHeading: 'Kylie Colquitt | Group Account Director',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Kylie_author_profile.webp',
    profileImageAlt: '',
    profileTeam: 'Client Partnership',
    profileFoundStartDate: '2017',
    profileExpertise: 'Client Services',
    profileBody: profileBlocks([
      'As a Group Account Director, Kylie Colquitt leads with a client-first mindset, orchestrating cross-channel strategies that drive meaningful growth for our partners. With over 15 years of experience in the industry, including seven formative years at top agencies in Chicago like iProspect, Mindshare, and Mediavest, Kylie brings a wealth of knowledge in client services to every engagement. Her approach ensures that complex marketing initiatives are translated into clear, actionable plans that accelerate success.',
      'Kylie’s expertise spans a diverse range of sectors, having supported major brands such as General Motors, General Mills, and Abbott Pharmaceuticals. This breadth of experience allows her to navigate unique industry challenges with confidence. Known for her ability to stay calm under pressure, she fosters a supportive environment that brings a sense of stability to her team, ensuring focused execution even during the most fast-paced campaigns.',
      'Her collaborative leadership style emphasizes deep partnership, aligning our agency’s efforts seamlessly with client goals to maximize impact. When she isn’t driving strategy at Found, Kylie enjoys life with her six-year-old daughter, Remi, and her dog, Miles.',
    ]),
    linkedin: 'https://www.linkedin.com/in/kyliecolquitt/',
    latestPosts: sharedRecentPosts,
  },
  maria: {
    wpId: 5303,
    profileHeading: 'maria escobedo | Associate Data Analyst',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Maria_author_profile-240x300.webp',
    profileImageAlt: '',
    profileTeam: 'Client Partnership',
    profileFoundStartDate: '2022',
    profileExpertise: 'Data Analysis',
    profileBody: profileBlocks([
      'With a strong foundation in mathematics and a Master of Science in Business Analytics from Purdue University, Maria brings analytical rigor, precision, and ownership to every project at Found. As an Associate Data Analyst, she leads our data efforts and specializes in transforming complex performance data into strategic, scalable insights that elevate client results.',
      'Google Search and Display-certified, Maria translates complex datasets into clear, actionable recommendations that align with broader business objectives. With over three years at Found, she effectively bridges technical analysis with overarching business goals to drive meaningful impact.',
      'A dedicated collaborator, Maria enjoys mentoring team members and contributing to knowledge-sharing initiatives. Outside of the data world, Maria can be found teaching indoor spin classes, whipping up delicious meals, or getting lost in a great book.',
      'Her superpower is turning complex data into straightforward, actionable guidance that helps clients and teams succeed.',
    ]),
    linkedin: 'https://www.linkedin.com/in/maria-escobedo-01/',
    latestPosts: sharedRecentPosts,
  },
  matt: {
    wpId: 5565,
    profileHeading: 'matt dragoo | Senior Data Analyst',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Matt_author_profile.webp',
    profileImageAlt: '',
    profileTeam: 'Client Partnership',
    profileFoundStartDate: '2019',
    profileExpertise: 'Reporting, Analysis, Paid Media Management',
    profileBody: profileBlocks([
      'Matt Dragoo has been with Found since 2019, starting his career in paid media right out of Purdue University, where he earned dual majors in Marketing and Management. With expertise in reporting, analysis, and paid media management, Matt uses his skills to craft data-driven strategies that deliver measurable results for clients.',
      'Certified in Google Ads, Google Analytics, Meta Ads, Microsoft Advertising, and Applied Bayesian Modeling, Matt has worked on a wide range of accounts throughout his career, including B2B and Higher Ed Partnerships. If a project has come through Found, there’s a good chance Matt has played a role in it.',
      'Outside of work, Matt enjoys playing video games, experimenting in the kitchen with his wife, or exploring the perks of living in Indianapolis—a city that offers big-city benefits without the big-city headaches. His favorite part of working at Found? The people. “Everyone genuinely wants what’s best for each other and the company. It makes even the hard stuff easier.”',
      'Matt’s superpower? Predicting problems before they even happen—a skill confirmed by his colleagues. He combines analytics with creativity to help clients maximize their ROI and achieve business goals.',
    ]),
    linkedin: 'https://www.linkedin.com/in/matthew-dragoo-a64011107/',
    latestPosts: sharedRecentPosts,
  },
  nicholas: {
    wpId: 5984,
    profileHeading: 'Nicholas Hoium | Head of Data Engineering',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/Nicholas_author_profile.webp',
    profileImageAlt: '',
    profileTeam: 'Innovation',
    profileFoundStartDate: '2010',
    profileExpertise: 'Google Cloud Certified Data Engineer',
    profileBody: profileBlocks([
      'Leading our technical strategy as Head of Data Engineering, Nicholas Hoium brings over 15 years of dedicated experience to the team, architecting the digital foundations that drive our partners’ growth. He specializes in constructing advanced data pipelines and web analytics solutions, transforming raw information into clear, accessible intelligence. His deep understanding of ad platforms ensures that every technical implementation aligns perfectly with broader business objectives.',
      'A Google Cloud Certified Data Engineer with a B.S. in Informatics from IU Bloomington, Nicholas combines technical precision with an innate curiosity for emerging technologies. Having been a cornerstone of the agency since 2010, he has implemented solutions for a diverse range of clients. His ability to quickly master new workflows allows him to deliver custom, forward-thinking solutions that keep clients ahead of the curve.',
      'Nicholas thrives in Found’s supportive environment, valuing the mutual trust and knowledge-sharing that defines the team culture. Outside of his technical leadership, he is an avid traveler and music enthusiast who enjoys watching soccer. When he isn’t exploring new places or sounds, he spends his downtime enjoying movies and indie games.',
    ]),
    linkedin: 'https://www.linkedin.com/in/nicholas-hoium/',
    latestPosts: sharedRecentPosts,
  },
  ryan: {
    wpId: 5198,
    profileHeading: 'Ryan Eme | Head of Data Intelligence',
    profileImage: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Ryan_author_profile-240x300.webp',
    profileImageAlt: '',
    profileTeam: 'Innovation',
    profileFoundStartDate: '2014',
    profileExpertise: 'Audience Intelligence, Data Strategy, Attribution Modeling',
    profileBody: profileBlocks([
      'With nearly 20 years of expertise in data-driven marketing and analytics, Ryan Eme is known for turning complex data into innovative solutions.',
      'As the Head of Data Intelligence, Ryan is focused on leading innovative projects, and helping the agency and clients solve problems, all while maximizing the value of marketing budgets.',
      'A Certified Google Cloud Data Engineer with advanced skills in Google Analytics and tag management, he’s helped clients in industries like higher education, healthcare, and B2B unlock growth and drive business results. Ryan has been part of the Found team for over a decade, and loves being a part of a team that supports, challenges, and inspires one another. His favorite thing about Found is the close-knit group the company has created.',
      'When he’s not transforming data into impact, you’ll find Ryan enjoying concerts, making memories with his wife and three kids, or cheering on his favorite local teams.',
      'Ryan’s superpower? Honestly, there are too many to count and he’s way too humble to name just one. So, we asked our clients – and they simply requested that we figure out a way to clone him.',
    ]),
    linkedin: 'https://www.linkedin.com/in/ryaneme/',
    latestPosts: [
      {
        title: 'ICDPA Isn’t Just Compliance. It’s the Foundation of Smarter Data Strategy.',
        href: '/insights/indiana-consumer-data-protection-act/',
        imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/ICDPA-blog-feature-768x513.webp',
        imageAlt: "Indiana's New Data Privacy Laws",
        imageWidth: 768,
        imageHeight: 513,
        date: 'February 2, 2026',
      },
      {
        title: 'A 3 Minute Implementation Guide to Segmenting AI Traffic in GA4',
        href: '/insights/a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4/',
        imageSrc: 'https://foundsm.com/found2025/wp-content/uploads/2025/12/GA4-Blog-image-768x512.png',
        imageAlt: '',
        imageWidth: 768,
        imageHeight: 512,
        date: 'January 2, 2026',
      },
    ],
  },
};

export const legacyPagePathOptions = legacyPageDefinitions.map((page) => ({
  title: `${page.title} (${page.path})`,
  value: page.path,
}));

export const defaultLegacyPageTemplates = legacyPageDefinitions.map((definition) => ({
  id: definition.id,
  title: definition.title,
  value: buildDefaultLegacyPageData(definition),
}));

export function getLegacyPageDefinitionsByGroup(group: LegacyPageGroup): LegacyPageDefinition[] {
  return legacyPageDefinitions.filter((definition) => definition.group === group);
}

export function getLegacyPageDefinitionByPath(path: string): LegacyPageDefinition | undefined {
  const normalized = normalizeLegacyPath(path);
  return legacyPageDefinitions.find((definition) => definition.path === normalized);
}

export function pathToSingleSlug(path: string): string {
  return normalizeLegacyPath(path).replace(/^\/|\/$/g, '').split('/').pop() || '';
}

export function normalizeLegacyPath(path: string): string {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function mergeLegacyPageData(definition: LegacyPageDefinition, incoming?: Partial<LegacyPageData> | null): LegacyPageData {
  const fallback = buildDefaultLegacyPageData(definition);
  if (!incoming) return fallback;
  const listing = mergeObject(fallback.listing, incoming.listing);

  return {
    ...fallback,
    ...incoming,
    title: incoming.title || fallback.title,
    path: incoming.path || fallback.path,
    seoTitle: incoming.seoTitle || fallback.seoTitle,
    seoDescription: incoming.seoDescription || fallback.seoDescription,
    canonicalUrl: incoming.canonicalUrl || fallback.canonicalUrl,
    robots: incoming.robots || fallback.robots,
    hero: {
      ...fallback.hero,
      ...(incoming.hero || {}),
      heading: incoming.hero?.heading || fallback.hero.heading,
    },
    body: hasBlocks(incoming.body) ? incoming.body as SimplePortableTextBlock[] : fallback.body,
    cards: incoming.cards || fallback.cards,
    listing: listing
      ? {
          ...listing,
          body: hasBlocks(incoming.listing?.body) ? incoming.listing?.body as SimplePortableTextBlock[] : fallback.listing?.body,
        }
      : undefined,
    cta: mergeObject(fallback.cta, incoming.cta),
    form: mergeObject(fallback.form, incoming.form),
  };
}

export function mergeLegacyAuthors(incoming: LegacyAuthorData[] = []): LegacyAuthorData[] {
  const bySlug = new Map<string, LegacyAuthorData>();

  for (const author of incoming) {
    if (!author.slug) continue;
    bySlug.set(author.slug, author);
  }

  const knownAuthors = legacyAuthorDefinitions.map((definition) => mergeLegacyAuthor(definition, bySlug.get(definition.slug)));

  const knownSlugs = new Set(legacyAuthorDefinitions.map((definition) => definition.slug));
  const extraAuthors = incoming.filter((author) => author.slug && !knownSlugs.has(author.slug));

  return [...knownAuthors, ...extraAuthors.sort((a, b) => a.name.localeCompare(b.name))];
}

export function slugifyAuthorName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildDefaultLegacyPageData(definition: LegacyPageDefinition): LegacyPageData {
  if (definition.id === 'legacy-dataconnect') {
    const summary = "We're ready to learn more about your business goals and talk about all the ways we can work together to find solutions that drive impact and lead to profitable revenue. Whether it's smarter paid media strategy, creative that converts, or finding clarity in your data, we're ready to sit on the same side of the table and get to work.";

    return {
      title: definition.title,
      path: definition.path,
      seoTitle: 'Data Connect - Found Search Marketing',
      seoDescription: summary,
      canonicalUrl: 'https://foundsm.com/dataconnect/',
      robots: 'index, follow',
      hero: {
        eyebrow: 'Ready to stop guessing and start scaling?',
        heading: 'Activating First-Party Data for Revenue.',
        subheading: "Let's talk about bringing your first-party data directly to the ad platforms where growth happens.",
      },
      body: [block(summary)],
      form: {
        hubspotFormId: '77ee07f7-2567-46d2-9255-ff9e410fdf6a',
      },
    };
  }

  if (definition.id === 'legacy-insights-filter-results') {
    const heroBody = 'Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.';
    const directoryHeading = 'Find inspiration and insights from the experts at Found.';

    return {
      title: definition.title,
      path: definition.path,
      seoTitle: 'Insights | Found Search Marketing | Enterprise Paid Media Agency',
      seoDescription: heroBody,
      canonicalUrl: 'https://foundsm.com/insights-filter-results/',
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      hero: {
        eyebrow: 'Insights',
        heading: 'Where Bold Ideas Are Found.',
        subheading: heroBody,
        image: '/images/migrated/insights-bulb-1.webp',
        imageAlt: '',
      },
      body: [block(directoryHeading)],
      listing: {
        latestHeading: 'LATEST POSTS',
        heading: directoryHeading,
        filterLabel: 'Blog',
      },
      cards: Array.from({ length: 5 }, () => ({
        title: 'Insight result',
        body: [block('Where Bold Ideas Are Found. Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.')],
        cta: { href: '/insights-filter-results/' },
      })),
    };
  }

  if (definition.id === 'legacy-insights-authors') {
    const heroBody = 'Meet Found Search Marketing: an agency where decades of expertise meet agile execution. With leadership grounded in foundational roles at Google and a team energized by complex problem-solving, we break down silos to offer fully integrated strategies.';
    const introBody = 'Dive into the articles below to see how our hands-on, results-obsessed experts apply this deep technical knowledge to transform business challenges into breakthroughs.';

    return {
      title: definition.title,
      path: definition.path,
      seoTitle: 'Authors | Found Search Marketing',
      seoDescription: definition.description,
      canonicalUrl: 'https://foundsm.com/insights/authors/',
      robots: 'index, follow',
      hero: {
        eyebrow: 'Authors',
        heading: 'From Google Roots\nto Agile Results',
        subheading: heroBody,
        image: '/images/pages/team/adam-persinger.webp',
        imageAlt: 'Found Search Marketing team member',
      },
      body: [block(introBody)],
      listing: {
        latestHeading: 'LATEST POSTS',
        heading: 'Blog Contributors',
        body: [block(introBody)],
      },
    };
  }

  const canonicalPath = definition.path === '/' ? '' : definition.path.replace(/\/$/, '');

  return {
    title: definition.title,
    path: definition.path,
    seoTitle: `${definition.title} | Found Search Marketing`,
    seoDescription: definition.description,
    canonicalUrl: `https://www.foundsm.com${canonicalPath}`,
    robots: 'index, follow',
    hero: {
      eyebrow: eyebrowForGroup(definition.group),
      heading: definition.title,
      subheading: definition.description,
    },
    body: [block(definition.description)],
    cta: {
      heading: 'Ready to improve your marketing performance?',
      body: [block('Found helps teams connect data, media, and creative decisions to measurable business outcomes.')],
      label: 'Start the Conversation',
      href: '/contact-us',
    },
  };
}

function eyebrowForGroup(group: LegacyPageGroup): string {
  if (group === 'insights') return 'Insights';
  if (group === 'authorIndex') return 'Insights';
  if (group === 'whitepapers') return 'Resources';
  return 'Found Search Marketing';
}

function hasBlocks(blocks: unknown): blocks is SimplePortableTextBlock[] {
  return Array.isArray(blocks) && blocks.some((item) => item?._type === 'block');
}

function hasLatestPosts(posts: unknown): posts is LegacyAuthorLatestPost[] {
  return Array.isArray(posts) && posts.some((post) => Boolean(post?.title && post?.href));
}

function mergeObject<T extends object>(fallback: T | undefined, incoming: T | undefined): T | undefined {
  if (!fallback && !incoming) return undefined;
  return { ...(fallback || {}), ...(incoming || {}) } as T;
}

function mergeLegacyAuthor(definition: LegacyAuthorDefinition, incoming?: LegacyAuthorData): LegacyAuthorData {
  const profile = legacyAuthorProfileDetails[definition.slug];

  return {
    _id: incoming?._id,
    slug: incoming?.slug || definition.slug,
    name: incoming?.name || definition.name || definition.slug,
    title: incoming?.title || definition.title,
    team: incoming?.team || definition.team,
    foundStartDate: incoming?.foundStartDate || definition.foundStartDate,
    expertise: incoming?.expertise || definition.expertise,
    bio: incoming?.bio || definition.bio,
    linkedin: incoming?.linkedin ?? (profile && 'linkedin' in profile ? profile.linkedin : undefined),
    image: incoming?.image || definition.image,
    wpId: incoming?.wpId ?? profile?.wpId,
    profileHeading: incoming?.profileHeading || profile?.profileHeading,
    profileImage: incoming?.profileImage || profile?.profileImage,
    profileImageAlt: incoming?.profileImageAlt ?? profile?.profileImageAlt,
    profileTeam: incoming?.profileTeam || profile?.profileTeam,
    profileFoundStartDate: incoming?.profileFoundStartDate || profile?.profileFoundStartDate,
    profileExpertise: incoming?.profileExpertise || profile?.profileExpertise,
    profileBody: hasBlocks(incoming?.profileBody) ? incoming.profileBody : profile?.profileBody,
    latestPosts: hasLatestPosts(incoming?.latestPosts) ? incoming.latestPosts : profile?.latestPosts,
  };
}
