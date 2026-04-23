import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AuthProvider from "@/components/auth/AuthProvider";
// @ts-ignore: side-effect CSS import for global styles
import "../styles.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  
  return (
     <AuthProvider>
    <div className="flex h-screen  overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0  main-scroll overflow-x-hidden main-scrollbar">
        <Header />
        <main className="flex-1 main-scroll  ">
          <div className="p-6 flex flex-col gap-5 pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
    </AuthProvider>
  );
}
