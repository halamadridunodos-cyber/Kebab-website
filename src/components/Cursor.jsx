import { useEffect, useRef } from 'react';

/** Curseur personnalisé (point + anneau qui suit avec inertie). Désactivé au tactile. */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (matchMedia('(hover:none)').matches) return;
    const c = dot.current, r = ring.current;
    let mx = 0, my = 0, rx = 0, ry = 0, raf;
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      c.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      r.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('mousemove', move);
    loop();
    const big = () => { c.classList.add('big'); r.classList.add('big'); };
    const small = () => { c.classList.remove('big'); r.classList.remove('big'); };
    const bind = () => document.querySelectorAll('a,button,.mcard,.rv-card,.cloud li').forEach((el) => {
      el.addEventListener('mouseenter', big); el.addEventListener('mouseleave', small);
    });
    const bt = setTimeout(bind, 300); // après rendu du contenu dynamique
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf); clearTimeout(bt); };
  }, []);

  return (
    <>
      <div className="cursor" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  );
}
