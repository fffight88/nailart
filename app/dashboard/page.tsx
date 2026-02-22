'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import PromptArea from '@/components/dashboard/PromptArea'
import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#181818' }}>
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#181818',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    >
      <DashboardNavbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 lg:ml-72 transition-[margin] duration-300">
        <PromptArea />
      </main>
    </div>
  )
}
