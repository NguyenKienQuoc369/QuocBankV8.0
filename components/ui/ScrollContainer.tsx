'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface ScrollContainerProps {
  children: ReactNode
  className?: string
  onScroll?: {
    scrollYProgress: MotionValue<number>
    yHero: MotionValue<string>
    opacityHero: MotionValue<number>
    rocketTop: MotionValue<string>
  }
}

export function ScrollContainer({ children, className = '' }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // useScroll hook must be called here in the client-side component
  // with the ref already attached to DOM
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end start"] 
  })

  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const rocketTop = useTransform(scrollYProgress, [0, 1], ['0%', '90%'])

  // Store these in context or pass down if needed
  return (
    <div 
      ref={containerRef} 
      className={className}
      data-scroll-container
    >
      {children}
    </div>
  )
}
