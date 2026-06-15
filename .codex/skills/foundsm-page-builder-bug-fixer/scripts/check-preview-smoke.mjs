#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes('--help') || args.length === 0) {
  printUsage();
  process.exit(args.length === 0 ? 1 : 0);
}

const url = args[0];
const timeoutMs = Number(readFlag('--timeout') || 45000);
const outputJson = args.includes('--json');

const report = {
  ok: false,
  url,
  mode: 'http-only',
  warnings: [],
  errors: [],
  viewports: [],
};

try {
  assertUrl(url);
  await checkHttp(url, timeoutMs);
  await checkWithPlaywright(url, timeoutMs);
} catch (error) {
  fail('$', error.message);
}

report.ok = report.errors.length === 0;
finish();

async function checkHttp(targetUrl, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(targetUrl, {
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!response.ok) {
      fail('http', `Preview returned HTTP ${response.status}.`);
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      warn('http.content-type', `Expected HTML but received "${contentType || 'unknown'}".`);
    }
  } finally {
    clearTimeout(timer);
  }
}

async function checkWithPlaywright(targetUrl, timeout) {
  let chromium;

  try {
    ({ chromium } = await import('playwright'));
  } catch {
    warn('playwright', 'Playwright is unavailable; completed HTTP-only smoke check.');
    return;
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    warn('playwright', `Could not launch a browser; completed HTTP-only smoke check. ${error.message}`);
    return;
  }

  report.mode = 'playwright';

  const viewportSpecs = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  try {
    for (const viewport of viewportSpecs) {
      await checkViewport(browser, targetUrl, viewport, timeout);
    }
  } finally {
    await browser.close();
  }
}

async function checkViewport(browser, targetUrl, viewport, timeout) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const viewportReport = {
    name: viewport.name,
    width: viewport.width,
    height: viewport.height,
    consoleErrors: [],
    requestFailures: [],
    failedResponses: [],
    brokenMedia: [],
    horizontalOverflow: false,
    bodyTextLength: 0,
  };
  report.viewports.push(viewportReport);

  page.on('console', (message) => {
    if (message.type() === 'error') {
      viewportReport.consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    viewportReport.consoleErrors.push(error.message);
  });

  page.on('requestfailed', (request) => {
    viewportReport.requestFailures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`.trim());
  });

  page.on('response', (response) => {
    const status = response.status();
    if (status >= 400) {
      viewportReport.failedResponses.push(`${status} ${response.url()}`);
    }
  });

  try {
    const response = await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout,
    });

    if (!response || !response.ok()) {
      viewportReport.failedResponses.push(`${response?.status() || 'NO_RESPONSE'} ${targetUrl}`);
    }

    await page.waitForTimeout(1000);

    const browserChecks = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      const brokenImages = Array.from(document.images)
        .filter((image) => image.currentSrc && image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc);
      const missingImageSources = Array.from(document.images)
        .filter((image) => !image.currentSrc && !image.getAttribute('src'))
        .map((image) => image.getAttribute('alt') || 'image without src');
      const emptyVideos = Array.from(document.querySelectorAll('video'))
        .filter((video) => !video.currentSrc && video.querySelectorAll('source').length === 0)
        .map((video) => video.getAttribute('aria-label') || 'video without source');

      return {
        bodyTextLength: body.innerText.trim().length,
        horizontalOverflow: html.scrollWidth > window.innerWidth + 2,
        scrollWidth: html.scrollWidth,
        viewportWidth: window.innerWidth,
        brokenMedia: [...brokenImages, ...missingImageSources, ...emptyVideos],
      };
    });

    viewportReport.bodyTextLength = browserChecks.bodyTextLength;
    viewportReport.horizontalOverflow = browserChecks.horizontalOverflow;
    viewportReport.brokenMedia = browserChecks.brokenMedia;

    if (browserChecks.bodyTextLength < 20) {
      fail(viewport.name, 'Rendered page has almost no visible text.');
    }

    if (browserChecks.horizontalOverflow) {
      fail(
        viewport.name,
        `Page has horizontal overflow: scrollWidth ${browserChecks.scrollWidth}, viewport ${browserChecks.viewportWidth}.`,
      );
    }

    for (const item of browserChecks.brokenMedia) {
      fail(viewport.name, `Broken or missing media: ${item}`);
    }
  } finally {
    await page.close();
  }

  for (const item of viewportReport.consoleErrors) {
    fail(viewport.name, `Console error: ${item}`);
  }
  for (const item of viewportReport.requestFailures) {
    fail(viewport.name, `Request failed: ${item}`);
  }
  for (const item of viewportReport.failedResponses) {
    fail(viewport.name, `Failed response: ${item}`);
  }
}

function assertUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid preview URL "${value}".`);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Preview URL must use http or https.');
  }
}

function readFlag(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? '' : args[index + 1] || '';
}

function warn(check, message) {
  report.warnings.push({ check, message });
}

function fail(check, message) {
  report.errors.push({ check, message });
}

function printUsage() {
  console.log('Usage: bun check-preview-smoke.mjs <preview-url> [--timeout 45000] [--json]');
}

function finish() {
  if (outputJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`FoundSM preview smoke: ${report.ok ? 'PASS' : 'FAIL'}`);
    console.log(`URL: ${report.url}`);
    console.log(`Mode: ${report.mode}`);
    console.log(`Warnings: ${report.warnings.length}, errors: ${report.errors.length}`);

    for (const item of report.warnings) {
      console.log(`[WARN] ${item.check}: ${item.message}`);
    }
    for (const item of report.errors) {
      console.log(`[FAIL] ${item.check}: ${item.message}`);
    }
  }

  process.exit(report.ok ? 0 : 1);
}
