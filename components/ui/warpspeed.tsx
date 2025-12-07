'use client'
import { useEffect, useRef } from 'react'

export function WarpSpeed({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const c = canvasRef.current
    const ctx = c.getContext('2d')!
    let w = c.width = window.innerWidth
    let h = c.height = window.innerHeight
    
    // Cấu hình sao
    const stars: any[] = []
    const count = 800 // Số lượng vạch sáng
    const speed = 20  // Tốc độ bay

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w - w / 2,
        y: Math.random() * h - h / 2,
        z: Math.random() * w
      })
    }

    let animationId: number

    const draw = () => {
      // Hiệu ứng mờ dần (Motion Blur)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.fillRect(0, 0, w, h)
      
      ctx.translate(w / 2, h / 2)
      
      stars.forEach(s => {
        // Di chuyển sao về phía màn hình
        s.z -= speed
        if (s.z <= 0) {
          s.z = w
          s.x = Math.random() * w - w / 2
          s.y = Math.random() * h - h / 2
        }

        // Tính toán vị trí 3D -> 2D
        const x = (s.x / s.z) * w
        const y = (s.y / s.z) * h
        const size = (1 - s.z / w) * 5 // Sao càng gần càng to
        
        // Vẽ vạch sáng
        ctx.beginPath()
        ctx.fillStyle = `hsl(${Math.random() * 100 + 200}, 100%, 80%)` // Màu xanh/tím vũ trụ
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        
        // Vẽ đuôi sao (Line streak)
        const prevX = (s.x / (s.z + speed * 2)) * w
        const prevY = (s.y / (s.z + speed * 2)) * h
        ctx.beginPath()
        ctx.strokeStyle = `hsl(${Math.random() * 100 + 200}, 100%, 50%)`
        ctx.lineWidth = size
        ctx.moveTo(x, y)
        ctx.lineTo(prevX, prevY)
        ctx.stroke()
      })

      ctx.translate(-w / 2, -h / 2)
      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      w = c.width = window.innerWidth
      h = c.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-50 pointer-events-none"
    />
  )
}