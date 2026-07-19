import { useRef, useState } from 'react';
import { FAQ } from '../data';
import { useReveal } from '../hooks/useReveal';

export default function Faq() {
  const head = useReveal();
  const [open, setOpen] = useState(-1);
  const refs = useRef([]);

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sechead" ref={head}>
          <h2><span className="n">// 05.</span> <span className="rw"><i>Questions</i></span></h2>
          <div className="meta">Tout ce qu'il faut savoir</div>
        </div>
        <div className="faq">
          {FAQ.map((x, i) => (
            <div className={`faq-item${open === i ? ' open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{x.q}</button>
              <div
                className="faq-a"
                ref={(el) => (refs.current[i] = el)}
                style={{ maxHeight: open === i && refs.current[i] ? refs.current[i].scrollHeight + 'px' : 0 }}
              >
                <p>{x.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
