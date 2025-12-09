"use client"

import React from 'react'
import ErrorResetButton from '@/components/ui/ErrorResetButton'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Application error</h1>
        <p>{error?.message ?? 'An unexpected error occurred'}</p>
        <ErrorResetButton reset={reset} />
      </div>
    </main>
  )
}
