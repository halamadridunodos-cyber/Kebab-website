import { useReveal } from '../hooks/useReveal';
import { PHOTOS } from '../assets';

/**
 * Galerie produits « éditoriale » : une photo par produit, titre + prix incrustés,
 * description révélée au survol. Les produits sans photo affichent un emplacement
 * de marque soigné (monogramme O'B) — jamais un placeholder « vide ».
 */
const PRODUITS = [
  { n: 'Kebab', p: '9€', tag: 'Signature', d: 'Broche maison 100 % veau, salade, tomates, oignons, sauce au choix.', img: PHOTOS.kebab, feature: true },
  { n: 'Tacos', p: '9,50€', tag: 'Gratiné', d: 'Viande, frites, sauce fromagère, le tout gratiné à la commande.', img: null },
  { n: 'Burger', p: '6€', tag: 'Maison', d: 'Pain toasté, steak, cheddar, sauce maison.', img: null },
  { n: 'Assiette', p: '14€', tag: 'Généreux', d: 'Viande, frites, salade — servie généreusement.', img: null },
  { n: 'Grillades', p: '16€', tag: 'Braise', d: 'Côtelettes, adana, iskender — grillées à la commande.', img: null },
];

function Card({ item }) {
  const ref = useReveal();
  return (
    <article className={`pcard rev${item.feature ? ' pcard-feature' : ''}`} ref={ref}>
      <div className="pcard-media">
        {item.img
          ? <div className="pcard-img" style={{ backgroundImage: `url(${item.img})` }} />
          : <div className="pcard-mono" aria-hidden="true"><span>O'B</span></div>}
        <span className="pcard-tag">{item.tag}</span>
        <div className="pcard-overlay">
          <div className="pcard-title">
            <h3>{item.n}</h3>
            <span className="pcard-price">{item.p}</span>
          </div>
          <p className="pcard-desc">{item.d}</p>
        </div>
      </div>
    </article>
  );
}

export default function Prepa() {
  const head = useReveal();
  return (
    <section className="section" id="prepa">
      <div className="wrap">
        <div className="sechead" ref={head}>
          <h2><span className="n">// 02.</span> <span className="rw"><i>En</i></span> <span className="rw"><i>images</i></span></h2>
          <div className="meta">Une photo · une envie<br />Nos produits signature</div>
        </div>
        <div className="pgrid">
          {PRODUITS.map((it) => <Card key={it.n} item={it} />)}
        </div>
      </div>
    </section>
  );
}
