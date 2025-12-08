'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface PlanetProps {
  position: [number, number, number]
  size: number
  textureFile?: string      // Tên file ảnh (VD: earth_daymap.jpg)
  color?: string            // Màu dự phòng
  rotationSpeed?: number
  isSun?: boolean           // Có phải mặt trời không?
  
  // Các option nâng cao
  hasRing?: boolean
  ringTextureFile?: string  // Ảnh vành đai (saturn_ring.png)
  ringSize?: number
  
  hasClouds?: boolean       // Mây (earth_clouds.jpg)
  
  hasAtmosphere?: boolean   // Khí quyển (Glow)
  atmosphereColor?: string
  
  nightMapFile?: string     // Ánh đèn đêm (earth_nightmap.jpg)
}

export function Planet({ 
  position, 
  size, 
  textureFile, 
  color = "#ffffff", 
  rotationSpeed = 0.005,
  isSun = false,
  hasRing = false,
  ringTextureFile,
  ringSize = 1.4,
  hasClouds = false,
  hasAtmosphere = false,
  atmosphereColor = "#4488ff",
  nightMapFile
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  
  // 1. Load Texture chính (Có xử lý fallback nếu không truyền tên file)
  // Mặc định dùng 'earth_daymap.jpg' nếu không có file nào khác được chỉ định để tránh lỗi
  const texturePath = textureFile ? `/textures/${textureFile}` : '/textures/earth_daymap.jpg'
  
  const texture = useTexture(texturePath, (t) => { 
    t.colorSpace = THREE.SRGBColorSpace 
  })

  // 2. Load các Texture phụ (chỉ load khi cần)
  const cloudTex = hasClouds ? useTexture('/textures/earth_clouds.jpg') : null
  const nightTex = nightMapFile ? useTexture(`/textures/${nightMapFile}`) : null
  const ringTex = ringTextureFile ? useTexture(`/textures/${ringTextureFile}`) : null

  if (ringTex) {
    ringTex.rotation = -Math.PI / 2
  }

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += rotationSpeed
    if (cloudsRef.current) cloudsRef.current.rotation.y += rotationSpeed * 1.15
    if (ringRef.current && hasRing) ringRef.current.rotation.z -= rotationSpeed * 0.5
  })

  return (
    <group position={position}>
      {/* BỀ MẶT HÀNH TINH */}
      <Sphere ref={meshRef} args={[size, 64, 64]}>
        {isSun ? (
          // Mặt trời dùng BasicMaterial (Tự phát sáng, không bóng đổ)
          <meshBasicMaterial map={texture} color={textureFile ? undefined : color} />
        ) : (
          // Hành tinh dùng StandardMaterial (Nhận ánh sáng)
          <meshStandardMaterial
            map={texture}
            color="#ffffff"
            metalness={0.4}
            roughness={0.7}
            // Logic đèn đêm (chỉ hiện ở vùng tối)
            emissiveMap={nightTex || undefined}
            emissive={nightTex ? new THREE.Color("#ffddaa") : new THREE.Color("#000000")}
            emissiveIntensity={nightTex ? 0.8 : 0} 
          />
        )}
      </Sphere>

      {/* LỚP MÂY (EARTH) */}
      {hasClouds && cloudTex && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[size * 1.015, 64, 64]} />
          <meshStandardMaterial
            map={cloudTex}
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            alphaMap={cloudTex} // Dùng chính ảnh mây làm mask
          />
        </mesh>
      )}

      {/* KHÍ QUYỂN (GLOW) */}
      {(hasAtmosphere || isSun) && (
        <Sphere args={[size * (isSun ? 1.05 : 1.03), 32, 32]}>
          <meshBasicMaterial
            color={isSun ? "#ffaa00" : atmosphereColor}
            transparent
            opacity={isSun ? 0.3 : 0.15}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      )}

      {/* VÀNH ĐAI (SATURN) */}
      {hasRing && (
        <mesh 
          ref={ringRef} 
          rotation={[Math.PI / 2.2, 0, 0]} 
        >
          <ringGeometry args={[size * 1.4, size * ringSize, 128]} />
          <meshStandardMaterial 
            map={ringTex || undefined}
            color={ringTex ? "#ffffff" : "#CDBA96"} 
            side={THREE.DoubleSide} 
            transparent 
            opacity={0.9} 
          />
        </mesh>
      )}
    </group>
  )
}