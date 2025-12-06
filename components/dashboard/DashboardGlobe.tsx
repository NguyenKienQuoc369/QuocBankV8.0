'use client'

import React from 'react'
import { Scene } from '@/components/3d/Scene'
import { DashboardScene } from '@/components/3d/DashboardScene'

export default function DashboardGlobe({ balance, userName }: { balance: number; userName: string }) {
  return (
    <div className="w-full h-64 md:h-80 lg:h-96">
      <Scene>
        <DashboardScene balance={balance} userName={userName} />
      </Scene>
    </div>
  )
}
