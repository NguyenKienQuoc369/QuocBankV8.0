'use client'

import { Scene } from './Scene'
import { Planet } from './Planet'
import { OrbitControls, Stars } from '@react-three/drei'

export default function SolarSystem({ className = "h-full w-full" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Scene>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa00" />

        {/* --- MẶT TRỜI (TÂM) --- */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial 
            color="#ffaa00" 
            emissive="#ff4400"
            emissiveIntensity={2} 
            toneMapped={false} 
          />
        </mesh>
        
        {/* Hào quang mặt trời */}
        <mesh position={[0, 0, 0]} scale={1.2}>
           <sphereGeometry args={[2.5, 32, 32]} />
           <meshBasicMaterial color="#ff8800" transparent opacity={0.2} />
        </mesh>

        {/* --- CÁC HÀNH TINH --- */}
        <Planet position={[5, 1, 3]} size={1.2} color="#00ff88" rotationSpeed={0.005} />
        <Planet position={[-7, -2, -4]} size={1.5} color="#8b5cf6" rotationSpeed={0.002} hasRing={true} />
        <Planet position={[0, 6, -5]} size={0.6} color="#ff4444" rotationSpeed={0.01} />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Scene>
    </div>
  )
}