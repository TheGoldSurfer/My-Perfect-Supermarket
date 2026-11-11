# My Perfect Supermarket

A first-person 3D supermarket simulator where you build your own shop from scratch! Order products, stock shelves, serve customers, hire employees, expand your store, unlock new departments and grow your supermarket into a successful business.

## Play online with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then click **Save**.
4. After GitHub Pages publishes the site, open:
   https://thegoldsurfer.github.io/My-Perfect-Supermarket/

The root `index.html` is the playable page and contains the game plus the Stage 14 Stock & Ordering desk directly, so the browser does not need a separate startup fetch or whole-page rewrite. `game-source.html` is kept as the standalone game-source reference and is checked against the published game module. The original compressed source parts are retained as a rollback copy. Use a modern browser with JavaScript and an internet connection: Three.js and its pointer-lock controls load from jsDelivr.

## Stage 11 — Performance and controls

- Lower default rendering cost, adaptive resolution and reduced background work.
- Reuses common 3D geometry and materials.
- CTRL unlocks the mouse; click the game view to lock it again.
- Replaces the previous placeholder arms with a simple first-person sleeve/hand view model.

## Stage 12 — Menu and phone interface

- Dark navy-blue management menus and separate screens for shop systems.
- Dedicated PHONE button plus the P keyboard shortcut.
- Search field in the dashboard.
- Menus pause the simulation while open.
- Updated mobile layout and keyboard navigation.

## Stage 13 — Building System 2.0

- Live furniture preview follows the centre of the screen.
- Green footprint means placement is valid; red means the spot is blocked.
- Rotated-rectangle collision checks reduce overlap between furniture.
- Placement checks shop boundaries and keeps the front entrance clear.
- Grid spacing options: 0.25 m, 0.5 m and 1 m, plus free placement.
- Q / E rotates in 15° increments; R rotates 90°; V toggles grid / free placement.
- On-screen placement dock includes rotation, grid-size and cancel controls.
- Build preview refreshes separately from the interaction raycast for smoother feedback.
- Existing furniture positions and rotations remain compatible with saved games.


## Stage 14 — Live Stock, Ordering and Warehouse Management

- Adds a Stock & Ordering desk accessible from the game screen.
- Uses the game's real 22-product catalogue, product unlocks, supplier prices and cash balance.
- Live stock overview separates warehouse quantities from units currently on shelves and shows reorder thresholds.
- Supplier orders create real in-game deliveries; receiving early or waiting for arrival creates physical crates at the loading bay.
- Crates can be picked up, stocked onto compatible fixtures or stored in warehouse racks using the existing 3D gameplay.
- Shelf compatibility reads the actual fixtures built in the store, their assigned products, current quantities and capacities.
- Manual stock adjustments update the real warehouse and shelf inventory; additions create physical delivery crates.
- Delivery orders, warehouse quantities, shelf contents and store progress are saved in the game save.
- Reorder thresholds are stored locally. JSON backups export product quantities and reorder thresholds; importing one restores those quantities into the live warehouse/shelf system.
- Exposes `window.MPSInventory` with `getProducts()`, `getStock()`, `getDeliveries()`, `adjustStock()`, `setStock()`, `createOrder()`, `receiveDelivery()` and `subscribe()`. Changes emit `mps:inventory:changed`.
- The original game source is now kept in `game-source.html`; the 16 compressed parts remain as a rollback copy.

## Stage 15 — Final polish and release checks (in progress)

- Adds a dependency-free Node.js quality check for the playable page, Three.js game module and Stock & Ordering script.
- Verifies the game's import map, live game/inventory bridge, public inventory API, exact 22-product catalogue and duplicate IDs in the page markup.
- Adds a GitHub Actions quality workflow that runs the checks on pushes to `main`, pull requests targeting `main` and manual workflow dispatch.
- Serves the game directly from the root page instead of fetching a second HTML file and rewriting the document during startup.
- A real browser play-through and device-specific checks are still required before calling the final release verified.

### Manual release smoke test

1. Start a new game and confirm the 3D scene, HUD and pointer-lock controls load.
2. Walk, jump, sprint and interact; open and close the phone, dashboard, pause menu and settings.
3. Enter build mode, rotate a fixture, check its placement preview and place it.
4. Open Stock & Ordering, review stock, place an unlocked order and confirm the delivery appears.
5. Receive the delivery, pick up its crate, stock a compatible shelf and confirm the stock overview updates.
6. Save, reload the page and confirm cash, stock, shelf contents, fixtures and active deliveries persist.
7. Repeat the essential controls and management screens at a narrow mobile viewport.

## Stage 16 — Stability, bug and performance audit (in progress)

- Adds a second automated audit for performance safeguards, frame-time clamping, background-tab behavior, paused simulation, adaptive resolution and quality-based frame caps.
- Checks that raycasts and build previews remain throttled and shared geometry/material caches are retained.
- Checks that save persistence and the live Stage 14 inventory bridge remain connected.
- Fixes a reorder-threshold persistence bug so a saved threshold of `0` stays `0` after reloading.
- Makes supplier delivery IDs collision-safe and repairs duplicate or missing IDs from older saves before the delivery desk uses them.
- Fixes warehouse rack visual cleanup so shared Three.js geometry and materials are not disposed while other objects still use them.
- Adds a GitHub Actions workflow that runs Stage 15 checks, Stage 16 regression guards and a headless Chromium startup test on pushes, pull requests and manual dispatch.
- The Chromium smoke test checks that the page returns successfully, the 3D canvas and main menu appear, and the 22-product inventory bridge initializes. It is a startup check, not a full play-through or a real-device FPS benchmark.

### Stage 16 manual stability pass

1. Test a fresh save and an existing save; check that both reach the game without console errors.
2. Play for at least 10 minutes with a busy store, several staff members and multiple shelves.
3. Watch for frame-rate drops while walking, turning, opening management screens and using build mode.
4. Switch browser tabs and return; confirm the game resumes without a large time jump.
5. Pause and resume; confirm customers and deliveries stop while paused and continue afterward.
6. Place orders, receive crates, stock shelves, save, reload and compare warehouse and shelf counts.
7. Repeat on a narrow mobile viewport and at each available graphics-quality setting.

## Controls

- WASD: walk; mouse: look; Space: jump; Shift: sprint.
- CTRL: unlock the mouse; click the game view to lock it again.
- E: interact; B: enter/exit build mode; P: open the phone.
- While building: Q / E rotate 15°, R rotates 90°, V toggles grid/free placement.
- Click the scene to place a fixture when the footprint preview is green.
- Use the placement dock to rotate, change grid spacing or cancel build mode.
- MENU: open the management dashboard; Esc: pause; F1: help.

## Included gameplay systems

- First-person supermarket with buildable shelves, fridges, checkouts, warehouse racks and specialist displays.
- Product ordering, five-second deliveries, storage and shelf stocking.
- Grocery, chilled, bakery, butcher, flower, toy and electronics departments.
- Customer shopping, shopper profiles, patience, checkout queues, cash/card payments and manual bagging.
- 07:00–23:00 opening hours, accelerated closed hours, weather, rush-hour traffic and reports.
- Store XP, staff, upgrades, security incidents and building expansions.
- QuickCart, ShopTune and character profile apps.
- Autosave plus manual save, import and export.

## Limitations

- This is a **single-player browser prototype**. Online multiplayer/shared shops are not implemented.
- ShopTune is not connected to Spotify's catalogue.
- Saves are local to the same browser and device unless exported and imported as a JSON backup.
- The 3D engine loads from jsDelivr, so an internet connection is required when the game starts.
- The Stage 15 and Stage 16 workflows include static code checks and a headless Chromium startup test. They do not guarantee performance on every real device or replace the manual gameplay checklist.
- Live gameplay, WebGL/CDN loading, pointer lock, mobile controls and full save/load behavior still need manual verification on target devices.
