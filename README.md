# My Perfect Supermarket

A first-person 3D supermarket simulator where you build your own shop from scratch! Order products, stock shelves, serve customers, hire employees, expand your store, unlock new departments and grow your supermarket into a successful business.

## Play online with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then click **Save**.
4. After GitHub Pages publishes the site, open:
   https://thegoldsurfer.github.io/My-Perfect-Supermarket/

The root `index.html` loader fetches the compressed game source files and starts the game. Use a modern browser with JavaScript enabled and an internet connection (the game loads Three.js from a CDN).

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
