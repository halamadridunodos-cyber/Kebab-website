import { useState } from 'react';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import BrocheSection from './components/BrocheSection';
import Prepa from './components/Prepa';
import Carte from './components/Carte';
import Avis from './components/Avis';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AudioToggle from './components/AudioToggle';
import { useFireAudio } from './hooks/useFireAudio';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export default function App() {
  const [started, setStarted] = useState(false);
  const { enabled, toggle } = useFireAudio();
  useSmoothScroll();

  return (
    <>
      <Preloader onDone={() => setStarted(true)} />
      <Cursor />
      <Nav />
      <Hero started={started} />
      <Marquee items={['Broche maison', '100 % Veau', 'Tranchée à la minute', 'Montée à la main', 'Rôtie à la flamme']} />
      <Stats />
      <BrocheSection />
      <Marquee alt items={['Kebab', 'Tacos', 'Burgers', 'Assiettes', 'Grillades', 'Wings', 'Tenders']} />
      <Prepa />
      <Carte />
      <Avis />
      <Faq />
      <Contact />
      <Footer />
      <AudioToggle enabled={enabled} onToggle={toggle} />
    </>
  );
}
