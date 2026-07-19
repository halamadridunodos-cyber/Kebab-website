import { usePrefersReducedMotion } from '../hooks/useEnv';

export default function Nav() {
  const reduce = usePrefersReducedMotion();
  const go = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <nav className="nav">
      <div className="brand">
        <span className="lg">O'<b>BRESSE</b></span>
        <span className="tg">Broche maison · 100% veau</span>
      </div>
      <div className="nav-links">
        <a href="#broche" onClick={(e) => go(e, '#broche')}>La broche</a>
        <a href="#prepa" onClick={(e) => go(e, '#prepa')}>Préparation</a>
        <a href="#carte" onClick={(e) => go(e, '#carte')}>La carte</a>
        <a href="#avis" onClick={(e) => go(e, '#avis')}>Avis</a>
        <a href="#contact" onClick={(e) => go(e, '#contact')}>Contact</a>
        <a href="tel:+33651280674" className="nav-cta">Commander</a>
      </div>
    </nav>
  );
}
