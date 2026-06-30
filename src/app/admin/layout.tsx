'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AuthProvider from '@/components/auth/AuthProvider'
import '../styles.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <AdminSidebar mobileOpen={mobileSidebarOpen} onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <div className="flex flex-col flex-1 min-w-0 main-scroll overflow-x-hidden main-scrollbar">
          <AdminHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
          <main className="flex-1 main-scroll">
            <div className="p-4 md:p-6 flex flex-col gap-5 pb-6">{children}</div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
