import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/** Lumière ponctuelle chaude qui vacille comme des flammes (scintillement pseudo-aléatoire). */
export default function FireLight({ position = [0, -0.6, 1.6], intensity = 18, color = '#ff7a2a', distance = 12 }) {
  const light = useRef();
  const seed = useRef(Math.random() * 100);
  useFrame((state) => {
    if (!light.current) return;
    const t = state.clock.elapsedTime + seed.current;
    const flick = 0.78 + Math.sin(t * 11) * 0.09 + Math.sin(t * 27) * 0.05 + Math.sin(t * 3.3) * 0.06;
    light.current.intensity = intensity * flick;
    light.current.position.x = position[0] + Math.sin(t * 5.0) * 0.08;
    light.current.position.y = position[1] + Math.sin(t * 7.0) * 0.05;
  });
  return <pointLight ref={light} position={position} color={color} intensity={intensity} distance={distance} decay={2} />;
}
