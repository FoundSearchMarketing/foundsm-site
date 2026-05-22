const legacyAssetMap = new Map<string, string>([
  ['/found2025/wp-content/themes/found2025/assets/images/search.svg', '/images/imported/home/3f96aea6-search.svg'],
  ['/found2025/wp-content/uploads/2025/08/header-logo.svg', '/images/logo.svg'],
  ['/found2025/wp-content/uploads/2025/09/contour-2.png', '/images/pages/data-activation/contour-2.png'],
  ['/found2025/wp-content/uploads/2025/09/topography-light.svg', '/images/pages/paid-media/topography-light.svg'],
  ['/found2025/wp-content/uploads/2025/11/contour-2.png', '/images/pages/data-activation/contour-2.png'],
  ['/found2025/wp-content/uploads/2025/11/insights_bulb-1.webp', '/images/migrated/insights-bulb-1.webp'],
  ['/found2025/wp-content/uploads/2026/01/closing-the-loop-main-768x768.webp', '/images/pages/insights/closing-the-loop-main-768x768.webp'],
  ['/found2025/wp-content/uploads/2026/01/img_0446-768x576.jpg', '/images/pages/insights/img_0446-768x576.jpg'],
  ['/found2025/wp-content/uploads/2026/02/ICDPA-blog-feature-768x513.webp', '/images/pages/insights/ICDPA-blog-feature-768x513.webp'],
  ['/found2025/wp-content/uploads/2026/02/Untitled-1200-x-801-px-1024x684.webp', '/images/pages/insights/Untitled-1200-x-801-px-1024x684.webp'],
  ['/found2025/wp-content/uploads/2026/02/Untitled-1200-x-801-px-768x513.webp', '/images/pages/insights/Untitled-1200-x-801-px-768x513.webp'],
  ['/found2025/wp-content/uploads/2026/02/dataengine-768x432.webp', '/images/pages/insights/dataengine-768x432.webp'],
  ['/found2025/wp-content/uploads/2026/03/GA-API-update-hero-1024x684.webp', '/images/pages/insights/GA-API-update-hero-1024x684.webp'],
  ['/found2025/wp-content/uploads/2026/03/GA-API-update-hero-768x513.webp', '/images/pages/insights/GA-API-update-hero-768x513.webp'],
  ['/found2025/wp-content/uploads/2026/03/bot-traffic-sm-768x513.webp', '/images/pages/insights/bot-traffic-sm-768x513.webp'],
  ['/found2025/wp-content/uploads/2026/03/bot-traffic-sm-850x500.webp', '/images/pages/insights/bot-traffic-sm-850x500.webp'],
  ['/found2025/wp-content/uploads/2026/03/capi-eye.webp', '/images/pages/capabilities/capi-eye.webp'],
  ['/found2025/wp-content/uploads/2025/11/Balance-of-Humans-and-Automation_Nov-2025.pdf', '/whitepapers/balance-of-humans-and-automation-nov-2025.pdf'],
  ['/found2025/wp-content/uploads/2026/01/Foundsm_Data_Activation_whitepaper_2026.pdf', '/whitepapers/data-activation-whitepaper-2026.pdf'],
  ['/found2025/wp-content/uploads/2026/01/foundsm_data_activation_whitepaper_2026.pdf', '/whitepapers/data-activation-whitepaper-2026.pdf'],
]);

const legacyAssetPrefix = '/found2025/wp-content/';
const foundHosts = new Set(['foundsm.com', 'www.foundsm.com']);

export function normalizeLegacyAssetUrl(value: string | undefined): string {
  if (!value) return '';

  try {
    const url = new URL(value, 'https://foundsm.com');
    if (!foundHosts.has(url.hostname)) return value;

    const mapped = legacyAssetMap.get(url.pathname);
    if (mapped) return mapped;

    if (url.pathname.startsWith(legacyAssetPrefix) && hasAssetExtension(url.pathname)) {
      return `/images/legacy/${url.pathname.slice(legacyAssetPrefix.length)}`;
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

function hasAssetExtension(pathname: string): boolean {
  return /\.(avif|webp|png|jpe?g|gif|svg|pdf|mp4|webm|mov|m4v|woff2?|ttf|otf)$/i.test(pathname);
}
