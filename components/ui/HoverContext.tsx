'use client'

import { createContext, useContext, useState } from 'react'

const HoverContext = createContext<boolean>(false)

export function HoverProvider({ children, value }: { children: React.ReactNode, value: boolean }) {
  return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
}

export function useHover() {
  return useContext(HoverContext)
}