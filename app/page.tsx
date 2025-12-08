'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { CosmicBackground } from '@/components/ui/CosmicBackground'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TextDecode } from '@/components/ui/TextDecode'
import { QuantumButton } from '@/components/ui/QuantumButton'
import { FloatingElement } from '@/components/ui/FloatingElement'
import { ScrollRocket } from '@/components/ui/ScrollRocket'
import { HoloDashboard } from '@/components/ui/HoloDashboard'
import { HyperText } from '@/components/ui/HyperText'
import { CosmicLogo } from '@/components/ui/CosmicLogo'
import { CosmicCursor } from '@/components/ui/CosmicCursor'
import { ArrowRight, ShieldCheck, Zap, Globe, Rocket, PlayCircle, Server, Activity, Smartphone, Star, Users, CheckCircle } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring, useInView, Variants } from 'framer-motion'

// --- 1. ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

// --- 2. SUB-COMPONENTS ---

// Số nhảy (Counter)
function Counter({ value }: { value: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const springValue = useSpring(0, { bounce: 0, duration: 2500 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (isInView) springValue.set(value)
  }, [isInView, value, springValue])

  useEffect(() => {
    springValue.on("change", (latest) => setDisplay(Math.floor(latest)))
  }, [springValue])

  return <span ref={ref}>{display.toLocaleString()}</span>
}

// Logo đối tác chạy (Marquee)
function PartnerMarquee() {
  const partners = ["GALAX_CORP", "STAR_LINK", "NEBULA_PAY", "QUANTUM_VC", "ORBIT_TECH", "VOID_BANK", "SOLAR_ENERGY"]
  return (
    <div className="w-full overflow-hidden py-10 border-y border-white/5 bg-black/20 backdrop-blur-sm relative z-20">
      <motion.div 
        className="flex gap-20 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...partners, ...partners].map((p, i) => (
          <div key={i} className="text-xl font-bold text-gray-600 uppercase tracking-widest hover:text-[#00ff88] transition-colors cursor-default">
             <HyperText text={p} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// --- 3. MAIN PAGE COMPONENT ---

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] })
  
  // Parallax Effect
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "60%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  return (
    <div ref={targetRef} className="min-h-screen flex flex-col font-sans text-white relative overflow-x-hidden selection:bg-[#00ff88] selection:text-black">
      
      {/* GLOBAL COMPONENTS */}
      <CosmicCursor /> 
      <ScrollRocket />

      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0">
        <CosmicBackground />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95 pointer-events-none" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-black/20 backdrop-blur-xl border border-white/5 rounded-full px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <Link href="/" className="flex items-center gap-3 group">
            <CosmicLogo size={40} />
            <span className="font-bold tracking-widest text-lg">QUOC<span className="text-[#00ff88]">BANK</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            {['Tính năng', 'Ứng dụng', 'Bảo mật'].map((item) => (
              <a key={item} href={`#${item.split(" ")[0]}`} className="hover:text-white transition-colors relative group px-2 py-1">
                <HyperText text={item} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff88] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <Link href="/login" className="hidden md:block text-xs font-bold px-4 py-2 hover:text-[#00ff88] transition-colors">
               <HyperText text="ĐĂNG NHẬP" />
             </Link>
             <Link href="/register">
                <QuantumButton className="px-6 py-2.5 text-xs rounded-full" variant="primary">
                   <HyperText text="MỞ TÀI KHOẢN" className="text-black" /> <ArrowRight size={14} />
                </QuantumButton>
             </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 w-full min-h-screen flex items-center pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* CỘT TRÁI: Hero Content */}
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="flex flex-col gap-8 text-center lg:text-left z-20">
            <FloatingElement duration={4}>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#00ff88] backdrop-blur-md w-fit mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
                <HyperText text="SYSTEM_V2.0: ONLINE" />
              </div>
            </FloatingElement>

            <div>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-4 text-shadow-glow">
                <div className="text-white mb-2"><HyperText text="NGÂN HÀNG" /></div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-300 to-cyan-500">
                  <TextDecode text="ĐA VŨ TRỤ" />
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                Quản lý tài sản liên hành tinh. Chuyển tiền tốc độ ánh sáng. Bảo mật lượng tử.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto justify-center lg:justify-start">
              <Link href="/register" className="w-full sm:w-auto">
                 <QuantumButton className="w-full text-lg" variant="primary">
                    <HyperText text="TRẠM CHỈ HUY" className="text-black" /> <Rocket size={20} />
                 </QuantumButton>
              </Link>
              <QuantumButton className="w-full sm:w-auto" variant="secondary">
                <PlayCircle size={20} className="group-hover:text-[#00ff88] transition-colors"/> <HyperText text="XEM DEMO" />
              </QuantumButton>
            </div>

            <div className="pt-8 border-t border-white/10 flex justify-center lg:justify-start gap-12">
               {[{ val: 5000000, label: "Công dân", icon: Users }, { val: 98000, label: "Hành tinh", icon: Globe }].map((stat, i) => (
                 <div key={i} className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                       <stat.icon size={20} className="text-[#00ff88]" /> 
                       <Counter value={stat.val} />+
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      <HyperText text={stat.label} />
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* CỘT PHẢI: Holo Dashboard */}
          <div className="hidden lg:block relative z-10 perspective-1000">
             <FloatingElement duration={6} yOffset={20}>
                <HoloDashboard />
             </FloatingElement>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#00ff88] to-transparent"></div>
          <span className="text-[10px] font-mono text-[#00ff88]">SCROLL_DOWN</span>
        </motion.div>
      </section>

      {/* PARTNERS MARQUEE */}
      <PartnerMarquee />

      {/* FEATURES GRID */}
      <section id="Tính" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <HyperText text="CÔNG NGHỆ" /> <span className="text-[#00ff88]"><HyperText text="LÕI" /></span>
            </h2>
            <div className="w-24 h-1 bg-[#00ff88] mx-auto rounded-full shadow-[0_0_20px_#00ff88]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
            
            {/* Card 1: Warp Speed */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="md:col-span-2">
               <SpotlightCard className="h-full group" spotlightColor="rgba(79, 70, 229, 0.3)">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
                 <div className="relative h-full flex flex-col justify-between p-8">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 border border-indigo-500/20"><Zap size={32} /></div>
                    <div>
                      <h3 className="text-3xl font-bold mb-3"><HyperText text="Warp Speed Transfer" /></h3>
                      <p className="text-gray-400 text-lg">Chuyển tiền siêu tốc độ ánh sáng. Xử lý hàng triệu giao dịch mỗi giây nhờ mạng lưới lượng tử phân tán.</p>
                    </div>
                 </div>
               </SpotlightCard>
            </motion.div>

            {/* Card 2: Quantum Safe */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ y: -5 }}>
               <SpotlightCard className="h-full" spotlightColor="rgba(0, 255, 136, 0.3)">
                 <div className="p-8 h-full flex flex-col justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-[#00ff88] border border-green-500/20"><ShieldCheck size={28} /></div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3"><HyperText text="Quantum Safe" /></h3>
                      <p className="text-gray-400">Mã hóa đa lớp an toàn tuyệt đối. Lá chắn năng lượng bảo vệ tài sản.</p>
                    </div>
                 </div>
               </SpotlightCard>
            </motion.div>

            {/* Card 3: Universal Pay */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ y: -5 }}>
               <SpotlightCard className="h-full" spotlightColor="rgba(6, 182, 212, 0.3)">
                 <div className="p-8 h-full flex flex-col justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20"><Globe size={28} /></div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3"><HyperText text="Universal Pay" /></h3>
                      <p className="text-gray-400">Thanh toán mọi nơi trong vũ trụ. Chuyển đổi tiền tệ tức thì.</p>
                    </div>
                 </div>
               </SpotlightCard>
            </motion.div>

            {/* Card 4: Virtual Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} whileHover={{ y: -5 }} className="md:col-span-2">
               <SpotlightCard className="h-full" spotlightColor="rgba(255, 255, 255, 0.2)">
                 <div className="flex flex-col md:flex-row items-center gap-10 h-full p-8">
                    <div className="flex-1">
                       <h3 className="text-3xl font-bold mb-3 text-white"><HyperText text="Thẻ Ảo Hologram" /></h3>
                       <p className="text-gray-400 mb-8 text-lg">Phát hành thẻ Visa ảo ngay lập tức. Tùy chỉnh màu sắc, hạn mức và đóng băng thẻ chỉ với một cú chạm.</p>
                       <Link href="/register">
                          <QuantumButton variant="secondary" className="text-sm px-6 py-2">
                             <HyperText text="PHÁT HÀNH NGAY" />
                          </QuantumButton>
                       </Link>
                    </div>
                    {/* HÌNH ẢNH THẺ VỚI LOGO MỚI */}
                    <motion.div whileHover={{ rotateY: 10, rotateX: -5 }} className="w-full md:w-1/2 aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                       <div className="flex justify-between items-start relative z-10">
                          <div className="text-2xl font-bold italic text-white tracking-tighter">VISA</div>
                          <CosmicLogo size={40} /> {/* Logo thay cho CPU */}
                       </div>
                       <div className="relative z-10">
                          <div className="text-white text-lg mb-2 font-mono tracking-widest text-shadow">4532  8899  1024  9999</div>
                          <div className="flex justify-between text-xs text-white/50 font-bold tracking-widest"><span>QUOC NGUYEN</span><span>12/99</span></div>
                       </div>
                    </motion.div>
                 </div>
               </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* APP SHOWCASE */}
      <section id="Ứng" className="relative z-10 py-32 bg-gradient-to-b from-transparent to-black/80">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative mx-auto">
              <div className="w-[320px] h-[650px] border-[8px] border-gray-800 rounded-[3rem] bg-black overflow-hidden relative shadow-[0_0_50px_rgba(0,255,136,0.2)]">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                 <div className="w-full h-full bg-gray-900 p-6 flex flex-col relative">
                    <div className="absolute inset-0 bg-[url('/textures/stars_milky_way.jpg')] opacity-30 bg-cover"></div>
                    <div className="text-[#00ff88] text-4xl font-mono font-bold mb-8 relative z-10 mt-16 text-center">9,850,000 ₫</div>
                    <div className="space-y-4 relative z-10">{[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl flex items-center px-4 gap-4"><div className="w-10 h-10 rounded-full bg-indigo-500/20"></div><div className="flex-1 h-4 bg-white/10 rounded"></div></div>)}</div>
                 </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full -z-10 animate-spin-slow pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#00ff88]/20 rounded-full -z-10 animate-spin-reverse-slow pointer-events-none"></div>
           </motion.div>
           <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">Ngân hàng trong <br/> <span className="text-[#00ff88]">Túi Áo Phi Hành Gia</span></h2>
              <div className="space-y-4">{["Xác thực mống mắt", "Dark Mode", "Thông báo vệ tinh", "Ví lạnh Crypto"].map((feat, i) => <div key={i} className="flex items-center gap-3"><div className="p-1 rounded-full bg-[#00ff88]/20 text-[#00ff88]"><CheckCircle size={16}/></div><span className="text-white"><HyperText text={feat} /></span></div>)}</div>
              <div className="flex gap-4 pt-4">
                 <QuantumButton variant="secondary" className="px-6 py-3 gap-2 flex items-center"><Smartphone size={20}/> <HyperText text="App Store" /></QuantumButton>
                 <QuantumButton variant="secondary" className="px-6 py-3 gap-2 flex items-center"><Smartphone size={20}/> <HyperText text="Google Play" /></QuantumButton>
              </div>
           </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="Bảo" className="relative z-10 py-32 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-4xl font-bold mb-16"><HyperText text="Truyền Tin Từ Khách Hàng" /></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { name: "Elon M.", role: "CEO, Mars Colony", msg: "Thanh toán nhiên liệu tên lửa cực nhanh!" },
                  { name: "Sarah K.", role: "Commander, ISS", msg: "Giao diện tối rất dịu mắt ngoài không gian." },
                  { name: "Alien X.", role: "Unknown", msg: "⍙⟒ ⌰⟟☍⟒ ⏁⊬⟟⌇ ⏚⏃⋏☍. (Ngân hàng tốt)" }
               ].map((item, i) => (
                  <SpotlightCard key={i} className="p-8" spotlightColor="rgba(255, 255, 255, 0.1)">
                     <div className="flex gap-1 mb-4 text-yellow-400">{[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}</div>
                     <p className="text-gray-300 mb-6 italic">"{item.msg}"</p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                        <div><div className="font-bold text-white"><HyperText text={item.name} /></div><div className="text-xs text-gray-500 uppercase">{item.role}</div></div>
                     </div>
                  </SpotlightCard>
               ))}
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-black pt-20 pb-10 px-6 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center mb-20">
             <h2 className="text-5xl font-bold mb-6"><HyperText text="Sẵn sàng cất cánh?" /></h2>
             <Link href="/register">
               <QuantumButton className="px-10 py-4 text-xl rounded-full" variant="primary">
                  <HyperText text="Mở Tài Khoản Ngay" className="text-black" />
               </QuantumButton>
             </Link>
          </div>
          <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2"><CosmicLogo size={32} /> © 2025 QuocBank. All rights reserved.</div>
            <div className="flex gap-6">
               <a href="#" className="hover:text-white">Điều khoản</a>
               <a href="#" className="hover:text-white">Bảo mật</a>
               <a href="#" className="hover:text-white">Bản đồ sao</a>
            </div>
          </div>
      </footer>
    </div>
  )
}