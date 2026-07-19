import { useReveal } from '../hooks/useReveal';
import { PHOTOS } from '../assets';

/**
 * Section « En images » : une photo par produit (plus de montage 3D).
 * Les produits sans photo affichent un emplacement prêt à recevoir l'image.
 */
const PRODUITS = [
  { n: 'Kebab', p: 'Seul 9€ · Menu 12€', d: 'Broche maison 100 % veau, salade, tomates, oignons, sauce au choix.', img: PHOTOS.kebab },
  { n: 'Tacos', p: 'Seul 9,50€ · Menu 12,50€', d: 'Viande, frites, sauce fromagère, le tout gratiné.', img: null },
  { n: 'Burger', p: 'dès 6€', d: 'Pain toasté, steak, cheddar, sauce maison.', img: null },
  { n: 'Assiette', p: 'dès 14€', d: 'Viande, frites, salade — servie généreusement.', img: null },
];

function Card({ item }) {
  const ref = useReveal();
  return (
    <article className="pcard rev" ref={ref}>
      <div className="pcard-media">
        {item.img
          ? <div className="pcard-img" style={{ backgroundImage: `url(${item.img})` }} />
          : <div className="pcard-ph"><span>Photo à venir</span></div>}
      </div>
      <div className="pcard-body">
        <div className="pcard-head"><h3>{item.n}</h3><span className="pcard-price">{item.p}</span></div>
        <p>{item.d}</p>
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
