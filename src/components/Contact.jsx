import { useReveal } from '../hooks/useReveal';
import Socials from './Socials';

export default function Contact() {
  const head = useReveal();
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="sechead" ref={head}>
          <h2><span className="n">// 06.</span> <span className="rw"><i>Passez</i></span> <span className="rw"><i>nous</i></span> <span className="rw"><i>voir</i></span></h2>
          <div className="meta">Sur place · À emporter<br />Montréal-la-Cluse</div>
        </div>
        <div className="ct-grid">
          <div className="ct-map rev" ref={useReveal()}>
            <iframe
              title="Localisation O'Bresse"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Restaurant+O'Bresse,2+Av.+de+Bresse,01460+Montr%C3%A9al-la-Cluse&output=embed"
            />
          </div>
          <div className="ct-info rev" ref={useReveal()}>
            <div className="ct-name">O'<b>BRESSE</b></div>
            <p className="ct-base">Broche maison · 100 % veau</p>
            <dl>
              <div className="ct-row"><dt>Adresse</dt><dd>2 Av. de Bresse<br />01460 Montréal-la-Cluse</dd></div>
              <div className="ct-row"><dt>Horaires</dt><dd className="accent">7j/7 · 11h – 14h<br />&amp; 17h30 – 23h</dd></div>
              <div className="ct-row"><dt>Téléphone</dt><dd>+33 6 51 28 06 74</dd></div>
            </dl>
            <div className="ct-cta">
              <a href="tel:+33651280674" className="btn primary">Appeler</a>
              <a href="https://www.google.com/maps?q=Restaurant+O'Bresse,2+Av.+de+Bresse,01460+Montr%C3%A9al-la-Cluse" target="_blank" rel="noopener" className="btn">Itinéraire</a>
            </div>
            <Socials className="ct-socials" />
          </div>
        </div>
      </div>
    </section>
  );
}
