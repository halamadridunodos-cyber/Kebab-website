import { useReveal } from '../hooks/useReveal';
import { PHOTOS } from '../assets';

/** Section 1 « Née du feu » : une seule photo de la broche (pas de 3D, pas de feu). */
export default function BrocheSection() {
  const head = useReveal();

  return (
    <section className="section story" id="broche">
      <div className="wrap">
        <div className="sechead" ref={head}>
          <h2><span className="n">// 01.</span> <span className="rw"><i>Née</i></span> <span className="rw"><i>du</i></span> <span className="rw"><i>feu</i></span></h2>
          <div className="meta">Broche maison · 100 % veau<br />Montée main · rôtie flamme</div>
        </div>
        <div className="story-grid">
          <div className="story-vis rev" ref={useReveal()}>
            <div className="ph" style={{ backgroundImage: `url(${PHOTOS.broche})` }} />
            <span className="story-tag">Rôtissoire · 100 % veau</span>
          </div>
          <div className="story-copy">
            <p className="big rev" ref={useReveal()}>Montée couche par couche.<br /><em>Rôtie devant la flamme.</em></p>
            <p className="rev" ref={useReveal()}>Chez O'Bresse, la broche est faite maison, 100 % veau. La viande est empilée à la main, couche après couche, autour de la broche. Puis elle rôtit progressivement devant la source de chaleur : l'extérieur se colore et caramélise, l'intérieur reste tendre. On tranche uniquement à la commande.</p>
            <div className="stats rev" style={{ gridTemplateColumns: 'repeat(3,1fr)' }} ref={useReveal()}>
              <div className="stat"><b>100%</b><span>Veau</span></div>
              <div className="stat"><b>Maison</b><span>Montée main</span></div>
              <div className="stat"><b>Halal</b><span>Certifié</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
