'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { CosmicBackground } from '@/components/ui/CosmicBackground'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TextDecode } from '@/components/ui/TextDecode'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { FloatingElement } from '@/components/ui/FloatingElement'
import { ArrowRight, ShieldCheck, Zap, Globe, CreditCard, Rocket, PlayCircle, Cpu, Server, Activity } from 'lucide-react'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] })
  
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  return (
    <div ref={targetRef} className="min-h-screen flex flex-col font-sans text-white relative overflow-x-hidden selection:bg-[#00ff88] selection:text-black">
      
      {/* 1. BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <CosmicBackground />
        {/* Overlay Noise nhẹ */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* 2. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-black/10 backdrop-blur-xl border border-white/5 rounded-full px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 360 }} 
              transition={{ duration: 0.6 }}
              className="w-8 h-8 rounded-full bg-[#00ff88] flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(0,255,136,0.6)]"
            >
              Q
            </motion.div>
            <span className="font-bold tracking-widest text-sm">QUOC<span className="text-[#00ff88]">BANK</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            {['Công nghệ', 'Hệ sinh thái', 'Về chúng tôi'].map((item) => (
              <a key={item} href={`#${item}`} className="hover:text-white transition-colors relative group overflow-hidden">
                <span className="relative z-10">{item}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00ff88] -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <Link href="/login">
                <MagneticButton className="hidden md:block text-xs font-bold px-4 py-2 hover:text-[#00ff88] transition-colors">
                  ĐĂNG NHẬP
                </MagneticButton>
             </Link>
             <Link href="/register">
                <MagneticButton className="px-5 py-2 rounded-full bg-[#00ff88] text-black text-xs font-bold hover:bg-[#00cc6a] shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center gap-2">
                   MỞ TÀI KHOẢN <ArrowRight size={14} />
                </MagneticButton>
             </Link>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative z-10 w-full min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          <motion.div 
            style={{ y: yText, opacity: opacityHero }} 
            className="flex flex-col gap-8 text-center lg:text-left z-20"
          >
            <FloatingElement duration={4}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#00ff88] w-fit mx-auto lg:mx-0 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
                SYSTEM_STATUS: ONLINE
              </motion.div>
            </FloatingElement>

            <div className="overflow-visible">
              <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[1] mb-2">
                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-white">
                   CHINH PHỤC
                </motion.div>
                
                <motion.span 
                  className="bg-clip-text text-transparent bg-[linear-gradient(110deg,#00ff88,45%,#ffffff,55%,#00ff88)] bg-[length:250%_100%]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <TextDecode text="KỶ NGUYÊN MỚI" />
                </motion.span>
              </h1>
            </div>

            <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Ngân hàng lượng tử đầu tiên vận hành trên nền tảng <span className="text-white font-semibold">Blockchain Đa Thiên Hà</span>. Giao dịch tức thì, phí 0đ, bảo mật tuyệt đối.
            </motion.p>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <Link href="/register">
                 <MagneticButton className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] relative overflow-hidden group">
                    <span className="relative z-10 flex items-center gap-2">KHỞI TẠO <Rocket size={20} /></span>
                    <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-gray-200/50"></div>
                 </MagneticButton>
              </Link>
              <MagneticButton className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md font-semibold flex items-center justify-center gap-2">
                 <PlayCircle size={20} /> XEM DEMO
              </MagneticButton>
            </motion.div>

            {/* Stats */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="pt-8 border-t border-white/10 flex justify-center lg:justify-start gap-12 mt-4">
               {[
                 { val: "5M+", label: "Citizens", icon: Server, color: "text-indigo-400" },
                 { val: "$90B", label: "Volume", icon: Activity, color: "text-[#00ff88]" },
                 { val: "0.01s", label: "Latency", icon: Zap, color: "text-yellow-400" }
               ].map((stat, i) => (
                 <FloatingElement key={i} delay={i * 0.5} yOffset={5}>
                    <motion.div variants={fadeInUp} className="text-center lg:text-left group cursor-default">
                        <div className={`text-3xl font-bold text-white flex items-center gap-2 group-hover:scale-110 transition-transform ${stat.color}`}>
                           <stat.icon size={24} /> {stat.val}
                        </div>
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
                    </motion.div>
                 </FloatingElement>
               ))}
            </motion.div>
          </motion.div>

          <div className="hidden lg:block"></div>
        </div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Scroll to Explore</span>
          <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 bg-[#00ff88] rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* 4. FEATURES GRID */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <FloatingElement duration={5} yOffset={10}>
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">CÔNG NGHỆ <span className="text-[#00ff88]">LÕI</span></h2>
            </FloatingElement>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
            {/* ... Cards ... */}
            <motion.div whileHover={{ y: -10, rotateX: 5, rotateY: 5 }} className="md:col-span-2 perspective-1000">
               <SpotlightCard className="h-full group" spotlightColor="rgba(79, 70, 229, 0.4)">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all"></div>
                 <div className="relative z-10 h-full flex flex-col justify-between p-8">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 border border-indigo-500/20">
                       <Zap size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-3">Warp Speed Transfer</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">Chuyển tiền siêu tốc độ ánh sáng. Xử lý hàng triệu giao dịch mỗi giây.</p>
                    </div>
                 </div>
               </SpotlightCard>
            </motion.div>

             {/* Card Security */}
             <motion.div whileHover={{ y: -10 }} className="perspective-1000">
               <SpotlightCard className="h-full" spotlightColor="rgba(0, 255, 136, 0.3)">
                 <div className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-[#00ff88] border border-green-500/20">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Quantum Safe</h3>
                    <p className="text-gray-400 leading-relaxed">Mã hóa đa lớp. Lá chắn năng lượng bảo vệ tài sản.</p>
                 </div>
               </SpotlightCard>
            </motion.div>

            {/* Card Global */}
            <motion.div whileHover={{ y: -10 }} className="perspective-1000">
               <SpotlightCard className="h-full" spotlightColor="rgba(6, 182, 212, 0.3)">
                 <div className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400 border border-cyan-500/20">
                        <Globe size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Universal Pay</h3>
                    <p className="text-gray-400 leading-relaxed">Kết nối vạn vật. Thanh toán dịch vụ toàn cầu.</p>
                 </div>
               </SpotlightCard>
            </motion.div>

            {/* Card Virtual */}
            <motion.div whileHover={{ y: -10 }} className="md:col-span-2 perspective-1000">
               <SpotlightCard className="h-full group" spotlightColor="rgba(255, 255, 255, 0.2)">
                 <div className="flex flex-col md:flex-row items-center gap-10 h-full p-8">
                    <div className="flex-1">
                       <h3 className="text-3xl font-bold mb-3 text-white">Thẻ Ảo Hologram</h3>
                       <p className="text-gray-400 mb-8 text-lg">Phát hành thẻ Visa ảo ngay lập tức. Tùy chỉnh màu sắc và hạn mức.</p>
                       <MagneticButton className="px-6 py-3 rounded-xl border border-[#00ff88] text-[#00ff88] font-bold hover:bg-[#00ff88] hover:text-black transition-all">
                          PHÁT HÀNH NGAY
                       </MagneticButton>
                    </div>
                    <motion.div 
                      whileHover={{ rotateY: 15, rotateX: -5 }}
                      className="w-full md:w-1/2 aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                    >
                       <div className="flex justify-between items-start relative z-10">
                          <div className="text-2xl font-bold italic text-white tracking-tighter">VISA</div>
                          <Cpu size={36} className="text-[#00ff88]" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-white text-lg mb-2 font-mono tracking-widest">4532  8899  1024  9999</div>
                       </div>
                    </motion.div>
                 </div>
               </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-black pt-20 pb-10 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
             <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-[#00ff88] flex items-center justify-center font-bold text-black text-xs">Q</div>
                <span className="font-bold text-lg">QUOCBANK</span>
             </div>
             <p className="text-gray-500 mb-8">Interstellar Financial System</p>
             <div className="text-xs text-gray-600">© 2025 QuocBank. All rights reserved.</div>
          </div>
      </footer>
    </div>
  )
}