'use client'

import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls, Environment } from '@react-three/drei'
import { Planet } from '@/components/3d/Planet' 
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'

// Component đường quỹ đạo - Optimized
function OrbitPath({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
    </mesh>
  )
}

function SolarSystemScene() {
  // Giảm khoảng cách để tập trung vào các hành tinh chính
  const R_EARTH = 25
  const R_MARS = 35
  const R_JUPITER = 50
  const R_SATURN = 65

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" decay={0} distance={1500} />
      <ambientLight intensity={0.08} />
      
      {/* Nền Ngân Hà - Optimized */}
      <Environment files="/textures/stars_milky_way.jpg" background={true} blur={0.05} />
      <Stars radius={250} depth={80} count={2000} factor={3} saturation={0} fade speed={0.5} />

      {/* --- MẶT TRỜI --- */}
      <Planet 
        position={[0, 0, 0]} 
        size={7} 
        color="#FFF8E7" 
        textureFile="sun.jpg" 
        isSun={true} 
        rotationSpeed={0.0003} 
      />

      {/* --- CHỈ GIỮ LẠI CÁC HÀNH TINH CHÍNH (4 hành tinh thay vì 8) --- */}
      
      {/* Trái Đất + Mặt Trăng */}
      <OrbitPath radius={R_EARTH} />
      <group position={[R_EARTH, 0, 0]}> 
        <Planet 
          position={[0, 0, 0]} 
          size={2.5} 
          color="#2233ff" 
          textureFile="earth_daymap.jpg" 
          nightMapFile="earth_nightmap.jpg" 
          rotationSpeed={0.004} 
          hasClouds={true} 
          hasAtmosphere={true} 
          atmosphereColor="#4488ff"
        />
        <Planet position={[3.5, 0.5, 3.5]} size={0.6} color="#888888" textureFile="moon.jpg" rotationSpeed={0.001} />
      </group>

      {/* Sao Hỏa */}
      <OrbitPath radius={R_MARS} />
      <Planet 
        position={[0, 0, -R_MARS]} 
        size={1.2} 
        color="#dd4422" 
        textureFile="mars.jpg" 
        rotationSpeed={0.006} 
        hasAtmosphere={true} 
        atmosphereColor="#aa3322"
      />

      {/* Sao Mộc */}
      <OrbitPath radius={R_JUPITER} />
      <Planet 
        position={[-R_JUPITER * 0.6, 0, -R_JUPITER * 0.8]} 
        size={5} 
        color="#C99039" 
        textureFile="jupiter.jpg" 
        rotationSpeed={0.008} 
      />

      {/* Sao Thổ */}
      <OrbitPath radius={R_SATURN} />
      <Planet 
        position={[R_SATURN * 0.5, 0, R_SATURN * 0.8]} 
        size={4} 
        color="#EAD6B8" 
        textureFile="saturn.jpg" 
        rotationSpeed={0.004} 
        hasRing={true} 
        ringTextureFile="saturn_ring.png" 
        ringSize={2}
      />

      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        enableRotate={true} 
        autoRotate={true} 
        autoRotateSpeed={0.3} 
        minDistance={20} 
        maxDistance={200}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}

export function CosmicBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas 
        camera={{ position: [45, 18, 45], fov: 45 }} 
        gl={{ 
          antialias: false, // Tắt antialiasing để tăng performance
          powerPreference: "high-performance",
          alpha: false
        }}
        dpr={[1, 1.5]} // Giới hạn device pixel ratio
        performance={{ min: 0.5 }} // Tự động giảm chất lượng nếu FPS thấp
      >
        <Suspense fallback={null}>
           <SolarSystemScene />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none" />
    </div>
  )
}
