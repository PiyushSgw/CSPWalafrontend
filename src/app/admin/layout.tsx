import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AuthProvider from '@/components/auth/AuthProvider'
import '../styles.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <AdminSidebar />
        <div className="flex flex-col flex-1 min-w-0 main-scroll overflow-x-hidden main-scrollbar">
          <AdminHeader />
          <main className="flex-1 main-scroll">
            <div className="p-6 flex flex-col gap-5 pb-6">{children}</div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
