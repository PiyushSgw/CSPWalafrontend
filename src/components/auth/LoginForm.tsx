'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2, BookOpen, ArrowRight, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearError, loginCSP } from '@/redux/slices/authslice';
import AdminLoginModal from './AdminLoginModal';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: 'ramesh@example.com',
    password: 'Secure@123',
    remember_me: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(loginCSP(form));
    if (loginCSP.fulfilled.match(res)) {
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else {
      toast.error((res.payload as string) || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-2/5 p-12 justify-between" style={{ background: '#0f1629' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            CSPWala
          </span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your Passbook<br/>Print Portal
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Manage customers, print A5 passbooks, and handle wallet top-ups.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[['60+', 'API Endpoints'], ['A5', 'PDF Format'], ['₹10', 'Per Print'], ['Instant', 'PDF Delivery']].map(([value, label]) => (
              <div key={label} className="rounded-xl p-3" style={{ background: '#1a2544' }}>
                <p className="text-green-400 font-bold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs">{`© ${new Date().getFullYear()} CSPWala. All rights reserved.`}</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>CSPWala</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Sign in</h1>
          <p className="text-sm text-gray-500 mb-7">Enter your credentials</p>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required 
                  value={form.password} onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="remember_me" checked={form.remember_me} onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 accent-green-600" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">Forgot?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>
                Sign in <ArrowRight size={16} />
              </>}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account? <a href="/register" className="text-green-600 hover:text-green-700 font-semibold">Register</a>
          </p>

          {/* ADMIN LOGIN BUTTON */}
          <button onClick={() => setShowAdminModal(true)}
            className="w-full mt-4 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
            text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all">
            <Shield size={18} /> Admin Login
          </button>
        </div>
      </div>

      {/* ADMIN MODAL */}
      <AdminLoginModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </div>
  );
}