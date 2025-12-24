'use client';

import { useState, useRef, useEffect } from 'react';
import { Lock, Key, Shield, Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft, AlertTriangle, Delete } from 'lucide-react';
import { setupPin, changePin } from '@/actions/pin';
import Link from 'next/link';

interface PinManagementProps {
  accountId: string;
  hasPin: boolean;
}

export function PinManagement({ accountId, hasPin }: PinManagementProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [oldPin, setOldPin] = useState(['', '', '', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [isMobile, setIsMobile] = useState(false);

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

  const handleSetupPin = async () => {
    setLoading(true);
    setMessage(null);

    const pinStr = pin.join('');
    const confirmPinStr = confirmPin.join('');

    if (pinStr !== confirmPinStr) {
      setMessage({ type: 'error', text: 'Mã PIN không khớp' });
      setLoading(false);
      setConfirmPin(['', '', '', '', '', '']);
      setStep('input');
      return;
    }

    const result = await setupPin(accountId, pinStr);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Thiết lập mã PIN thành công!' });
      setPin(['', '', '', '', '', '']);
      setConfirmPin(['', '', '', '', '', '']);
      setStep('input');
    } else {
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
      setStep('input');
    }
  };

  const handleChangePin = async () => {
    setLoading(true);
    setMessage(null);

    const oldPinStr = oldPin.join('');
    const newPinStr = newPin.join('');
    const confirmPinStr = confirmPin.join('');

    if (newPinStr !== confirmPinStr) {
      setMessage({ type: 'error', text: 'Mã PIN mới không khớp' });
      setLoading(false);
      setConfirmPin(['', '', '', '', '', '']);
      setStep('input');
      return;
    }

    const result = await changePin(accountId, oldPinStr, newPinStr);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Thay đổi mã PIN thành công!' });
      setOldPin(['', '', '', '', '', '']);
      setNewPin(['', '', '', '', '', '']);
      setConfirmPin(['', '', '', '', '', '']);
      setStep('input');
    } else {
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
      setStep('input');
    }
  };

  const PinInput = ({ 
    value, 
    onChange, 
    label, 
    disabled = false,
    inputId = 'pin',
    isMobileInput,
    showPinInput
  }: { 
    value: string[]; 
    onChange: (arr: string[]) => void;
    label: string;
    disabled?: boolean;
    inputId?: string;
    isMobileInput: boolean;
    showPinInput: boolean;
  }) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleInput = (index: number, inputValue: string) => {
      if (!/^\d*$/.test(inputValue)) return;
      
      const newPinArray = [...value];
      newPinArray[index] = inputValue.slice(-1);
      onChange(newPinArray);

      // Auto focus next input after DOM updates
      if (inputValue && index < 5) {
        requestAnimationFrame(() => {
          inputRefs.current[index + 1]?.focus();
        });
      }
    };

    const handleKeyUp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      const value = (e.target as HTMLInputElement).value;
      const key = e.key;
      const isDigitKey = /^\d$/.test(key) || key.startsWith('Numpad') || key === 'Decimal';
      // Fallback: if a digit was typed (including numpad) or the field now has a char, advance
      if ((isDigitKey || value.length === 1) && value && index < 5) {
        requestAnimationFrame(() => {
          inputRefs.current[index + 1]?.focus();
        });
      }
    };

    const handleKey = (index: number, e: React.KeyboardEvent) => {
      const key = e.key;

      if (key === 'Backspace' && !value[index] && index > 0) {
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
      const newPinArray = [...value];
      
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newPinArray[i] = pastedData[i];
      }
      
      onChange(newPinArray);
      
      // Focus last filled input or first empty one
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    };

    const focusIndex = (idx: number) => {
      requestAnimationFrame(() => {
        inputRefs.current[idx]?.focus();
        setActiveIndex(idx);
      });
    };

    const handleVirtualDigit = (digit: string) => {
      let target = activeIndex;
      while (target < 6 && value[target]) target += 1;
      if (target >= 6) return;
      handleInput(target, digit);
      const next = Math.min(target + 1, 5);
      focusIndex(next);
    };

    const handleVirtualBackspace = () => {
      let target = activeIndex;
      if (target > 5) target = 5;
      if (value[target] === '' && target > 0) target -= 1;
      while (target >= 0 && value[target] === '') target -= 1;
      if (target < 0) return;
      const newArr = [...value];
      newArr[target] = '';
      onChange(newArr);
      focusIndex(target);
    };

    const handleVirtualClear = () => {
      onChange(['', '', '', '', '', '']);
      focusIndex(0);
    };

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <div className="flex gap-3 justify-center">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              id={`${inputId}-${index}`}
              type={isMobileInput ? 'tel' : showPinInput ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value[index]}
              // onInput helps with mobile keyboards; onChange covers desktop keyboards that may skip onInput
              onInput={(e) => handleInput(index, (e.target as HTMLInputElement).value)}
              onChange={(e) => handleInput(index, (e.target as HTMLInputElement).value)}
              onKeyDown={(e) => handleKey(index, e)}
              onKeyUp={(e) => handleKeyUp(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              onFocus={() => setActiveIndex(index)}
              disabled={disabled}
              autoComplete="off"
              className="w-14 h-16 md:w-16 md:h-20 text-center text-2xl md:text-3xl font-bold bg-black/40 border-2 border-cyan-500/30 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50"
              placeholder="•"
            />
          ))}
        </div>

        {!isMobileInput && (
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
              className="py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Delete className="w-4 h-4" />
              <span>Del</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Back Button */}
      <Link
        href="/dashboard/security"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại Bảo mật</span>
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-900/20 to-cyan-900/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <Key className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {hasPin ? 'Thay đổi Mã PIN' : 'Thiết lập Mã PIN'}
              </h1>
              <p className="text-cyan-400 mt-1">Mã bảo mật 6 số cho tài khoản của bạn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning if no PIN */}
      {!hasPin && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-400 mb-2">Chưa cài đặt mã PIN</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Tài khoản của bạn chưa có mã PIN bảo mật. Vui lòng thiết lập mã PIN 6 số để bảo vệ tài khoản và thực hiện các giao dịch an toàn hơn.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`rounded-2xl p-6 flex items-start gap-4 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-8">
        <div className="space-y-8">
          {/* Toggle Show/Hide PIN */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowPin(!showPin)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {showPin ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  <span>Ẩn mã PIN</span>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  <span>Hiện mã PIN</span>
                </>
              )}
            </button>
          </div>

          {/* Setup PIN Flow */}
          {!hasPin && (
            <>
              {step === 'input' && (
                <>
                  <PinInput
                    value={pin}
                    onChange={setPin}
                    label="Nhập mã PIN mới (6 số)"
                    inputId="setup-pin"
                    isMobileInput={isMobile}
                    showPinInput={showPin}
                  />
                  <button
                    onClick={() => {
                      if (pin.join('').length === 6) {
                        setStep('confirm');
                        setTimeout(() => {
                          document.getElementById('setup-confirm-0')?.focus();
                        }, 100);
                      }
                    }}
                    disabled={pin.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    <Key className="w-5 h-5" />
                    Tiếp tục
                  </button>
                </>
              )}

              {step === 'confirm' && (
                <>
                  <PinInput
                    value={confirmPin}
                    onChange={setConfirmPin}
                    label="Xác nhận mã PIN"
                    inputId="setup-confirm"
                    isMobileInput={isMobile}
                    showPinInput={showPin}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setStep('input');
                        setConfirmPin(['', '', '', '', '', '']);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-xl transition-all"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleSetupPin}
                      disabled={loading || confirmPin.join('').length !== 6}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Change PIN Flow */}
          {hasPin && (
            <>
              {step === 'input' && (
                <>
                  <PinInput
                    value={oldPin}
                    onChange={setOldPin}
                    label="Mã PIN hiện tại"
                    inputId="change-old"
                    isMobileInput={isMobile}
                    showPinInput={showPin}
                  />
                  <PinInput
                    value={newPin}
                    onChange={setNewPin}
                    label="Mã PIN mới (6 số)"
                    inputId="change-new"
                    isMobileInput={isMobile}
                    showPinInput={showPin}
                  />
                  <button
                    onClick={() => {
                      if (oldPin.join('').length === 6 && newPin.join('').length === 6) {
                        setStep('confirm');
                        setTimeout(() => {
                          document.getElementById('change-confirm-0')?.focus();
                        }, 100);
                      }
                    }}
                    disabled={oldPin.join('').length !== 6 || newPin.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    <Key className="w-5 h-5" />
                    Tiếp tục
                  </button>
                </>
              )}

              {step === 'confirm' && (
                <>
                  <PinInput
                    value={confirmPin}
                    onChange={setConfirmPin}
                    label="Xác nhận mã PIN mới"
                    inputId="change-confirm"
                    isMobileInput={isMobile}
                    showPinInput={showPin}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setStep('input');
                        setConfirmPin(['', '', '', '', '', '']);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 px-6 rounded-xl transition-all"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleChangePin}
                      disabled={loading || confirmPin.join('').length !== 6}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      {loading ? 'Đang xử lý...' : 'Xác nhận thay đổi'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-xl p-6">
        <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Lưu ý bảo mật
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-gray-300 text-sm">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-400 text-xs font-bold">1</span>
            </div>
            <span>Không sử dụng mã PIN dễ đoán như 123456, 000000, ngày sinh</span>
          </li>
          <li className="flex items-start gap-3 text-gray-300 text-sm">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-400 text-xs font-bold">2</span>
            </div>
            <span>Không chia sẻ mã PIN với bất kỳ ai, kể cả nhân viên ngân hàng</span>
          </li>
          <li className="flex items-start gap-3 text-gray-300 text-sm">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-400 text-xs font-bold">3</span>
            </div>
            <span>Thay đổi mã PIN định kỳ (3-6 tháng/lần) để tăng cường bảo mật</span>
          </li>
          <li className="flex items-start gap-3 text-gray-300 text-sm">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-400 text-xs font-bold">4</span>
            </div>
            <span>Không lưu mã PIN trong điện thoại, email hoặc ghi chú</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
