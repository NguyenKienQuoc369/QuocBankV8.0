'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface PlanetProps {
  position: [number, number, number]
  size: number
  textureFile?: string
  color?: string
  rotationSpeed?: number
  isSun?: boolean
  hasRing?: boolean
  ringTextureFile?: string
  ringSize?: number
  hasClouds?: boolean
  hasAtmosphere?: boolean
  atmosphereColor?: string
  nightMapFile?: string
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
  
  const texturePath = textureFile ? `/textures/${textureFile}` : '/textures/earth_daymap.jpg'
  const texture = useTexture(texturePath, (t) => { t.colorSpace = THREE.SRGBColorSpace })

  const cloudTex = hasClouds ? useTexture('/textures/earth_clouds.jpg') : null
  const nightTex = nightMapFile ? useTexture(`/textures/${nightMapFile}`) : null
  const ringTex = ringTextureFile ? useTexture(`/textures/${ringTextureFile}`) : null

  if (ringTex) ringTex.rotation = -Math.PI / 2

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += rotationSpeed
    if (cloudsRef.current) cloudsRef.current.rotation.y += rotationSpeed * 1.15
    if (ringRef.current && hasRing) ringRef.current.rotation.z -= rotationSpeed * 0.5
  })

  return (
    <group position={position}>
      {/* --- BỀ MẶT --- */}
      <Sphere ref={meshRef} args={[size, 64, 64]}>
        {isSun ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            map={texture}
            color="#ffffff"
            metalness={0.4}
            roughness={0.7}
            emissiveMap={nightTex || undefined}
            emissive={nightTex ? new THREE.Color("#ffddaa") : new THREE.Color("#000000")}
            emissiveIntensity={nightTex ? 0.8 : 0} 
          />
        )}
      </Sphere>

      {/* --- HIỆU ỨNG MẶT TRỜI (Đã sửa lại gọn gàng) --- */}
      {isSun && (
        <Sphere args={[size * 1.1, 32, 32]}> {/* Chỉ to hơn 10% */}
            <meshBasicMaterial
              color="#ffaa00"
              transparent
              opacity={0.4}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
        </Sphere>
        /* ĐÃ XÓA SPHERE MÀU ĐỎ KHỔNG LỒ GÂY LỖI TẠI ĐÂY */
      )}

      {/* --- CÁC PHẦN KHÁC GIỮ NGUYÊN --- */}
      {hasClouds && cloudTex && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[size * 1.015, 64, 64]} />
          <meshStandardMaterial
            map={cloudTex}
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            alphaMap={cloudTex}
          />
        </mesh>
      )}

      {(hasAtmosphere || isSun) && !isSun && (
        <Sphere args={[size * 1.03, 32, 32]}>
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      )}

      {hasRing && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
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