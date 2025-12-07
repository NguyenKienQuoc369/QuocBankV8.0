// app/page.tsx
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { SupernovaBackground } from '@/components/ui/SupernovaBackground'
import SolarSystem from '@/components/3d/SolarSystem' // Import component mới
import { ArrowRight, ShieldCheck, Zap, Globe, CreditCard, Lock, Rocket, PlayCircle } from 'lucide-react'

export default async function LandingPage() {
  const session = await getSession()
  const isLoggedIn = !!session

  return (
    <div className="min-h-screen flex flex-col font-sans text-white relative overflow-x-hidden">
      
      {/* 1. Background Layer */}
      <div className="fixed inset-0 z-0">
        <SupernovaBackground />
        {/* Lớp phủ gradient để làm nổi bật text bên trái */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* 2. Navbar */}
      <nav className="relative z-50 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#00ff88] flex items-center justify-center font-bold text-black text-xl shadow-[0_0_20px_rgba(0,255,136,0.4)]">
            Q
          </div>
          <span className="text-xl font-bold tracking-wider">QUOC<span className="text-[#00ff88]">BANK</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Công nghệ</a>
          <a href="#ecosystem" className="hover:text-white transition-colors">Hệ sinh thái</a>
          <a href="#about" className="hover:text-white transition-colors">Về chúng tôi</a>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/dashboard" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 font-semibold flex items-center gap-2 transition-all">
              Dashboard <ArrowRight size={16}/>
            </Link>
          ) : (
            <Link href="/login" className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all font-medium">
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>

      {/* 3. HERO SECTION (Layout Mới) */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 pb-20 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* CỘT TRÁI: Nội dung (Text) */}
          <div className="flex flex-col gap-8 text-center lg:text-left z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold w-fit mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              NGÂN HÀNG LƯỢNG TỬ V2.0
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Chinh Phục <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-cyan-400 to-indigo-500">
                Kỷ Nguyên Tài Chính
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Quản lý tài sản đa thiên hà với tốc độ ánh sáng. 
              Hệ thống bảo mật sinh trắc học lượng tử và giao dịch tức thì.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center lg:justify-start">
              <Link 
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00ff88] text-black font-bold text-lg hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                {isLoggedIn ? 'Vào Trạm Chỉ Huy' : 'Mở Tài Khoản Ngay'} 
                <Rocket size={20} />
              </Link>
              
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md font-semibold flex items-center justify-center gap-2 transition-all group">
                <PlayCircle size={20} className="text-gray-400 group-hover:text-white transition-colors"/>
                Xem Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Giả lập logo đối tác */}
               <div className="flex items-center gap-2 font-bold text-xl"><Globe size={24}/> GALAX_PAY</div>
               <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck size={24}/> STAR_SECURE</div>
            </div>
          </div>

          {/* CỘT PHẢI: 3D Visualization (Hệ Mặt Trời) */}
          <div className="relative h-[500px] lg:h-[700px] w-full flex items-center justify-center">
            {/* Hiệu ứng nền toả sáng sau hành tinh */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Component 3D được đóng khung đẹp đẽ */}
            <div className="w-full h-full relative z-10 animate-float-slow">
               <SolarSystem className="w-full h-full" />
            </div>

            {/* Các thẻ bài trôi nổi (Floating Cards) tạo chiều sâu */}
            <div className="absolute top-20 right-0 lg:-right-10 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl z-20 animate-bounce-slow hidden md:block">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><Zap size={20} /></div>
                  <div>
                     <div className="text-xs text-gray-400">Giao dịch thành công</div>
                     <div className="font-bold text-[#00ff88]">+ 500.000.000 VND</div>
                  </div>
               </div>
            </div>

            <div className="absolute bottom-40 left-0 lg:-left-10 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl z-20 animate-bounce-slow" style={{ animationDelay: '1s' }}>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><ShieldCheck size={20} /></div>
                  <div>
                     <div className="text-xs text-gray-400">Trạng thái bảo mật</div>
                     <div className="font-bold text-blue-400">AN TOÀN TUYỆT ĐỐI</div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURES SECTION (Bento Grid cũ - Giữ nguyên vì đã đẹp) */}
      <section id="features" className="relative z-10 py-20 bg-black/50 border-t border-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Công Nghệ Vượt Thời Gian</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Tích hợp những công nghệ tiên tiến nhất từ lõi giao dịch lượng tử đến giao diện thực tế ảo.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-all hover:-translate-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
                <Zap className="text-indigo-400 group-hover:text-[#00ff88]" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Chuyển tiền Warp Speed</h3>
              <p className="text-gray-400 leading-relaxed">
                Gửi và nhận tiền ngay lập tức bất kể khoảng cách. Hệ thống xử lý song song đảm bảo giao dịch thông suốt.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-all hover:-translate-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all">
                <ShieldCheck className="text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Bảo mật đa lớp</h3>
              <p className="text-gray-400 leading-relaxed">
                Lá chắn năng lượng bảo vệ tài sản của bạn 24/7. Mã hóa End-to-End chuẩn quân sự thiên hà.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-all hover:-translate-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                <Globe className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Kết nối vạn vật</h3>
              <p className="text-gray-400 leading-relaxed">
                Thanh toán hóa đơn điện, nước, internet vệ tinh chỉ với một cú chạm. Hỗ trợ mọi đơn vị tiền tệ.
              </p>
            </div>

            {/* Feature 4 (Large) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#00ff88]/50 transition-all flex flex-col md:flex-row items-center gap-8 group">
              <div className="flex-1">
                 <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <CreditCard className="text-[#00ff88]" size={24} />
                    Thẻ ảo Hologram
                 </h3>
                 <p className="text-gray-400 leading-relaxed mb-6">
                    Phát hành thẻ Visa ảo ngay lập tức. Tùy chỉnh hạn mức, khóa thẻ khẩn cấp và theo dõi chi tiêu thời gian thực với giao diện 3D độc quyền.
                 </p>
                 <Link href={isLoggedIn ? "/dashboard/cards" : "/register"} className="text-[#00ff88] font-bold hover:underline flex items-center gap-2">
                    Trải nghiệm ngay <ArrowRight size={16} />
                 </Link>
              </div>
              <div className="w-full md:w-1/3 aspect-video rounded-xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-all">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff88]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-xs text-gray-500 font-mono">VIRTUAL CARD PREVIEW</div>
              </div>
            </div>

             {/* Feature 5 */}
             <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#00ff88]/50 transition-all hover:-translate-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all">
                <Lock className="text-red-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Quyền riêng tư</h3>
              <p className="text-gray-400 leading-relaxed">
                Dữ liệu của bạn là của bạn. Chúng tôi cam kết không chia sẻ thông tin với bất kỳ thế lực thứ ba nào.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded bg-gray-500 flex items-center justify-center font-bold text-black text-xs">Q</div>
            <span className="font-bold">QUOCBANK</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2025 QuocBank Financial Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}