'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { initializeAuth } from '@/redux/slices/authslice';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => 
    state.auth.isAuthenticated || state.auth.isAdminAuthenticated
  );

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // ✅ Redirect if not authenticated (after 1s delay)
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}