'use client'

import { motion } from 'framer-motion'

export function FloatingElement({ 
  children, 
  delay = 0, 
  duration = 6,
  yOffset = 15 // Độ cao trôi
}: { 
  children: React.ReactNode, 
  delay?: number,
  duration?: number,
  yOffset?: number
}) {
  return (
    <motion.div
      animate={{ y: [0, -yOffset, 0] }}
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