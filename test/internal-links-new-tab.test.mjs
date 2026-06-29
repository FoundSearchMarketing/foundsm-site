import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const mainScript = readFileSync(new URL('../public/scripts/main.js', import.meta.url), 'utf8');

function installBrowserApiStubs(window) {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  });

  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

async function renderScriptFixture() {
  const dom = new JSDOM(
    `
      <nav>
        <a id="site-nav-relative" href="/contact-us/">Contact</a>
      </nav>
      <section class="blog-post__content-section">
        <a id="relative" href="/contact-us/">Contact</a>
        <a id="absolute" href="https://www.foundsm.com/dataconnect/">Data Connect</a>
        <a id="same-page-anchor" href="#section">Jump</a>
        <a id="same-page-path-anchor" href="/current/#section">Jump</a>
        <a id="external" href="https://example.com/">External</a>
        <a id="mail" href="mailto:info@foundsm.com">Email</a>
        <a id="download" href="/whitepapers/example.pdf" download>Download</a>
        <a id="existing-target" href="/newsletter/" target="_self">Newsletter</a>
      </section>
      <div id="section"></div>
      <script>${mainScript}</script>
    `,
    {
      url: 'https://foundsm.com/current/',
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      beforeParse: installBrowserApiStubs,
    },
  );

  await new Promise((resolve) => {
    if (dom.window.document.readyState === 'loading') {
      dom.window.document.addEventListener('DOMContentLoaded', resolve, { once: true });
      return;
    }

    resolve();
  });

  return dom.window.document;
}

test('main script opens blog content internal links in new tabs', async () => {
  const document = await renderScriptFixture();

  for (const id of ['relative', 'absolute']) {
    const link = document.getElementById(id);

    assert.equal(link.getAttribute('target'), '_blank', `${id} target`);
    assert.equal(link.getAttribute('rel'), 'noopener noreferrer', `${id} rel`);
  }
});

test('main script leaves non-blog-content and non-page-navigation links unchanged', async () => {
  const document = await renderScriptFixture();

  for (const id of ['site-nav-relative', 'same-page-anchor', 'same-page-path-anchor', 'external', 'mail', 'download']) {
    const link = document.getElementById(id);

    assert.equal(link.getAttribute('target'), null, `${id} target`);
    assert.equal(link.getAttribute('rel'), null, `${id} rel`);
  }

  assert.equal(document.getElementById('existing-target').getAttribute('target'), '_self');
});
