'use client'

import { motion } from 'framer-motion'

export function FloatingElement({ 
  children, 
  delay = 0, 
  duration = 6,
  yOffset = 15 // Độ cao trôi
  , rotation = 0
}: { 
  children: React.ReactNode, 
  delay?: number,
  duration?: number,
  yOffset?: number,
  rotation?: number
}) {
  const animateProps: any = { y: [0, -yOffset, 0] }
  if (rotation && rotation !== 0) animateProps.rotate = [0, rotation, 0]

  return (
    <motion.div
      animate={animateProps}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  )
}