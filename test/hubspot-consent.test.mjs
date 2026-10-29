import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const source = readFileSync(new URL('../public/scripts/hubspot-consent.js', import.meta.url), 'utf8');

function boot({ cookies = [], before = '' } = {}) {
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
    url: 'https://foundsm.com/',
    runScripts: 'dangerously',
  });
  for (const cookie of cookies) dom.window.document.cookie = cookie;
  if (before) dom.window.eval(before);
  dom.window.eval(source);
  return dom;
}

function scriptSrc(dom) {
  return dom.window.document.getElementById('hs-script-loader')?.src || '';
}

test('HubSpot tracking stays unloaded before a OneTrust choice', () => {
  const dom = boot({
    before: 'window.OnetrustActiveGroups = ",C0001,C0002,C0003,C0004,";',
  });

  assert.equal(scriptSrc(dom), '');
  assert.equal(dom.window.document.cookie.includes('__hstc'), false);
  assert.equal(dom.window.document.cookie.includes('hubspotutk'), false);
});

test('accepting performance and functional consent loads HubSpot', () => {
  const dom = boot();
  dom.window.document.cookie = 'OptanonAlertBoxClosed=2026-10-29T00:00:00.000Z';
  dom.window.document.cookie = 'OptanonConsent=interactionCount=1&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A0';
  dom.window.OnetrustActiveGroups = ',C0001,C0002,C0003,';
  dom.window.dispatchEvent(new dom.window.Event('OneTrustGroupsUpdated'));

  assert.match(scriptSrc(dom), /^https:\/\/js\.hs-scripts\.com\/5045186\.js/);
});

test('targeting consent alone does not load HubSpot', () => {
  const dom = boot({
    cookies: [
      'OptanonAlertBoxClosed=2026-10-29T00:00:00.000Z',
      'OptanonConsent=interactionCount=1&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A1',
    ],
    before: 'window.OnetrustActiveGroups = ",C0001,C0004,";',
  });

  assert.equal(scriptSrc(dom), '');
});

test('a later accept through OptanonWrapper loads HubSpot', () => {
  const dom = boot({
    before: 'window.OnetrustActiveGroups = ",C0001,";',
  });
  assert.equal(scriptSrc(dom), '');

  dom.window.document.cookie = 'OptanonAlertBoxClosed=2026-10-29T00:00:00.000Z';
  dom.window.OnetrustActiveGroups = ',C0001,C0002,C0003,';
  dom.window.OptanonWrapper();

  assert.match(scriptSrc(dom), /js\.hs-scripts\.com\/5045186\.js$/);
});

test('rejecting consent clears HubSpot cookies from an earlier visit', () => {
  const dom = boot({
    cookies: [
      '__hstc=old',
      'hubspotutk=old',
      '__hssrc=1',
      '__hssc=1',
      'OptanonAlertBoxClosed=2026-10-29T00:00:00.000Z',
      'OptanonConsent=interactionCount=1&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0',
    ],
    before: 'window.OnetrustActiveGroups = ",C0001,";',
  });

  assert.equal(scriptSrc(dom), '');
  const jar = dom.window.document.cookie;
  assert.equal(jar.includes('__hstc='), false);
  assert.equal(jar.includes('hubspotutk='), false);
  assert.equal(jar.includes('__hssrc='), false);
  assert.equal(jar.includes('__hssc='), false);
});

test('rejecting consent does not leave the tracking script in the page', () => {
  const dom = boot({
    cookies: [
      'OptanonAlertBoxClosed=2026-10-29T00:00:00.000Z',
      'OptanonConsent=interactionCount=1&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0',
    ],
    before: 'window.OnetrustActiveGroups = ",C0001,";',
  });

  assert.equal(scriptSrc(dom), '');
});
