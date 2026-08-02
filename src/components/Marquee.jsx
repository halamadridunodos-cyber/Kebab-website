export default function Marquee({ items, alt = false }) {
  const one = items.map((t, i) => (
    <span key={i}>{t}<i>◆</i></span>
  ));
  return (
    <div className={`marquee${alt ? ' alt' : ''}`}>
      <div className="marquee-track">{one}{one}</div>
    </div>
  );
}
