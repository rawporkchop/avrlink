# AVR Link site (React)

Vite + React + React Router. Same look and behaviour as the original static site.

## Commands
    npm install        # once
    npm run dev        # local dev server with hot reload
    npm run build      # outputs the finished site to docs/

## Where things live
    src/
      main.jsx, App.jsx        entry point + routes (/, /support, /privacy)
      pages/                   one file per page
      components/              one file per section of the home page
      hooks/                   reusable logic (hero animation, CSV loading, ...)
      styles/home.css          dark home page styles
      styles/doc.css           light Support/Privacy styles
      assets/                  images + video (bundled/hashed by Vite)
    public/                    copied as-is: icon.png, compatibility.csv, web_preview.html,
                               support.html, privacy.html (redirect stubs to /support, /privacy)

## Common edits
- Add a receiver: edit `public/compatibility.csv` (no code change).
- Change page text: edit the matching file in `src/components/` or `src/pages/`.

## Hosting
`npm run build` writes to `docs/` (GitHub Pages folder) and wipes it first.
support.html and privacy.html live in public/ (redirect to /support and /privacy),
and a copy of index.html is written as 404.html so deep links keep working.
If the site lives at user.github.io/AVR-Link/ (not a custom domain), build with:
    VITE_BASE=/AVR-Link/ npm run build
