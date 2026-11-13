// Per-page weight budget (harness: docs/conventions/frontend.md §6, principle 7).
// For every HTML page in dist/, sums the gzip size of the JS and CSS it loads
// (external and inline) and the size of the fonts its CSS references, and
// fails when a page goes over budget.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const KB = 1024;
export const budgets = { js: 60 * KB, css: 30 * KB, fonts: 100 * KB };

const gzipSize = (content) => gzipSync(content, { level: 9 }).length;

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const matches = (text, regex) => [...text.matchAll(regex)].map((m) => m[1]);
const localAsset = (dist, url) => join(dist, url.split(/[?#]/)[0]);

export function measurePage(dist, htmlPath) {
  const html = readFileSync(htmlPath, 'utf8');
  const totals = { js: 0, css: 0, fonts: 0 };
  const fonts = new Set();

  const scripts = matches(html, /<script\b[^>]*\bsrc="(\/[^"]+)"/g);
  for (const src of new Set(scripts)) totals.js += gzipSize(readFileSync(localAsset(dist, src)));
  for (const inline of matches(html, /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    totals.js += gzipSize(inline);
  }

  const stylesheets = matches(html, /<link\b[^>]*rel="stylesheet"[^>]*href="(\/[^"]+)"/g);
  const cssTexts = matches(html, /<style\b[^>]*>([\s\S]*?)<\/style>/g);
  for (const href of new Set(stylesheets)) {
    const css = readFileSync(localAsset(dist, href));
    totals.css += gzipSize(css);
    cssTexts.push(css.toString('utf8'));
  }
  for (const inline of matches(html, /<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
    totals.css += gzipSize(inline);
  }
  for (const css of cssTexts) {
    for (const url of matches(css, /url\(["']?(\/[^"')]+\.(?:woff2?|ttf|otf))["']?\)/g)) {
      fonts.add(url);
    }
  }
  for (const font of fonts) totals.fonts += readFileSync(localAsset(dist, font)).length;

  return totals;
}

function main() {
  const dist = 'dist';
  if (!existsSync(dist)) {
    console.error('size: dist/ not found, run `npm run build` first');
    process.exit(1);
  }
  const pages = htmlFiles(dist);
  if (pages.length === 0) {
    console.error('size: no HTML pages in dist/');
    process.exit(1);
  }

  const fmt = (bytes) => `${(bytes / KB).toFixed(1)} KB`;
  let failed = false;
  for (const page of pages.sort()) {
    const totals = measurePage(dist, page);
    const over = Object.keys(budgets).filter((kind) => totals[kind] > budgets[kind]);
    failed ||= over.length > 0;
    const detail = Object.keys(budgets)
      .map((kind) => `${kind} ${fmt(totals[kind])}/${fmt(budgets[kind])}`)
      .join(' · ');
    console.log(`${over.length > 0 ? 'FAIL' : 'ok  '} ${relative(dist, page)}  ${detail}`);
  }
  if (failed) {
    console.error('size: at least one page is over budget (principle 7)');
    process.exit(1);
  }
}

main();
