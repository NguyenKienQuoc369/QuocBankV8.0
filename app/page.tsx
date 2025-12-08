'use client'

import Link from 'next/link'
import { CosmicBackground } from '@/components/ui/CosmicBackground'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { ArrowRight, ShieldCheck, Zap, Globe, CreditCard, Rocket, PlayCircle, Cpu, Server, Activity } from 'lucide-react'
import { motion, Variants } from 'framer-motion' // 1. Import thêm Type Variants

// 2. Khai báo kiểu dữ liệu rõ ràng để tránh lỗi TypeScript
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
    transition: {
      staggerChildren: 0.15
    }
  }
}

export default function LandingPage() {
  const isLoggedIn = false 

  return (
    <div className="min-h-screen flex flex-col font-sans text-white relative overflow-x-hidden">
      
      {/* 1. BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <CosmicBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* 2. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/10 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88] flex items-center justify-center font-bold text-black text-xl shadow-[0_0_20px_rgba(0,255,136,0.4)] group-hover:scale-110 transition-transform">
              Q
            </div>
            <span className="text-xl font-bold tracking-wider">QUOC<span className="text-[#00ff88]">BANK</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-[#00ff88] transition-colors relative group">
              Công nghệ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff88] transition-all group-hover:w-full"></span>
            </a>
            <a href="#ecosystem" className="hover:text-[#00ff88] transition-colors relative group">
              Hệ sinh thái
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff88] transition-all group-hover:w-full"></span>
            </a>
            <a href="#about" className="hover:text-[#00ff88] transition-colors relative group">
              Về chúng tôi
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff88] transition-all group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-gray-300 hover:text-white font-medium px-4 hover:bg-white/5 rounded-full py-2 transition-all">
              Đăng nhập
            </Link>
            <Link href="/register" className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black font-bold hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              Mở tài khoản <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative z-10 w-full min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* CỘT TRÁI */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-8 text-center lg:text-left z-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold w-fit mx-auto lg:mx-0 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              HỆ THỐNG TÀI CHÍNH LIÊN SAO V2.0
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Chinh Phục <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-cyan-400 to-indigo-500 animate-gradient-x">
                Kỷ Nguyên Mới
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Trải nghiệm ngân hàng lượng tử với tốc độ ánh sáng. 
              Bảo mật tuyệt đối, giao dịch tức thì trên toàn hệ mặt trời với chi phí 0đ.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <Link 
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00ff88] text-black font-bold text-lg hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                Trạm Chỉ Huy <Rocket size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md font-semibold flex items-center justify-center gap-2 transition-all group">
                <PlayCircle size={20} className="text-gray-400 group-hover:text-white transition-colors"/>
                Xem Demo
              </button>
            </motion.div>

            {/* Stats Section */}
            <motion.div variants={fadeInUp} className="pt-8 border-t border-white/10 flex flex-wrap justify-center lg:justify-start gap-12 mt-4">
               <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white flex items-center gap-1"><Server size={20} className="text-indigo-400"/> 5M+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Người dùng</div>
               </div>
               <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white flex items-center gap-1"><Activity size={20} className="text-[#00ff88]"/> $90B</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Giao dịch/Năm</div>
               </div>
               <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white flex items-center gap-1"><Zap size={20} className="text-yellow-400"/> 0.01s</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Độ trễ</div>
               </div>
            </motion.div>
          </motion.div>

          {/* CỘT PHẢI: Không gian 3D + Thẻ nổi */}
          <div className="relative h-[600px] w-full hidden lg:block">
             <motion.div 
               initial={{ x: 50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="absolute top-1/4 -right-4 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 animate-bounce-slow z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
             >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-[#00ff88]">
                   <Zap size={24} />
                </div>
                <div>
                   <div className="text-sm text-gray-400">Giao dịch thành công</div>
                   <div className="text-xl font-bold text-white">+ 50.000.000 đ</div>
                </div>
             </motion.div>
             
             <motion.div 
               initial={{ x: -50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.8, duration: 0.8 }}
               className="absolute bottom-1/4 -left-10 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 animate-bounce-slow z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)]" 
               style={{ animationDelay: '1s'}}
             >
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                   <ShieldCheck size={24} />
                </div>
                <div>
                   <div className="text-sm text-gray-400">Trạng thái hệ thống</div>
                   <div className="text-xl font-bold text-blue-400">BẢO MẬT 100%</div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section id="features" className="relative z-10 py-24 bg-black/60 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Công Nghệ Vượt Thời Gian</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Kết hợp sức mạnh của điện toán lượng tử và giao diện thực tế ảo để mang lại trải nghiệm tài chính chưa từng có.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
               <SpotlightCard className="h-full group" spotlightColor="rgba(79, 70, 229, 0.4)">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                 <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                         <Zap size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Chuyển tiền Warp Speed</h3>
                      <p className="text-gray-400 max-w-md">Công nghệ xử lý song song cho phép chuyển tiền tức thì đến bất kỳ tài khoản nào trong hệ thống, bất kể khoảng cách địa lý.</p>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                       <div className="h-full bg-gradient-to-r from-indigo-500 to-[#00ff88] w-2/3 animate-pulse"></div>
                    </div>
                 </div>
               </SpotlightCard>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
            >
               <SpotlightCard className="h-full" spotlightColor="rgba(0, 255, 136, 0.3)">
                 <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 text-[#00ff88]">
                    <ShieldCheck size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-2">Bảo mật Lượng tử</h3>
                 <p className="text-gray-400 text-sm">Mã hóa End-to-End chuẩn quân sự. Tài sản được bảo vệ bởi lá chắn năng lượng đa lớp.</p>
               </SpotlightCard>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
            >
               <SpotlightCard className="h-full" spotlightColor="rgba(6, 182, 212, 0.3)">
                 <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                    <Globe size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-2">Kết nối Vạn vật</h3>
                 <p className="text-gray-400 text-sm">Thanh toán mọi hóa đơn điện, nước, internet vệ tinh. Hỗ trợ quy đổi mọi loại tiền tệ liên hành tinh.</p>
               </SpotlightCard>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
               className="md:col-span-2"
            >
               <SpotlightCard className="h-full group" spotlightColor="rgba(255, 255, 255, 0.2)">
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00ff88]/10 rounded-full blur-3xl group-hover:bg-[#00ff88]/20 transition-all"></div>
                 <div className="flex flex-col md:flex-row items-center gap-8 h-full">
                    <div className="flex-1">
                       <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-white">
                          <CreditCard size={24} />
                       </div>
                       <h3 className="text-2xl font-bold mb-2">Thẻ Ảo Hologram</h3>
                       <p className="text-gray-400 mb-6">Phát hành thẻ Visa ảo ngay lập tức. Tùy chỉnh hạn mức, khóa thẻ khẩn cấp và theo dõi chi tiêu thời gian thực.</p>
                       <Link href="/register" className="text-[#00ff88] font-bold hover:underline flex items-center gap-2">
                          Phát hành ngay <ArrowRight size={16} />
                       </Link>
                    </div>
                    {/* Visual thẻ ảo */}
                    <div className="w-full md:w-1/2 aspect-video bg-black/40 rounded-xl border border-white/20 p-6 flex flex-col justify-between transform group-hover:scale-105 transition-transform duration-500 shadow-2xl relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                       <div className="flex justify-between items-start relative z-10">
                          <div className="text-xl font-bold italic text-white/90">VISA</div>
                          <Cpu size={32} className="text-yellow-500/90" />
                       </div>
                       <div className="relative z-10">
                          <div className="text-white/80 text-sm mb-2 font-mono tracking-widest">4532 •••• •••• 9999</div>
                          <div className="flex justify-between text-xs text-white/50">
                             <span>CARD HOLDER</span>
                             <span>12/30</span>
                          </div>
                       </div>
                    </div>
                 </div>
               </SpotlightCard>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative z-10 bg-black pt-20 pb-10 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-[#00ff88] flex items-center justify-center font-bold text-black text-xs">Q</div>
              <span className="font-bold text-lg">QUOCBANK</span>
            </div>
            <p className="text-gray-500 max-w-sm">
              Định hình lại tương lai tài chính. Chúng tôi cung cấp nền tảng ngân hàng an toàn, nhanh chóng và minh bạch nhất vũ trụ.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Sản phẩm</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-[#00ff88] transition-colors">Tài khoản thanh toán</a></li>
              <li><a href="#" className="hover:text-[#00ff88] transition-colors">Thẻ tín dụng ảo</a></li>
              <li><a href="#" className="hover:text-[#00ff88] transition-colors">Khoang tiết kiệm</a></li>
              <li><a href="#" className="hover:text-[#00ff88] transition-colors">API Doanh nghiệp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Hỗ trợ</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-[#00ff88] transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-[#00ff88] transition-colors">Trạng thái hệ thống</a></li>
              <li><a href="#" className="hover:text-[#00ff88] transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-[#00ff88] transition-colors">Điều khoản & Bảo mật</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <div>© 2025 QuocBank Interstellar. All rights reserved.</div>
          <div className="flex gap-4">
             <span>Earth HQ</span>
             <span>Mars Branch</span>
             <span>Moon Station</span>
          </div>
        </div>
      </footer>
    </div>
  )
}