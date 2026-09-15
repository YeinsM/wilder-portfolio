'use client';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../lib/portfolio-state';
import { copy } from '../lib/content';

export default function HeroScene({ locale }: { locale: Locale }) {
  const holder = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(false);
  const invalidateRef = useRef<() => void>(() => {});
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const c = copy[locale];
  useEffect(() => {
    expandedRef.current = expanded;
    invalidateRef.current();
  }, [expanded]);
  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    let cancelled = false;
    let cleanup = () => {};
    import('three')
      .then((T) => {
        if (cancelled) return;
        let renderer: InstanceType<typeof T.WebGLRenderer>;
        try {
          renderer = new T.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'low-power',
          });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        element.appendChild(renderer.domElement);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(34, 1, 0.1, 60);
        camera.position.set(0, 0.2, 11);
        const group = new T.Group();
        scene.add(group);
        const glyphs = [
          [
            [-2.2, 1],
            [-1.85, 1],
            [-1.49, -0.42],
            [-1.1, 0.65],
            [-0.78, 0.65],
            [-0.4, -0.42],
            [-0.05, 1],
            [0.3, 1],
            [-0.23, -1],
            [-0.57, -1],
            [-0.95, 0.05],
            [-1.34, -1],
            [-1.68, -1],
          ],
          [
            [0.5, -1],
            [0.5, 1],
            [0.85, 1],
            [1.5, -0.04],
            [2.15, 1],
            [2.5, 1],
            [2.5, -1],
            [2.13, -1],
            [2.13, 0.31],
            [1.5, -0.65],
            [0.87, 0.31],
            [0.87, -1],
          ],
        ];
        const layers: InstanceType<typeof T.Group>[] = [];
        for (let layer = 0; layer < 3; layer++) {
          const assembly = new T.Group();
          glyphs.forEach((points) => {
            const shape = new T.Shape();
            points.forEach(([x, y], i) => {
              if (i === 0) shape.moveTo(x, y);
              else shape.lineTo(x, y);
            });
            shape.closePath();
            const geometry = new T.ExtrudeGeometry(shape, {
              depth: 0.12,
              bevelEnabled: true,
              bevelThickness: 0.03,
              bevelSize: 0.025,
              bevelSegments: 1,
              steps: 1,
            });
            const material = new T.MeshPhysicalMaterial({
              color: layer === 2 ? 0x183a52 : 0x0d2038,
              metalness: 0.7,
              roughness: 0.24,
              transparent: true,
              opacity: layer === 2 ? 0.95 : 0.45,
            });
            assembly.add(new T.Mesh(geometry, material));
            const edgeGeometry = new T.EdgesGeometry(geometry, 30);
            assembly.add(
              new T.LineSegments(
                edgeGeometry,
                new T.LineBasicMaterial({
                  color: layer === 2 ? 0x91f0ff : 0x2875a0,
                  transparent: true,
                  opacity: layer === 2 ? 0.95 : 0.55,
                }),
              ),
            );
          });
          assembly.position.z = (layer - 1) * 0.18;
          group.add(assembly);
          layers.push(assembly);
        }
        const ring = new T.LineLoop(
          new T.BufferGeometry().setFromPoints(
            Array.from(
              { length: 100 },
              (_, i) =>
                new T.Vector3(
                  Math.cos((i / 100) * Math.PI * 2) * 3.3,
                  Math.sin((i / 100) * Math.PI * 2) * 3.3,
                  0,
                ),
            ),
          ),
          new T.LineBasicMaterial({
            color: 0x345574,
            transparent: true,
            opacity: 0.5,
          }),
        );
        ring.rotation.x = 1.05;
        ring.position.y = -1.6;
        group.add(ring);
        scene.add(new T.AmbientLight(0x8ccce8, 2.6));
        const light = new T.PointLight(0x67e8f9, 65);
        light.position.set(2, 4, 5);
        scene.add(light);
        const back = new T.PointLight(0x2862ff, 25);
        back.position.set(-3, -1, 1);
        scene.add(back);
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        let reduced = media.matches,
          visible = true,
          frame = 0,
          last = 0,
          elapsed = 0;
        const pointer = { x: 0, y: 0 };
        const move = (event: PointerEvent) => {
          const box = element.getBoundingClientRect();
          pointer.x = (event.clientX - box.left) / box.width - 0.5;
          pointer.y = (event.clientY - box.top) / box.height - 0.5;
        };
        const leave = () => {
          pointer.x = 0;
          pointer.y = 0;
        };
        const resize = () => {
          const { width, height } = element.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          invalidateRef.current();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(element);
        resize();
        const visibility = new IntersectionObserver(
          (entries) => {
            visible = entries[0].isIntersecting;
            if (visible) invalidateRef.current();
          },
          { threshold: 0.05 },
        );
        visibility.observe(element);
        const preference = () => {
          reduced = media.matches;
          cancelAnimationFrame(frame);
          animate(performance.now());
        };
        media.addEventListener('change', preference);
        element.addEventListener('pointermove', move);
        element.addEventListener('pointerleave', leave);
        const contextLost = (event: Event) => {
          event.preventDefault();
          setReady(false);
          cancelAnimationFrame(frame);
        };
        renderer.domElement.addEventListener('webglcontextlost', contextLost);
        const animate = (time: number) => {
          if (!reduced) frame = requestAnimationFrame(animate);
          const delta = Math.min((time - last) / 1000, 0.05);
          last = time;
          if (!visible || document.hidden) return;
          if (!reduced) elapsed += delta;
          group.rotation.y = reduced
            ? -0.22
            : group.rotation.y +
              (-0.24 +
                pointer.x * 0.35 +
                Math.sin(elapsed * 0.24) * 0.08 -
                group.rotation.y) *
                0.055;
          group.rotation.x = reduced
            ? 0.13
            : group.rotation.x +
              (0.13 + pointer.y * 0.2 - group.rotation.x) * 0.055;
          group.rotation.z = -0.1;
          group.position.y = reduced ? 0 : Math.sin(elapsed * 0.6) * 0.08;
          layers.forEach((layer, i) => {
            const target = (i - 1) * (expandedRef.current ? 1.05 : 0.18);
            layer.position.z = reduced
              ? target
              : layer.position.z + (target - layer.position.z) * 0.065;
          });
          renderer.render(scene, camera);
        };
        invalidateRef.current = () => {
          if (reduced) animate(performance.now());
        };
        const documentVisibility = () => {
          if (!document.hidden) invalidateRef.current();
        };
        document.addEventListener('visibilitychange', documentVisibility);
        animate(performance.now());
        setReady(true);
        cleanup = () => {
          invalidateRef.current = () => {};
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          visibility.disconnect();
          document.removeEventListener('visibilitychange', documentVisibility);
          media.removeEventListener('change', preference);
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerleave', leave);
          renderer.domElement.removeEventListener(
            'webglcontextlost',
            contextLost,
          );
          scene.traverse((object) => {
            if (object instanceof T.Mesh || object instanceof T.Line) {
              object.geometry.dispose();
              const materials = Array.isArray(object.material)
                ? object.material
                : [object.material];
              materials.forEach((m) => m.dispose());
            }
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
  return (
    <div className={`hero-visual ${expanded ? 'is-expanded' : ''}`}>
      <div className="scene-corner top-left" />
      <div className="scene-corner bottom-right" />
      <span className="scene-index">WM / 001</span>
      <span className="scene-axis">
        Y ↑<br />Z ↗ X →
      </span>
      <div ref={holder} className={`scene-canvas ${ready ? 'ready' : ''}`} />
      {!ready && (
        <div
          className={`wm-fallback ${expanded ? 'separated' : ''}`}
          aria-hidden="true"
        >
          WM
        </div>
      )}
      <div className="scene-layer-labels" aria-hidden="true">
        <span>01 / UI</span>
        <span>02 / API</span>
        <span>03 / DATA</span>
      </div>
      <div className="scene-control">
        <button
          type="button"
          className="text-button"
          aria-pressed={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '−' : '+'} {expanded ? c.closeLayers : c.layers}
        </button>
        <p>{c.layerHint}</p>
      </div>
    </div>
  );
}
