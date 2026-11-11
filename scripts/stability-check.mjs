import fs from 'node:fs';
import assert from 'node:assert/strict';

const game = fs.readFileSync('game-source.html', 'utf8');
const launcher = fs.readFileSync('index.html', 'utf8');

function pass(message) {
  console.log('PASS ' + message);
}

function requireMatch(source, pattern, message) {
  assert.match(source, pattern, message);
  pass(message);
}

// Rendering safeguards: keep the default GPU workload conservative.
requireMatch(game, /new THREE\.WebGLRenderer\(\{[^}]*antialias:false[^}]*powerPreference:'high-performance'/, 'WebGL renderer keeps antialiasing disabled and requests high-performance mode');
requireMatch(game, /renderer\.shadowMap\.enabled=false/, 'Real-time shadow maps remain disabled');
requireMatch(game, /renderer\.setPixelRatio\(Math\.min\(devicePixelRatio\|\|1,\.85\)\)/, 'Initial pixel ratio is capped for lower rendering cost');
requireMatch(game, /adaptiveScale=Math\.max\(\.62,adaptiveScale-\.1\)/, 'Adaptive resolution has a lower safety bound');
requireMatch(game, /adaptiveScale=Math\.min\(1,adaptiveScale\+\.04\)/, 'Adaptive resolution never scales above its baseline');
requireMatch(game, /average>24&&adaptiveScale>\.62/, 'Slow render frames trigger adaptive downscaling');
requireMatch(game, /average<12&&adaptiveScale<1/, 'Fast render frames allow gradual resolution recovery');

// Keep simulation and rendering bounded on slower devices.
requireMatch(game, /const dt=Math\.min\(\.05,\(now-lastT\)\/1000\)/, 'Large frame gaps are clamped before simulation updates');
requireMatch(game, /if\(document\.hidden\)\{lastT=now;return\}/, 'Background tabs skip rendering and simulation work');
requireMatch(game, /if\(gameStarted&&!gamePaused\)/, 'Gameplay simulation stops while the game is paused or at the title screen');
requireMatch(game, /gameSettings\.quality==='low'\?1000\/30:gameSettings\.quality==='medium'\?1000\/45:1000\/60/, 'Quality settings cap rendering at 30, 45 or 60 FPS');
requireMatch(game, /now-lastAdaptiveCheck>3000/, 'Adaptive quality decisions are throttled rather than checked every frame');

// Guard the existing CPU-side work throttles and resource reuse.
requireMatch(game, /now-lastTargetCheck>160/, 'Interaction raycasts are throttled');
requireMatch(game, /rayNow-lastRaycastRefresh>650/, 'Raycast target lists are refreshed periodically');
requireMatch(game, /now-lastGhostCheck>65/, 'Build preview updates are throttled');
requireMatch(game, /const sharedMaterials=new Set\(\),sharedGeometries=new Set\(\),materialCache=new Map\(\),geometryCache=new Map\(\)/, 'Shared material and geometry caches remain enabled');
requireMatch(game, /function disposeDynamicTree\(root\)[\s\S]{0,700}sharedGeometries\.has\(o\.geometry\)/, 'Dynamic object cleanup preserves shared geometry resources');

// Guard save and stock integration contracts.
requireMatch(game, /localStorage\.setItem\('mySupermarketSave',JSON\.stringify\(data\)\)/, 'Game progress continues to save locally');
requireMatch(game, /deliveries:deliveries\.map\(d=>\(\{\.\.\.d\}\)\)/, 'Active deliveries remain part of saved game data');
requireMatch(game, /window\.MPSGameBridge=Object\.freeze\(/, 'Stage 14 live game bridge remains present');
for (const method of ['getProducts', 'getInventory', 'getDeliveries', 'getCrates', 'getFixtures', 'getCash', 'order', 'receive', 'adjustStock', 'setStock']) {
  assert.match(game, new RegExp('\\b' + method + '\\s*:'));
}
pass('All Stage 14 game bridge methods remain available');
requireMatch(launcher, /window\.MPSInventory=Object\.freeze\(/, 'Stage 14 public inventory API remains present');
requireMatch(launcher, /setInterval\(\(\)=>\{[\s\S]{0,300}sync\(/, 'Stock desk continues periodically syncing with live game state');

console.log('All Stage 16 stability and performance guard checks passed.');
