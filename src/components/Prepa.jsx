import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SceneCanvas from '../three/SceneCanvas';
import SandwichScene from '../three/SandwichScene';
import { BUILD_STEPS } from '../data';
import { useReveal } from '../hooks/useReveal';
import { usePrefersReducedMotion, useQualityTier, useIsMobile } from '../hooks/useEnv';

export default function Prepa() {
  const sectionRef = useRef(null);
  const builderRef = useRef(null);
  const progRef = useRef(null);
  const scrollRef = useRef(0);
  const [step, setStep] = useState(0);
  const head = useReveal();
  const reduce = usePrefersReducedMotion();
  const quality = useQualityTier();
  const isMobile = useIsMobile();
  const pr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  const applyProgress = (p) => {
    scrollRef.current = p;
    if (progRef.current) progRef.current.style.width = p * 100 + '%';
    const s = Math.max(0, Math.min(BUILD_STEPS.length - 1, Math.floor(p * BUILD_STEPS.length - 1e-4)));
    setStep((prev) => (prev === s ? prev : s));
  };

  useEffect(() => {
    if (reduce) { applyProgress(1); return; }

    if (isMobile) {
      // Mobile : lecture auto à l'entrée (pas d'épinglage coûteux).
      const proxy = { v: 0 };
      let tween;
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !tween) {
            tween = gsap.to(proxy, { v: 1, duration: 6, ease: 'none', onUpdate: () => applyProgress(proxy.v) });
          }
        });
      }, { threshold: 0.4 });
      io.observe(sectionRef.current);
      return () => { io.disconnect(); tween?.kill(); };
    }

    // Desktop : builder épinglé, montage scrubé par le scroll.
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=220%',
      pin: builderRef.current,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => applyProgress(self.progress),
    });
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 400); // après chargement des polices/canvas
    return () => { st.kill(); clearTimeout(t); };
  }, [reduce, isMobile]);

  return (
    <section className="section prepa-track" id="prepa" ref={sectionRef}>
      <div className="wrap">
        <div className="sechead" ref={head}>
          <h2><span className="n">// 02.</span> <span className="rw"><i>La</i></span> <span className="rw"><i>préparation</i></span></h2>
          <div className="meta">Le kebab se monte<br />sous vos yeux</div>
        </div>
        <div className="builder" ref={builderRef}>
          <div className="bd-left">
            <div className="bd-num">01 / 01 — Sandwich kebab</div>
            <h3 className="bd-title">Kebab</h3>
            <div className="bd-price">Seul 9€ · Menu 12€</div>
            <ul className="seq">
              {BUILD_STEPS.map((s, i) => (
                <li key={s.key} className={i <= step ? 'on' : ''}>
                  <span className="dot" />{s.label}
                </li>
              ))}
            </ul>
            <a href="tel:+33651280674" className="btn primary">Commander</a>
          </div>
          <div className="bd-stage">
            <SceneCanvas
              className="r3f-layer"
              dpr={[1, quality === 'low' ? 1.5 : 2]}
              camera={{ position: [0, 1, 5.4], fov: 42 }}
              gl={{ alpha: true }}
              shadows
            >
              <SandwichScene quality={quality} reduce={reduce} scrollRef={scrollRef} />
            </SceneCanvas>
            <div className="bd-hud">
              <span className="big">{String(step + 1).padStart(2, '0')}</span>
              <span className="step">{step + 1}/{BUILD_STEPS.length} · {BUILD_STEPS[step].label} — {BUILD_STEPS[step].hint}</span>
            </div>
            <div className="bd-prog" ref={progRef} style={{ width: 0 }} />
          </div>
        </div>
      </div>
    </section>
  );
}
