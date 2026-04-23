'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '../../utils/axios';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name,
        mobile,
        email: email || undefined,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      document.cookie = `token=${response.data.token}; path=/`;
      toast.success('Registered successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = [
    { label: 'At least 6 characters', valid: password.length >= 6 },
    { label: 'Contains a number', valid: /\d/.test(password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center items-center text-white p-10 space-y-6">
          <h1 className="text-5xl font-extrabold">Join CSP 🚀</h1>
          <p className="text-lg opacity-80 text-center">
            Create your account and start managing your services seamlessly.
          </p>
          <div className="space-y-2">
            {['Fast onboarding', 'Secure authentication', 'Dashboard access'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6">Fill in your details to register</p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm font-medium text-gray-600">Mobile Number</label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength */}
            <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
              {passwordChecks.map((rule, i) => (
                <div key={i} className={`flex items-center gap-2 ${rule.valid ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle2 size={16} /> {rule.label}
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            <button className="border py-2 rounded-xl hover:bg-gray-50">Google</button>
            <button className="border py-2 rounded-xl hover:bg-gray-50">Facebook</button>
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm">
            Already registered?{' '}
            <a href="/login" className="text-emerald-600 font-semibold hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}