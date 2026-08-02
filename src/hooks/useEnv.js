import { useEffect, useState } from 'react';

/** Détecte prefers-reduced-motion (réactif). */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches,
  );
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion:reduce)');
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

/**
 * Palier de qualité pour le rendu 3D.
 * Tient compte de la taille d'écran, du nombre de cœurs et du pointeur tactile
 * afin d'adapter la densité de particules, le DPR et le post-processing.
 */
export function useQualityTier() {
  const [tier, setTier] = useState(() => {
    if (typeof window === 'undefined') return 'high';
    const coarse = matchMedia('(hover:none)').matches || matchMedia('(max-width:768px)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    if (coarse || cores <= 4) return 'low';
    if (cores <= 8) return 'mid';
    return 'high';
  });
  useEffect(() => {
    const mq = matchMedia('(max-width:768px)');
    const on = () => setTier(mq.matches ? 'low' : (navigator.hardwareConcurrency || 4) <= 8 ? 'mid' : 'high');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return tier;
}

export function useIsMobile(query = '(max-width:960px)') {
  const [m, setM] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}
