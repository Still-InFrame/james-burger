# Night Window (concept)

A one-page site for Night Window, a fictional walk-up smash burger window that opens late. Plain HTML, CSS and JS, no build step. Designed with the Impeccable design skill.

Everything business-related is sample content: name, menu, prices, hours, address, phone. The site says so on the page.

## Preview

Open `index.html`, or serve this folder with any static server.

## Photos

The four photos (`assets/hero-lit.jpg`, `hero-shut.jpg`, `burger.jpg`, `handoff.jpg`) are generated concept images. If they're missing, run:

```sh
sh night-window/fetch-photos.sh
```

It downloads them and resizes them for the web (needs `curl` and `ffmpeg`).

## How the hero works

`script.js` checks the sample hours against the visitor's local time. When the window is open, the hero shows it lit; when it's closed, the shutter is down and a switch lets visitors "peek at 1 AM", which warms the scene up the way a sodium streetlamp does.

## Design notes

- `PRODUCT.md`: product facts for future design work.
- `.impeccable/surfaces/index-html.md`: the design direction for this page.
- Fonts are self-hosted in `fonts/` (Ultra, Yellowtail, Barlow, Barlow Condensed; all SIL Open Font License).
