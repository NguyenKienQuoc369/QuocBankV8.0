'use client'

import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls, Environment } from '@react-three/drei'
import { Planet } from '@/components/3d/Planet' 
import { Suspense } from 'react'
import * as THREE from 'three'

function SolarSystemScene() {
  return (
    <>
      {/* 1. Ánh sáng: Mặt trời là nguồn sáng duy nhất tại [0,0,0] */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" decay={0} distance={500} />
      <ambientLight intensity={0.02} /> {/* Vũ trụ tối đen, chỉ có ánh sáng sao rất yếu */}

      {/* 2. Nền Ngân Hà (Milky Way) */}
      {/* Environment map thay cho Stars để có dải ngân hà thực tế */}
      <Environment 
        files="/textures/stars_milky_way.jpg" 
        background={true} // Làm nền luôn
        blur={0.05}       // Mờ nhẹ để làm nổi bật hành tinh
      />

      {/* --- HỆ MẶT TRỜI --- */}

      {/* SUN */}
      <Planet 
        position={[0, 0, 0]} 
        size={8} 
        color="#FDB813" 
        textureFile="sun.jpg" 
        isSun={true} 
        rotationSpeed={0.0005} 
      />

      {/* MERCURY */}
      <Planet 
        position={[12, 0, 5]} 
        size={0.8} 
        color="#A5A5A5" 
        textureFile="mercury.jpg" 
        rotationSpeed={0.004} 
      />

      {/* VENUS (Dùng ảnh venus_atmosphere.jpg cho đúng thực tế) */}
      <Planet 
        position={[18, 1, -5]} 
        size={1.5} 
        color="#E3BB76" 
        textureFile="venus_atmosphere.jpg" 
        rotationSpeed={0.002}
        hasAtmosphere={true}
        atmosphereColor="#DDBB88"
      />

      {/* EARTH (Nhân vật chính) */}
      <Planet 
        position={[28, 0, 10]} 
        size={2.2} 
        color="#2233ff" 
        textureFile="earth_daymap.jpg"    // Ảnh ban ngày
        nightMapFile="earth_nightmap.jpg" // Ảnh đèn đêm (City Lights)
        rotationSpeed={0.005}
        hasClouds={true}                  // Bật mây (tự dùng earth_clouds.jpg)
        hasAtmosphere={true}
        atmosphereColor="#4488ff"
      />
      {/* Moon */}
      <Planet 
        position={[32, 1, 10]} 
        size={0.6} 
        color="#888888" 
        textureFile="moon.jpg" 
        rotationSpeed={0.001} 
      />

      {/* MARS */}
      <Planet 
        position={[38, 2, -5]} 
        size={1.2} 
        color="#dd4422" 
        textureFile="mars.jpg" 
        rotationSpeed={0.008}
        hasAtmosphere={true}
        atmosphereColor="#aa3322"
      />

      {/* JUPITER */}
      <Planet 
        position={[55, -5, -20]} 
        size={5} 
        color="#C99039" 
        textureFile="jupiter.jpg" 
        rotationSpeed={0.01} 
      />

      {/* SATURN (Vành đai xịn từ ảnh PNG) */}
      <Planet 
        position={[75, 5, 20]} 
        size={4} 
        color="#EAD6B8" 
        textureFile="saturn.jpg" 
        rotationSpeed={0.005}
        hasRing={true}
        ringTextureFile="saturn_ring.png" // Dùng file PNG vành đai
        ringSize={2.2}
      />

      {/* URANUS */}
      <Planet 
        position={[90, -8, -10]} 
        size={2.5} 
        color="#D1E7E7" 
        textureFile="uranus.jpg" 
        rotationSpeed={0.006} 
      />

      {/* NEPTUNE */}
      <Planet 
        position={[105, 0, 15]} 
        size={2.4} 
        color="#5B5DDF" 
        textureFile="neptune.jpg" 
        rotationSpeed={0.006}
        hasRing={true} // Neptune vẫn vẽ ring bằng code (vì ko có texture ring riêng)
        ringSize={1.8}
      />

      {/* Camera Controller */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.3}
        target={[28, 0, 10]} // Camera khóa mục tiêu vào Trái Đất
        minPolarAngle={Math.PI / 2 - 0.2}
        maxPolarAngle={Math.PI / 2 + 0.2}
      />
    </>
  )
}

export function CosmicBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      {/* Thêm gl={{ preserveDrawingBuffer: true }} để chống nháy hình nếu cần */}
      <Canvas 
        camera={{ position: [38, 4, 38], fov: 40 }} 
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
           <SolarSystemScene />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  )
}