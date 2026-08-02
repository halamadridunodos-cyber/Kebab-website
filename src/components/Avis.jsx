import { useEffect, useRef } from 'react';
import { REVIEWS } from '../data';
import { useReveal } from '../hooks/useReveal';

export default function Avis() {
  const head = useReveal();
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    grid.querySelectorAll('.rev').forEach((el, i) => { el.style.transitionDelay = (i * 80) + 'ms'; io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <section className="section reviews" id="avis">
      <div className="wrap">
        <div className="sechead" ref={head}>
          <h2><span className="n">// 04.</span> <span className="rw"><i>Les</i></span> <span className="rw"><i>avis</i></span></h2>
          <div className="meta">Note Google vérifiée<br />Montréal-la-Cluse</div>
        </div>
        <div className="rv-hero rev" ref={useReveal()}>
          <div className="rv-score">4,8</div>
          <div className="rv-meta">
            <span className="stars">{[0, 1, 2, 3, 4].map((i) => <i key={i} className="on">★</i>)}</span>
            <p className="rv-count">27 avis sur Google</p>
            <p className="rv-open">7j/7 · 11h–14h &amp; 17h30–23h</p>
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
