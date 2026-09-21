import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import { updateThumbnail } from './update.mjs';

function picture(value) {
  const png = new PNG({ width: 20, height: 20 });
  for (let i = 0; i < png.data.length; i += 4) { png.data[i] = value; png.data[i + 1] = value; png.data[i + 2] = value; png.data[i + 3] = 255; }
  return PNG.sync.write(png);
}
test('preserves last valid image when capture fails or returns invalid bytes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'wm-thumbnails-'));
  try {
    const file = join(dir, 'preview.png'); const original = picture(0);
    await writeFile(file, original);
    for (const capture of [async () => { throw new Error('HTTP 503'); }, async () => Buffer.from('invalid')]) {
      await assert.rejects(updateThumbnail(file, capture));
      assert.deepEqual(await readFile(file), original);
    }
  } finally { await rm(dir, { recursive: true }); }
});
test('skips identical captures and saves meaningful changes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'wm-thumbnails-'));
  try {
    const file = join(dir, 'preview.png');
    assert.equal(await updateThumbnail(file, async () => picture(0)), true);
    assert.equal(await updateThumbnail(file, async () => picture(0)), false);
    assert.equal(await updateThumbnail(file, async () => picture(255)), true);
    assert.deepEqual(await readFile(file), picture(255));
  } finally { await rm(dir, { recursive: true }); }
});
