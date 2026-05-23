'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, User, KeyRound, Loader2, AlertTriangle, Fingerprint } from 'lucide-react'

const credentialsSchema = z.object({
  employeeId: z.string().min(4, 'Employee ID is required'),
  password: z.string().min(8, 'Password is required'),
  otp: z.string().optional(),
})

type FormValues = z.infer<typeof credentialsSchema>

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string
      execute: (widgetId: string, options?: Record<string, unknown>) => void
      reset: (widgetId: string) => void
    }
}
}

const stepLabels = {
  credentials: 'Verify credentials',
  otp: 'Enter OTP (Authenticator)',
}

export default function AdminLoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const widgetId = useRef<string | null>(null)
  const widgetContainer = useRef<HTMLDivElement | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

  const form = useForm<FormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { employeeId: '', password: '', otp: '' },
  })

  const loadTurnstile = useMemo(() => {
    return () => {
      if (!siteKey || typeof window === 'undefined') return
      if (window.turnstile && widgetContainer.current && !widgetId.current) {
        widgetId.current = window.turnstile.render(widgetContainer.current, {
          sitekey: siteKey,
          size: 'invisible',
        })
        return
      }

      if (!document.querySelector('script[data-turnstile]')) {
        const script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.defer = true
        script.dataset.turnstile = 'true'
        script.onload = () => loadTurnstile()
        document.body.appendChild(script)
      }
    }
  }, [siteKey])

  useEffect(() => {
    loadTurnstile()
  }, [loadTurnstile])

  const getTurnstileToken = async () => {
    if (!siteKey || !window.turnstile || !widgetId.current) return ''

    return new Promise<string>((resolve) => {
      const id = widgetId.current as string
      window.turnstile?.execute(id, {
        callback: (token: string) => resolve(token),
        'expired-callback': () => resolve(''),
      })
    })
  }

  const submitCredentials = async (values: FormValues) => {
    setError(null)
    setLoading(true)

    const turnstileToken = await getTurnstileToken()
    const res = await fetch('/api/admin/auth/verify-credentials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        employeeId: values.employeeId,
        password: values.password,
        turnstileToken,
      }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok || !data?.ok) {
      setError(data?.error || 'Access denied')
      return
    }

    setStep('otp')
  }

  const submitOtp = async (values: FormValues) => {
    setError(null)
    setLoading(true)

    const turnstileToken = await getTurnstileToken()
    const result = await signIn('admin-credentials', {
      employeeId: values.employeeId,
      password: values.password,
      otp: values.otp,
      turnstileToken,
      redirect: false,
    })

    setLoading(false)

    if (result?.ok) {
      router.push('/admin')
      return
    }

    setError('Invalid OTP. Contact IT Security if the issue persists.')
  }

  const onSubmit = async (values: FormValues) => {
    if (step === 'credentials') {
      await submitCredentials(values)
      return
    }

    await submitOtp(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div ref={widgetContainer} />

      {error ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-red-400" />
          <div>
            <div className="text-sm font-semibold text-red-200">Access denied</div>
            <div className="text-sm text-red-200/80">{error}</div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-gray-400">
        Step: <span className="font-semibold text-cyan-200">{stepLabels[step]}</span>
      </div>

      {step === 'credentials' ? (
        <>
          <label className="block">
            <div className="mb-1 text-xs font-semibold tracking-widest text-gray-300">EMPLOYEE ID</div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-cyan-500/30">
              <User className="h-4 w-4 text-gray-400" />
              <input
                {...form.register('employeeId')}
                autoComplete="off"
                className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                placeholder="EMP-00001"
                disabled={loading}
              />
            </div>
            {form.formState.errors.employeeId ? (
              <p className="mt-1 text-xs text-red-300">{form.formState.errors.employeeId.message}</p>
            ) : null}
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-semibold tracking-widest text-gray-300">PASSWORD</div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-cyan-500/30">
              <KeyRound className="h-4 w-4 text-gray-400" />
              <input
                {...form.register('password')}
                type="password"
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            {form.formState.errors.password ? (
              <p className="mt-1 text-xs text-red-300">{form.formState.errors.password.message}</p>
            ) : null}
          </label>
        </>
      ) : (
        <label className="block">
          <div className="mb-1 text-xs font-semibold tracking-widest text-gray-300">OTP CODE</div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-cyan-500/30">
            <Fingerprint className="h-4 w-4 text-gray-400" />
            <input
              {...form.register('otp')}
              inputMode="numeric"
              maxLength={6}
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
              placeholder="123456"
              disabled={loading}
            />
          </div>
        </label>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-600/20 px-4 py-3 text-sm font-bold text-cyan-100 hover:bg-cyan-600/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        {loading ? 'Processing…' : step === 'credentials' ? 'Verify & Continue' : 'Confirm & Sign in'}
      </button>
    </form>
  )
}