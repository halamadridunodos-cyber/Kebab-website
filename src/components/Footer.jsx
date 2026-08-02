import Socials from './Socials';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="foot-logo">O'<b>BRESSE</b></div>
      <div className="foot-tag">Snack · Fast-food · Broche maison 100 % veau · Halal</div>
      <Socials className="foot-socials" />
      <div className="copy">2 Av. de Bresse, 01460 Montréal-la-Cluse · +33 6 51 28 06 74<br />7j/7 · 11h–14h &amp; 17h30–23h · © 2026 O'Bresse — Tous droits réservés</div>
    </footer>
  );
}
