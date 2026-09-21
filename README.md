# Wilder Mancera

Bilingual full stack portfolio. Spanish/English, procedural Three.js workstation, eight-object technology gallery, five-role experience timeline and globe, three expandable project contributions, contact intents and clipboard feedback. Original black/navy/cyan design. React + TypeScript + Vite (Sites/Vinext scaffold), GSAP and Three.js. Fonts are bundled locally.

## Development

Run `npm ci`, then `npm run dev`. Check `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`. Public static output is `dist/client`. No backend, database or server functions are required.

## Vercel deployment

Import this repository with its root directory unchanged. The committed `vercel.json` selects the Other framework preset, runs `npm ci` and `npm run build`, and publishes `dist/client`. This project uses Vinext static export; it must not use the Next.js preset or publish the repository root or `dist` directory. Pushes to the connected production branch trigger a new deployment. Sites can also publish the same static output through its existing manifest.

## Content

Edit `lib/content.ts` for bilingual copy and projects. Contact URLs are in `components/portfolio.tsx`; email intent encoding is in `lib/portfolio-state.ts`. Career dates and metrics in lib/experience.ts were supplied by Wilder. No years of experience or sole-authorship claims were invented. BM Cargo is explicitly a contribution to an existing project. Project cards use real screenshots of the public websites, stored in public/projects. These snapshots are updated manually when the websites change.

## Verification and limits

- State tests cover locale fallback, terminal pipeline transitions and encoded contact intent.
- Read-only independent review checked content, SSR, cleanup and accessibility. Its control-size and reduced-motion findings were addressed.
- Browser review covered the desktop scenes, ES/EN switching, project expansion, contact section and a narrow mobile viewport. Reduced-motion and WebGL fallback are implemented and source-reviewed; real-device coverage remains limited.
- Lint targets authored application files. Unused generated `components/ui` and `hooks` remain unchanged; the starter's full-tree lint reports findings in those templates.
- The pinned starter dependency audit reported 11 advisories (8 high, 2 moderate, 1 low), affecting build/dev/server dependencies. They are not shipped as server runtimes in this static deployment. No forced dependency upgrades were applied. Review/update the starter before exposing a development server or adding server functions.
- Three.js is lazy-loaded; its minified chunk exceeds the build's 500kB warning threshold. GPU resources are released on unmount; offscreen scenes skip rendering and reduced motion renders on demand.

## Sources

Profile, contributions, stack and contacts were supplied and approved by Wilder Mancera. Public project links: https://deltaforex.org/, https://www.techbrains.com.do/, https://inscripciontorneo.bmcargo.com/. GitHub link: https://github.com/YeinsM/YeinsM. Original visual reference informed the initial discussion; this design uses its own composition and interaction concept.

## Automatic project thumbnails

The `Refresh website thumbnails` GitHub Actions workflow runs daily at 10:23 UTC (06:23 in Santo Domingo; GitHub schedules may be delayed), manually via **Actions → Refresh website thumbnails → Run workflow**, and when its capture code changes on main. It uses pinned Playwright dependencies in `scripts/thumbnails`, visits the three public websites at 1280×800, checks expected page content and visible images, and saves PNG snapshots. It retains the last image on HTTP/loading/validation failures and reports a failed run if any capture fails. Differences below 0.5% of pixels are ignored; animated or time-sensitive page content can still produce daily changes.

Changed screenshots are committed to main with the existing project author and the GitHub Actions bot as committer. Vercel's connected Git integration deploys the new commit. No personal access token or external screenshot service is required. The schedule is approximate, not a guarantee of an update within 24 hours. Repository Actions must be enabled and permitted to write contents. Test preservation and comparison logic with `node --test scripts/thumbnails/update.test.mjs` after `npm ci --prefix scripts/thumbnails`.
