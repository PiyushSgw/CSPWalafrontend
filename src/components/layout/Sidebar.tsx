'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logoutCSP, logoutAdmin } from '../../redux/slices/authslice';
import api from '../../utils/axios';

const navGroups = [
  {
    section: 'MAIN',
    items: [
      { href: '/dashboard', label: 'Overview', emoji: '🏠', iconBg: 'bg-white/5', badge: undefined, badgeStyle: undefined },
    ],
  },
  {
    section: 'SERVICES',
    items: [
      { href: '/passbook',        label: 'Passbook Print',       emoji: '📖', iconBg: 'bg-white/5', badge: undefined, badgeStyle: undefined },
      { href: '/account-opening', label: 'Account Opening Form', emoji: '📋', iconBg: 'bg-white/5', badge: 'NEW',     badgeStyle: 'yellow' },
    ],
  },
  {
    section: 'RECORDS',
    items: [
      { href: '/customers',    label: 'Customers',    emoji: '👥', iconBg: 'bg-white/5', badge: undefined, badgeStyle: undefined },
      { href: '/print-history',label: 'Print History',emoji: '🗂️', iconBg: 'bg-white/5', badge: '4',       badgeStyle: 'red' },
    ],
  },
  {
    section: 'FINANCE',
    items: [
      { href: '/wallet', label: 'Wallet', emoji: '💰', iconBg: 'bg-white/5', badge: undefined, badgeStyle: undefined },
    ],
  },
  {
    section: 'ACCOUNT',
    items: [
      { href: '/profile', label: 'My Profile',    emoji: '👤', iconBg: 'bg-white/5', badge: undefined, badgeStyle: undefined },
      { href: '/support', label: 'Help & Support', emoji: '🎧', iconBg: 'bg-white/5', badge: undefined, badgeStyle: undefined },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const dispatch = useDispatch();

  // ✅ Redux se data lo — same as 1st code
  const authState       = useSelector((state: RootState) => state.auth);
  const user            = authState.user || authState.admin;
  const isAuthenticated = authState.isAuthenticated || authState.isAdminAuthenticated;
  const isAdmin         = !!authState.admin;

  const [mounted, setMounted] = useState(false);

  // ✅ Use dashboard state instead of separate API call
  const dashboardState = useSelector((state: RootState) => state.dashboard);
  const dashboardWalletBalance = dashboardState.stats?.walletBalance || 0;

  useEffect(() => { setMounted(true); }, []);

  // ✅ Auth check — same as 1st code
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // ✅ Loading state — same as 1st code
  if (!mounted || !isAuthenticated) {
    return <aside className="w-[260px] bg-[#0f2744] animate-pulse flex-shrink-0" />;
  }

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      if (isAdmin) {
        await (dispatch as any)(logoutAdmin());
      } else {
        await (dispatch as any)(logoutCSP());
      }
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      router.replace('/login');
    }
  };

  const initial = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <aside className="flex flex-col w-[260px] min-w-[260px] h-screen bg-[#0f2744] overflow-hidden">

      {/* ✅ Scrollable Nav */}
      <nav
        className="flex-1 overflow-x-hidden py-[14px]"
      >

        {/* ✅ Brand Logo */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/[0.08] flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-[#0d8f72] to-[#0fb896] rounded-[8px] flex items-center justify-center font-extrabold text-white text-[18px] flex-shrink-0">
            C
          </div>
          <div>
            <p className="text-white font-extrabold text-[16px] tracking-[-0.3px] leading-tight">CSPWala</p>
            <p className="text-white/40 text-[10px] font-semibold tracking-[0.5px] uppercase mt-0.5">Operator Portal</p>
          </div>
        </div>

        {/* ✅ User Card — Redux data */}
        <div className="mx-[14px] mt-[14px] bg-white/5 border border-white/10 rounded-[10px] px-[14px] py-3">
          <div className="flex items-center gap-[10px]">
            <div className="w-[34px] h-[34px] rounded-[8px] bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center text-white font-extrabold text-[14px] flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              {/* ✅ user.name from Redux */}
              <p className="text-white font-bold text-[12px] leading-tight">
                {user?.name || 'Loading...'}
              </p>
              {/* ✅ user.email from Redux */}
              <p className="text-white/45 text-[10px] font-mono mt-0.5">
                {(user as any)?.email ||  ''}
              </p>
            </div>
          </div>
          <div className="flex items-center mt-[10px] pt-[10px] border-t border-white/[0.07]">
            {/* ✅ isAdmin from Redux */}
            <p className="text-white/50 text-[10px]">
              🏦 {isAdmin ? 'Admin' : 'CSP Agent'}
            </p>
            {/* ✅ status from Redux */}
            <span className="ml-auto bg-[rgba(13,143,114,0.25)] text-[#4ade80] text-[9px] font-bold px-2 py-[2px] rounded-full tracking-[0.5px]">
              ● {isAdmin ? 'ADMIN' : ((user as any)?.status?.toUpperCase() || 'ACTIVE')}
            </span>
          </div>
        </div>

        {/* ✅ Nav Items */}
        {navGroups.map((group) => (
          <div key={group.section}>
            <p className="text-white/25 text-[9px] font-bold uppercase tracking-[1.5px] px-5 pt-2 pb-1 mt-1.5">
              {group.section}
            </p>

            {group.items.map(({ href, label, emoji, iconBg, badge, badgeStyle }: any) => {
              const isActive = pathname === href || pathname?.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-[11px] px-5 py-[10px] mx-[10px] rounded-[8px] transition-all duration-150 mb-[1px] ${
                    isActive
                      ? 'bg-[rgba(13,143,114,0.18)] border border-[rgba(13,143,114,0.25)]'
                      : 'border border-transparent hover:bg-white/[0.07]'
                  }`}
                >
                  {/* ✅ Green left line for active */}
                  {isActive && (
                    <span
                      className="absolute top-1/2 -translate-y-1/2 rounded-r-[3px] bg-[#0d8f72]"
                      style={{ left: '-10px', width: '3px', height: '60%' }}
                    />
                  )}

                  {/* ✅ Emoji Icon */}
                  <div className={`w-[32px] h-[32px] rounded-[7px] flex items-center justify-center flex-shrink-0 transition-colors text-[16px] ${
                    isActive ? 'bg-[rgba(13,143,114,0.3)]' : iconBg
                  }`}>
                    {emoji}
                  </div>

                  {/* Label */}
                  <span className={`flex-1 truncate text-[13px] leading-tight ${
                    isActive ? 'text-white font-semibold' : 'text-white/60 font-medium'
                  }`}>
                    {label}
                  </span>

                  {/* Badge */}
                  {badge && (
                    <span className={`font-bold flex-shrink-0 ${
                      badgeStyle === 'red'
                        ? 'bg-[#dc2626] text-white text-[10px] px-[6px] py-[1px] rounded-full'
                        : 'bg-[#fef9c3] text-[#854d0e] text-[9px] px-[6px] py-[1px] rounded'
                    }`}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="h-2" />

        {/* ✅ Wallet Card — API data + Redux auth check */}
        <div className="flex-shrink-0 mx-[14px] mb-[16px]">
          <div className="bg-gradient-to-br from-[#1a3d6e] to-[#24538f] border border-white/10 rounded-[10px] p-[14px]">
            <p className="text-white/45 text-[10px] font-semibold uppercase tracking-[1px] mb-1">
             Wallet Balance
            </p>
            <div className="flex items-baseline gap-0.5 my-1 mb-[10px]">
              <span className="text-white/60 text-[14px] font-medium font-mono">₹</span>
              <span className="text-white text-[22px] font-medium font-mono leading-none">
                {dashboardWalletBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/wallet')}
                className="flex-1 py-[7px] bg-[#0d8f72] hover:opacity-90 hover:-translate-y-px text-white text-[11px] font-bold rounded-[6px] transition-all"
              >
                + Recharge
              </button>
              <button
                onClick={() => router.push('/wallet')}
                className="flex-1 py-[7px] bg-white/[0.08] border border-white/[0.12] text-white/70 hover:opacity-90 hover:-translate-y-px text-[11px] font-bold rounded-[6px] transition-all"
              >
                Ledger
              </button>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}