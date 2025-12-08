import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { CosmicBackground } from '@/components/ui/CosmicBackground' // Nền vũ trụ mới
import { ArrowRight, ShieldCheck, Zap, Globe, CreditCard, Lock, Rocket, PlayCircle, Cpu, Radio } from 'lucide-react'

export default async function LandingPage() {
  const session = await getSession()
  const isLoggedIn = !!session

  return (
    <div className="min-h-screen flex flex-col font-sans text-white relative overflow-x-hidden">
      
      {/* 1. BACKGROUND: Vũ trụ bao trùm (Fixed) */}
      <div className="fixed inset-0 z-0">
        <CosmicBackground />
        {/* Gradient overlay để text dễ đọc hơn trên nền sao */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* 2. NAVBAR: Thanh điều hướng kính mờ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/10 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88] flex items-center justify-center font-bold text-black text-xl shadow-[0_0_20px_rgba(0,255,136,0.4)]">
              Q
            </div>
            <span className="text-xl font-bold tracking-wider">QUOC<span className="text-[#00ff88]">BANK</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white hover:text-[#00ff88] transition-colors">Công nghệ</a>
            <a href="#security" className="hover:text-white hover:text-[#00ff88] transition-colors">Bảo mật</a>
            <a href="#ecosystem" className="hover:text-white hover:text-[#00ff88] transition-colors">Hệ sinh thái</a>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 font-semibold flex items-center gap-2 transition-all group">
                Vào Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-gray-300 hover:text-white font-medium px-4">
                  Đăng nhập
                </Link>
                <Link href="/register" className="px-6 py-2 rounded-full bg-[#00ff88] text-black font-bold hover:shadow-[0_0_20px_#00ff88] transition-all hover:scale-105">
                  Mở tài khoản
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION: Trái tim của trang chủ */}
      <section className="relative z-10 w-full min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Cột Trái: Text Content */}
          <div className="flex flex-col gap-8 text-center lg:text-left z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold w-fit mx-auto lg:mx-0 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              HỆ THỐNG TÀI CHÍNH LIÊN SAO V2.0
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Chinh Phục <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-cyan-400 to-indigo-500">
                Kỷ Nguyên Mới
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Trải nghiệm ngân hàng lượng tử với tốc độ ánh sáng. 
              Bảo mật tuyệt đối, giao dịch tức thì trên toàn hệ mặt trời với chi phí 0đ.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <Link 
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00ff88] text-black font-bold text-lg hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                {isLoggedIn ? 'Trạm Chỉ Huy' : 'Mở Tài Khoản'} <Rocket size={20} />
              </Link>
              
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md font-semibold flex items-center justify-center gap-2 transition-all group">
                <PlayCircle size={20} className="text-gray-400 group-hover:text-white transition-colors"/>
                Xem Demo
              </button>
            </div>

            {/* Chỉ số tin cậy (Stats) */}
            <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center lg:justify-start gap-12">
               <div>
                  <div className="text-3xl font-bold text-white">5M+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Người dùng</div>
               </div>
               <div>
                  <div className="text-3xl font-bold text-white">$90B</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Giao dịch/Năm</div>
               </div>
               <div>
                  <div className="text-3xl font-bold text-white">0.01s</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Độ trễ</div>
               </div>
            </div>
          </div>

          {/* Cột Phải: Không gian trống để nhìn thấy 3D Background */}
          {/* Note: Ta để trống để người dùng nhìn thấy Hệ Mặt Trời từ file CosmicBackground ở lớp dưới */}
          <div className="relative h-[500px] w-full hidden lg:block">
             {/* Thẻ nổi trang trí */}
             <div className="absolute top-1/4 right-0 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-[#00ff88]">
                   <Zap size={24} />
                </div>
                <div>
                   <div className="text-sm text-gray-400">Giao dịch mới</div>
                   <div className="text-xl font-bold text-white">+ 50.000.000 đ</div>
                </div>
             </div>
             
             <div className="absolute bottom-1/4 left-10 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 animate-bounce-slow" style={{ animationDelay: '1s'}}>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                   <ShieldCheck size={24} />
                </div>
                <div>
                   <div className="text-sm text-gray-400">Trạng thái hệ thống</div>
                   <div className="text-xl font-bold text-blue-400">BẢO MẬT 100%</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID: Công nghệ lõi (Bento Grid) */}
      <section id="features" className="relative z-10 py-24 bg-black/60 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Công Nghệ Vượt Thời Gian</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Kết hợp sức mạnh của điện toán lượng tử và giao diện thực tế ảo để mang lại trải nghiệm tài chính chưa từng có.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* Card 1: Warp Speed (Large) */}
            <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 relative overflow-hidden group hover:border-[#00ff88]/30 transition-all">
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
            </div>

            {/* Card 2: Security */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 relative overflow-hidden group hover:border-[#00ff88]/30 transition-all hover:-translate-y-1">
               <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 text-[#00ff88]">
                  <ShieldCheck size={24} />
               </div>
               <h3 className="text-xl font-bold mb-2">Bảo mật Lượng tử</h3>
               <p className="text-gray-400 text-sm">Mã hóa End-to-End chuẩn quân sự. Tài sản của bạn được bảo vệ bởi lá chắn năng lượng đa lớp.</p>
            </div>

            {/* Card 3: Global */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 relative overflow-hidden group hover:border-[#00ff88]/30 transition-all hover:-translate-y-1">
               <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                  <Globe size={24} />
               </div>
               <h3 className="text-xl font-bold mb-2">Kết nối Vạn vật</h3>
               <p className="text-gray-400 text-sm">Thanh toán mọi hóa đơn điện, nước, internet vệ tinh. Hỗ trợ quy đổi mọi loại tiền tệ liên hành tinh.</p>
            </div>

            {/* Card 4: Virtual Card (Large) */}
            <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 relative overflow-hidden group hover:border-[#00ff88]/30 transition-all">
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
                  <div className="w-full md:w-1/2 aspect-video bg-black/40 rounded-xl border border-white/20 p-6 flex flex-col justify-between transform group-hover:scale-105 transition-transform duration-500">
                     <div className="flex justify-between items-start">
                        <div className="text-xl font-bold italic text-white/80">VISA</div>
                        <Cpu size={32} className="text-yellow-500/80" />
                     </div>
                     <div>
                        <div className="text-white/60 text-sm mb-1 font-mono">4532 •••• •••• 9999</div>
                        <div className="flex justify-between text-xs text-white/40">
                           <span>CARD HOLDER</span>
                           <span>12/30</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOOTER: Chân trang */}
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
          <div>© 2025 QuocBank Financial Systems. All rights reserved.</div>
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