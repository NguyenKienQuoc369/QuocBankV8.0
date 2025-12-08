'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, useTexture, Environment } from '@react-three/drei'
import { Planet } from '@/components/3d/Planet' 
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

// Hào quang mặt trời (Sửa lỗi type emissive)
function SunGlow() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (meshRef.current) meshRef.current.lookAt(state.camera.position)
  })
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[24, 24]} />
      <meshBasicMaterial 
        color="#ffaa00" 
        transparent 
        opacity={0.2} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </mesh>
  )
}

function SolarSystemScene() {
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffffff" decay={0} distance={1000} />
      <ambientLight intensity={0.05} />

      {/* Nền Ngân Hà (Dùng đúng tên file của bạn) */}
      <Environment 
        files="/textures/stars_milky_way.jpg" 
        background={true}
        blur={0.02}
      />
      
      {/* Sao lấp lánh thêm */}
      <Stars radius={300} depth={100} count={3000} factor={4} saturation={0} fade speed={1} />

      {/* --- MẶT TRỜI --- */}
      <Planet position={[0, 0, 0]} size={8} color="#FDB813" textureFile="sun.jpg" isSun={true} rotationSpeed={0.0005} />
      <SunGlow />

      {/* --- CÁC HÀNH TINH (Khớp tên file trong screenshot) --- */}
      
      {/* Mercury */}
      <Planet position={[12, 0, 5]} size={0.8} color="#A5A5A5" textureFile="mercury.jpg" rotationSpeed={0.004} />

      {/* Venus (Dùng venus_atmosphere.jpg hoặc venus.jpg) */}
      <Planet position={[18, 1, -5]} size={1.5} color="#E3BB76" textureFile="venus_atmosphere.jpg" rotationSpeed={0.002} hasAtmosphere={true} atmosphereColor="#DDBB88"/>

      {/* EARTH (Nhân vật chính) */}
      <Planet 
        position={[28, 0, 10]} 
        size={2.2} 
        color="#2233ff" 
        textureFile="earth_daymap.jpg"      // CHÍNH XÁC TÊN FILE
        nightMapFile="earth_nightmap.jpg"   // CHÍNH XÁC TÊN FILE
        rotationSpeed={0.005}
        hasClouds={true}                    // Code Planet sẽ tự gọi earth_clouds.jpg
        hasAtmosphere={true}
        atmosphereColor="#4488ff"
      />
      <Planet position={[32, 1, 10]} size={0.6} color="#888888" textureFile="moon.jpg" rotationSpeed={0.001} />

      {/* Mars */}
      <Planet position={[38, 2, -5]} size={1.2} color="#dd4422" textureFile="mars.jpg" rotationSpeed={0.008} hasAtmosphere={true} atmosphereColor="#aa3322"/>

      {/* Jupiter */}
      <Planet position={[55, -5, -20]} size={5} color="#C99039" textureFile="jupiter.jpg" rotationSpeed={0.01} />

      {/* Saturn (Ring xịn) */}
      <Planet 
        position={[75, 5, 20]} 
        size={4} 
        color="#EAD6B8" 
        textureFile="saturn.jpg" 
        rotationSpeed={0.005} 
        hasRing={true} 
        ringTextureFile="saturn_ring.png" // CHÍNH XÁC TÊN FILE
        ringSize={2.2}
      />

      {/* Uranus */}
      <Planet position={[90, -8, -10]} size={2.5} color="#D1E7E7" textureFile="uranus.jpg" rotationSpeed={0.006} />

      {/* Neptune */}
      <Planet position={[105, 0, 15]} size={2.4} color="#5B5DDF" textureFile="neptune.jpg" rotationSpeed={0.006} hasRing={true} ringSize={1.8}/>

      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.3}
        target={[28, 0, 10]} 
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2 + 0.2}
      />
    </>
  )
}

export function CosmicBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [36, 6, 38], fov: 45 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
           <SolarSystemScene />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  )
}