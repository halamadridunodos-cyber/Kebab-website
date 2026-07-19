import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useEnv';

/** Compteur animé (ease-out) déclenché à l'entrée dans le viewport. */
export default function Counter({ to, dec = 0, suffix = '', className, onDone, tag: Tag = 'b' }) {
  const ref = useRef(null);
  const [txt, setTxt] = useState((0).toFixed(dec).replace('.', ','));
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        if (reduce) { setTxt(to.toFixed(dec).replace('.', ',') + suffix); onDone?.(); return; }
        const t0 = performance.now(), dur = 1150;
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / dur), e2 = 1 - Math.pow(1 - p, 3);
          setTxt((to * e2).toFixed(dec).replace('.', ',') + suffix);
          if (p < 1) requestAnimationFrame(tick); else onDone?.();
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, dec, suffix, reduce, onDone]);

  return <Tag ref={ref} className={className}>{txt}</Tag>;
}
