# TARUMT Bus Schedule Finder

A fast, mobile-friendly web app for checking TARUMT (TAR UC / TARC) shuttle bus schedules for the Setapak, Kuala Lumpur campus.

Live: search by route, direction, and time period to instantly see bus timings — no more digging through PDFs.

> **Disclaimer:** This is not an official TARUMT website; schedules and routes may be inaccurate.

## Features

- **Route selection** — Wangsa Maju, Melati Utama, PV18 / Teratai Residency / GK, PV10/12/13/15/16
- **Direction toggle** — to campus / from campus, each with its own stop list
- **Period selection** — find schedules for the relevant time block
- **Interactive map** — view the route on a map (`MapModal`)
- **Animated UI** — scroll-driven bus animation and gradient background

## Tech Stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [react-leaflet](https://react-leaflet.js.org/) / [Leaflet](https://leafletjs.com/) for the route map
- [Oxlint](https://oxc.rs/) for linting
- [Playwright](https://playwright.dev/) for browser tests
- Deployed to GitHub Pages via `gh-pages`

## Project Structure

```
src/
├── App.jsx                  # Main app shell & scroll animation logic
├── components/
│   ├── RouteSelect.jsx
│   ├── DirectionSelect.jsx
│   ├── PeriodSelect.jsx
│   ├── ScheduleResults.jsx
│   └── MapModal.jsx
├── data/
│   ├── routes.js             # Route definitions & stop lists
│   ├── periods.js            # Time period definitions
│   ├── schedules.js          # Actual bus timings
│   └── locations.js
└── styles/
```

## Getting Started

```bash
npm install
npm run dev       # start dev server
npm run build      # production build
npm run preview     # preview the production build
npm run lint       # run Oxlint
npm run deploy      # build & deploy to GitHub Pages
```

## Contact

Designed by Joshua Lau. Report issues or suggestions to **joshuahaojie@gmail.com**.
