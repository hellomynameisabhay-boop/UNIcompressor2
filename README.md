# UNIcompresser Website

A highly-animated, premium landing page for the UNIcompresser macOS app.

## Getting started

- Open `index.html` in your browser. No build step required.
- Update the DMG download link in two places:
  - `index.html` → `#downloadBtn` and `#downloadBtn2` `href` attributes.
  - Optionally place your file at `/downloads/UNIcompresser.dmg` in your hosting.

## Customize

- Branding: Update the inline SVG logo in the header (inside `index.html`).
- Colors & theme: Edit CSS variables at the top of `styles.css`.
- Animations: Particle background and reveals live in `script.js`.

## Deploy

Any static host works (GitHub Pages, Vercel, Netlify, Cloudflare). Upload the repo and set the root to this folder. If your DMG is large, host it behind a CDN and point the Download buttons to that URL.

## Notes

- The particle canvas is efficient: capped particle count and uses `requestAnimationFrame`.
- All animations are CSS/WAAPI, no external libraries required.


