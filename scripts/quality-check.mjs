import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const indexHtml = read('index.html');
const gameHtml = read('game-source.html');
const readme = read('README.md');

function pass(message) {
  console.log('PASS ' + message);
}

function checkJavaScript(label, source, extension) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mps-stage15-'));
  const file = path.join(tempDir, 'check.' + extension);
  try {
    fs.writeFileSync(file, source, 'utf8');
    const result = spawnSync(process.execPath, ['--check', file], {
      encoding: 'utf8',
    });
    assert.equal(
      result.status,
      0,
      label + ' syntax check failed:\n' + (result.stderr || result.stdout || 'Unknown Node.js parse error'),
    );
    pass(label + ' JavaScript syntax');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function scriptTags(html) {
  return [...html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script\\s*>/gi)]
    .map((match) => ({ attrs: match[1], source: match[2] }));
}

function assertUniqueIds(label, markup) {
  const ids = [...markup.matchAll(/\\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const seen = new Set();
  const duplicates = new Set();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  assert.equal(
    duplicates.size,
    0,
    label + ' contains duplicate IDs: ' + [...duplicates].join(', '),
  );
  pass(label + ' HTML IDs (' + ids.length + ' unique)');
}

function extractAddonString(source) {
  const marker = 'const stage14Addon=';
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, 'Launcher is missing its embedded Stage 14 add-on');
  let cursor = markerIndex + marker.length;
  assert.equal(source[cursor], '"', 'Stage 14 add-on must remain a quoted string');
  const start = cursor;
  cursor += 1;
  let escaped = false;
  for (; cursor < source.length; cursor += 1) {
    const char = source[cursor];
    if (escaped) {
      escaped = false;
    } else if (char === '\\\\') {
      escaped = true;
    } else if (char === '"') {
      break;
    }
  }
  assert.ok(cursor < source.length, 'Stage 14 add-on string is not closed');
  return JSON.parse(source.slice(start, cursor + 1));
}

assert.match(indexHtml, /fetch\\(['"]\\.\\/game-source\\.html['"]/i, 'Launcher must load game-source.html');
assert.match(indexHtml, /Loading My Perfect Supermarket/i, 'Launcher should show the Stage 15 startup copy');
assert.match(indexHtml, /id=["']retry["']/i, 'Launcher should include a retry control');
pass('launcher points to the standalone game source and has a retry control');

const launcherScripts = scriptTags(indexHtml);
assert.equal(launcherScripts.length, 1, 'Expected one executable launcher script');
checkJavaScript('Launcher', launcherScripts[0].source, 'cjs');

const sourceScripts = scriptTags(gameHtml);
const importMap = sourceScripts.find((tag) => /\\btype=["']importmap["']/i.test(tag.attrs));
const gameModule = sourceScripts.filter((tag) => /\\btype=["']module["']/i.test(tag.attrs));
assert.ok(importMap, 'Game source is missing its import map');
assert.doesNotThrow(() => JSON.parse(importMap.source), 'Game import map must be valid JSON');
assert.equal(gameModule.length, 1, 'Expected exactly one game module script');
pass('game import map JSON');

checkJavaScript('Three.js game module', gameModule[0].source, 'mjs');

const addonMarkup = extractAddonString(indexHtml);
const addonScript = addonMarkup.match(/<script\\b[^>]*id=["']stage14-stock-script["'][^>]*>([\\s\\S]*?)<\\/script\\s*>/i);
assert.ok(addonScript, 'Embedded Stage 14 stock desk script was not found');
checkJavaScript('Stage 14 stock desk', addonScript[1], 'cjs');

const bridgeStart = gameHtml.indexOf('window.MPSGameBridge=Object.freeze({');
assert.notEqual(bridgeStart, -1, 'Game bridge is missing');
const bridgeEnd = gameHtml.indexOf('window.dispatchEvent(new Event(\'mps-game:ready\'))', bridgeStart);
assert.ok(bridgeEnd > bridgeStart, 'Game bridge ready event is missing');
const bridge = gameHtml.slice(bridgeStart, bridgeEnd);
for (const method of [
  'getProducts', 'getInventory', 'getDeliveries', 'getCrates',
  'getFixtures', 'getCash', 'order', 'receive', 'adjustStock', 'setStock',
]) {
  assert.match(bridge, new RegExp('\\\\b' + method + '\\\\s*:'), 'Game bridge is missing ' + method);
}
pass('game-to-inventory bridge contract');

assert.match(addonMarkup, /window\\.MPSInventory=Object\\.freeze\\(/, 'Public inventory API is missing');
for (const method of ['getSnapshot', 'getProducts', 'getDeliveries', 'getStock', 'setStock', 'adjustStock', 'createOrder', 'receiveDelivery', 'importBackup', 'subscribe']) {
  assert.match(addonMarkup, new RegExp('\\\\b' + method + '\\\\s*:'), 'Public inventory API is missing ' + method);
}
pass('public MPSInventory API contract');

const productsMatch = gameHtml.match(/const PRODUCTS=\\{([\\s\\S]*?)\\};\\s*function productCost/);
assert.ok(productsMatch, 'Game product catalogue could not be located');
const productKeys = [...productsMatch[1].matchAll(/(?:^|,)([A-Za-z_$][\\w$]*):\\{/g)]
  .map((match) => match[1]);
const expectedKeys = [
  'bread', 'milk', 'apples', 'drinks', 'chips', 'eggs', 'cereal', 'cheese',
  'juice', 'tomatoes', 'baguette', 'croissants', 'muffins', 'chicken', 'beef',
  'sausages', 'roses', 'bouquet', 'teddy', 'toyCar', 'headphones', 'charger',
];
assert.deepEqual(productKeys, expectedKeys, 'The live catalogue must contain the expected 22 products in order');
pass('22-product catalogue');

const gameMarkup = gameHtml.slice(0, gameHtml.search(/<script\\b/i));
const launcherMarkup = indexHtml.slice(0, indexHtml.search(/<script\\b/i));
assertUniqueIds('Game page', gameMarkup);
assertUniqueIds('Launcher page', launcherMarkup);

assert.match(readme, /Stage 15 — Final polish and release checks/i, 'README must document Stage 15');
pass('Stage 15 documentation');
console.log('All Stage 15 release checks passed.');
