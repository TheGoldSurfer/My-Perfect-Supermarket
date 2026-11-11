import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { chromium } from 'playwright';

const root = process.cwd();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const file = path.resolve(root, relative);
    if (file !== root && !file.startsWith(root + path.sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const content = fs.readFileSync(file);
    response.writeHead(200, {
      'content-type': types[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    response.end(content);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

await new Promise((resolve) => server.listen(4173, '127.0.0.1', resolve));

let browser;
try {
  browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=swiftshader',
    ],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const response = await page.goto('http://127.0.0.1:4173/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  assert.ok(response && response.ok(), 'Game page did not return HTTP 200');

  await page.waitForFunction(
    () => Boolean(window.MPSGameBridge && window.MPSInventory && document.querySelector('#game canvas')),
    { timeout: 45000 },
  );

  const state = await page.evaluate(() => {
    const canvas = document.querySelector('#game canvas');
    const menu = document.querySelector('#menuOverlay');
    return {
      canvasWidth: canvas?.width || 0,
      canvasHeight: canvas?.height || 0,
      menuVisible: Boolean(menu && getComputedStyle(menu).display !== 'none'),
      productCount: window.MPSInventory.getProducts().length,
      bridgeVersion: window.MPSGameBridge.version,
      inventoryVersion: window.MPSInventory.version,
    };
  });

  assert.ok(state.canvasWidth > 0 && state.canvasHeight > 0, '3D canvas has no drawing area');
  assert.ok(state.menuVisible, 'Main menu did not appear after startup');
  assert.equal(state.productCount, 22, 'Live inventory did not expose all 22 game products');
  assert.equal(state.bridgeVersion, 1, 'Game bridge did not initialize');
  assert.equal(state.inventoryVersion, 2, 'Stock desk API did not initialize');
  assert.deepEqual(pageErrors, [], 'Browser reported JavaScript page errors: ' + pageErrors.join(' | '));

  console.log('PASS browser startup: ' + JSON.stringify(state));
  console.log('All Chromium startup smoke checks passed.');
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
