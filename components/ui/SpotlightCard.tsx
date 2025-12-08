'use client'

import { useRef, useState } from 'react'

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({ 
  children, 
  className = "", 
  spotlightColor = "rgba(0, 255, 136, 0.15)", // Giảm độ đậm spotlight cho đỡ gắt
  ...props 
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => setOpacity(0)

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // QUAN TRỌNG: Giữ background cố định ở đây, không để spotlight đè lên
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}
      {...props}
    >
      {/* Lớp Spotlight chỉ tác động lên Border hoặc Overlay rất nhẹ */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      
      {/* Nội dung bên trong phải có z-index cao hơn spotlight */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}