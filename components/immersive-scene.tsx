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
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const active = () => visible && !document.hidden && !disposed;
    const resume = () => {
      if (active() && draw && !frame) frame = requestAnimationFrame(draw);
    };
    const visibility = () => {
      if (active()) resume();
      else stop();
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
        canvas.style.cssText = 'display:block;width:100%;height:100%;cursor:grab;touch-action:pan-y;';
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
        let pointer: number | null = null;
        let selected = -1;
        let lastX = 0;
        let lastY = 0;
        const down = (event: PointerEvent) => {
          if (event.button !== 0 || pointer !== null || contextFailed) return;
          const bounds = canvas.getBoundingClientRect();
          selected = localScene.pick(
            ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            1 - ((event.clientY - bounds.top) / bounds.height) * 2,
          );
          if (selected < 0) return;
          pointer = event.pointerId;
          lastX = event.clientX;
          lastY = event.clientY;
          canvas.setPointerCapture(pointer);
          canvas.style.cursor = 'grabbing';
        };
        const move = (event: PointerEvent) => {
          if (event.pointerId !== pointer) return;
          const scale = (Math.PI * 2) / Math.max(canvas.clientWidth, 300);
          localScene.rotate(selected, (event.clientX - lastX) * scale,
            (event.clientY - lastY) * scale);
          lastX = event.clientX;
          lastY = event.clientY;
          resume();
        };
        const release = (event: PointerEvent) => {
          if (event.pointerId !== pointer) return;
          pointer = null;
          selected = -1;
          canvas.style.cursor = 'grab';
          if (canvas.hasPointerCapture(event.pointerId))
            canvas.releasePointerCapture(event.pointerId);
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
          localRenderer.render(localScene.scene, localScene.camera);
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(element);
        canvas.addEventListener('pointerdown', down);
        canvas.addEventListener('pointermove', move);
        canvas.addEventListener('pointerup', release);
        canvas.addEventListener('pointercancel', release);
        canvas.addEventListener('lostpointercapture', release);
        canvas.addEventListener('webglcontextlost', contextLost);
        teardown = () => {
          resizeObserver.disconnect();
          canvas.removeEventListener('pointerdown', down);
          canvas.removeEventListener('pointermove', move);
          canvas.removeEventListener('pointerup', release);
          canvas.removeEventListener('pointercancel', release);
          canvas.removeEventListener('lostpointercapture', release);
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
    return () => {
      disposed = true;
      stop();
      preload.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
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
      title={locale === 'es' ? 'Haz clic y arrastra para girar' : 'Click and drag to rotate'}
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
