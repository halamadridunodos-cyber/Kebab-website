import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PHOTOS } from '../assets';
import { usePrefersReducedMotion } from '../hooks/useEnv';

/** Accueil : une seule photo (pas de 3D), voile dégradé + titre révélé. */
export default function Hero({ started }) {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const reduce = usePrefersReducedMotion();

  // Parallaxe verticale légère (photo qui glisse un peu au scroll).
  useEffect(() => {
    if (reduce) return;
    let raf;
    const t0 = performance.now();
    const loop = () => {
      // Parallaxe verticale + très léger « Ken Burns » (respiration lente de l'image).
      const t = (performance.now() - t0) / 1000;
      const zoom = 1.1 + Math.sin(t * 0.12) * 0.03;
      if (bgRef.current) bgRef.current.style.transform = `translateY(${scrollY * 0.16}px) scale(${zoom})`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // Révélation du titre + CTA après le préchargement.
  useEffect(() => {
    if (!started) return;
    const words = heroRef.current.querySelectorAll('#heroTitle .rw');
    words.forEach((s, i) => setTimeout(() => s.classList.add('in'), 120 + i * 90));
    heroRef.current.querySelectorAll('.hero .rev').forEach((s, i) => setTimeout(() => s.classList.add('in'), 350 + i * 140));
  }, [started]);

  return (
    <header className="hero" ref={heroRef}>
      <div className="hero-bg hero-photo" ref={bgRef} style={{ backgroundImage: `url(${PHOTOS.hero})` }} />
      <div className="hero-veil" />
      <div className="hero-in">
        <span className="eyebrow rev">Montréal-la-Cluse · Restaurant turc</span>
        <h1 id="heroTitle">
          <span className="rw"><i>O'</i></span>
          <span className="rw"><i><em>BRESSE</em></i></span>
        </h1>
        <p className="sub rev">Broche maison 100 % veau, montée à la main couche par couche. Tranchée à la commande.</p>
        <div className="hero-badges rev">
          <span className="hbadge">100 % Veau</span>
          <span className="hbadge">Halal</span>
          <span className="hbadge">Broche maison</span>
          <span className="hbadge hbadge-star"><b>4,8</b> ★ · Google</span>
        </div>
        <div className="hero-cta rev">
          <motion.a href="#carte" className="btn primary" whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>Voir la carte</motion.a>
          <motion.a href="tel:+33651280674" className="btn" whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>06 51 28 06 74</motion.a>
        </div>
      </div>
      <div className="scrollcue"><span>Scroll</span><i /></div>
    </header>
  );
}
