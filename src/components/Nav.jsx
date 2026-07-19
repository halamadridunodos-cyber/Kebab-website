export default function Nav() {
  // Le défilement doux des ancres est géré globalement par Lenis (useSmoothScroll).
  return (
    <nav className="nav">
      <div className="brand">
        <span className="lg">O'<b>BRESSE</b></span>
        <span className="tg">Broche maison · 100% veau</span>
      </div>
      <div className="nav-links">
        <a href="#broche">La broche</a>
        <a href="#prepa">Préparation</a>
        <a href="#carte">La carte</a>
        <a href="#avis">Avis</a>
        <a href="#contact">Contact</a>
        <a href="tel:+33651280674" className="nav-cta">Commander</a>
      </div>
    </nav>
  );
}
