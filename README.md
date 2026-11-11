# My Perfect Supermarket

A first-person 3D supermarket simulator where you build your own shop from scratch! Order products, stock shelves, serve customers, hire employees, expand your store, unlock new departments and grow your supermarket into a successful business.

## Play online with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then click **Save**.
4. After GitHub Pages publishes the site, open:
   https://thegoldsurfer.github.io/My-Perfect-Supermarket/

The root `index.html` loads 16 compressed game source parts, unpacks the complete game in your browser, and adds the Stage 14 Stock & Ordering management desk. Use a modern browser with JavaScript and gzip decompression support. The game also loads Three.js from a CDN, so an internet connection is required.

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


## Stage 14 — Product Ordering and Inventory 2.0

- Adds a Stock & Ordering desk accessible from the game screen.
- Stock overview tracks product quantities and per-product replenishment thresholds.
- Place supplier orders with configurable quantities and track incoming deliveries.
- Receive deliveries to add their units to the inventory desk's stock records.
- Shelf compatibility screen compares each product's required fixture type with its assigned fixture and flags mismatches.
- Inventory desk records persist in the browser using local storage.
- This management desk currently keeps its own inventory records; automatic synchronisation with the 3D shelves and the game's original stock simulation is not yet implemented.

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
- JavaScript syntax, HTML parsing, duplicate-ID and ZIP integrity checks passed for Stage 13. Live gameplay testing still needs to be performed on the target device.
