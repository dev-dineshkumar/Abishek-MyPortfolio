# Abishek S – Founder & CEO, AMDV Solutions – Portfolio

React + Vite portfolio. All content lives in `src/data/portfolio.js` and comes only from the supplied AMDV Solutions brand material (portrait, logo, emblem, flyer).

```powershell
npm install
npm run dev      # http://localhost:5174
npm run build    # production build in /dist
```

- **Images:** `public/abishek.webp` (portrait), `public/amdv-logo.webp`, `public/amdv-emblem.webp`. Replace the files to change them.
- **Email / address / social links:** not in the supplied material, so they are not shown. Set `profile.email` in `src/data/portfolio.js` to show the email card and enable the contact form (it opens the visitor's email app, pre-filled).
- Respects `prefers-reduced-motion`; particle background, tilt and cursor glow are reduced/disabled on touch devices.
- This project is fully independent of `../Dinesh_Kumar` (own dependencies, assets, config and port).

## Motion & structure
- `src/components/ScrollFX.jsx` is the scroll-reactive depth layer (perspective grid floor, wireframe shapes, light pools, data streams). It is transform-only, eased, thinned out on touch/small screens and shown as a single static frame under `prefers-reduced-motion`.
- `src/components/Marquee.jsx` is the seamless right-to-left ticker (pixel-constant speed, copies sized to cover any viewport; stops and becomes hand-scrollable under reduced motion).
- Section order is set in `src/App.jsx`; nav links in `navLinks` in `src/data/portfolio.js`.

- Background: `src/components/FounderBackground.jsx` is the Founder & CEO backdrop (gradient mesh, light beam and two rails of glass leadership emblems). The hero scene in `src/lib/codeScene.js` shows Innovate → Develop → Deliver. The "What We Deliver" tickers move left to right and pause / resume on click. `src/components/FlowBackdrop.jsx` is a page-length layer (document space) of breathing violet / teal fields and floating 3D leadership shapes, so the background scrolls with the page with per-depth parallax, and keeps following scroll under reduced motion. Theme: ink violet + teal / mint (change it in the `:root` block of `site.css`). On phones (<768px) the hero banner is portrait: `Hero.jsx` sizes it to the copy block plus the scene, and `createCodeScene(..., { mobile: true })` re-places the same artwork under the copy, so the glass tiles, text and scene stay together like the laptop layout.

Solutions section: `src/components/Projects.jsx` has two presentations of the same cards. Tablets and desktops get the pinned 3D rail that settles into a grid; phones (the `FLOW_QUERY` media query) get full-size cards in the normal page flow, each swinging in as it scrolls into view. Card styles are the `.p-card` and `.p-flow` rules in `src/styles/site.css`.
