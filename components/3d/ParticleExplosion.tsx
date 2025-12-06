'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleExplosion() {
  const particlesRef = useRef<THREE.Points>(null)

  const particleCount = 200
  const particlesDataRef = useRef<{
    positions: Float32Array
    velocities: Float32Array
  } | null>(null)

  const [, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    const init = () => {
      const positions = new Float32Array(particleCount * 3)
      const velocities = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0

        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const speed = Math.random() * 0.2 + 0.1

        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
        velocities[i * 3 + 2] = Math.cos(phi) * speed
      }

      if (mounted) {
        particlesDataRef.current = { positions, velocities }
        // Trigger a re-render so bufferAttribute mounts with data
        setReady(true)
      }
    }

    const raf = requestAnimationFrame(init)
    return () => {
      mounted = false
      cancelAnimationFrame(raf)
    }
  }, [])

  useFrame(() => {
    if (particlesRef.current && particlesDataRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array
      const velocities = particlesDataRef.current.velocities

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3]
        positions[i * 3 + 1] += velocities[i * 3 + 1]
        positions[i * 3 + 2] += velocities[i * 3 + 2]

        // Add gravity
        velocities[i * 3 + 1] -= 0.002
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const positions = particlesDataRef.current?.positions ?? new Float32Array(0)

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00ff88"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
