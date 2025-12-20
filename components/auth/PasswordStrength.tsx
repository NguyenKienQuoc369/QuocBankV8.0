'use client'
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: "6+ ký tự", pass: password.length >= 6 },
    { label: "Số / Chữ hoa", pass: /[0-9A-Z]/.test(password) },
  ];
  const strength = checks.filter(c => c.pass).length;
  
  const getColor = () => {
    if (strength === 0) return 'bg-gray-700';
    if (strength <= 1) return 'bg-red-500';
    return 'bg-[#00ff88]';
  }

  return (
    <div className="w-full space-y-2 mt-1 mb-4">
      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 2) * 100}%` }}
          className={`h-full ${getColor()} transition-colors duration-300 shadow-[0_0_10px_currentColor]`}
        />
      </div>
      <div className="flex gap-3">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
            {check.pass ? <Check size={10} className="text-[#00ff88]" /> : <div className="w-2.5 h-2.5 rounded-full border border-gray-600" />}
            <span className={check.pass ? 'text-gray-300' : 'text-gray-600'}>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};