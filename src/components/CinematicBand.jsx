import { useEffect, useRef } from 'react';
import { PHOTOS } from '../assets';
import { usePrefersReducedMotion } from '../hooks/useEnv';

/** Bande cinématique pleine largeur : photo en parallaxe + citation éditoriale. */
export default function CinematicBand() {
  const ref = useRef(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    const img = el.querySelector('.band-img');
    let raf;
    const loop = () => {
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // ~ -1..1
      if (img) img.style.transform = `translateY(${p * -46}px) scale(1.14)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <section className="band" ref={ref} aria-label="La maison O'Bresse">
      <div className="band-img" style={{ backgroundImage: `url(${PHOTOS.band})` }} />
      <div className="band-veil" />
      <div className="band-in">
        <span className="band-eyebrow">La maison</span>
        <p className="band-quote">On ne triche pas avec le goût. La broche est montée <em>à la main</em>, rôtie à la flamme, tranchée <em>à la minute</em>.</p>
        <span className="band-sign">— O'Bresse · Montréal-la-Cluse</span>
      </div>
    </section>
  );
}
