import { useEffect, useRef, useState } from 'react';
import { REVIEWS } from '../data';
import Counter from './Counter';
import { useReveal } from '../hooks/useReveal';

export default function Avis() {
  const head = useReveal();
  const gridRef = useRef(null);
  const [starsLit, setStarsLit] = useState(0);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    grid.querySelectorAll('.rev').forEach((el, i) => { el.style.transitionDelay = (i * 80) + 'ms'; io.observe(el); });
    return () => io.disconnect();
  }, []);

  // Allume les étoiles une par une après le compteur de note.
  const lightStars = () => [0, 1, 2, 3, 4].forEach((i) => setTimeout(() => setStarsLit(i + 1), i * 110));

  return (
    <section className="section reviews" id="avis">
      <div className="wrap">
        <div className="sechead" ref={head}>
          <h2><span className="n">// 04.</span> <span className="rw"><i>Les</i></span> <span className="rw"><i>avis</i></span></h2>
          <div className="meta">Note Google vérifiée<br />Montréal-la-Cluse</div>
        </div>
        <div className="rv-hero rev" ref={useReveal()}>
          <Counter tag="div" className="rv-score" to={4.8} dec={1} onDone={lightStars} />
          <div className="rv-meta">
            <span className="stars">{[0, 1, 2, 3, 4].map((i) => <i key={i} className={i < starsLit ? 'on' : ''}>★</i>)}</span>
            <p className="rv-count">27 avis sur Google</p>
            <p className="rv-open">Ouvert · Ferme à 23:00</p>
          </div>
          <a href="https://www.google.com/maps?q=Restaurant+O'Bresse,2+Av.+de+Bresse,01460+Montr%C3%A9al-la-Cluse" target="_blank" rel="noopener" className="btn">Voir sur Google</a>
        </div>
        <div className="rv-grid" ref={gridRef}>
          {REVIEWS.map((r, i) => (
            <article className="rv-card rev" key={i}>
              <div className="rv-top"><span className="stars">{'★★★★★'.split('').map((s, j) => <i key={j} className="on">{s}</i>)}</span><span className="rv-q">&rdquo;</span></div>
              <p className="rv-text">{r.t}</p>
              <footer className="rv-who">
                <span className="rv-av" style={{ background: r.c }}>{r.n[0].toUpperCase()}</span>
                <span className="rv-id"><b>{r.n}</b><small>{r.d}</small></span>
                <span className="rv-src">Google</span>
              </footer>
            </article>
          ))}
        </div>
        <p className="legal">Avis réels publiés sur la fiche Google d'O'Bresse. Aucun avis n'est inventé ni modifié.</p>
      </div>
    </section>
  );
}
