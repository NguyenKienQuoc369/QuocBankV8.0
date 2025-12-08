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
  spotlightColor = "rgba(0, 255, 136, 0.15)",
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
      // UPDATE: Thêm bg-black/40 cố định ở đây để không bao giờ mất nền
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Lớp Spotlight: Chỉ hiện màu, không che nền */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      
      {/* Nội dung: z-20 để nổi lên trên spotlight */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  )
}