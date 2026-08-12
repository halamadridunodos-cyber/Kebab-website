import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene.jsx'

const TEL = 'tel:+33651280674'
const MAPS = "https://www.google.com/maps?q=Restaurant+O'Bresse,2+Av.+de+Bresse,01460+Montr%C3%A9al-la-Cluse"
const GOOGLE = 'https://share.google/rvYl9iT7WRFEWdatb'
const IG = 'https://www.instagram.com/obresse01?igsh=djhteGw5cDdmY3Jk'
const TT = 'https://www.tiktok.com/@obresse2?_r=1&_t=ZN-98AOft6U2Tu'

const SpitIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 6 v88" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M50 14C34 16 30 24 31 32C33 40 30 44 32 52C34 60 31 64 34 72C36 79 42 84 50 86C58 84 64 79 66 72C69 64 66 60 68 52C70 44 67 40 69 32C70 24 66 16 50 14Z" fill="currentColor" />
    <circle cx="50" cy="9" r="4.2" fill="currentColor" />
  </svg>
)

const CARTE = [
  { t: 'Sandwichs & Galettes', cols: 'Seul · Menu', items: [['Kebab', '9 €', '12 €'], ['Escalope', '9 €', '12 €'], ['Kofte', '9 €', '12 €'], ['Steak', '9 €', '12 €'], ['Tenders', '9 €', '12 €'], ['Cordon Bleu', '8 €', '10,50 €'], ['Adana', '8 €', '10,50 €']], note: 'Servis avec crudités et sauces au choix. Frites incluses pour les galettes.' },
  { t: 'Burgers', cols: 'Seul · Menu', items: [['Cheese', '6 €', '9 €'], ['Double Cheese', '7 €', '10 €'], ['Fish', '6 €', '9 €'], ['Chicken', '6 €', '9 €'], ["Bap's", '7 €', '10 €'], ['Vegi', '6 €', '9 €'], ["Chicken Bap's", '7 €', '10 €'], ['Special', '9 €', '11,50 €']], note: 'Servis avec crudités et sauces au choix.' },
  { t: 'Tacos', cols: 'Seul · Menu', items: [['Tacos', '9,50 €', '12,50 €'], ['Maxi Tacos', '12 €', '15 €']], note: 'Viande au choix, crudités et sauces — sauce gruyère incluse. Supplément viande +1 €.' },
  { t: 'Assiettes', items: [['Kebab', '15 €'], ['Escalope', '14 €'], ['Kofte', '14 €'], ['Steak', '14 €'], ['Tenders', '14 €'], ['Cordon Bleu', '14 €'], ['Royal', '19 €']], note: 'Servies avec frites, riz, boulgour — ou deux au choix.' },
  { t: 'Grillades', items: [['Côtelettes', '18 €'], ['Beyti Adana ou Brochette', '17 €'], ['Adana', '16 €'], ['Aile de Poulet', '16 €'], ['Iskender', '16 €']], note: 'Servies avec crudités et sauces au choix.' },
  { t: 'Accompagnement & Box', items: [['4 Oignon Rings', '3 €'], ['8 Oignon Rings', '6 €'], ['4 Modza Stick', '3 €'], ['8 Modza Stick', '6 €'], ['4 Nuggets', '3 €'], ['4 Chili Cheese', '3 €']] },
  { t: 'Wings · Tenders · Mixte', cols: 'Une portion, trois façons', items: [['8 Wings · 6 Tenders · 3T+4W', '10 €'], ['16 Wings · 12 Tenders · 6T+8W', '16 €', 'mixte 18 €'], ['24 Wings · 18 Tenders · 9T+12W', '24 €', 'mixte 25 €'], ['32 Wings · 24 Tenders · 12T+16W', '32 €']], wide: true },
  { t: 'Tasty', cols: 'Seul · Menu', items: [['Tasty', '9,50 €', '12,50 €']] },
  { t: 'Menu Enfant', items: [['Kebab', '7 €'], ['Burger', '7 €'], ['Tenders', '7 €'], ['Nuggets', '7 €']], note: 'Servi avec frites, une boisson et un jouet.' },
  { t: 'Boissons', items: [['Canette 33 cl', '2 €'], ['Bouteille 1,5 L', '3,50 €'], ['Eau 50 cl', '1,50 €'], ['Café', '1,80 €']] },
]

const REVIEWS = [
  ['M', 'Musa Isiksoy', "Excellent ! Un kebab 100% veau fait maison qui est très bon. Le restaurant est très propre avec un beau décor, je recommande fortement avec un accueil chaleureux."],
  ['J', 'Jülide Şen', "Contente d'avoir ce genre de restaurant dans le coin avec une broche maison 100% veau !"],
  ['I', 'Ines Boudabban', "Incroyable ! C'est super bon, le kebab est excellent, bon accueil. Bref, foncez si vous voulez bien manger."],
  ['G', 'Géraldine Chêne', "Viande de qualité faite 100% maison au veau, personnel accueillant et à l'écoute, ainsi que des prix très abordables. Une très bonne adresse à découvrir."],
  ['H', 'Huseyin Cengiz', "Accueil, personnel, nourriture : excellent ! Le goût des viandes est vraiment exceptionnel. Recommande fortement."],
  ['K', 'Keziban Gulsever', "La viande est excellente, elle est faite maison. Si vous voulez manger un bon kebab de veau, n'hésitez pas, foncez !!!"],
]

const FAQ = [
  ['La viande est-elle vraiment faite maison ?', "Oui. La broche est montée à la main dans le restaurant, couche par couche, 100 % veau. Elle rôtit progressivement devant la source de chaleur et n'est tranchée qu'au moment de la commande."],
  ['La viande est-elle halal ?', 'Oui, la viande est 100 % halal.'],
  ['Quels sont vos horaires ?', 'Nous sommes ouverts tous les jours (7j/7) de 11h à 14h et de 17h30 à 23h.'],
  ['Peut-on commander à emporter ?', "Oui, sur place ou à emporter. Appelez-nous pour préparer votre commande à l'avance et éviter l'attente."],
  ['Proposez-vous des menus enfant ?', 'Oui, à 7 € : kebab, burger, tenders ou nuggets, servis avec frites, une boisson et un jouet.'],
]

function QA({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`qa${open ? ' open' : ''}`}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span><i className="ic" />
      </button>
      <div className="a"><div><p>{a}</p></div></div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <header className="nav">
        <a className="nav__brand" href="#top"><SpitIcon /> O'Bresse</a>
        <nav className="nav__links">
          <a href="#carte">La Carte</a><a href="#avis">Avis</a>
          <a href="#questions">Questions</a><a href="#contact">Contact</a>
        </nav>
        <a className="nav__cta" href={TEL}>Commander</a>
      </header>

      {/* HERO 3D */}
      <section className="hero3d" id="top">
        <Canvas
          className="hero3d__canvas"
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.3, 7.5], fov: 38 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        <div className="hero3d__overlay">
          <div className="inner">
            <div className="hero3d__eyebrow"><i />Broche Maison · 100% Veau</div>
            <h1 className="hero3d__title">O'Bresse</h1>
            <p className="hero3d__sub">Notre broche, faite maison et rôtie à la braise — en trois dimensions. Bougez la souris pour la faire tourner.</p>
            <div className="hero3d__actions">
              <a href="#carte" className="btn btn--solid">Découvrir la carte</a>
              <a href={TEL} className="btn btn--ghost">06 51 28 06 74</a>
            </div>
          </div>
        </div>
        <div className="hero3d__hint">Défiler</div>
      </section>

      {/* CARTE */}
      <section className="section" id="carte">
        <div className="section__head">
          <span className="section-index">01 — La Carte</span>
          <h2 className="section-title">14 catégories, 56 produits.</h2>
          <p className="section__intro">Sur place ou à emporter. Prix d'après la carte officielle O'Bresse.</p>
        </div>
        <div className="carte__grid">
          {CARTE.map((c) => (
            <article className="cat" key={c.t} style={c.wide ? { gridColumn: '1 / -1' } : undefined}>
              <h3>{c.t}{c.cols ? <span style={{ float: 'right', fontSize: '.62rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ember-2)', fontWeight: 600 }}>{c.cols}</span> : null}</h3>
              {c.items.map((it) => (
                <div className="mrow" key={it[0]}>
                  <span>{it[0]}</span>
                  <b>{it[1]}{it[2] ? <i> {it[2].startsWith('mixte') ? '· ' + it[2] : '/ ' + it[2]}</i> : null}</b>
                </div>
              ))}
              {c.note ? <p>{c.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      {/* AVIS */}
      <section className="section" id="avis">
        <div className="section__head">
          <span className="section-index">02 — Les Avis</span>
          <h2 className="section-title">Ils en parlent.</h2>
        </div>
        <div className="rating">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.3rem' }}>
            <span className="num">4,8</span>
            <div>
              <div className="stars">★★★★★</div>
              <span className="sub">sur 5 · <b>plus de 30</b> avis sur Google</span>
            </div>
          </div>
          <a className="btn btn--ghost" href={GOOGLE} target="_blank" rel="noopener" style={{ padding: '.7rem 1.3rem', fontSize: '.74rem' }}>Voir sur Google</a>
        </div>
        <div className="reviews">
          {REVIEWS.map(([av, name, txt]) => (
            <figure className="review" key={name}>
              <div className="s">★★★★★</div>
              <blockquote>{txt}</blockquote>
              <figcaption><span className="ava">{av}</span><span className="who"><b>{name}</b><i>Google</i></span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="section" id="questions">
        <div className="section__head">
          <span className="section-index">03 — Questions</span>
          <h2 className="section-title">Tout ce qu'il faut savoir.</h2>
        </div>
        <div className="faq__list">
          {FAQ.map(([q, a]) => <QA key={q} q={q} a={a} />)}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="contact__grid">
          <div>
            <span className="section-index">04 — Passez nous voir</span>
            <h2 className="section-title">Sur place ou à emporter.</h2>
            <div className="info">
              <div><div className="k">Adresse</div><p className="v">2 Av. de Bresse<br />01460 Montréal-la-Cluse</p></div>
              <div><div className="k">Horaires</div><p className="v">7j/7 · 11h – 14h<br />&amp; 17h30 – 23h</p></div>
              <div><div className="k">Téléphone</div><p className="v"><a href={TEL}>+33 6 51 28 06 74</a></p></div>
              <div><div className="k">Suivez-nous</div>
                <div className="social">
                  <a className="ig" href={IG} target="_blank" rel="noopener" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" /></svg>
                  </a>
                  <a className="tt" href={TT} target="_blank" rel="noopener" aria-label="TikTok">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82c-.9-.6-1.5-1.53-1.68-2.6a4.3 4.3 0 0 1-.05-.72h-2.9v11.9a2.36 2.36 0 0 1-2.36 2.28 2.36 2.36 0 0 1-1.06-4.47 2.36 2.36 0 0 1 1.06-.25c.2 0 .4.03.6.08v-2.96a5.3 5.3 0 0 0-.6-.04 5.28 5.28 0 1 0 5.28 5.28V9.01a7.13 7.13 0 0 0 4.16 1.33V7.44a4.28 4.28 0 0 1-2.45-.77z" /></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="actions">
              <a href={TEL} className="btn btn--solid">Appeler</a>
              <a href={MAPS} target="_blank" rel="noopener" className="btn btn--ghost">Itinéraire</a>
            </div>
          </div>
          <div className="map">
            <iframe title="O'Bresse sur Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen
              src="https://www.google.com/maps?q=Restaurant+O'Bresse,2+Av.+de+Bresse,01460+Montr%C3%A9al-la-Cluse&output=embed" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="big">O'Bresse</div>
        <div className="meta">
          <span>2 Av. de Bresse, 01460 Montréal-la-Cluse · <a href={TEL}>+33 6 51 28 06 74</a></span>
          <span>7j/7 · 11h–14h &amp; 17h30–23h · Broche maison 100% veau · Halal</span>
          <span>© {new Date().getFullYear()} O'Bresse — version immersive 3D</span>
        </div>
      </footer>
    </>
  )
}
