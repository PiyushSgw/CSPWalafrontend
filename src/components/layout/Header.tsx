'use client';
import { ChevronDown, User, LogOut, X, CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logoutCSP, logoutAdmin } from '../../redux/slices/authslice';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import api from '../../utils/axios';
import AdminHeader from '../admin/AdminHeader';

export default function Header() {
  const authState = useSelector((state: RootState) => state.auth);
  const user      = authState.user || authState.admin;
  const isAdmin   = !!authState.admin;
  const dispatch  = useDispatch();
  const router    = useRouter();
  const pathname  = usePathname();

  // ✅ If admin is logged in and accessing admin routes, show admin header
  if (isAdmin && pathname?.startsWith('/admin')) {
    return <AdminHeader />
  }

  const [walletBalance, setWalletBalance]         = useState<number>(0);
  const [showDropdown, setShowDropdown]           = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted]                     = useState(false);
  const dropdownRef     = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const dashboardState = useSelector((state: RootState) => state.dashboard);
  const dashboardWalletBalance = dashboardState.stats?.walletBalance || 0;

  useEffect(() => {
    if (mounted && authState.isAuthenticated && !authState.admin) {
      setWalletBalance(dashboardWalletBalance);
    }
  }, [mounted, authState.isAuthenticated, authState.admin, dashboardWalletBalance]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageName = () => {
    const map: any = {
      '/dashboard': 'Overview',
      '/passbook': 'Passbook Print',
      '/customers': 'Customers',
      '/print-history': 'Print History',
      '/wallet': 'Wallet',
      '/profile': 'My Profile',
    };
    return map[pathname] || 'Dashboard';
  };

  if (!mounted) {
    return <header className="topbar animate-pulse" />;
  }

  const handleLogout = async () => {
    console.log('🔐 Starting logout process...');
    
    // Navigate to login first to prevent blank screen
    router.push('/login');
    
    // Then clear tokens and update state
    try {
      const isAdmin = !!authState.admin;
      console.log('🔐 User type:', isAdmin ? 'Admin' : 'CSP');
      
      // Clear tokens immediately
      if (isAdmin) {
        console.log('🔐 Clearing admin tokens...');
        localStorage.removeItem('admin_token');
        // Also clear Redux state
        dispatch({ type: 'auth/logoutAdmin/fulfilled', payload: null });
      } else {
        console.log('🔐 Clearing CSP tokens...');
        localStorage.removeItem('csp_access_token');
        localStorage.removeItem('csp_refresh_token');
        // Also clear Redux state
        dispatch({ type: 'auth/logoutCSP/fulfilled', payload: null });
      }
      
      console.log('✅ Logout completed successfully');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Even if logout fails, we're already on login page
    }
  };

  const initial      = user?.name?.[0]?.toUpperCase() || 'U';
  const isLowBalance = walletBalance < 500;

  const notifications = [
    { id: 1, title: 'CSP Approval Pending',   desc: 'Admin review required', type: 'info',    time: '2m ago',    unread: true  },
    { id: 2, title: 'Print Job #PJ123 Failed', desc: 'Printer offline',       type: 'error',   time: '5m ago',    unread: true  },
    { id: 3, title: 'Wallet Top-up Success',   desc: '₹500 added',            type: 'success', time: '1h ago',    unread: false },
    { id: 4, title: 'New Bank Added',          desc: 'SBI Main Branch',       type: 'info',    time: 'Yesterday', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="topbar flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
      <div className="topbar-title min-w-0 flex-1 md:flex-none">
        {getPageName()} <span className="hidden sm:inline">/ Dashboard Home</span>
      </div>

      <div className="topbar-actions w-full md:w-auto flex items-center justify-end flex-wrap sm:flex-nowrap gap-2">
        {isLowBalance && (
          <div
            className="alert-box warn max-w-full sm:max-w-none"
            style={{ margin: 0, padding: '8px 14px', borderRadius: '8px', fontSize: '12px' }}
          >
            <span>⚠️</span>
            <span style={{ marginLeft: '4px' }} className="whitespace-nowrap">
              <strong>Low Balance:</strong> ₹{dashboardWalletBalance} remaining
            </span>
          </div>
        )}

        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="notif-btn"
          >
            <span>🔔</span>
            {unreadCount > 0 && <div className="notif-dot" />}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[92vw] max-w-80 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <h3 className="font-bold text-slate-900 text-lg truncate">Notifications</h3>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                </div>
                <div className="flex gap-4 mt-3 text-sm text-slate-500 flex-wrap">
                  <span className="font-medium">{unreadCount} unread</span>
                  <span>• {notifications.length} total</span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => setShowNotifications(false)}
                    className="p-5 border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer group last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                        notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                        notif.type === 'error'   ? 'bg-red-100 text-red-600'         :
                                                   'bg-blue-100 text-blue-600'
                      }`}>
                        {notif.type === 'success' && <CheckCircle size={18} strokeWidth={2} />}
                        {notif.type === 'error'   && <span>⚠️</span>}
                        {notif.type === 'info'    && <span>🔔</span>}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1 gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 truncate pr-2">
                            {notif.title}
                          </h4>
                          {notif.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-2 line-clamp-2 break-words">
                          {notif.desc}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="flex gap-2 text-xs flex-col sm:flex-row">
                  <button className="flex-1 py-2 px-3 font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                    Mark All Read
                  </button>
                  <button className="flex-1 py-2 px-3 font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    View All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="topbar-user"
          >
            <div className="topbar-user-avatar">{initial}</div>
            <span className="topbar-user-name hidden sm:inline max-w-[140px] truncate">{user?.name || 'User'}</span>
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              className="text-slate-400 transition-transform duration-200"
              style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>

          {showDropdown && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[92vw] max-w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || ''}</p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="py-1.5 px-1.5 space-y-0.5">
                <button
                  onClick={() => { router.push('/profile'); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                >
                  <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User size={13} strokeWidth={2.5} className="text-slate-500" />
                  </div>
                  My Profile
                </button>

                <button
                  onClick={() => { router.push('/wallet'); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                >
                  <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[12px]">₹</span>
                  </div>
                  Wallet
                  <span className="ml-auto text-[11px] font-bold text-green-600">₹{walletBalance}</span>
                </button>
              </div>

              <div className="border-t border-slate-100 px-1.5 pt-1.5 pb-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LogOut size={13} strokeWidth={2.5} className="text-red-500" />
                  </div>
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