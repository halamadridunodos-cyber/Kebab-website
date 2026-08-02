import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';

/**
 * Enveloppe un Canvas R3F :
 * - montage paresseux (le WebGL ne démarre qu'à l'approche du viewport),
 * - boucle de rendu suspendue quand la scène sort de l'écran (économie GPU/batterie).
 */
export default function SceneCanvas({
  children,
  className = '',
  dpr = [1, 2],
  camera,
  gl,
  rootMargin = '200px',
  eventSource,
  onCreated,
  ...rest
}) {
  const wrap = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting);
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    // Suspend aussi quand l'onglet passe en arrière-plan.
    const onVis = () => setActive((a) => (document.hidden ? false : a));
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [rootMargin]);

  return (
    <div ref={wrap} className={className} style={{ width: '100%', height: '100%' }}>
      {mounted && (
        <Canvas
          frameloop={active ? 'always' : 'never'}
          dpr={dpr}
          camera={camera}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: true, ...gl }}
          onCreated={onCreated}
          {...rest}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
