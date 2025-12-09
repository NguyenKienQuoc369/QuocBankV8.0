import React from 'react'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <main style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <div style={{textAlign:'center'}}>
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </main>
  )
}
