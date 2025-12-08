'use client'

import { useRef, useState, useEffect } from 'react'
import { useHover } from './HoverContext' // Import context vừa tạo

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"

export function HyperText({ text, className = "" }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isParentHovered = useHover() // Nhận tín hiệu từ cha (Card/Button)
  const [isSelfHovered, setIsSelfHovered] = useState(false) // Tín hiệu từ chính nó

  // Hàm kích hoạt hiệu ứng chạy chữ
  const triggerAnimation = () => {
    let iteration = 0
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) => 
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " "
            if (index < iteration) return text[index]
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          })
          .join("")
      )

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }

      iteration += 1 / 3
    }, 30)
  }

  // Effect: Chạy khi cha Hover HOẶC chính nó Hover
  useEffect(() => {
    if (isParentHovered || isSelfHovered) {
      triggerAnimation()
    }
  }, [isParentHovered, isSelfHovered])

  return (
    <span 
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsSelfHovered(true)}
      onMouseLeave={() => setIsSelfHovered(false)}
    >
      {displayText}
    </span>
  )
}