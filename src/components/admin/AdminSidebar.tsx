"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CheckSquare, Building2,
  Wallet, FileText, ShieldCheck
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeStyle?: "red" | "blue";
};

const navGroups = [
  {
    section: "MAIN",
    items: [
      {
        href: "/admin/dashboard",
        label: "Dashboard", 
        icon: LayoutDashboard,
        iconBg: "bg-emerald-500/20",
        iconColor: "text-emerald-400",
      },
    ],
  },
  {
    section: "CSP MANAGEMENT",
    items: [
      {
        href: "/admin/csp-approval",
        label: "CSP Approval", 
        icon: CheckSquare,
        iconBg: "bg-slate-500/20",
        iconColor: "text-slate-400",
        badge: "1",
        badgeStyle: "red" as const,
      },
      {
        href: "/admin/csp-list",
        label: "CSP List",
        icon: Users,
        iconBg: "bg-indigo-500/20", 
        iconColor: "text-indigo-400",
      },
    ],
  },
  {
    section: "SETTINGS",
    items: [
      {
        href: "/admin/banks",
        label: "Bank Master",
        icon: Building2,
        iconBg: "bg-amber-500/20",
        iconColor: "text-amber-400",
      },
      {
        href: "/admin/wallet-approval",
        label: "Wallet Approval",
        icon: Wallet,
        iconBg: "bg-slate-500/20",
        iconColor: "text-slate-400",
        badge: "NEW",
        badgeStyle: "blue" as const,
      },
    ],
  },
  {
    section: "REPORTS",
    items: [
      {
        href: "/admin/print-jobs",
        label: "Print Jobs",
        icon: FileText,
        iconBg: "bg-orange-500/20",
        iconColor: "text-orange-400",
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-[240px] min-w-[240px] h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* BRAND */}
      <div className="flex items-center gap-3 px-5 py-[18px] border-b border-slate-700/50 flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg flex items-center justify-center font-bold text-white text-[15px] flex-shrink-0 shadow-lg">
          A
        </div>
        <div>
          <p className="text-white font-bold text-[15px] leading-tight">CSPWala</p>
          <p className="text-slate-400 text-[10px] font-semibold tracking-[1.2px] uppercase mt-0.5">
            Admin Portal
          </p>
        </div>
      </div>

      {/* USER CARD */}
      <div className="mx-3 my-3 bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
            A
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-[13px] leading-tight truncate">Admin User</p>
            <p className="text-slate-400 text-[11px] mt-0.5 truncate">ADMIN-001</p>
          </div>
        </div>
        <div className="flex items-center mt-2.5 pt-2.5 border-t border-slate-700/50">
          <p className="text-slate-400 text-[10.5px] truncate flex-1">🔐 Super Administrator</p>
          <span className="bg-emerald-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
            ● ACTIVE
          </span>
        </div>
      </div>

      {/* SCROLLABLE NAV */}
      <nav className="sidebar-scroll flex-1 overflow-y-scroll overflow-x-hidden pb-2 px-2">
        {navGroups.map((group) => (
          <div key={group.section} className="px-1 mt-4 space-y-1">
            <p className="text-slate-500 text-[9.5px] font-semibold tracking-[1.2px] uppercase px-2 mb-2">
              {group.section}
            </p>
            {group.items.map(({ href, label, icon: Icon, iconBg, iconColor, badge, badgeStyle }) => {
              const isActive = pathname === href || pathname?.startsWith(href + "/");
              
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1
                    relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-slate-600/30 to-slate-500/30 border-l-4 border-slate-400 pl-1 shadow-lg shadow-slate-900/50' 
                      : 'hover:bg-slate-800/50 text-slate-300 hover:text-slate-100'
                    }
                  `}
                >
                  {/* Icon Box */}
                  <div className={`
                    w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm
                    transition-all duration-200 group-hover:scale-105
                    ${isActive 
                      ? 'bg-slate-500/30 shadow-slate-500/50' 
                      : iconBg
                    }
                  `}>
                    <Icon
                      size={16}
                      className={`
                        transition-all duration-200
                        ${isActive 
                          ? 'text-slate-300 shadow-lg drop-shadow-lg' 
                          : iconColor
                        }
                      `}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>

                  {/* Label - FULL NAME VISIBLE */}
                  <span className={`
                    flex-1 min-w-0 text-left leading-tight font-medium
                    ${isActive ? 'text-slate-100 font-semibold drop-shadow-sm' : 'text-slate-300'}
                    group-hover:text-slate-100
                  `}>
                    {label}
                  </span>

                  {/* Badge */}
                  {badge && (
                    <span
                      className={`
                        text-white font-bold flex-shrink-0 leading-none shadow-lg
                        ${badgeStyle === "red"
                          ? "bg-red-500/90 text-xs px-2 py-1 rounded-full shadow-red-500/50"
                          : "bg-slate-500/90 text-[10px] px-1.5 py-1 rounded shadow-slate-500/50"
                        }
                      `}
                    >
                      {badge}
                    </span>
                  )}

                  {/* Active Glow Effect */}
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-t from-slate-400/50 to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="h-4" />
      </nav>

      {/* LICENSE CARD */}
      <div className="flex-shrink-0 px-3 pb-4 pt-2">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <p className="text-slate-500 text-[9px] font-semibold tracking-[1.1px] uppercase mb-2">
            Admin License
          </p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-slate-400 text-[16px] font-bold font-mono">●</span>
            <span className="text-slate-100 text-[26px] font-bold font-mono leading-none tracking-tight">
              UNLIMITED
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/admin/users" className="py-2.5 bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-white text-[11px] font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-center">
              Manage Users
            </Link>
            <button className="py-2.5 border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-500 text-[11px] font-semibold rounded-lg transition-all shadow-sm">
              Logs
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
