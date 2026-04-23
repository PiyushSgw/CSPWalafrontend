"use client";
import { Bell, AlertTriangle, ChevronDown } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 gap-3 flex-shrink-0 z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-0.5">
        <span className="text-[25px] font-semibold text-slate-800">
          Admin
        </span>
        <span className="text-[18px] text-slate-400 text-sm">/</span>
        <span className="text-[18px] text-slate-500 font-medium">
          Management Portal
        </span>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Low balance alert → Admin Alert */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-[12.5px] text-slate-900 font-medium select-none">
        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
        <div className="font-bold">1 CSP</div>pending approval
      </div>

      {/* Notification bell */}
      <button className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition bg-slate-100">
        <Bell size={16} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
      </button>

      {/* User chip */}
      <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition rounded-lg py-1.5 px-2.5 cursor-pointer select-none">
        <div className="w-[28px] h-[28px] rounded-md bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold text-[12px] flex-shrink-0">
          A
        </div>
        <span className="text-[13px] font-semibold text-slate-800">
          Admin User
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </div>
    </header>
  );
}
