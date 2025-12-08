'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CHARS = "-_~=+*&^%$#@!0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function TextDecode({ text, className = "" }: { text: string, className?: string }) {
  const [display, setDisplay] = useState("")
  
  useEffect(() => {
    let iteration = 0
    let interval: NodeJS.Timeout

    interval = setInterval(() => {
      setDisplay(prev => 
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join("")
      )

      if (iteration >= text.length) clearInterval(interval)
      iteration += 1 / 3
    }, 30)

    return () => clearInterval(interval)
  }, [text])

  return <motion.span className={className}>{display}</motion.span>
}