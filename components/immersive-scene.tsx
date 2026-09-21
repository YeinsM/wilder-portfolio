'use client';

import { useEffect, useRef, useState } from 'react';
import { technologyNames, type SceneKind } from '../lib/scene-builders';

export default function ImmersiveScene({
  kind,
  locale,
}: {
  kind: SceneKind;
  locale: 'es' | 'en';
}) {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>(
    'loading',
  );
  const label =
    kind === 'desk'
      ? locale === 'es'
        ? 'Estación de desarrollo 3D con código, monitor y computador'
        : '3D development workstation with code, monitor and computer'
      : kind === 'globe'
        ? locale === 'es'
          ? 'Globo terrestre 3D: conectando ideas alrededor del mundo'
          : '3D globe: connecting ideas around the world'
        : locale === 'es'
          ? 'Tecnologías que uso para construir'
          : 'Technologies I build with';

  useEffect(() => {
    if (!host.current) return;
    const element: HTMLDivElement = host.current;
    let disposed = false;
    let started = false;
    let visible = false;
    let frame = 0;
    let teardown: (() => void) | undefined;
    let draw: (() => void) | undefined;
    setStatus('loading');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    let px = 0;
    let py = 0;
    let elapsed = 0;
    let lastTime = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    const active = () => visible && !document.hidden && !disposed;
    const resume = () => {
      if (active() && draw && !frame) frame = requestAnimationFrame(draw);
    };
    const visibility = () => {
      if (active()) resume();
      else stop();
    };
    const preference = () => {
      stop();
      resume();
    };
    async function initialize() {
      if (started || disposed) return;
      started = true;
      let renderer: import('three').WebGLRenderer | undefined;
      let built:
        | ReturnType<(typeof import('../lib/scene-builders'))['buildScene']>
        | undefined;
      try {
        const [T, builders] = await Promise.all([
          import('three'),
          import('../lib/scene-builders'),
        ]);
        if (disposed) return;
        renderer = new T.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setClearColor(0x05070d, 0);
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        built = builders.buildScene(T, kind);
        const canvas = renderer.domElement;
        canvas.style.cssText = 'display:block;width:100%;height:100%;';
        canvas.setAttribute('aria-hidden', 'true');
        element.insertBefore(canvas, element.firstChild);
        const localRenderer = renderer;
        const localScene = built;
        let contextFailed = false;
        const resize = () => {
          const { width, height } = element.getBoundingClientRect();
          if (width < 1 || height < 1 || disposed || contextFailed) return;
          localRenderer.setSize(width, height, false);
          localScene.resize(width, height);
          const labels = element.querySelectorAll<HTMLLIElement>(
            '.scene-tech-labels li',
          );
          localScene.labelPositions().forEach((position, index) => {
            const labelElement = labels[index];
            if (labelElement)
              Object.assign(labelElement.style, {
                position: 'absolute',
                left: `${position.left}%`,
                top: `${position.top}%`,
                transform: 'translate(-50%, -50%)',
                whiteSpace: 'normal',
                textAlign: 'center',
                width: '110px',
              });
          });
          resume();
        };
        const move = (event: PointerEvent) => {
          if (!finePointer.matches || motion.matches) return;
          const bounds = element.getBoundingClientRect();
          px = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
          py = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
          resume();
        };
        const leave = () => {
          px = 0;
          py = 0;
          resume();
        };
        const contextLost = (event: Event) => {
          event.preventDefault();
          contextFailed = true;
          stop();
          draw = undefined;
          element
            .querySelectorAll<HTMLLIElement>('.scene-tech-labels li')
            .forEach((item) => item.removeAttribute('style'));
          if (!disposed) setStatus('fallback');
        };
        draw = () => {
          frame = 0;
          if (!active()) return;
          const now = performance.now();
          if (!motion.matches && lastTime)
            elapsed += Math.min((now - lastTime) / 1000, 0.05);
          lastTime = now;
          localScene.update(
            motion.matches ? 0 : elapsed,
            motion.matches ? 0 : px,
            motion.matches ? 0 : py,
          );
          localRenderer.render(localScene.scene, localScene.camera);
          if (!motion.matches) frame = requestAnimationFrame(draw!);
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(element);
        element.addEventListener('pointermove', move);
        element.addEventListener('pointerleave', leave);
        canvas.addEventListener('webglcontextlost', contextLost);
        teardown = () => {
          resizeObserver.disconnect();
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerleave', leave);
          canvas.removeEventListener('webglcontextlost', contextLost);
          localScene.dispose();
          localRenderer.dispose();
          canvas.remove();
        };
        resize();
        setStatus('ready');
        resume();
      } catch {
        built?.dispose();
        renderer?.dispose();
        renderer?.domElement.remove();
        if (!disposed) setStatus('fallback');
      }
    }
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void initialize();
          preload.disconnect();
        }
      },
      { rootMargin: '120px' },
    );
    preload.observe(element);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        void initialize();
        resume();
      } else stop();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', preference);
    return () => {
      disposed = true;
      stop();
      preload.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', preference);
      teardown?.();
    };
  }, [kind]);

  return (
    <div
      ref={host}
      className={`immersive-scene scene-${kind}`}
      data-scene-status={status}
      role={kind === 'tech' ? 'group' : 'img'}
      aria-label={label}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {status !== 'ready' && (
        <div
          className="scene-fallback"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeContent: 'center',
            textAlign: 'center',
            color: '#8da6b8',
            padding: 24,
            pointerEvents: 'none',
          }}
        >
          <span aria-hidden="true" style={{ color: '#67e8f9', fontSize: 42 }}>
            {kind === 'desk' ? '⌘' : kind === 'globe' ? '◎' : '◇'}
          </span>
          <span>
            {status === 'loading'
              ? locale === 'es'
                ? 'Preparando la escena…'
                : 'Preparing the scene…'
              : label}
          </span>
        </div>
      )}
      {kind === 'tech' && (
        <ul
          className="scene-tech-labels"
          aria-label={locale === 'es' ? 'Tecnologías' : 'Technologies'}
        >
          {technologyNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
