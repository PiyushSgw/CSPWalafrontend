'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '../../utils/axios';
import { Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Get mobile from localStorage
    const storedMobile = localStorage.getItem('registration_mobile');
    if (!storedMobile) {
      toast.error('No registration found. Please register first.');
      router.push('/register');
      return;
    }
    setMobile(storedMobile);
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        mobile,
        otp,
      });

      toast.success(response.data?.message || 'Mobile verified successfully!');
      
      // Clear registration mobile
      localStorage.removeItem('registration_mobile');
      
      // Redirect to login with message
      toast.success('Your account is under review. Admin will approve within 24 hours.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      await api.post('/auth/resend-otp', {
        mobile,
        purpose: 'registration',
      });
      toast.success('OTP resent successfully!');
      setCountdown(60); // 60 second cooldown
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Mobile Number</h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit OTP sent to <strong>{mobile}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              OTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              placeholder="000000"
              className="w-full p-4 text-center text-2xl tracking-widest rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
              required
              maxLength={6}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify OTP'}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-2">Didn&apos;t receive OTP?</p>
          <button
            onClick={handleResendOtp}
            disabled={resending || countdown > 0}
            className="flex items-center justify-center gap-2 mx-auto text-emerald-600 font-medium disabled:text-gray-400 transition"
          >
            {resending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>

        {/* Back to Login */}
        <div className="mt-8 pt-6 border-t text-center">
          <a href="/login" className="text-emerald-600 font-semibold hover:underline">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
