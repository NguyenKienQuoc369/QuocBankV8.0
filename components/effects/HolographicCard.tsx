'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HolographicCardProps {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  balance: number;
  cvv?: string;
}

export function HolographicCard({
  cardNumber,
  cardHolder,
  expiry,
  balance
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.05, 1.05, 1.05)
      `;
    };

    const handleMouseLeave = () => {
      card.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, rotateY: -30 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative w-full aspect-[1.586/1] rounded-2xl cursor-pointer transition-transform duration-200 ease-out preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
        }}
      >
        {/* Card Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
          {/* Holographic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl" />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              animation: 'grid-flow 20s linear infinite'
            }} />
          </div>

          {/* Glowing Edges */}
          <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_0_30px_rgba(6,182,212,0.1)]" />

          {/* Holographic Shine */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] animate-shimmer" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono text-cyan-400/80 mb-1 tracking-wider">QUANTUM CARD</div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  QUOC
                  <span className="text-white">BANK</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/30 to-blue-400/30 border border-cyan-400/50 backdrop-blur flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 animate-pulse" />
                </div>
                <div className="text-[10px] font-mono text-cyan-400/60">NFC ENABLED</div>
              </div>
            </div>

            {/* Chip */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400/50 to-yellow-500/50 border border-amber-400/60 backdrop-blur shadow-lg">
                <div className="absolute inset-1 grid grid-cols-3 gap-[2px]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-amber-900/50 rounded-[1px]" />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-mono text-cyan-400/60 mb-1">BALANCE</div>
                <div className="text-xl font-bold font-mono text-white">
                  {balance.toLocaleString('vi-VN')} ₫
                </div>
              </div>
            </div>

            {/* Card Number */}
            <div>
              <div className="text-2xl font-mono tracking-[0.3em] text-white/90 mb-3">
                {cardNumber.match(/.{1,4}/g)?.join('  ') || cardNumber}
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400/60 mb-1">CARD HOLDER</div>
                  <div className="text-sm font-mono text-white/90 uppercase tracking-wider">
                    {cardHolder}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-cyan-400/60 mb-1">VALID THRU</div>
                  <div className="text-sm font-mono text-white/90">
                    {expiry}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Holographic Overlay Effects */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-cyan-500/10 to-blue-500/20 rounded-2xl pointer-events-none" />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-200%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        @keyframes grid-flow {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(20px, 20px);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
