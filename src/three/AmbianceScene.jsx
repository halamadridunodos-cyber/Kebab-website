import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Fire from './Fire';
import Smoke from './Smoke';
import Embers from './Embers';
import FireLight from './FireLight';

/**
 * Ambiance de feu 3D légère (sans modèle) superposée à la photo de la broche —
 * remplace l'ancien effet 2D « brocheFx ».
 */
export default function AmbianceScene({ quality = 'high', reduce = false, pixelRatio = 1 }) {
  const low = quality === 'low';
  return (
    <>
      <ambientLight intensity={0.2} color="#5b4a3a" />
      <FireLight position={[0, -1.2, 1.4]} intensity={10} />
      <Fire position={[0, -1.5, 0]} scale={[2.2, 2.8, 1]} layers={low ? 2 : 3} quality={quality} />
      {!reduce && (
        <>
          <Smoke count={low ? 12 : 22} origin={[0, -0.4, 0]} spread={1.0} rise={3.2} size={low ? 80 : 110} opacity={0.5} pixelRatio={pixelRatio} />
          <Embers count={low ? 28 : 50} origin={[0, -1.4, 0]} area={1.6} rise={3.4} size={low ? 18 : 24} pixelRatio={pixelRatio} />
        </>
      )}
      {!reduce && !low && (
        <EffectComposer disableNormalPass>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} radius={0.75} />
        </EffectComposer>
      )}
    </>
  );
}
