import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SceneCanvas from '../three/SceneCanvas';
import HeroScene from '../three/HeroScene';
import { usePrefersReducedMotion, useQualityTier } from '../hooks/useEnv';
import { BROCHE } from '../img';

export default function Hero({ started }) {
  const heroRef = useRef(null);
  const scrollRef = useRef(0);
  const reduce = usePrefersReducedMotion();
  const quality = useQualityTier();
  const pr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  // Scroll → progression 0..1 sur le hero (pilote le recul caméra).
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => { scrollRef.current = self.progress; },
    });
    return () => st.kill();
  }, []);

  // Révélation du titre + CTA à la fin du préchargement.
  useEffect(() => {
    if (!started) return;
    const words = heroRef.current.querySelectorAll('#heroTitle .rw');
    words.forEach((s, i) => setTimeout(() => s.classList.add('in'), 120 + i * 90));
    heroRef.current.querySelectorAll('.hero .rev').forEach((s, i) => setTimeout(() => s.classList.add('in'), 350 + i * 140));
  }, [started]);

  return (
    <header className="hero" ref={heroRef}>
      <div className="hero-bg" style={{ backgroundImage: `url(${BROCHE})` }} />
      <SceneCanvas
        className="hero-3d"
        dpr={[1, quality === 'low' ? 1.5 : 2]}
        camera={{ position: [0, 0.35, 7.2], fov: 34 }}
        rootMargin="300px"
      >
        <HeroScene quality={quality} reduce={reduce} scrollRef={scrollRef} pixelRatio={pr} />
      </SceneCanvas>
      <div className="hero-veil" />
      <div className="hero-in">
        <span className="eyebrow rev">Montréal-la-Cluse · Restaurant turc</span>
        <h1 id="heroTitle">
          <span className="rw"><i>O'</i></span>
          <span className="rw"><i><em>BRESSE</em></i></span>
        </h1>
        <p className="sub rev">Broche maison 100 % veau, montée à la main couche par couche. Tranchée à la commande.</p>
        <div className="hero-cta rev">
          <a href="#carte" className="btn primary">Voir la carte</a>
          <a href="tel:+33651280674" className="btn">06 51 28 06 74</a>
        </div>
      </div>
      <div className="scrollcue"><span>Scroll</span><i /></div>
    </header>
  );
}
