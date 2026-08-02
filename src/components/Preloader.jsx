import { useEffect, useRef, useState } from 'react';

/** Préchargement animé (compteur + barre) puis fondu, comme le site d'origine. */
export default function Preloader({ onDone }) {
  const [v, setV] = useState(0);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let val = 0;
    const t = setInterval(() => {
      val += Math.random() * 13 + 5;
      if (val >= 100) {
        val = 100;
        clearInterval(t);
        setTimeout(() => {
          setGone(true);
          document.body.style.overflow = '';
          if (!doneRef.current) { doneRef.current = true; onDone?.(); }
        }, 420);
      }
      setV(Math.floor(val));
    }, 95);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div id="pre" className={gone ? 'gone' : ''} aria-hidden={gone}>
      <div>
        <div className="pre-num">{v}</div>
        <div className="pre-lab">O'Bresse — Broche maison</div>
        <div className="pre-bar"><i style={{ width: v + '%' }} /></div>
      </div>
    </div>
  );
}
