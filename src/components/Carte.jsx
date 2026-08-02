import { useEffect, useRef, useState } from 'react';
import { MENU, SAUCES, SUPP, GRAT } from '../data';
import { useReveal } from '../hooks/useReveal';

const GROUPS = [
  { k: 'all', l: 'Tout' }, { k: 'plats', l: 'Sandwichs & Plats' }, { k: 'grill', l: 'Grillades' },
  { k: 'box', l: 'Box & Wings' }, { k: 'autres', l: 'Tasty & Enfant' }, { k: 'drinks', l: 'Boissons' }, { k: 'sauces', l: 'Sauces' },
];

function Rows({ items }) {
  return items.map((it, i) => (
    <div className="mrow" key={i}>
      <span className="nm">{it.n}{it.note && <small>{it.note}</small>}</span>
      <span className="dots" />
      {it.p.length === 2
        ? <><span className="pr">{it.p[0]}</span><span className="pr">{it.p[1]}</span></>
        : <span className="pr single">{it.p[0]}</span>}
    </div>
  ));
}

function Card({ c }) {
  return (
    <div className="mcard rev">
      <div className="mc-head">
        <h3>{c.cat}</h3>
        {c.cols.length > 0 && <div className="mc-cols">{c.cols.map((x, i) => <span key={i}>{x}</span>)}</div>}
      </div>
      <div className="mc-body">
        <Rows items={c.items} />
        {(c.notes || []).map((n, i) => <div className="mnote" key={i}>{n}</div>)}
      </div>
    </div>
  );
}

const SuppCard = () => (
  <div className="mcard wide rev">
    <div className="mc-head"><h3>Suppléments</h3></div>
    <div className="mc-body supp-grid">
      <div><div className="supp-price">Supp Viande <b>+1€</b></div><p className="supp-list">{SUPP.join(' · ')}</p></div>
      <div><div className="supp-price">Gratiné <b>+1,50€</b></div><p className="supp-list">{GRAT.join(' · ')}</p></div>
    </div>
  </div>
);

const SaucesCard = () => (
  <div className="mcard wide rev">
    <div className="mc-head"><h3>Nos Sauces</h3><div className="mc-cols"><span>{SAUCES.length} sauces</span></div></div>
    <div className="mc-body"><ul className="cloud">{SAUCES.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
  </div>
);

export default function Carte() {
  const [k, setK] = useState('all');
  const gridRef = useRef(null);
  const head = useReveal();

  // Révélation des cartes après chaque changement de filtre.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    grid.querySelectorAll('.rev:not(.in)').forEach((el, i) => { el.style.transitionDelay = (i * 45) + 'ms'; io.observe(el); });
    return () => io.disconnect();
  }, [k]);

  let content;
  if (k === 'sauces') content = <SaucesCard />;
  else {
    const list = k === 'all' ? MENU : MENU.filter((c) => c.g === k);
    content = (
      <>
        {list.map((c) => <Card key={c.id} c={c} />)}
        {(k === 'all' || k === 'autres') && <SuppCard />}
        {k === 'all' && <SaucesCard />}
      </>
    );
  }

  return (
    <section className="section" id="carte" style={{ background: 'linear-gradient(180deg,var(--char),var(--ink) 60%)' }}>
      <div className="wrap">
        <div className="sechead" ref={head}>
          <h2><span className="n">// 03.</span> <span className="rw"><i>La</i></span> <span className="rw"><i>carte</i></span></h2>
          <div className="meta">14 catégories · 56 produits<br />Sur place ou à emporter</div>
        </div>
        <div className="filters">
          {GROUPS.map((g) => (
            <button key={g.k} className={`filter${k === g.k ? ' on' : ''}`} onClick={() => setK(g.k)}>{g.l}</button>
          ))}
        </div>
        <div className="mgrid" ref={gridRef} key={k}>{content}</div>
        <p className="legal">Prix d'après la carte officielle O'Bresse. Sous réserve de modification en magasin.</p>
      </div>
    </section>
  );
}
