"use client";
import { Bell, AlertTriangle, ChevronDown, LogOut, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { logoutAdmin } from "../../redux/slices/authslice";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function AdminHeader() {
  const admin = useSelector((s: RootState) => s.auth.admin);
  const pendingCount = useSelector((s: RootState) => s.admin.pendingCount);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try { await (dispatch as any)(logoutAdmin()) } catch {}
    router.replace('/login');
  };

  const getPageName = () => {
    const map: any = {
      '/admin/dashboard': 'Dashboard',
      '/admin/csp-approval': 'CSP Approval',
      '/admin/csp-list': 'CSP List',
      '/admin/banks': 'Bank Master',
      '/admin/wallet-approval': 'Wallet Approval',
      '/admin/customers': 'Customers',
      '/admin/print-jobs': 'Print Jobs',
    };
    return map[pathname] || 'Admin';
  };

  const initial = admin?.name?.[0]?.toUpperCase() || 'A';
  const pendingCSPs = pendingCount?.pending || 0;

  return (
    <header className="topbar flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
      <div className="topbar-title min-w-0 flex-1 md:flex-none">
        {getPageName()} <span className="hidden sm:inline">/ Admin Portal</span>
      </div>
      <div className="topbar-actions w-full md:w-auto flex items-center justify-end flex-wrap sm:flex-nowrap gap-2">
        {pendingCSPs > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-900 font-medium select-none">
            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
            <div className="font-bold">{pendingCSPs} CSP{pendingCSPs > 1 ? 's' : ''}</div>pending approval
          </div>
        )}
        <button className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition bg-slate-100">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <div onClick={() => setShowDropdown(!showDropdown)} className="topbar-user">
            <div className="topbar-user-avatar">{initial}</div>
            <span className="topbar-user-name hidden sm:inline max-w-[140px] truncate">{admin?.name || 'Admin'}</span>
            <ChevronDown size={14} strokeWidth={2.5} className="text-slate-400 transition-transform duration-200" style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </div>
          {showDropdown && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[92vw] max-w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{initial}</div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{admin?.name || 'Admin'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{admin?.email || ''}</p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />{admin?.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 px-1.5 pt-1.5 pb-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
                  <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0"><LogOut size={13} strokeWidth={2.5} className="text-red-500" /></div>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
