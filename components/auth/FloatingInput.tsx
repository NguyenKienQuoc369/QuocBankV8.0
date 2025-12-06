"use client"

import React from 'react'

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: any
}

export function FloatingInput({ label, icon: Icon, ...props }: FloatingInputProps) {
  return (
    <label className="block">
      <span className="text-sm text-gray-400 mb-1 block">{label}</span>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-gray-400" size={18} />}
        <input {...props} className={`w-full px-3 py-2 rounded-md bg-white/5 text-white ${props.className || ''}`} />
      </div>
    </label>
  )
}

export default FloatingInput
