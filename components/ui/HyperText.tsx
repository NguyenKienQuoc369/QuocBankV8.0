'use client'

import { useRef, useState } from 'react'

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"

export function HyperText({ text, className = "" }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    let iteration = 0
    clearInterval(intervalRef.current!)

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) => 
        text
          .split("")
          .map((letter, index) => {
            // Giữ nguyên khoảng trắng để không bị giật layout
            if (letter === " ") return " "
            
            // Nếu đã chạy qua ký tự này rồi thì hiển thị chữ gốc
            if (index < iteration) {
              return text[index]
            }
            // Ngược lại thì hiển thị ký tự random
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          })
          .join("")
      )

      if (iteration >= text.length) {
        clearInterval(intervalRef.current!)
      }

      iteration += 1 / 3 // Tốc độ giải mã
    }, 30)
  }

  return (
    <span 
      className={`cursor-pointer inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  )
}