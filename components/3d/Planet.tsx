'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface PlanetProps {
  position: [number, number, number]
  size: number
  textureFile?: string
  color: string
  rotationSpeed?: number
  isSun?: boolean
  hasRing?: boolean
  ringTextureFile?: string // Tên file ảnh vành đai (saturn_ring.png)
  ringSize?: number
  hasClouds?: boolean
  hasAtmosphere?: boolean
  atmosphereColor?: string
  nightMapFile?: string // File ánh đèn đêm (earth_nightmap.jpg)
}

export function Planet({ 
  position, 
  size, 
  textureFile, 
  color, 
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
  
  // 1. Load texture chính
  const texture = useTexture(
    textureFile ? `/textures/${textureFile}` : '/textures/earth_daymap.jpg',
    (t) => { t.colorSpace = THREE.SRGBColorSpace }
  )

  // 2. Load texture phụ (Mây, Đèn đêm, Vành đai)
  // Dùng useTexture cho mảng để load nhiều ảnh cùng lúc nếu cần
  const cloudTex = hasClouds ? useTexture('/textures/earth_clouds.jpg') : null
  const nightTex = nightMapFile ? useTexture(`/textures/${nightMapFile}`) : null
  const ringTex = ringTextureFile ? useTexture(`/textures/${ringTextureFile}`) : null

  if (ringTex) {
    ringTex.rotation = -Math.PI / 2 // Xoay texture vành đai cho đúng chiều
  }

  useFrame(() => {
    // Xoay hành tinh
    if (meshRef.current) meshRef.current.rotation.y += rotationSpeed
    
    // Xoay mây (nhanh hơn chút)
    if (cloudsRef.current) cloudsRef.current.rotation.y += rotationSpeed * 1.15

    // Xoay vành đai (nếu cần)
    if (ringRef.current && hasRing) ringRef.current.rotation.z -= rotationSpeed * 0.5
  })

  return (
    <group position={position}>
      {/* --- BỀ MẶT HÀNH TINH --- */}
      <Sphere ref={meshRef} args={[size, 64, 64]}>
        {isSun ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial
            map={texture} // Ảnh ban ngày
            color="#ffffff"
            metalness={0.4}
            roughness={0.7}
            // Hiệu ứng Đèn Đêm (City Lights)
            emissiveMap={nightTex || undefined}
            emissive={nightTex ? new THREE.Color("#ffddaa") : new THREE.Color("#000000")}
            emissiveIntensity={nightTex ? 0.5 : 0} // Độ sáng đèn đêm
          />
        )}
      </Sphere>

      {/* --- LỚP MÂY (EARTH) --- */}
      {hasClouds && cloudTex && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[size * 1.01, 64, 64]} />
          <meshStandardMaterial
            map={cloudTex}
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            alphaMap={cloudTex} // Dùng chính ảnh mây làm mặt nạ cắt phần đen
          />
        </mesh>
      )}

      {/* --- KHÍ QUYỂN (GLOW) --- */}
      {(hasAtmosphere || isSun) && (
        <Sphere args={[size * (isSun ? 1.05 : 1.03), 32, 32]}>
          <meshBasicMaterial
            color={isSun ? "#ffaa00" : atmosphereColor}
            transparent
            opacity={isSun ? 0.2 : 0.1}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      )}

      {/* --- VÀNH ĐAI (SATURN) --- */}
      {hasRing && (
        <mesh 
          ref={ringRef} 
          rotation={[Math.PI / 2.2, 0, 0]} // Nghiêng vành đai
        >
          <ringGeometry args={[size * 1.4, size * ringSize, 128]} />
          <meshStandardMaterial 
            map={ringTex} // Dùng ảnh saturn_ring.png
            color={ringTex ? "#ffffff" : "#CDBA96"} // Nếu ko có ảnh thì dùng màu
            side={THREE.DoubleSide} 
            transparent 
            opacity={0.9} 
          />
        </mesh>
      )}
    </group>
  )
}