 'use client'

import { useEffect, useState } from 'react'

export default function DashboardLoading() {
   const [lines, setLines] = useState<{ top: string; delay: string; opacity: number }[]>([])

   useEffect(() => {
      const generated = new Array(10).fill(0).map(() => ({
         top: `${Math.random() * 100}%`,
         delay: `${Math.random()}s`,
         opacity: Math.random(),
      }))
      const raf = requestAnimationFrame(() => setLines(generated))
      return () => cancelAnimationFrame(raf)
   }, [])

   return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-xl relative overflow-hidden rounded-3xl">
      
      {/* Vòng quay năng lượng */}
      <div className="relative w-24 h-24">
         <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00ff88] animate-spin"></div>
         <div className="absolute inset-2 rounded-full border-4 border-transparent border-r-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
         </div>
      </div>

      <p className="mt-8 text-[#00ff88] font-mono text-sm tracking-[0.2em] animate-pulse">
         LOADING DATA STREAMS...
      </p>

      {/* Hiệu ứng tia sáng chạy ngang (Warp lines) */}
         <div className="absolute inset-0 pointer-events-none opacity-20">
            {lines.map((l, i) => (
               <div
                  key={i}
                  className="absolute h-[1px] bg-white animate-[scan_2s_linear_infinite]"
                  style={{
                     top: l.top,
                     left: 0,
                     right: 0,
                     animationDelay: l.delay,
                     opacity: l.opacity,
                  }}
               />
            ))}
         </div>
    </div>
  )
}