# Wilder Mancera

Bilingual full stack portfolio. Spanish/English, interactive Three.js WM monogram, selectable technology layers, three expandable project contributions, contact intents and clipboard feedback. Original black/navy/cyan design. React + TypeScript + Vite (Sites/Vinext scaffold), GSAP and Three.js. Fonts are bundled locally.

## Development

Run `npm ci`, then `npm run dev`. Check `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`. Public static output is `dist/client`. No backend, database or server functions are required.

## Vercel deployment

Import this repository with its root directory unchanged. The committed `vercel.json` selects the Other framework preset, runs `npm ci` and `npm run build`, and publishes `dist/client`. This project uses Vinext static export; it must not use the Next.js preset or publish the repository root or `dist` directory. Pushes to the connected production branch trigger a new deployment. Sites can also publish the same static output through its existing manifest.

## Content

Edit `lib/content.ts` for bilingual copy and projects. Contact URLs are in `components/portfolio.tsx`; email intent encoding is in `lib/portfolio-state.ts`. No metrics, years of experience or sole-authorship claims were invented. BM Cargo is explicitly a contribution to an existing project. Project visuals are labeled conceptual summaries, not screenshots of production systems.

## Verification and limits

- State tests cover locale fallback, terminal pipeline transitions and encoded contact intent.
- Read-only independent review checked content, SSR, cleanup and accessibility. Its control-size and reduced-motion findings were addressed.
- Browser interaction/visual QA has not been performed. Mobile and reduced-motion behavior are implemented but require device validation before a public launch.
- Lint targets authored application files. Unused generated `components/ui` and `hooks` remain unchanged; the starter's full-tree lint reports findings in those templates.
- The pinned starter dependency audit reported 11 advisories (8 high, 2 moderate, 1 low), affecting build/dev/server dependencies. They are not shipped as server runtimes in this static deployment. No forced dependency upgrades were applied. Review/update the starter before exposing a development server or adding server functions.
- Three.js is lazy-loaded; its minified chunk exceeds the build's 500kB warning threshold. GPU resources are released on unmount; offscreen scenes skip rendering and reduced motion renders on demand.

## Sources

Profile, contributions, stack and contacts were supplied and approved by Wilder Mancera. Public project links: https://deltaforex.org/, https://www.techbrains.com.do/, https://inscripciontorneo.bmcargo.com/. GitHub link: https://github.com/YeinsM/YeinsM. Original visual reference informed the initial discussion; this design uses its own composition and interaction concept.
