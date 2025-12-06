'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const SupernovaBackground = () => {
  const [meteors, setMeteors] = useState<number[]>([]);

  // Tạo sao băng ngẫu nhiên (chỉ khởi tạo 1 lần trên client)
  useEffect(() => {
    const meteorCount = 10;
    const list = new Array(meteorCount).fill(0).map((_, i) => i)
    const raf = requestAnimationFrame(() => setMeteors(list))
    return () => cancelAnimationFrame(raf)
  }, []);

  const [meteorProps, setMeteorProps] = useState<{ top: string; left: string; delay: string; duration: string }[]>([])

  useEffect(() => {
    if (!meteors.length) return
    const props = meteors.map(() => ({
      top: Math.floor(Math.random() * 100) + '%',
      left: Math.floor(Math.random() * 100) + '%',
      delay: Math.random() * 5 + 's',
      duration: Math.floor(Math.random() * 8 + 2) + 's',
    }))
    const raf = requestAnimationFrame(() => setMeteorProps(props))
    return () => cancelAnimationFrame(raf)
  }, [meteors])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#000000] -z-10">
      
      {/* 1. Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-[#000000] to-[#000000]" />

      {/* 2. THE BLACK HOLE / SUPERNOVA CORE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-60">
        
        {/* Lõi sáng trung tâm */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-[100px] opacity-50 animate-pulse" />
        
        {/* Vòng xoáy năng lượng (Accretion Disk) */}
        <div className="absolute inset-0 border-[2px] border-white/20 rounded-full animate-spin-slow" style={{ animationDuration: '30s' }}>
           <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full blur-[4px] shadow-[0_0_20px_white]" />
        </div>
        <div className="absolute inset-40 border-[1px] border-white/10 rounded-full animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
        
        {/* Sóng xung kích lan tỏa */}
        <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-shockwave" />
        <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-shockwave" style={{ animationDelay: '1s' }} />
      </div>

      {/* 3. Stars (Static Field) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-200"></div>
      
      {/* 4. Meteors (Sao băng rơi) */}
      {meteors.map((el, idx) => (
        <span
          key={idx}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: meteorProps[idx]?.top,
            left: meteorProps[idx]?.left,
            animationDelay: meteorProps[idx]?.delay,
            animationDuration: meteorProps[idx]?.duration,
          }}
        >
          {/* Đuôi sao băng */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[100px] -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-transparent" />
        </span>
      ))}
    </div>
  );
};
