"use client"

import React from 'react'

export default function ErrorResetButton({ reset }: { reset: () => void }) {
  return (
    <button onClick={() => reset()} style={{ marginTop: 16 }}>
      Try again
    </button>
  )
}
