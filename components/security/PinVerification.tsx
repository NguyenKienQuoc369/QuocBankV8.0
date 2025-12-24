'use client';

import { useState, useRef, useEffect } from 'react';
import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { verifyPin } from '@/actions/pin';

interface PinVerificationProps {
  accountId: string;
  onVerified: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export function PinVerification({ 
  accountId, 
  onVerified, 
  onCancel,
  title = "Xác thực giao dịch",
  description = "Vui lòng nhập mã PIN 6 số để xác nhận giao dịch"
}: PinVerificationProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window === 'undefined') return;
      const mq = window.matchMedia('(pointer: coarse)');
      setIsMobile(mq.matches);
    };
    updateIsMobile();
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(pointer: coarse)');
      mq.addEventListener('change', updateIsMobile);
      return () => mq.removeEventListener('change', updateIsMobile);
    }
  }, []);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    // Auto focus next input after DOM updates
    if (value && index < 5) {
      requestAnimationFrame(() => {
        inputRefs.current[index + 1]?.focus();
      });
    }

    // Auto verify when all 6 digits are filled
    if (index === 5 && value) {
      const fullPin = [...newPin.slice(0, 5), value].join('');
      if (fullPin.length === 6) {
        setTimeout(() => {
          handleVerify([...newPin.slice(0, 5), value]);
        }, 100);
      }
    }
  };

  const handleKeyUp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = (e.target as HTMLInputElement).value;
    const key = e.key;
    const isDigitKey = /^\d$/.test(key) || key.startsWith('Numpad') || key === 'Decimal';
    // Fallback for cases where onInput/onChange are skipped; also covers numpad keys
    if ((isDigitKey || val.length === 1) && val && index < 5) {
      requestAnimationFrame(() => {
        inputRefs.current[index + 1]?.focus();
      });
    }
  };

  const focusIndex = (idx: number) => {
    requestAnimationFrame(() => {
      inputRefs.current[idx]?.focus();
      setActiveIndex(idx);
    });
  };

  const handleVirtualDigit = (digit: string) => {
    let target = activeIndex;
    while (target < 6 && pin[target]) target += 1;
    if (target >= 6) return;
    handleInput(target, digit);
    const next = Math.min(target + 1, 5);
    focusIndex(next);
  };

  const handleVirtualBackspace = () => {
    let target = activeIndex;
    if (target > 5) target = 5;
    if (pin[target] === '' && target > 0) target -= 1;
    while (target >= 0 && pin[target] === '') target -= 1;
    if (target < 0) return;
    const newArr = [...pin];
    newArr[target] = '';
    setPin(newArr);
    focusIndex(target);
  };

  const handleVirtualClear = () => {
    setPin(['', '', '', '', '', '']);
    focusIndex(0);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const key = e.key;

    if (key === 'Backspace' && !pin[index] && index > 0) {
      e.preventDefault();
      e.stopPropagation();
      inputRefs.current[index - 1]?.focus();
    } else if (key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      e.stopPropagation();
      inputRefs.current[index + 1]?.focus();
    } else if (key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      e.stopPropagation();
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newPin = [...pin];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newPin[i] = pastedData[i];
    }
    
    setPin(newPin);
    
    // Auto verify if 6 digits pasted
    if (pastedData.length === 6) {
      handleVerify(newPin);
    } else {
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerify = async (pinToVerify = pin) => {
    const pinStr = pinToVerify.join('');
    if (pinStr.length !== 6) {
      setError('Vui lòng nhập đủ 6 số');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyPin(accountId, pinStr);
    
    if (result.success) {
      onVerified();
    } else {
      setError(result.error || 'Mã PIN không chính xác');
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-cyan-500/30 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-cyan-500/30">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-cyan-400 text-sm mt-0.5">{description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* PIN Input */}
          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type={isMobile ? 'tel' : showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={pin[index]}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => handleInput(index, (e.target as HTMLInputElement).value)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onKeyUp={(e) => handleKeyUp(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  onFocus={() => setActiveIndex(index)}
                  disabled={loading}
                  autoComplete="off"
                  className="w-12 h-14 text-center text-2xl font-bold bg-black/40 border-2 border-cyan-500/30 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50"
                  placeholder="•"
                />
              ))}
            </div>

            {!isMobile && (
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleVirtualDigit(String(num))}
                    className="py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleVirtualClear}
                  className="py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  CLR
                </button>
                <button
                  type="button"
                  onClick={() => handleVirtualDigit('0')}
                  className="py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleVirtualBackspace}
                  className="py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  ⌫
                </button>
              </div>
            )}

            {/* Show/Hide Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {showPin ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Hiện PIN</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Ẩn PIN</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={() => handleVerify()}
              disabled={loading || pin.join('').length !== 6}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Xác nhận</span>
                </>
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Mã PIN của bạn được mã hóa và bảo mật tuyệt đối
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
