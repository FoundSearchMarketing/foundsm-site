import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const readSource = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const beforeClientScript = (source) => source.split('<script>')[0];

const migratedAutoTabSections = [
  {
    path: 'src/components/home/Homepage.astro',
    panelMarker: 'data-home-panel={tab.id}',
    bodyMarker: 'renderRichText(tab.body)',
  },
  {
    path: 'src/pages/about-us.astro',
    panelMarker: 'role="tabpanel"',
    bodyMarker: 'aboutRichHtml(value.body)',
  },
  {
    path: 'src/pages/capabilities/paid-media.astro',
    panelMarker: 'data-paid-media-panel',
    bodyMarker: 'set:html={tab.bodyHtml}',
  },
  {
    path: 'src/components/modern/PerformanceCreativePage.astro',
    panelMarker: 'role="tabpanel"',
    bodyMarker: 'set:html={tab.bodyHtml}',
  },
  {
    path: 'src/pages/our-approach.astro',
    panelMarker: 'data-partnership-panel',
    bodyMarker: 'set:html={richHtml(tab.body)}',
  },
];

test('migrated auto-rotating tab content remains server-rendered', () => {
  for (const { path, panelMarker, bodyMarker } of migratedAutoTabSections) {
    const markup = beforeClientScript(readSource(path));

    assert.ok(markup.includes(panelMarker), `${path} should render tab panels before client JavaScript`);
    assert.ok(markup.includes(bodyMarker), `${path} should render tab body copy before client JavaScript`);
  }
});

test('migrated auto-rotating tabs use progressive-enhancement rotation', () => {
  for (const { path } of migratedAutoTabSections) {
    const source = readSource(path);

    assert.ok(source.includes('setupAutoRotatingTabs'), `${path} should initialize tab auto-rotation`);
  }
});

test('our approach partnership copy remains in static fallback content', () => {
  const source = readSource('src/lib/morePageData.ts');

  assert.ok(source.includes('Google Marketing Platform Certified'));
  assert.ok(source.includes('Microsoft Advertising Elite Partner'));
  assert.ok(source.includes('Being named a Google Partner is recognition for maximizing campaign success'));
  assert.ok(source.includes('Meta Business Partner'));
  assert.ok(source.includes('OneTrust Privacy Professional'));
});
