const legacyAssetPathMap = new Map<string, string>([
  ['/found2025/wp-content/themes/found2025/assets/images/search.svg', '/images/imported/home/3f96aea6-search.svg'],
  ['/found2025/wp-content/uploads/2025/08/header-logo.svg', '/images/logo.svg'],
  ['/found2025/wp-content/uploads/2025/09/contour-2.png', '/images/pages/data-activation/contour-2.png'],
  ['/found2025/wp-content/uploads/2025/09/icon-difference-1.svg', '/images/pages/our-approach/icon-difference-1.svg'],
  ['/found2025/wp-content/uploads/2025/09/topography-light.svg', '/images/pages/paid-media/topography-light.svg'],
  ['/found2025/wp-content/uploads/2025/11/contour-2.png', '/images/pages/data-activation/contour-2.png'],
  ['/found2025/wp-content/uploads/2025/11/insights_bulb-1.webp', '/images/migrated/insights-bulb-1.webp'],
  ['/found2025/wp-content/uploads/2025/11/Balance-of-Humans-and-Automation_Nov-2025.pdf', '/whitepapers/balance-of-humans-and-automation-nov-2025.pdf'],
  ['/found2025/wp-content/uploads/2026/01/Foundsm_Data_Activation_whitepaper_2026.pdf', '/whitepapers/data-activation-whitepaper-2026.pdf'],
  ['/found2025/wp-content/uploads/2026/01/foundsm_data_activation_whitepaper_2026.pdf', '/whitepapers/data-activation-whitepaper-2026.pdf'],
]);

const legacyAssetFilenameMap = new Map<string, string>([
  ['Adam_author_profile.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/3fc7b72c007f76df88872814b420a21ba78fcb2e-530x670.webp'],
  ['Caroline_author_profile-240x300.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/c4d30657f5a2639dcc9d352ad9b4c6ad651552c9-240x300.webp'],
  ['Caroline_author_profile.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/c4d30657f5a2639dcc9d352ad9b4c6ad651552c9-240x300.webp'],
  ['Emily-FoundSM.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/46b80a90953e3f490b1997007f818a7d85a5b62e-400x500.webp'],
  ['GA-API-update-hero-768x513.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/489f02fadd43cd41da6534fb95a903c8c9771551-768x513.webp'],
  ['GA-API-update-hero-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/88537a46fd1bb82f51d423f6c86417de6cbdca7c-850x500.webp'],
  ['GA-API-update-hero.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/26b3ea744b030e74e1711fde7dc04aae5e009615-1200x801.webp'],
  ['GA4-Blog-image-768x512.png', 'https://cdn.sanity.io/images/vzneqxsx/staging/7fdd4669083b5e1a41bfe7dd1130215757e95605-768x512.png'],
  ['GA4-Blog-image-850x500.png', 'https://cdn.sanity.io/images/vzneqxsx/staging/05af0c61d95514fe32760857cdd926b69ac9d6a6-850x500.png'],
  ['GA4-Blog-image.png', 'https://cdn.sanity.io/images/vzneqxsx/staging/03c764fc4a7c6a1cf434c9faa010df69e66da059-1200x800.png'],
  ['ICDPA-blog-feature-768x513.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/8e04c0e71b2cf9c8dfe60d19794f9611250b24f0-768x513.webp'],
  ['ICDPA-blog-feature-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/7be03beb44465e71b0874acecd69d8064d06b69a-850x500.webp'],
  ['ICDPA-blog-feature.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/3281159023f5e5c3b3ec773cb7416043a837f8aa-1200x801.webp'],
  ['Julie-Warnecke-FoundSM-au.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/a1519d479d9417ad16179e20c1bbf04445f167cf-400x500.webp'],
  ['Julie_W_1800-1.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/765df875e6b68021831fbdc4d7e0f01a7290697c-450x399.webp'],
  ['Kelley_author_profile-240x300.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/87552239dd1bd1cc78ecbb75c41a6401f76f5ff6-240x300.webp'],
  ['Kelley_author_profile.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/87552239dd1bd1cc78ecbb75c41a6401f76f5ff6-240x300.webp'],
  ['Kelsey_author_profile-240x300.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/827cccefbf08b751afb47b1c1068ee2287db6365-240x300.webp'],
  ['Kelsey_author_profile.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/827cccefbf08b751afb47b1c1068ee2287db6365-240x300.webp'],
  ['Kylie_author_profile.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/2ee13ddcd8fc174c9093ad4136906128a4283807-400x500.webp'],
  ['Maria_author_profile-240x300.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/9f1553bd6fbfc64b655a22fbcaa9bc36b172c947-240x300.webp'],
  ['Maria_author_profile.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/9f1553bd6fbfc64b655a22fbcaa9bc36b172c947-240x300.webp'],
  ['Matt_author_profile.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/a90290da584aaf0910917ea0a0c215b4e2dd1fad-400x500.webp'],
  ['Nicholas-FoundSM.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/f4b14d2e2f4bfcc60d01de91f9c2309f515f788a-400x500.webp'],
  ['Nicholas_author_profile.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/f4b14d2e2f4bfcc60d01de91f9c2309f515f788a-400x500.webp'],
  ['PXL_20251105_210949084-768x579.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/177f3c482a1f4100a87beb10e120310fcd196f46-768x579.webp'],
  ['PXL_20251105_210949084-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/91a2d0befb86dce5c3b3b05e6827c38c4a5468ac-850x500.webp'],
  ['PXL_20251105_210949084.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/733e2fa4bc921596e2c0ddd7effff80f5f686f7b-1200x904.webp'],
  ['Ryan-Eme-FoundSM-copy.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/0a1eedbfe3db7219bab04bbaa2710376e1c1e78e-240x300.webp'],
  ['Ryan_author_profile-240x300.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/0a1eedbfe3db7219bab04bbaa2710376e1c1e78e-240x300.webp'],
  ['SMX-Conference-2025-1-sm-768x576.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/a4dfa8187f5b861de098b3818c6546d8a0d509d6-768x576.webp'],
  ['SMX-Conference-2025-1-sm.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/9514aca93f01c177274e4d73e4af80d1d987db1e-800x600.webp'],
  ['Untitled-1200-x-801-px-768x513.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/9866f8b8d6d2f991dee6887cac736f1acd52be81-768x513.webp'],
  ['Untitled-1200-x-801-px-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/50b343c3f470c0cd5a9fe95efa9d9d27a21f5d21-850x500.webp'],
  ['Untitled-1200-x-801-px.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/f4f6bc7893084d2114e9ea9d566c319e23be8fa8-1200x801.webp'],
  ['blog_insights_header_images.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/9ffc1997ad674ba73858903f10ed04da968cf47d-434x609.webp'],
  ['bot-traffic-sm-768x513.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/eeee7c5ae38c6c2a75e42ee9491dc2821ec3ee08-768x513.webp'],
  ['bot-traffic-sm-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/e4fc6f2857e413e0a6814e6fc0574aa3714d2fe6-850x500.webp'],
  ['bot-traffic-sm.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/d3bdda4a2aebe1dc077468033dbd05a92fffe07f-1200x801.webp'],
  ['capi-cactus.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/becff8d4fd8b879762fd273a8be9664fba3c7e18-1024x983.webp'],
  ['capi-eye.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/9c74539d1922a680db6710c2c0044fc3cd72a345-800x800.webp'],
  ['closing-the-loop-main-768x768.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/f59565f3b5ed502a7896cd8de8f7453636fa9bd2-768x768.webp'],
  ['closing-the-loop-main-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/e510195611d497f63d7c92987c2cfb992a8a96a6-850x500.webp'],
  ['closing-the-loop-main.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/0ff2ec68336f2b09ffe35895c42fa7ebb53017ca-1000x1000.webp'],
  ['coffee-blend.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/3ff71acad858a826b2e660a5607c1ba6aec4e117-800x800.webp'],
  ['cookie-chat-sm.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/ce69c98ff02db32664aef206939cf941602256ab-1200x801.webp'],
  ['dataengine-768x432.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/879bf1128e60662728ef505b004dcb1c6ecf7560-768x432.webp'],
  ['dataengine-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/ef329151c663f12c17e5455c634627ce3c71cb35-850x500.webp'],
  ['dataengine.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/e5c404d7af091ee59d99c3e2e577ce1b2fc5591c-1200x675.webp'],
  ['first-party-whitepaper-feature-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/f8b72279cf7ea37f21d3f088e72e7a009a4cb3cf-1200x801.webp'],
  ['first-party-whitepaper-feature.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/f8b72279cf7ea37f21d3f088e72e7a009a4cb3cf-1200x801.webp'],
  ['hero-about-1.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/70a7d7d7765b7837f9a0d644588115aa50768eb5-682x660.webp'],
  ['img_0446-768x576.jpg', 'https://cdn.sanity.io/images/vzneqxsx/staging/836ab3446fa4e2bbb905b0fbeb03939ebd4be596-768x576.jpg'],
  ['img_0446-850x500.jpg', 'https://cdn.sanity.io/images/vzneqxsx/staging/8036e0e6224537f6cacbc9b86d29e75030443c87-850x500.jpg'],
  ['img_0446.jpg', 'https://cdn.sanity.io/images/vzneqxsx/staging/c107bbd08a25f82acec0c712e4eccfed95a1af02-1200x900.jpg'],
  ['infotrust-webinar-formheader-4-1024x640.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/7ec00c4db04479fc4a506bc257404623607d6a40-1024x640.webp'],
  ['infotrust-webinar-formheader-4.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/ebd6a83dfeee5031f4abd5f3b96a67c037f9d478-1200x750.webp'],
  ['infotrust-webinar-formheader-postevent-1-1024x576.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/3f8c2aa9cad0963a32bb8903d4378d9368ca7c01-1024x576.webp'],
  ['infotrust-webinar-formheader-postevent-1-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/225f59b9b74bf3c0f5abecf14c6b426916f34f9f-1200x675.webp'],
  ['infotrust-webinar-formheader-postevent-1.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/225f59b9b74bf3c0f5abecf14c6b426916f34f9f-1200x675.webp'],
  ['infotrust-webinar-header.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/ebd6a83dfeee5031f4abd5f3b96a67c037f9d478-1200x750.webp'],
  ['manvsmachine-smx-feature-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/eb4241209b7c174d18844819e51d167abb42d0b3-1200x801.webp'],
  ['manvsmachine-smx-feature.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/eb4241209b7c174d18844819e51d167abb42d0b3-1200x801.webp'],
  ['play_insights_header_images.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/504c5568fec785e399d557d8e3b6cf9827c08b6b-434x609.webp'],
  ['signal-quiz-feature-850x500.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/20caddc5841651231396214c09258cd064acd0a7-850x500.webp'],
  ['signal-quiz-feature.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/20caddc5841651231396214c09258cd064acd0a7-850x500.webp'],
  ['tools_insights_header_images.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/64b27db4a4710bf3e063c5516319666c349ba2fc-434x609.webp'],
  ['tr-sketch.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/f8699d79e15572e05a18c4a769b65e33b4608e22-800x800.webp'],
  ['whitepapers_insights_header_images.webp', 'https://cdn.sanity.io/images/vzneqxsx/staging/060b660264968c72e60c8671f9de67b6836ff6b7-434x609.webp'],
]);

const legacyAssetPrefix = '/found2025/wp-content/';
const legacyUploadPrefix = `${legacyAssetPrefix}uploads/`;
const foundHosts = new Set(['foundsm.com', 'www.foundsm.com']);

export function legacyUploadAsset(path: string): string {
  return normalizeLegacyAssetUrl(`${legacyUploadPrefix}${path.replace(/^\/+/, '')}`);
}

export function normalizeLegacyAssetUrl(value: string | undefined): string {
  if (!value) return '';

  try {
    const url = new URL(value, 'https://foundsm.com');
    if (!foundHosts.has(url.hostname)) return value;

    const mapped = legacyAssetPathMap.get(url.pathname);
    if (mapped) return mapped;

    if (url.pathname.startsWith(legacyAssetPrefix)) {
      const filename = decodeURIComponent(url.pathname.split('/').pop() || '');
      const filenameMapped = legacyAssetFilenameMap.get(filename);
      if (filenameMapped) return filenameMapped;
    }

    return value;
  } catch {
    return value;
  }
}

export function normalizeLegacyAssetSrcset(value: string | undefined): string | undefined {
  if (!value) return undefined;

  return value
    .split(',')
    .map((candidate) => {
      const parts = candidate.trim().split(/\s+/);
      const [url, ...descriptor] = parts;
      if (!url) return candidate.trim();
      return [normalizeLegacyAssetUrl(url), ...descriptor].join(' ');
    })
    .join(', ');
}
