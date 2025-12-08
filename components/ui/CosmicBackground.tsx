'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, useTexture, Environment } from '@react-three/drei'
import { Planet } from '@/components/3d/Planet' 
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

// 1. Component vẽ đường quỹ đạo (Orbit Line)
function OrbitPath({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* Tạo hình vành khuyên rất mỏng */}
      <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.15} // Mờ nhẹ để không rối mắt
        side={THREE.DoubleSide} 
      />
    </mesh>
  )
}

// 2. Component Hào quang Mặt Trời
function SunGlow() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (meshRef.current) meshRef.current.lookAt(state.camera.position)
  })
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[28, 28]} />
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
  // Cấu hình khoảng cách (Bán kính quỹ đạo)
  const R_MERCURY = 12
  const R_VENUS = 18
  const R_EARTH = 26
  const R_MARS = 34
  const R_JUPITER = 50
  const R_SATURN = 70
  const R_URANUS = 90
  const R_NEPTUNE = 110

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffffff" decay={0} distance={1000} />
      <ambientLight intensity={0.05} />

      {/* Nền Ngân Hà */}
      <Environment 
        files="/textures/stars_milky_way.jpg" 
        background={true}
        blur={0.02}
      />
      <Stars radius={300} depth={100} count={3000} factor={4} saturation={0} fade speed={1} />

      {/* --- MẶT TRỜI --- */}
      <Planet position={[0, 0, 0]} size={8} color="#FDB813" textureFile="sun.jpg" isSun={true} rotationSpeed={0.0005} />
      <SunGlow />

      {/* --- CÁC HÀNH TINH & QUỸ ĐẠO --- */}
      
      {/* 1. Mercury */}
      <OrbitPath radius={R_MERCURY} />
      {/* Vị trí: x = R * cos(angle), z = R * sin(angle). Chọn góc ngẫu nhiên cho tự nhiên */}
      <Planet position={[R_MERCURY * 0.8, 0, R_MERCURY * 0.6]} size={0.8} color="#A5A5A5" textureFile="mercury.jpg" rotationSpeed={0.004} />

      {/* 2. Venus */}
      <OrbitPath radius={R_VENUS} />
      <Planet position={[-R_VENUS * 0.5, 0, R_VENUS * 0.86]} size={1.5} color="#E3BB76" textureFile="venus_atmosphere.jpg" rotationSpeed={0.002} hasAtmosphere={true} atmosphereColor="#DDBB88"/>

      {/* 3. EARTH (Nhân vật chính) */}
      <OrbitPath radius={R_EARTH} />
      <group position={[R_EARTH, 0, 0]}> {/* Đặt Earth ngay góc nhìn chính */}
        <Planet 
          position={[0, 0, 0]} 
          size={2.2} 
          color="#2233ff" 
          textureFile="earth_daymap.jpg"      
          nightMapFile="earth_nightmap.jpg"   
          rotationSpeed={0.005}
          hasClouds={true}                    
          hasAtmosphere={true}
          atmosphereColor="#4488ff"
        />
        {/* Moon xoay quanh Earth */}
        <Planet position={[3, 0.5, 3]} size={0.6} color="#888888" textureFile="moon.jpg" rotationSpeed={0.001} />
      </group>

      {/* 4. Mars */}
      <OrbitPath radius={R_MARS} />
      <Planet position={[0, 0, -R_MARS]} size={1.2} color="#dd4422" textureFile="mars.jpg" rotationSpeed={0.008} hasAtmosphere={true} atmosphereColor="#aa3322"/>

      {/* 5. Jupiter */}
      <OrbitPath radius={R_JUPITER} />
      <Planet position={[-R_JUPITER * 0.7, 0, -R_JUPITER * 0.7]} size={5} color="#C99039" textureFile="jupiter.jpg" rotationSpeed={0.01} />

      {/* 6. Saturn */}
      <OrbitPath radius={R_SATURN} />
      <Planet 
        position={[R_SATURN * 0.5, 0, R_SATURN * 0.86]} 
        size={4} 
        color="#EAD6B8" 
        textureFile="saturn.jpg" 
        rotationSpeed={0.005} 
        hasRing={true} 
        ringTextureFile="saturn_ring.png" 
        ringSize={2.2}
      />

      {/* 7. Uranus */}
      <OrbitPath radius={R_URANUS} />
      <Planet position={[-R_URANUS, 0, 0]} size={2.5} color="#D1E7E7" textureFile="uranus.jpg" rotationSpeed={0.006} />

      {/* 8. Neptune */}
      <OrbitPath radius={R_NEPTUNE} />
      <Planet position={[0, 0, R_NEPTUNE]} size={2.4} color="#5B5DDF" textureFile="neptune.jpg" rotationSpeed={0.006} hasRing={true} ringSize={1.8}/>

      {/* --- CẤU HÌNH TƯƠNG TÁC (CONTROLS) --- */}
      <OrbitControls 
        enableZoom={true}       // Cho phép lăn chuột zoom ra/vào
        enablePan={false}       // Tắt di chuyển tâm để giữ Mặt trời ở giữa
        enableRotate={true}     // Cho phép xoay chuột
        
        autoRotate={true}       // Tự động xoay nhẹ khi không tương tác
        autoRotateSpeed={0.5}
        
        minDistance={15}        // Không cho zoom quá gần vào trong mặt trời
        maxDistance={200}       // Không cho zoom quá xa ra ngoài hệ mặt trời
        
        // Bỏ giới hạn góc nhìn (minPolarAngle/maxPolarAngle) 
        // để người dùng có thể xoay lên đỉnh hoặc xuống đáy tùy thích
      />
    </>
  )
}

export function CosmicBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas 
        camera={{ position: [40, 20, 50], fov: 45 }} 
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
           <SolarSystemScene />
        </Suspense>
      </Canvas>
      {/* Lớp phủ gradient nhẹ để Text UI vẫn đọc được */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />
    </div>
  )
}