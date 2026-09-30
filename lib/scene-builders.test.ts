import { afterEach, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { buildScene, type SceneKind } from './scene-builders';

afterEach(() => vi.unstubAllGlobals());

it.each<SceneKind>(['desk', 'globe', 'tech'])('%s completes repeated turns without moving its anchors', (kind) => {
  const context = new Proxy({}, { get: () => () => undefined });
  vi.stubGlobal('document', {
    createElement: () => ({ getContext: () => context }),
  });
  const model = buildScene(THREE, kind);
  model.resize(1000, 650);
  const root = model.scene.children[0];
  const targets = kind !== 'tech' ? [root] : root.children.filter((child) => child instanceof THREE.Group);
  expect(targets.length).toBeGreaterThan(0);
  const anchors = model.labelPositions();
  const start = targets.map((target) => target.rotation.y);
  targets.forEach((_, index) => model.rotate(index, 4 * Math.PI, 2 * Math.PI));
  targets.forEach((target, index) => {
    expect(target.rotation.y - start[index]).toBeGreaterThanOrEqual(2 * Math.PI);
  });
  expect(model.labelPositions()).toEqual(anchors);
  targets.forEach((_, index) => model.rotate(index, -4 * Math.PI, -2 * Math.PI));
  targets.forEach((target, index) => expect(target.rotation.y).toBeCloseTo(start[index]));
  model.dispose();
});
