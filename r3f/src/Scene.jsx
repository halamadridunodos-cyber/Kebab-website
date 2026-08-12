import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* Profil de la broche (döner) pour un LatheGeometry : [hauteur, rayon] */
const PROFILE = [
  [-2.05, 0.30], [-1.7, 0.66], [-1.25, 0.98], [-0.7, 1.20],
  [-0.1, 1.28], [0.5, 1.24], [1.05, 1.08], [1.55, 0.78],
  [1.9, 0.4], [2.05, 0.10], [2.05, 0.0],
]

function Broche() {
  const group = useRef()
  const points = useMemo(
    () => PROFILE.map(([y, r]) => new THREE.Vector2(Math.max(r, 0.0001), y)),
    []
  )

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    // rotation continue (delta-scaled)
    g.rotation.y += delta * 0.4
    // léger balancement vers le pointeur (damp, sans allocation)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, state.pointer.x * 0.08, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.05, 3, delta)
  })

  return (
    <group ref={group}>
      {/* Viande de la broche */}
      <mesh castShadow>
        <latheGeometry args={[points, 96]} />
        <meshStandardMaterial
          color="#7c3f1e"
          roughness={0.72}
          metalness={0.05}
          emissive="#e0872e"
          emissiveIntensity={0.14}
        />
      </mesh>
      {/* Broche métallique */}
      <mesh>
        <cylinderGeometry args={[0.045, 0.045, 4.7, 24]} />
        <meshStandardMaterial color="#d8d2c7" metalness={0.9} roughness={0.28} />
      </mesh>
      {/* Embout haut */}
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#d8d2c7" metalness={0.9} roughness={0.28} />
      </mesh>
    </group>
  )
}

export default function Scene() {
  return (
    <>
      {/* Lumières chaudes cinématiques */}
      <ambientLight intensity={0.55} />
      <spotLight
        position={[5, 6, 6]} angle={0.5} penumbra={1} decay={0}
        intensity={2.2} color="#ffdca8" castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, -1, 2]} intensity={12} distance={12} color="#c8611e" />
      <pointLight position={[0, -2.2, 0.5]} intensity={9} distance={6} color="#e0872e" />

      <Float speed={1.1} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.12, 0.12]}>
        <Broche />
        <Sparkles count={70} scale={[5, 8, 5]} position={[0, 0.5, 0]} size={4} speed={0.5} noise={1.5} color="#e0872e" />
      </Float>

      <ContactShadows position={[0, -2.25, 0]} opacity={0.55} scale={12} blur={2.6} far={4.2} color="#000000" />
    </>
  )
}
