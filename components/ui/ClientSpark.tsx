"use client"

import dynamic from 'next/dynamic'

// Dynamically import the actual ClickSpark client component on the client
const ClickSpark = dynamic(() => import('./ClickSpark').then((mod) => mod.ClickSpark), { ssr: false })

export default function ClientSpark() {
  return <ClickSpark />
}
