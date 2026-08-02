import { useEffect, useRef } from 'react';

/**
 * Ajoute la classe `in` quand l'élément entre dans le viewport (une seule fois).
 * Reproduit la révélation « mot par mot » du site d'origine pour les .rw enfants.
 */
export function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          e.target.querySelectorAll?.('.rw').forEach((s, i) =>
            setTimeout(() => s.classList.add('in'), i * 80),
          );
          io.unobserve(e.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -50px 0px', ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
