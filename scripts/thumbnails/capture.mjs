import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { appendFile } from 'node:fs/promises';
import { updateThumbnail } from './update.mjs';

const targets = [
  { id: 'delta', url: 'https://deltaforex.org/', expected: /Trading Profesional/i },
  { id: 'techbrains', url: 'https://www.techbrains.com.do/', expected: /Welcome to TechBrains|Bienvenido.*TechBrains/i },
  { id: 'cargo', url: 'https://inscripciontorneo.bmcargo.com/', expected: /Seleccione su opción|Select your option/i },
];
const browser = await chromium.launch();
const results = [];
try {
  for (const target of targets) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: 'es-DO', timezoneId: 'America/Santo_Domingo', reducedMotion: 'reduce', colorScheme: 'light' });
    try {
      const page = await context.newPage();
      const updated = await updateThumbnail(fileURLToPath(new URL(`../../public/projects/${target.id}.png`, import.meta.url)), async () => {
        const response = await page.goto(target.url, { waitUntil: 'load', timeout: 60000 });
        if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'unavailable'}`);
        await page.getByText(target.expected).first().waitFor({ state: 'visible', timeout: 20000 });
        await page.evaluate(async () => {
          await Promise.race([Promise.all([document.fonts.ready, ...Array.from(document.images).filter(image => {
            const rect = image.getBoundingClientRect();
            return rect.top < innerHeight && rect.bottom > 0;
          }).map(image => image.decode())]), new Promise((_, reject) => setTimeout(() => reject(new Error('Visible assets did not load')), 15000))]);
        });
        // Allow entrance transitions and client-rendered graphics to settle.
        await page.waitForTimeout(2500);
        return page.screenshot({ fullPage: false, animations: 'disabled', caret: 'hide', timeout: 20000 });
      });
      results.push(`${target.id}: ${updated ? 'updated' : 'unchanged'}`);
    } catch (error) {
      results.push(`${target.id}: kept previous image (capture failed)`);
      console.error(`Capture failed for ${target.id}: ${error.message}`);
      process.exitCode = 1;
    } finally { await context.close(); }
  }
} finally {
  await browser.close();
  console.log(results.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `## Website thumbnails\n\n${results.map(result => `- ${result}`).join('\n')}\n`);
}
