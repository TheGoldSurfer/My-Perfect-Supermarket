# My Perfect Supermarket

A first-person 3D supermarket simulator where you build your own shop from scratch! Order products, stock shelves, serve customers, hire employees, expand your store, unlock new departments and grow your supermarket into a successful business.

## Play online with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then click **Save**.
4. After GitHub Pages publishes the site, open:
   https://thegoldsurfer.github.io/My-Perfect-Supermarket/

The root `index.html` loader downloads the original game source files and applies the Stage 11 performance and controls update before starting the game. Use a modern browser with JavaScript enabled and an internet connection (the game loads Three.js from a CDN).

## Stage 11 update

- Lower default rendering cost and capped low/medium frame rates.
- Adaptive render resolution responds to measured frame cost.
- Reuses common geometry and materials to reduce duplicate GPU resources.
- Reduces unnecessary raycasts, background-tab work, rain particles and customer count on low graphics.
- CTRL unlocks the mouse; click the game canvas to lock it again.
- Replaces the previous broken placeholder arm display with a simple first-person sleeve/hand model.

## Run locally

From the repository folder, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/ in your browser.

## Notes

- This is a single-player browser prototype.
- Online multiplayer is not implemented.
- ShopTune is not connected to Spotify's catalogue.
- Save data is stored in browser local storage. Use the in-game Save & Backup menu to export a backup before clearing browser data.
