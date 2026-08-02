import Counter from './Counter';
import { useReveal } from '../hooks/useReveal';

export default function Stats() {
  return (
    <section className="section" style={{ paddingTop: 'clamp(50px,7vh,80px)' }}>
      <div className="wrap">
        <div className="stats rev" ref={useReveal()}>
          <div className="stat"><Counter to={4.8} dec={1} /><span>Note Google</span></div>
          <div className="stat"><Counter to={27} /><span>Avis clients</span></div>
          <div className="stat"><Counter to={56} /><span>Produits à la carte</span></div>
          <div className="stat"><Counter to={100} suffix="%" /><span>Veau · Broche maison</span></div>
        </div>
      </div>
    </section>
  );
}
