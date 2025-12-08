'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Environment } from '@react-three/drei'
import { Planet } from '@/components/3d/Planet' 
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

// 1. SỬA HÀO QUANG: Đổi màu cam gắt sang trắng ấm, giảm độ đặc
function SunGlow() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (meshRef.current) meshRef.current.lookAt(state.camera.position)
  })
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[26, 26]} />
      <meshBasicMaterial 
        color="#ffecd1" // Màu trắng kem (thay vì cam đậm)
        transparent 
        opacity={0.12}  // Giảm độ đục để nhìn xuyên thấu hơn
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </mesh>
  )
}

function OrbitPath({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  )
}

function SolarSystemScene() {
  const R_MERCURY = 14
  const R_VENUS = 20
  const R_EARTH = 30
  const R_MARS = 40
  const R_JUPITER = 60
  const R_SATURN = 80
  const R_URANUS = 100
  const R_NEPTUNE = 120

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" decay={0} distance={2000} />
      <ambientLight intensity={0.05} />
      <Environment files="/textures/stars_milky_way.jpg" background={true} blur={0.02} />
      <Stars radius={300} depth={100} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* --- MẶT TRỜI MỚI (MÀU SANG HƠN) --- */}
      <Planet 
        position={[0, 0, 0]} 
        size={8} 
        color="#FFF8E7" // Đổi màu backup sang trắng kem
        textureFile="sun.jpg" 
        isSun={true} 
        rotationSpeed={0.0005} 
      />
      <SunGlow />

      {/* ... GIỮ NGUYÊN CODE CÁC HÀNH TINH KHÁC NHƯ CŨ ... */}
      
      <OrbitPath radius={R_MERCURY} />
      <Planet position={[R_MERCURY * 0.7, 0, R_MERCURY * 0.7]} size={0.8} color="#A5A5A5" textureFile="mercury.jpg" rotationSpeed={0.004} />

      <OrbitPath radius={R_VENUS} />
      <Planet position={[-R_VENUS * 0.5, 0, R_VENUS * 0.8]} size={1.5} color="#E3BB76" textureFile="venus_atmosphere.jpg" rotationSpeed={0.002} hasAtmosphere={true} atmosphereColor="#DDBB88"/>

      <OrbitPath radius={R_EARTH} />
      <group position={[R_EARTH, 0, 0]}> 
        <Planet position={[0, 0, 0]} size={2.5} color="#2233ff" textureFile="earth_daymap.jpg" nightMapFile="earth_nightmap.jpg" rotationSpeed={0.005} hasClouds={true} hasAtmosphere={true} atmosphereColor="#4488ff"/>
        <Planet position={[3.5, 0.5, 3.5]} size={0.6} color="#888888" textureFile="moon.jpg" rotationSpeed={0.001} />
      </group>

      <OrbitPath radius={R_MARS} />
      <Planet position={[0, 0, -R_MARS]} size={1.2} color="#dd4422" textureFile="mars.jpg" rotationSpeed={0.008} hasAtmosphere={true} atmosphereColor="#aa3322"/>

      <OrbitPath radius={R_JUPITER} />
      <Planet position={[-R_JUPITER * 0.6, 0, -R_JUPITER * 0.8]} size={5.5} color="#C99039" textureFile="jupiter.jpg" rotationSpeed={0.01} />

      <OrbitPath radius={R_SATURN} />
      <Planet position={[R_SATURN * 0.5, 0, R_SATURN * 0.8]} size={4.5} color="#EAD6B8" textureFile="saturn.jpg" rotationSpeed={0.005} hasRing={true} ringTextureFile="saturn_ring.png" ringSize={2.2}/>

      <OrbitPath radius={R_URANUS} />
      <Planet position={[-R_URANUS, 0, 0]} size={3} color="#D1E7E7" textureFile="uranus.jpg" rotationSpeed={0.006} />

      <OrbitPath radius={R_NEPTUNE} />
      <Planet position={[0, 0, R_NEPTUNE]} size={2.8} color="#5B5DDF" textureFile="neptune.jpg" rotationSpeed={0.006} hasRing={true} ringSize={1.8}/>

      <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} autoRotate={true} autoRotateSpeed={0.4} minDistance={20} maxDistance={250} />
    </>
  )
}

export function CosmicBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [50, 20, 50], fov: 45 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
           <SolarSystemScene />
        </Suspense>
      </Canvas>
      {/* Overlay gradient tối hơn chút để làm nổi bật độ sáng của mặt trời */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none" />
    </div>
  )
}