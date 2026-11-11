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
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mps-quality-'));
  const file = path.join(tempDir, 'check.' + extension);
  try {
    fs.writeFileSync(file, source, 'utf8');
    const result = spawnSync(process.execPath, ['--check', file], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, label + ' syntax check failed:\n' + (result.stderr || result.stdout || 'Unknown Node.js parse error'));
    pass(label + ' JavaScript syntax');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function scriptTags(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
    .map((match) => ({ attrs: match[1], source: match[2] }));
}

function assertUniqueIds(label, markup) {
  const htmlOnly = markup.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
  const ids = [...htmlOnly.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const seen = new Set();
  const duplicates = new Set();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  assert.equal(duplicates.size, 0, label + ' contains duplicate IDs: ' + [...duplicates].join(', '));
  pass(label + ' HTML IDs (' + ids.length + ' unique)');
}

function parsePage(label, html) {
  const scripts = scriptTags(html);
  const importMaps = scripts.filter((tag) => /\btype=["']importmap["']/i.test(tag.attrs));
  const modules = scripts.filter((tag) => /\btype=["']module["']/i.test(tag.attrs));
  assert.equal(importMaps.length, 1, label + ' must contain exactly one import map');
  assert.doesNotThrow(() => JSON.parse(importMaps[0].source), label + ' import map must be valid JSON');
  assert.equal(modules.length, 1, label + ' must contain exactly one game module');
  checkJavaScript(label + ' Three.js module', modules[0].source, 'mjs');
  return { scripts, moduleSource: modules[0].source };
}

assert.match(indexHtml, /<div id=["']game["']><\/div>/i, 'Root index must contain the actual game canvas host');
assert.match(indexHtml, /id=["']stage14-stock-script["']/i, 'Root index must include the Stage 14 stock desk');
assert.doesNotMatch(indexHtml, /document\.write\(html\)/, 'Root index must not depend on dynamic whole-document rewriting');
assert.doesNotMatch(indexHtml, /fetch\(['"]\.\/game-source\.html['"]/, 'Root index must not fetch the game at startup');
pass('Root index directly serves the game and stock desk');

const playable = parsePage('Root index', indexHtml);
const source = parsePage('Standalone game source', gameHtml);
assert.equal(playable.moduleSource, source.moduleSource, 'Root index and standalone game source must contain the same game module');
pass('Published game module matches the standalone source');

const stockScripts = playable.scripts.filter((tag) => /\bid=["']stage14-stock-script["']/i.test(tag.attrs));
assert.equal(stockScripts.length, 1, 'Root index must contain exactly one Stage 14 stock desk script');
checkJavaScript('Stage 14 stock desk', stockScripts[0].source, 'cjs');

const bridgeStart = gameHtml.indexOf('window.MPSGameBridge=Object.freeze({');
assert.notEqual(bridgeStart, -1, 'Game bridge is missing');
const bridgeEnd = gameHtml.indexOf("window.dispatchEvent(new Event('mps-game:ready'))", bridgeStart);
assert.ok(bridgeEnd > bridgeStart, 'Game bridge ready event is missing');
const bridge = gameHtml.slice(bridgeStart, bridgeEnd);
for (const method of [
  'getProducts', 'getInventory', 'getDeliveries', 'getCrates',
  'getFixtures', 'getCash', 'order', 'receive', 'adjustStock', 'setStock',
]) {
  assert.match(bridge, new RegExp('\\b' + method + '\\s*:'), 'Game bridge is missing ' + method);
}
pass('Game-to-inventory bridge contract');

assert.match(indexHtml, /window\.MPSInventory=Object\.freeze\(/, 'Public inventory API is missing');
for (const method of ['getSnapshot', 'getProducts', 'getDeliveries', 'getStock', 'setStock', 'adjustStock', 'createOrder', 'receiveDelivery', 'importBackup', 'subscribe']) {
  assert.match(indexHtml, new RegExp('\\b' + method + '\\s*:'), 'Public inventory API is missing ' + method);
}
pass('Public MPSInventory API contract');

const productsMatch = gameHtml.match(/const PRODUCTS=\{([\s\S]*?)\};\s*function productCost/);
assert.ok(productsMatch, 'Game product catalogue could not be located');
const productKeys = [...productsMatch[1].matchAll(/(?:^|,)([A-Za-z_$][\w$]*):\{/g)].map((match) => match[1]);
const expectedKeys = [
  'bread', 'milk', 'apples', 'drinks', 'chips', 'eggs', 'cereal', 'cheese',
  'juice', 'tomatoes', 'baguette', 'croissants', 'muffins', 'chicken', 'beef',
  'sausages', 'roses', 'bouquet', 'teddy', 'toyCar', 'headphones', 'charger',
];
assert.deepEqual(productKeys, expectedKeys, 'The live catalogue must contain the expected 22 products in order');
pass('22-product catalogue');

assertUniqueIds('Playable page', indexHtml);
assertUniqueIds('Standalone game source', gameHtml);
assert.match(readme, /Stage 15 — Final polish and release checks/i, 'README must document Stage 15');
assert.match(readme, /Stage 16 — Stability, bug and performance audit/i, 'README must document Stage 16');
pass('Stage 15 and Stage 16 documentation');
console.log('All game release checks passed.');
