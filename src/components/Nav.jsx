import { useEffect, useState } from 'react';

const LINKS = [
  ['#broche', 'La broche'],
  ['#prepa', 'Préparation'],
  ['#carte', 'La carte'],
  ['#avis', 'Avis'],
  ['#contact', 'Contact'],
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Verrouille le scroll quand le menu mobile est ouvert + fermeture à Échap.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className="nav">
        <div className="brand">
          <span className="lg">O'<b>BRESSE</b></span>
          <span className="tg">Broche maison · 100% veau</span>
        </div>
        <div className="nav-links">
          {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          <a href="tel:+33651280674" className="nav-cta">Commander</a>
        </div>
        <button
          className={`nav-toggle${open ? ' on' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div id="mobile-menu" className={`nav-overlay${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <div className="nav-overlay-inner">
          {LINKS.map(([href, label], i) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{ transitionDelay: `${0.05 + i * 0.05}s` }}>{label}</a>
          ))}
          <a href="tel:+33651280674" className="btn primary nav-overlay-cta" onClick={() => setOpen(false)}>Commander · 06 51 28 06 74</a>
        </div>
      </div>
    </>
  );
}
