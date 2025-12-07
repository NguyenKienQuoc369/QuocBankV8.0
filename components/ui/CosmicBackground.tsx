'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Trail } from '@react-three/drei'
import * as THREE from 'three'

// --- 1. Component Sao Băng (Meteor) ---
function Meteor() {
  // Tạo vị trí ngẫu nhiên xuất phát từ xa
  const [startPos] = useState(() => {
    const x = (Math.random() - 0.5) * 100
    const y = (Math.random() - 0.5) * 100
    const z = -100 - Math.random() * 100
    return new THREE.Vector3(x, y, z)
  })
  
  // Tốc độ ngẫu nhiên
  const [speed] = useState(() => 2 + Math.random() * 3)
  const mesh = useRef<THREE.Mesh>(null)
  const trailRef = useRef<any>(null)

  useFrame((state, delta) => {
    if (!mesh.current) return

    // Bay về phía camera
    mesh.current.position.z += speed

    // Reset khi bay qua camera
    if (mesh.current.position.z > 20) {
       mesh.current.position.z = startPos.z
       mesh.current.position.x = (Math.random() - 0.5) * 100
       mesh.current.position.y = (Math.random() - 0.5) * 100
       if(trailRef.current) trailRef.current.reset()
    }
  })

  return (
    <group>
      <Trail
        ref={trailRef}
        width={0.8}
        length={8}
        color={new THREE.Color("#00ff88")}
        attenuation={(t) => t * t}
      >
        <mesh ref={mesh} position={startPos}>
          <sphereGeometry args={[0.1, 8, 8]} />
          {/* SỬA LỖI TẠI ĐÂY: Đổi meshBasicMaterial -> meshStandardMaterial */}
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#00ff88" 
            emissiveIntensity={2} 
            toneMapped={false} 
          />
        </mesh>
      </Trail>
    </group>
  )
}

// --- 2. Component Vũ Trụ Chính ---
function CosmicScene() {
  const starsRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02
      starsRef.current.rotation.x += delta * 0.01
    }
  })

  const meteors = useMemo(() => Array.from({ length: 5 }).map((_, i) => <Meteor key={i} />), [])

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fogExp2 attach="fog" args={['#050514', 0.015]} /> 
      
      <ambientLight intensity={0.2} />

      <group ref={starsRef}>
        <Stars 
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </group>

      {meteors}
    </>
  )
}

// --- 3. Component Export Chính ---
export function CosmicBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <CosmicScene />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />
    </div>
  )
}