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

test('opt-out defaults load HubSpot without a banner click', () => {
  const dom = boot({
    before: 'window.OnetrustActiveGroups = ",C0001,C0002,C0003,C0004,";',
  });

  assert.match(scriptSrc(dom), /^https:\/\/js\.hs-scripts\.com\/5045186\.js/);
});

test('opt-in regions wait until performance and functional groups are active', () => {
  const dom = boot({
    before: 'window.OnetrustActiveGroups = ",C0001,";',
  });

  assert.equal(scriptSrc(dom), '');
  assert.equal(dom.window.document.cookie.includes('__hstc'), false);
});

test('a saved OptanonConsent cookie is enough before the OneTrust global exists', () => {
  const dom = boot({
    cookies: ['OptanonConsent=groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A0'],
  });

  assert.match(scriptSrc(dom), /js\.hs-scripts\.com\/5045186\.js$/);
});

test('targeting consent alone does not load HubSpot', () => {
  const dom = boot({
    cookies: ['OptanonConsent=groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A1'],
    before: 'window.OnetrustActiveGroups = ",C0001,C0004,";',
  });

  assert.equal(scriptSrc(dom), '');
});

test('a later accept through OptanonWrapper loads HubSpot', () => {
  const dom = boot({
    before: 'window.OnetrustActiveGroups = ",C0001,";',
  });
  assert.equal(scriptSrc(dom), '');

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
      'OptanonConsent=groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0',
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

test('withdrawing C0002 after load clears HubSpot cookies', () => {
  const dom = boot({
    cookies: ['__hstc=old', 'hubspotutk=old', '__hssrc=1', '__hssc=1'],
    before: 'window.OnetrustActiveGroups = ",C0001,C0002,C0003,";',
  });
  assert.match(scriptSrc(dom), /5045186\.js$/);

  dom.window.document.cookie = '__hstc=old';
  dom.window.document.cookie = 'hubspotutk=old';
  dom.window.document.cookie = '__hssrc=1';
  dom.window.document.cookie = '__hssc=1';
  dom.window.OnetrustActiveGroups = ',C0001,C0003,';
  dom.window.dispatchEvent(new dom.window.Event('OneTrustGroupsUpdated'));

  const jar = dom.window.document.cookie;
  assert.equal(jar.includes('__hstc='), false);
  assert.equal(jar.includes('hubspotutk='), false);
  assert.equal(jar.includes('__hssrc='), false);
  assert.equal(jar.includes('__hssc='), false);
});

test('unknown consent does not load tracking or clear an existing cookie', () => {
  const dom = boot({ cookies: ['__hstc=keep'] });

  assert.equal(scriptSrc(dom), '');
  assert.equal(dom.window.document.cookie.includes('__hstc=keep'), true);
});
