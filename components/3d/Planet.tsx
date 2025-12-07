'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface PlanetProps {
  position?: [number, number, number]
  size?: number
  color?: string
  rotationSpeed?: number
  hasRing?: boolean
}

export function Planet({ 
  position = [0, 0, 0], 
  size = 1, 
  color = "#ffffff", 
  rotationSpeed = 0.005,
  hasRing = false
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
    }
  })

  return (
    <group position={position}>
      {/* Lõi hành tinh */}
      <Sphere ref={meshRef} args={[size, 64, 64]}>
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.7}
          emissive={color}
          emissiveIntensity={0.1} 
        />
      </Sphere>

      {/* Vành đai (Ring) - Dành cho sao Thổ/Mộc */}
      {hasRing && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[size * 1.4, size * 2, 64]} />
          <meshStandardMaterial 
            color={color} 
            side={THREE.DoubleSide} 
            transparent 
            opacity={0.4} 
          />
        </mesh>
      )}
      
      {/* Khí quyển mờ */}
      <Sphere args={[size * 1.2, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          side={THREE.BackSide} 
        />
      </Sphere>
    </group>
  )
}