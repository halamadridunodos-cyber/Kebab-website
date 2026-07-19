const IG = 'https://www.instagram.com/obresse01?igsh=djhteGw5cDdmY3Jk';
const TT = 'https://www.tiktok.com/@obresse2?_r=1&_t=ZN-98AOft6U2Tu';

export default function Socials({ className = '' }) {
  return (
    <div className={`socials ${className}`}>
      <a href={IG} target="_blank" rel="noopener" className="social" aria-label="Instagram O'Bresse">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
        <span>Instagram</span>
      </a>
      <a href={TT} target="_blank" rel="noopener" className="social" aria-label="TikTok O'Bresse">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.4c-1.3.1-2.5-.3-3.6-1v5.6c0 3.3-2.4 5.6-5.5 5.6-3 0-5.2-2.2-5.2-5.1 0-2.9 2.3-5.1 5.4-4.9v2.5c-.4-.1-.8-.2-1.2-.1-1.2.1-2.1 1-2 2.3 0 1.3 1 2.2 2.3 2.1 1.3 0 2.1-1 2.1-2.4V3h3.7z" />
        </svg>
        <span>TikTok</span>
      </a>
    </div>
  );
}
