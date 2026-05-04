"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { logoutAdmin } from "../../redux/slices/authslice";
import {
  LayoutDashboard, Users, CheckSquare, Building2,
  Wallet, FileText, UserCheck, LogOut
} from "lucide-react";

const navGroups = [
  {
    section: "MAIN",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400" },
    ],
  },
  {
    section: "CSP MANAGEMENT",
    items: [
      { href: "/admin/csp-approval", label: "CSP Approval", icon: CheckSquare, iconBg: "bg-amber-500/20", iconColor: "text-amber-400" },
      { href: "/admin/csp-list", label: "CSP List", icon: Users, iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400" },
    ],
  },
  {
    section: "SETTINGS",
    items: [
      { href: "/admin/banks", label: "Bank Master", icon: Building2, iconBg: "bg-sky-500/20", iconColor: "text-sky-400" },
      { href: "/admin/wallet-approval", label: "Wallet Approval", icon: Wallet, iconBg: "bg-violet-500/20", iconColor: "text-violet-400" },
    ],
  },
  {
    section: "DATA",
    items: [
      { href: "/admin/customers", label: "Customers", icon: UserCheck, iconBg: "bg-teal-500/20", iconColor: "text-teal-400" },
      { href: "/admin/print-jobs", label: "Print Jobs", icon: FileText, iconBg: "bg-orange-500/20", iconColor: "text-orange-400" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const admin = useSelector((s: RootState) => s.auth.admin);
  const pendingCount = useSelector((s: RootState) => s.admin.pendingCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true) }, []);
  if (!mounted) return <aside className="w-[260px] bg-[#0f2744] animate-pulse flex-shrink-0" />;

  const initial = admin?.name?.[0]?.toUpperCase() || 'A';
  const handleLogout = async () => {
    try { await (dispatch as any)(logoutAdmin()) } catch {}
    router.replace('/login');
  };

  return (
    <aside className="flex flex-col w-[260px] min-w-[260px] h-screen bg-[#0f2744] overflow-hidden">
      <nav className="flex-1 overflow-x-hidden py-[14px]">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/[0.08] flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[8px] flex items-center justify-center font-extrabold text-white text-[18px] flex-shrink-0">A</div>
          <div>
            <p className="text-white font-extrabold text-[16px] tracking-[-0.3px] leading-tight">CSPWala</p>
            <p className="text-white/40 text-[10px] font-semibold tracking-[0.5px] uppercase mt-0.5">Admin Portal</p>
          </div>
        </div>

        {/* User Card */}
        <div className="mx-[14px] mt-[14px] bg-white/5 border border-white/10 rounded-[10px] px-[14px] py-3">
          <div className="flex items-center gap-[10px]">
            <div className="w-[34px] h-[34px] rounded-[8px] bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-[14px] flex-shrink-0">{initial}</div>
            <div className="min-w-0">
              <p className="text-white font-bold text-[12px] leading-tight">{admin?.name || 'Admin'}</p>
              <p className="text-white/45 text-[10px] font-mono mt-0.5">{admin?.email || ''}</p>
            </div>
          </div>
          <div className="flex items-center mt-[10px] pt-[10px] border-t border-white/[0.07]">
            <p className="text-white/50 text-[10px]">🔐 {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
            <span className="ml-auto bg-[rgba(13,143,114,0.25)] text-[#4ade80] text-[9px] font-bold px-2 py-[2px] rounded-full tracking-[0.5px]">● ACTIVE</span>
          </div>
        </div>

        {/* Nav Items */}
        {navGroups.map((group) => (
          <div key={group.section}>
            <p className="text-white/25 text-[9px] font-bold uppercase tracking-[1.5px] px-5 pt-2 pb-1 mt-1.5">{group.section}</p>
            {group.items.map(({ href, label, icon: Icon, iconBg, iconColor }) => {
              const isActive = pathname === href || pathname?.startsWith(href + '/');
              const badge = href === '/admin/csp-approval' && pendingCount?.pending ? String(pendingCount.pending) : undefined;
              return (
                <Link key={href} href={href}
                  className={`relative flex items-center gap-[11px] px-5 py-[10px] mx-[10px] rounded-[8px] transition-all duration-150 mb-[1px] ${
                    isActive ? 'bg-[rgba(139,92,246,0.18)] border border-[rgba(139,92,246,0.25)]' : 'border border-transparent hover:bg-white/[0.07]'
                  }`}>
                  {isActive && <span className="absolute top-1/2 -translate-y-1/2 rounded-r-[3px] bg-purple-500" style={{ left: '-10px', width: '3px', height: '60%' }} />}
                  <div className={`w-[32px] h-[32px] rounded-[7px] flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-[rgba(139,92,246,0.3)]' : iconBg}`}>
                    <Icon size={16} className={isActive ? 'text-purple-300' : iconColor} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`flex-1 truncate text-[13px] leading-tight ${isActive ? 'text-white font-semibold' : 'text-white/60 font-medium'}`}>{label}</span>
                  {badge && <span className="bg-[#dc2626] text-white text-[10px] px-[6px] py-[1px] rounded-full font-bold flex-shrink-0">{badge}</span>}
                </Link>
              )
            })}
          </div>
        ))}
        <div className="h-2" />

        {/* Logout */}
        <div className="flex-shrink-0 mx-[14px] mb-[16px]">
          <button onClick={handleLogout}
            className="w-full py-[10px] bg-white/[0.05] border border-white/[0.1] hover:bg-red-500/20 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[12px] font-bold rounded-[8px] transition-all flex items-center justify-center gap-2">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
