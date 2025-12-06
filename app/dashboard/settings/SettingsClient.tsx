'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { updateProfile } from '@/actions/settings'
import { AstronautBadge } from '@/components/dashboard/AstronautBadge'
import { FloatingInput } from '@/components/auth/FloatingInput'
import { User, Lock, Save, Bell, Moon, Globe, Shield, LogOut } from 'lucide-react'
import { logout } from '@/actions/auth'
import { motion } from 'framer-motion'

export default function SettingsClient({ user }: { user: any & { accounts?: { id: string; accountNumber: string; balance: number; isLocked: boolean }[] } }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      currentPassword: '',
      newPassword: ''
    }
  })

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-gray-800 rounded-lg"><User className="text-[#00ff88]" size={24} /></div>
          Cấu Hình Hệ Thống
        </h2>
        <p className="text-gray-400 mt-2">Hiệu chỉnh thông số cá nhân và bảo mật tàu bay</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <AstronautBadge user={user} />

          <div className="glass-cockpit rounded-2xl p-4 space-y-1">
            {[
              { icon: User, label: 'Hồ sơ cá nhân', active: true },
              { icon: Bell, label: 'Trung tâm thông báo', active: false },
              { icon: Shield, label: 'Nhật ký bảo mật', active: false },
              { icon: Globe, label: 'Ngôn ngữ & Khu vực', active: false }
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-indigo-600/20 text-white border border-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <button onClick={() => logout()} className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
            <LogOut size={18} /> Ngắt kết nối (Eject)
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Accounts overview */}
          <div className="glass-cockpit rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Tài khoản của bạn</h3>
            <div className="space-y-3">
              {user?.accounts?.length ? (
                user.accounts.map((acc: any) => (
                  <div key={acc.id} className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-300">Số tài khoản</div>
                      <div className="font-mono text-white">{acc.accountNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">Số dư</div>
                      <div className="font-bold text-[#00ff88]">{acc.balance.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">Chưa có tài khoản ngân hàng.</div>
              )}
            </div>
          </div>

          <div className="glass-cockpit rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#00ff88] rounded-full"></span>
              Thông số cơ bản
            </h3>

            <form
              action={formAction}
              onSubmit={(evt) => {
                evt.preventDefault()
                handleSubmit((data) => {
                  const formData = new FormData()
                  Object.entries(data).forEach(([key, val]) => formData.append(key, String(val)))
                  formAction(formData)
                })(evt)
              }}
              className="space-y-6">

              <FloatingInput label="Tên hiển thị (Codename)" icon={User} {...register('fullName')} className="!bg-black/20" />

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Thay đổi mã truy cập (Password)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <FloatingInput label="Mã hiện tại" icon={Lock} isPassword {...register('currentPassword')} className="!bg-black/20" />
                  <FloatingInput label="Mã mới" icon={Lock} isPassword {...register('newPassword')} className="!bg-black/20" />
                </div>
              </div>

              {state?.message && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-3 rounded-lg text-sm font-medium text-center ${state.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {state.message}
                </motion.div>
              )}

              <div className="flex justify-end">
                <button disabled={isPending} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-[#00ff88] hover:shadow-[0_0_20px_#00ff88] transition-all flex items-center gap-2">
                  {isPending ? 'Đang ghi đè...' : (<> <Save size={18} /> Lưu cấu hình </>)}
                </button>
              </div>
            </form>
          </div>

          <div className="glass-cockpit rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Cài đặt môi trường
            </h3>

            <div className="space-y-4">
              {[
                { title: 'Giao diện Tối (Dark Matter)', desc: 'Kích hoạt chế độ tiết kiệm năng lượng mắt', icon: Moon, default: true },
                { title: 'Thông báo vệ tinh', desc: 'Nhận tín hiệu khi có biến động số dư', icon: Bell, default: true },
                { title: 'Xác thực 2 lớp (2FA)', desc: 'Yêu cầu mã OTP khi đăng nhập lạ', icon: Shield, default: false }
              ].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-indigo-500/20 transition-all">
                      <setting.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{setting.title}</h4>
                      <p className="text-xs text-gray-500">{setting.desc}</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={setting.default} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
