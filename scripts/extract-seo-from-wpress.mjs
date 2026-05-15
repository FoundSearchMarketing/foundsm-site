#!/usr/bin/env node
import { gunzipSync } from 'node:zlib';
import { existsSync, openSync, readSync, closeSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HEADER_SIZE = 4377;
const NAME_SIZE = 255;
const SIZE_OFFSET = 255;
const SIZE_SIZE = 14;
const PATH_OFFSET = 281;
const SITE_URL = 'https://foundsm.com';
const SITE_NAME = 'Found Search Marketing';
const DB_ENTRY = 'updraft/backup_2026-03-30-1931_Found_Search_Marketing_e971b95c05cc-db.gz';
const DEFAULT_WPRESS = '/Users/theoden/Documents/test/foundsm.wpress';
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const VERCEL_REDIRECT_LIMIT = 2048;

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const archivePath = resolve(args._[0] || DEFAULT_WPRESS);
const dbEntryName = args.dbEntry || DB_ENTRY;
const manifestPath = resolve(repoRoot, args.manifest || 'src/lib/seoManifest.generated.json');
const reportPath = resolve(repoRoot, args.report || 'seo-migration-diff-report.md');
const vercelPath = resolve(repoRoot, args.vercel || 'vercel.json');

if (!existsSync(archivePath)) {
  throw new Error(`Archive not found: ${archivePath}`);
}

const archiveEntries = listEntries(archivePath);
const dbEntry = archiveEntries.find((entry) => entry.name === dbEntryName);
if (!dbEntry) {
  throw new Error(`Database entry not found in archive: ${dbEntryName}`);
}

const dbSql = gunzipSync(readEntry(archivePath, dbEntry)).toString('utf8');
const parsed = parseDatabase(dbSql);
const cacheHtmlEntries = selectCacheHtmlEntries(archiveEntries);
const cacheSeo = extractCacheSeo(archivePath, cacheHtmlEntries);
const buildResult = buildManifest(parsed, cacheSeo, archivePath, dbEntryName);
const vercelRedirects = mergeVercelRedirects(vercelPath, buildResult.redirects);

if (vercelRedirects.length > VERCEL_REDIRECT_LIMIT) {
  throw new Error(`Generated ${vercelRedirects.length} Vercel redirects, above the ${VERCEL_REDIRECT_LIMIT} static redirect limit.`);
}

writeJson(manifestPath, buildResult.manifest);
writeReport(reportPath, buildResult, cacheSeo, parsed);

if (args.updateVercel !== false) {
  const vercelConfig = JSON.parse(readFileSync(vercelPath, 'utf8'));
  vercelConfig.trailingSlash = true;
  vercelConfig.redirects = vercelRedirects;
  writeJson(vercelPath, vercelConfig);
}

console.log(`SEO manifest routes: ${Object.keys(buildResult.manifest.routes).length}`);
console.log(`Yoast redirects merged into vercel.json: ${vercelRedirects.length}`);
console.log(`Cache HTML entries checked: ${cacheHtmlEntries.length}`);
console.log(`Wrote ${manifestPath}`);
console.log(`Wrote ${reportPath}`);

function parseArgs(argv) {
  const out = { _: [], updateVercel: true };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--no-vercel') {
      out.updateVercel = false;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2).replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      const next = argv[index + 1];
      if (!next || next.startsWith('--')) {
        out[key] = true;
      } else {
        out[key] = next;
        index += 1;
      }
    } else {
      out._.push(arg);
    }
  }
  return out;
}

function listEntries(archive) {
  const fd = openSync(archive, 'r');
  const header = Buffer.alloc(HEADER_SIZE);
  const entries = [];
  let offset = 0;

  try {
    while (true) {
      const bytesRead = readSync(fd, header, 0, HEADER_SIZE, offset);
      if (bytesRead === 0) break;
      if (bytesRead !== HEADER_SIZE) throw new Error(`Truncated .wpress header near byte ${offset}`);

      const fileName = decodeHeader(header.subarray(0, NAME_SIZE));
      const directory = decodeHeader(header.subarray(PATH_OFFSET)).replace(/^\/+|\/+$/g, '');
      const sizeText = decodeHeader(header.subarray(SIZE_OFFSET, SIZE_OFFSET + SIZE_SIZE)).trim();
      if (!fileName) break;
      if (!/^\d+$/.test(sizeText)) throw new Error(`Invalid size for archive entry: ${fileName}`);

      const name = directory && directory !== '.' ? `${directory}/${fileName}` : fileName;
      const size = Number(sizeText);
      const dataOffset = offset + HEADER_SIZE;
      entries.push({ name, size, dataOffset });
      offset = dataOffset + size;
    }
  } finally {
    closeSync(fd);
  }

  return entries;
}

function decodeHeader(buffer) {
  return buffer.subarray(0, buffer.indexOf(0) === -1 ? buffer.length : buffer.indexOf(0)).toString('utf8');
}

function readEntry(archive, entry) {
  const fd = openSync(archive, 'r');
  const buffer = Buffer.alloc(entry.size);
  try {
    readSync(fd, buffer, 0, entry.size, entry.dataOffset);
  } finally {
    closeSync(fd);
  }
  return buffer;
}

function parseDatabase(sql) {
  const postColumns = [
    'ID',
    'post_author',
    'post_date',
    'post_date_gmt',
    'post_content',
    'post_title',
    'post_excerpt',
    'post_status',
    'comment_status',
    'ping_status',
    'post_password',
    'post_name',
    'to_ping',
    'pinged',
    'post_modified',
    'post_modified_gmt',
    'post_content_filtered',
    'post_parent',
    'guid',
    'menu_order',
    'post_type',
    'post_mime_type',
    'comment_count',
  ];
  const indexableColumns = parseCreateColumns(sql, 'wp_yoast_indexable');
  const optionRows = parseInsertRows(sql, 'wp_options');
  const postRows = parseInsertRows(sql, 'wp_posts').map((row) => rowToObject(row, postColumns));
  const postMetaRows = parseInsertRows(sql, 'wp_postmeta');
  const indexableRows = parseInsertRows(sql, 'wp_yoast_indexable').map((row) => rowToObject(row, indexableColumns));
  const terms = parseInsertRows(sql, 'wp_terms');
  const termTaxonomy = parseInsertRows(sql, 'wp_term_taxonomy');
  const termRelationships = parseInsertRows(sql, 'wp_term_relationships');
  const options = new Map(optionRows.map((row) => [String(row[1]), row[2] == null ? '' : String(row[2])]));
  const posts = new Map(postRows.map((post) => [Number(post.ID), post]));
  const postmeta = new Map();

  for (const row of postMetaRows) {
    const postId = Number(row[1]);
    const key = String(row[2]);
    const value = row[3] == null ? '' : String(row[3]);
    const meta = postmeta.get(postId) || {};
    meta[key] = value;
    postmeta.set(postId, meta);
  }

  return {
    options,
    posts,
    postmeta,
    indexables: indexableRows,
    termCounts: {
      terms: terms.length,
      termTaxonomy: termTaxonomy.length,
      termRelationships: termRelationships.length,
    },
  };
}

function parseCreateColumns(sql, table) {
  const needle = `CREATE TABLE \`${table}\``;
  const start = sql.indexOf(needle);
  if (start === -1) return [];
  const end = findSqlStatementEnd(sql, start);
  const statement = sql.slice(start, end);
  return statement
    .split('\n')
    .map((line) => line.match(/^\s*`([^`]+)`/)?.[1])
    .filter(Boolean);
}

function parseInsertRows(sql, table) {
  const prefix = `INSERT INTO \`${table}\` VALUES`;
  const rows = [];
  let searchFrom = 0;

  while (true) {
    const start = sql.indexOf(prefix, searchFrom);
    if (start === -1) break;
    const valuesStart = start + prefix.length;
    const statementEnd = findSqlStatementEnd(sql, valuesStart);
    rows.push(...parseSqlValueRows(sql.slice(valuesStart, statementEnd)));
    searchFrom = statementEnd + 1;
  }

  return rows;
}

function findSqlStatementEnd(sql, start) {
  let inString = false;
  for (let index = start; index < sql.length; index += 1) {
    const char = sql[index];
    if (inString) {
      if (char === '\\') {
        index += 1;
      } else if (char === "'" && sql[index + 1] === "'") {
        index += 1;
      } else if (char === "'") {
        inString = false;
      }
      continue;
    }
    if (char === "'") inString = true;
    if (char === ';') return index;
  }
  return sql.length;
}

function parseSqlValueRows(valueText) {
  const rows = [];
  let index = 0;
  while (index < valueText.length) {
    if (valueText[index] !== '(') {
      index += 1;
      continue;
    }
    const parsed = parseSqlRow(valueText, index + 1);
    rows.push(parsed.values);
    index = parsed.next;
  }
  return rows;
}

function parseSqlRow(text, start) {
  const values = [];
  let index = start;

  while (index < text.length) {
    while (/\s/.test(text[index] || '')) index += 1;
    if (text[index] === "'") {
      const parsed = parseSqlString(text, index + 1);
      values.push(parsed.value);
      index = parsed.next;
    } else {
      const valueStart = index;
      while (index < text.length && text[index] !== ',' && text[index] !== ')') index += 1;
      const raw = text.slice(valueStart, index).trim();
      values.push(parseSqlScalar(raw));
    }

    while (/\s/.test(text[index] || '')) index += 1;
    if (text[index] === ',') {
      index += 1;
      continue;
    }
    if (text[index] === ')') {
      return { values, next: index + 1 };
    }
  }

  return { values, next: index };
}

function parseSqlString(text, start) {
  let value = '';
  let index = start;
  while (index < text.length) {
    const char = text[index];
    if (char === '\\') {
      value += unescapeSql(text[index + 1] || '');
      index += 2;
      continue;
    }
    if (char === "'" && text[index + 1] === "'") {
      value += "'";
      index += 2;
      continue;
    }
    if (char === "'") {
      return { value, next: index + 1 };
    }
    value += char;
    index += 1;
  }
  return { value, next: index };
}

function parseSqlScalar(raw) {
  if (!raw || /^null$/i.test(raw)) return null;
  if (/^-?\d+$/.test(raw)) return Number(raw);
  if (/^-?\d+\.\d+$/.test(raw)) return Number(raw);
  return raw;
}

function unescapeSql(char) {
  switch (char) {
    case 'n':
      return '\n';
    case 'r':
      return '\r';
    case 't':
      return '\t';
    case '0':
      return '\0';
    default:
      return char;
  }
}

function rowToObject(row, columns) {
  return Object.fromEntries(columns.map((column, index) => [column, row[index]]));
}

function selectCacheHtmlEntries(entries) {
  const bestByPath = new Map();
  for (const entry of entries) {
    if (!entry.name.startsWith('cache/wp-rocket/foundsm.com/')) continue;
    if (!entry.name.endsWith('.html') && !entry.name.endsWith('.htm')) continue;
    const path = routeFromCacheName(entry.name);
    if (!path) continue;
    const existing = bestByPath.get(path);
    const isDesktop = entry.name.endsWith('/index-https.html') || entry.name.endsWith('foundsm.com/index-https.html');
    if (!existing || isDesktop) bestByPath.set(path, entry);
  }
  return [...bestByPath.values()];
}

function routeFromCacheName(name) {
  let route = name.replace(/^cache\/wp-rocket\/foundsm\.com\/?/, '');
  route = route.replace(/index(?:-mobile)?-https?\.html$/, '');
  return normalizePath(`/${route}`);
}

function extractCacheSeo(archivePath, entries) {
  const byPath = new Map();
  for (const entry of entries) {
    const path = routeFromCacheName(entry.name);
    const html = readEntry(archivePath, entry).toString('utf8');
    byPath.set(path, {
      ...parseHeadSeo(html),
      path,
      source: entry.name,
    });
  }
  return byPath;
}

function parseHeadSeo(html) {
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || html.slice(0, 20000);
  const meta = {};
  const metaRegex = /<meta\s+([^>]+)>/gi;
  let match;
  while ((match = metaRegex.exec(head))) {
    const attrs = attrsToObject(match[1]);
    const key = attrs.property || attrs.name;
    if (key && attrs.content != null) meta[key.toLowerCase()] = decodeHtml(attrs.content);
  }

  const title = decodeHtml(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '');
  const canonical = decodeHtml(head.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i)?.[0]?.match(/\shref=["']([^"']+)["']/i)?.[1] || '');
  const schemaRaw = head.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1]?.trim();
  let schema;
  if (schemaRaw) {
    try {
      schema = JSON.parse(decodeHtml(schemaRaw));
    } catch {
      schema = undefined;
    }
  }

  return cleanObject({
    title,
    description: meta.description,
    canonical,
    robots: meta.robots,
    ogTitle: meta['og:title'],
    ogDescription: meta['og:description'],
    ogType: meta['og:type'],
    ogImage: meta['og:image'] ? { url: meta['og:image'], width: numberOrUndefined(meta['og:image:width']), height: numberOrUndefined(meta['og:image:height']) } : undefined,
    twitterCard: meta['twitter:card'],
    twitterSite: meta['twitter:site'],
    twitterTitle: meta['twitter:title'],
    twitterDescription: meta['twitter:description'],
    twitterImage: meta['twitter:image'],
    modifiedAt: meta['article:modified_time'],
    publishedAt: meta['article:published_time'],
    schema,
  });
}

function attrsToObject(attrsText) {
  const attrs = {};
  const attrRegex = /([:@\w-]+)\s*=\s*(["'])(.*?)\2/g;
  let match;
  while ((match = attrRegex.exec(attrsText))) attrs[match[1].toLowerCase()] = match[3];
  return attrs;
}

function buildManifest(parsed, cacheSeo, archivePath, dbEntryName) {
  const wpseoSocial = parsePhpSerializedSafe(parsed.options.get('wpseo_social')) || {};
  const redirects = parseYoastRedirects(parsed.options);
  const routes = {};
  const conflicts = [];

  for (const indexable of parsed.indexables) {
    if (!indexable.permalink || indexable.object_type !== 'post') continue;
    if (indexable.post_status && indexable.post_status !== 'publish') continue;
    const path = normalizePath(new URL(String(indexable.permalink), SITE_URL).pathname);
    const post = parsed.posts.get(Number(indexable.object_id));
    const meta = parsed.postmeta.get(Number(indexable.object_id)) || {};
    const route = cleanObject({
      sourceWpId: numberOrUndefined(indexable.object_id),
      path,
      title: renderYoastTemplate(meta._yoast_wpseo_title || indexable.title || post?.post_title, post),
      description: meta._yoast_wpseo_metadesc || indexable.description || post?.post_excerpt || '',
      canonical: normalizeCanonical(meta._yoast_wpseo_canonical || indexable.canonical || indexable.permalink, path),
      robots: robotsFromYoast(indexable, meta),
      ogTitle: renderYoastTemplate(meta._yoast_wpseo_opengraph_title || indexable.open_graph_title, post),
      ogDescription: meta._yoast_wpseo_opengraph_description || indexable.open_graph_description,
      ogImage: imageFromYoast(meta._yoast_wpseo_opengraph_image || indexable.open_graph_image, indexable.open_graph_image_meta),
      ogType: post?.post_type === 'post' ? 'article' : 'website',
      twitterCard: 'summary_large_image',
      twitterSite: wpseoSocial.twitter_site ? `@${String(wpseoSocial.twitter_site).replace(/^@/, '')}` : '@FoundSM',
      twitterTitle: renderYoastTemplate(meta._yoast_wpseo_twitter_title || indexable.twitter_title, post),
      twitterDescription: meta._yoast_wpseo_twitter_description || indexable.twitter_description,
      twitterImage: meta._yoast_wpseo_twitter_image || indexable.twitter_image,
      publishedAt: normalizeDateTime(indexable.object_published_at || post?.post_date_gmt),
      modifiedAt: normalizeDateTime(indexable.object_last_modified || post?.post_modified_gmt),
    });
    routes[path] = mergeRoute(routes[path], route);
  }

  for (const [path, rendered] of cacheSeo.entries()) {
    const current = routes[path] || { path, canonical: canonicalForPath(path), robots: DEFAULT_ROBOTS };
    const conflict = findConflict(path, current, rendered);
    if (conflict) conflicts.push(conflict);
    routes[path] = mergeRoute(current, rendered, true);
  }

  for (const route of Object.values(routes)) {
    route.canonical = normalizeCanonical(route.canonical, route.path);
    route.robots = route.robots || DEFAULT_ROBOTS;
    if (!route.ogImage) route.ogImage = { url: 'https://foundsm.com/images/og-image-1200x630.jpg', width: 1200, height: 630 };
  }

  const sortedRoutes = Object.fromEntries(Object.entries(routes).sort(([a], [b]) => a.localeCompare(b)));
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: {
      archive: archivePath,
      databaseEntry: dbEntryName,
      cacheHtmlEntries: cacheSeo.size,
      parsedTermCounts: parsed.termCounts,
    },
    siteUrl: SITE_URL,
    defaultOgImage: {
      url: 'https://foundsm.com/images/og-image-1200x630.jpg',
      width: 1200,
      height: 630,
    },
    twitterSite: wpseoSocial.twitter_site ? `@${String(wpseoSocial.twitter_site).replace(/^@/, '')}` : '@FoundSM',
    social: cleanObject({
      facebook: wpseoSocial.facebook_site,
      linkedin: Array.isArray(wpseoSocial.other_social_urls) ? wpseoSocial.other_social_urls.find((url) => String(url).includes('linkedin')) : undefined,
      x: 'https://x.com/FoundSM',
    }),
    routes: sortedRoutes,
    redirects,
  };

  return { manifest, redirects, conflicts };
}

function mergeRoute(base = {}, incoming = {}, preferIncoming = false) {
  const merged = { ...base };
  for (const [key, value] of Object.entries(incoming)) {
    if (value == null || value === '') continue;
    if (preferIncoming || merged[key] == null || merged[key] === '') merged[key] = value;
  }
  return cleanObject(merged);
}

function findConflict(path, current, rendered) {
  const fields = ['title', 'description', 'canonical', 'robots'];
  const diffs = fields.filter((field) => current[field] && rendered[field] && normalizeCompare(current[field]) !== normalizeCompare(rendered[field]));
  if (diffs.length === 0) return undefined;
  return { path, fields: diffs, db: pick(current, diffs), rendered: pick(rendered, diffs), source: rendered.source };
}

function pick(object, fields) {
  return Object.fromEntries(fields.map((field) => [field, object[field]]));
}

function normalizeCompare(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function parseYoastRedirects(options) {
  const plain = parsePhpSerializedSafe(options.get('wpseo-premium-redirects-export-plain')) || {};
  const redirects = [];

  for (const [origin, target] of Object.entries(plain)) {
    if (!target || typeof target !== 'object') continue;
    const source = normalizeRedirectSource(origin);
    const destination = normalizeRedirectDestination(target.url);
    if (!source || !destination || source === destination) continue;
    redirects.push({
      source,
      destination,
      permanent: Number(target.type) !== 302 && Number(target.type) !== 307,
    });
  }

  return uniqueRedirects(redirects).sort((a, b) => a.source.localeCompare(b.source));
}

function mergeVercelRedirects(vercelPath, generated) {
  const config = JSON.parse(readFileSync(vercelPath, 'utf8'));
  const existing = Array.isArray(config.redirects) ? config.redirects : [];
  return uniqueRedirects([...existing.map(normalizeExistingRedirect), ...generated]);
}

function normalizeExistingRedirect(redirect) {
  return {
    ...redirect,
    source: normalizeRedirectSource(redirect.source),
    destination: normalizeRedirectDestination(redirect.destination),
    permanent: redirect.permanent !== false,
  };
}

function uniqueRedirects(redirects) {
  const seen = new Set();
  const out = [];
  for (const redirect of redirects) {
    const key = redirect.source;
    if (!redirect.source || !redirect.destination || seen.has(key)) continue;
    seen.add(key);
    out.push(redirect);
  }
  return out;
}

function normalizeRedirectSource(source) {
  if (!source) return '';
  let value = String(source).trim();
  if (/^https?:\/\//i.test(value)) value = new URL(value).pathname;
  value = `/${value.replace(/^\/+|\/+$/g, '')}`;
  return value === '/' ? '/' : value;
}

function normalizeRedirectDestination(destination) {
  if (!destination) return '';
  const value = String(destination).trim();
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (url.hostname.replace(/^www\./, '') !== 'foundsm.com') return value;
    return normalizePath(url.pathname);
  }
  return normalizePath(`/${value.replace(/^\/+/, '')}`);
}

function renderYoastTemplate(value, post) {
  if (!value) return '';
  return String(value)
    .replace(/%%title%%/g, post?.post_title || '')
    .replace(/%%sitename%%/g, SITE_NAME)
    .replace(/%%sep%%/g, '-')
    .replace(/%%page%%/g, '')
    .replace(/%%sitedesc%%/g, '')
    .replace(/\s+-\s+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function imageFromYoast(url, meta) {
  if (!url) return undefined;
  let parsedMeta;
  if (meta && typeof meta === 'string') {
    try {
      parsedMeta = JSON.parse(meta);
    } catch {
      parsedMeta = undefined;
    }
  }
  return cleanObject({
    url: String(url).replace('https://foundsm.com/', 'https://foundsm.com/'),
    width: numberOrUndefined(parsedMeta?.width),
    height: numberOrUndefined(parsedMeta?.height),
  });
}

function robotsFromYoast(indexable, meta) {
  const noindex = Number(indexable.is_robots_noindex) === 1 || meta._yoast_wpseo_meta_robots_noindex === '1' || meta['_yoast_wpseo_meta-robots-noindex'] === '1';
  const nofollow = Number(indexable.is_robots_nofollow) === 1 || meta._yoast_wpseo_meta_robots_nofollow === '1' || meta['_yoast_wpseo_meta-robots-nofollow'] === '1';
  const noimageindex = Number(indexable.is_robots_noimageindex) === 1 || String(meta['_yoast_wpseo_meta-robots-adv'] || '').includes('noimageindex');
  const noarchive = Number(indexable.is_robots_noarchive) === 1;
  const nosnippet = Number(indexable.is_robots_nosnippet) === 1;
  const parts = [noindex ? 'noindex' : 'index', nofollow ? 'nofollow' : 'follow'];
  if (noimageindex) parts.push('noimageindex');
  if (noarchive) parts.push('noarchive');
  if (nosnippet) parts.push('nosnippet');
  if (!noindex && !nosnippet) parts.push('max-image-preview:large', 'max-snippet:-1', 'max-video-preview:-1');
  return parts.join(', ');
}

function normalizeCanonical(value, path) {
  if (!value) return canonicalForPath(path);
  const url = new URL(String(value), SITE_URL);
  url.protocol = 'https:';
  url.hostname = 'foundsm.com';
  url.pathname = normalizePath(url.pathname);
  url.search = '';
  url.hash = '';
  return url.toString();
}

function canonicalForPath(path) {
  const normalized = normalizePath(path);
  return `${SITE_URL}${normalized === '/' ? '/' : normalized.slice(1)}`;
}

function normalizePath(path) {
  let pathname = path || '/';
  try {
    pathname = new URL(pathname, SITE_URL).pathname;
  } catch {
    pathname = pathname.split('?')[0]?.split('#')[0] || '/';
  }
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, '/');
  if (pathname !== '/' && !hasFileExtension(pathname) && !pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function hasFileExtension(pathname) {
  return /\.[a-z0-9]{2,8}$/i.test(pathname.split('/').pop() || '');
}

function normalizeDateTime(value) {
  if (!value) return undefined;
  const text = String(value).trim();
  if (!text || text === '0000-00-00 00:00:00') return undefined;
  return text.includes('T') ? text : `${text.replace(' ', 'T')}+00:00`;
}

function parsePhpSerializedSafe(value) {
  if (!value || typeof value !== 'string') return undefined;
  try {
    return parsePhpSerialized(value);
  } catch {
    return undefined;
  }
}

function parsePhpSerialized(value) {
  let index = 0;
  const parse = () => {
    const type = value[index++];
    if (type === 'N') {
      if (value[index] === ';') index += 1;
      return null;
    }
    if (value[index++] !== ':') throw new Error('Invalid PHP serialized value');
    if (type === 'b' || type === 'i' || type === 'd') {
      const end = value.indexOf(';', index);
      const raw = value.slice(index, end);
      index = end + 1;
      if (type === 'b') return raw === '1';
      return Number(raw);
    }
    if (type === 's') {
      const lenEnd = value.indexOf(':', index);
      const length = Number(value.slice(index, lenEnd));
      index = lenEnd + 2;
      const out = value.slice(index, index + length);
      index += length + 2;
      return out;
    }
    if (type === 'a') {
      const lenEnd = value.indexOf(':', index);
      const length = Number(value.slice(index, lenEnd));
      index = lenEnd + 2;
      const pairs = [];
      for (let i = 0; i < length; i += 1) {
        pairs.push([parse(), parse()]);
      }
      index += 1;
      const isArray = pairs.every(([key], i) => key === i);
      return isArray ? pairs.map(([, item]) => item) : Object.fromEntries(pairs.map(([key, item]) => [String(key), item]));
    }
    throw new Error(`Unsupported PHP serialized type: ${type}`);
  };
  return parse();
}

function cleanObject(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}

function numberOrUndefined(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeReport(path, buildResult, cacheSeo, parsed) {
  const routes = Object.values(buildResult.manifest.routes);
  const noindex = routes.filter((route) => String(route.robots).toLowerCase().includes('noindex'));
  const sampledRoutes = ['/', '/about-us/', '/capabilities/paid-media/', '/insights/', '/insights/authors/', '/whitepapers/', '/contact-us/']
    .map((route) => buildResult.manifest.routes[route])
    .filter(Boolean);
  const lines = [
    '# SEO Migration Diff Report',
    '',
    `Generated: ${buildResult.manifest.generatedAt}`,
    `Archive: ${buildResult.manifest.source.archive}`,
    `Database entry: ${buildResult.manifest.source.databaseEntry}`,
    '',
    '## Inventory',
    '',
    `- Manifest routes: ${routes.length}`,
    `- Cached rendered HTML routes checked: ${cacheSeo.size}`,
    `- Yoast redirects extracted: ${buildResult.redirects.length}`,
    `- Noindex routes: ${noindex.length}`,
    `- Parsed taxonomy tables: ${JSON.stringify(parsed.termCounts)}`,
    '',
    '## Representative Route Values',
    '',
    '| Route | Title | Canonical | Robots |',
    '| --- | --- | --- | --- |',
    ...sampledRoutes.map((route) => `| ${route.path} | ${escapeTable(route.title)} | ${route.canonical} | ${escapeTable(route.robots)} |`),
    '',
    '## Rendered HTML Conflicts',
    '',
    buildResult.conflicts.length
      ? buildResult.conflicts.slice(0, 50).map((conflict) => `- ${conflict.path}: ${conflict.fields.join(', ')} differed between database/indexable data and cached HTML (${conflict.source}).`).join('\n')
      : '- None found in checked cache entries.',
    '',
    '## Implementation Notes',
    '',
    '- Cached Yoast-rendered head values win over database/indexable values when both exist.',
    '- Canonicals are normalized to `https://foundsm.com` with trailing slashes for directory routes.',
    '- Redirects are merged into `vercel.json` and the extractor fails if the result exceeds Vercel static redirect limits.',
  ];
  writeFileSync(path, `${lines.join('\n')}\n`);
}

function escapeTable(value) {
  return String(value || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}
