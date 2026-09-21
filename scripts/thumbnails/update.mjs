import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export async function updateThumbnail(file, capture) {
  // Capture and decode before touching the last known good image.
  const bytes = await capture();
  const next = PNG.sync.read(bytes);
  let previous;
  let previousBytes;
  try { previousBytes = await readFile(file); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (previousBytes) {
    try { previous = PNG.sync.read(previousBytes); }
    catch { /* A valid new PNG can replace an older capture in another format. */ }
  }
  if (previous?.width === next.width && previous?.height === next.height) {
    const changed = pixelmatch(previous.data, next.data, null, next.width, next.height, { threshold: 0.15 });
    // Ignore minor rasterization differences and tiny transient elements.
    if (changed / (next.width * next.height) < 0.005) return false;
  }
  await mkdir(dirname(file), { recursive: true });
  await writeFile(`${file}.tmp`, bytes);
  await rename(`${file}.tmp`, file);
  return true;
}
