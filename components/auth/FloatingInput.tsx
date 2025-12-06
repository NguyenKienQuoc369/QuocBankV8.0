'use client'

import React from 'react'

export function FloatingInput(props: any) {
  const { label, icon: Icon, isPassword, className = '', ...rest } = props
  return (
    <label className={`block relative ${className}`}>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-gray-400" />}
        <input type={isPassword ? 'password' : props.type || 'text'} {...rest} className="w-full bg-black/20 border border-white/5 rounded-md px-3 py-2 text-white" />
      </div>
    </label>
  )
}
