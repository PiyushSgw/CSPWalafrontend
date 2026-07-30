'use client'

import { useState } from 'react'
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AuthProvider from "@/components/auth/AuthProvider";
import SessionExpiredModal from "@/components/auth/SessionExpiredModal";
import { useSessionTimer } from "@/hooks/useSessionTimer";
// @ts-ignore: side-effect CSS import for global styles
import "../styles.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  useSessionTimer('csp_access_token')

  return (
     <AuthProvider>
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar mobileOpen={mobileSidebarOpen} onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <div className="flex flex-col flex-1 min-w-0 main-scrollbar">
        <Header onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden min-h-0">
          <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-5 pb-8 md:pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
    <SessionExpiredModal onLoginPath="/user" />
    </AuthProvider>
  );
}
