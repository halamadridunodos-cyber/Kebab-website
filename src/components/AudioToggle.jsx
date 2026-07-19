/** Bouton discret pour activer/couper le crépitement du feu (Web Audio). */
export default function AudioToggle({ enabled, onToggle }) {
  return (
    <button
      className={`audio-btn${enabled ? ' on' : ''}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Couper le son du feu' : 'Activer le son du feu'}
    >
      <span className="audio-eq" aria-hidden="true"><i /><i /><i /><i /></span>
      <span>{enabled ? 'Son' : 'Silence'}</span>
    </button>
  );
}
