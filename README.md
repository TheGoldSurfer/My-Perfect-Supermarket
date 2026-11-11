# My Perfect Supermarket

A first-person 3D supermarket simulator where you build your own shop from scratch! Order products, stock shelves, serve customers, hire employees, expand your store, unlock new departments and grow your supermarket into a successful business.

## Play online with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then click **Save**.
4. After GitHub Pages publishes the site, open:
   https://thegoldsurfer.github.io/My-Perfect-Supermarket/

The root `index.html` loads the compressed game source parts and applies the latest interface update before starting the game. Use a modern browser with JavaScript enabled and an internet connection (the game loads Three.js from a CDN).

## Stage 12 — Interface redesign

- Reworked the title, pause, management and phone screens into a consistent dark navy-blue interface.
- Updated panels, feature tiles, forms, progress bars, action buttons and phone apps to match.
- Added a dedicated **PHONE** button to the visible in-game toolbar. The phone can also be opened with **P**.
- The toolbar is focused on **Menu, Build, Phone, Interact and Pause**. The alarm appears only during an active security incident.
- Added a search field to the supermarket dashboard to find menus such as build, orders, staff, upgrades, security and save management.
- Management menus pause the simulation while open, and the simulation resumes when they close.
- Shelf, warehouse and checkout management screens also pause the simulation.
- Improved keyboard focus outlines, button states and mobile layout.

## Controls

- Click **Start Game** / **Continue Game** to begin.
- WASD: walk; mouse: look; Space: jump; Shift: sprint.
- **CTRL**: unlock mouse; click the game view to lock it again.
- **E**: interact; **B**: build; **R**: rotate the selected fixture; **V**: toggle grid/free placement.
- **PHONE** button or **P**: open the owner phone.
- **MENU**: open the supermarket dashboard. Search for a feature and select its own screen.
- **Esc** or **PAUSE**: pause the simulation.
- **F1**: open help.
- On touch screens, use the on-screen movement buttons; desktop mouse look is recommended.

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
- Static JavaScript syntax, HTML parsing, duplicate-ID and ZIP integrity checks passed for the Stage 12 download. A live gameplay playtest still needs to be performed on the target device.
