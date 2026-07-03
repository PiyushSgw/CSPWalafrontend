'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../utils/axios';

const BANK_OPTIONS = [
  { id: 1, name: 'State Bank of India (SBI)' },
  { id: 2, name: 'Punjab National Bank (PNB)' },
  { id: 3, name: 'Bank of Baroda (BOB)' },
  { id: 4, name: 'Canara Bank' },
  { id: 5, name: 'Union Bank of India' },
  { id: 6, name: 'Bank of India' },
  { id: 7, name: 'Indian Bank' },
  { id: 8, name: 'Central Bank of India' },
  { id: 9, name: 'Indian Overseas Bank' },
  { id: 10, name: 'UCO Bank' },
  { id: 11, name: 'HDFC Bank' },
  { id: 12, name: 'ICICI Bank' },
  { id: 13, name: 'Axis Bank' },
  { id: 14, name: 'Kotak Mahindra Bank' },
  { id: 15, name: 'Yes Bank' },
  { id: 16, name: 'IndusInd Bank' },
  { id: 17, name: 'IDBI Bank' },
  { id: 18, name: 'Bandhan Bank' },
  { id: 99, name: 'Other' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cspCode, setCspCode] = useState('');
  const [bankId, setBankId] = useState('');
  const [otherBankName, setOtherBankName] = useState('');
  const [branchId, setBranchId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Location dropdown state
  const [states, setStates] = useState<{ name: string }[]>([]);
  const [districts, setDistricts] = useState<{ name: string }[]>([]);
  const [talukas, setTalukas] = useState<{ name: string }[]>([]);
  const [villages, setVillages] = useState<{ name: string }[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluka, setSelectedTaluka] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [talukasLoading, setTalukasLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(false);

  const router = useRouter();
  const isOtherBank = bankId === '99';

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    setStatesLoading(true);
    try {
      const res = await api.get('/locations/states');
      setStates(res.data.data);
    } catch {
      toast.error('Failed to load states');
    } finally {
      setStatesLoading(false);
    }
  };

  const handleStateChange = async (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setSelectedTaluka('');
    setSelectedVillage('');
    setDistricts([]);
    setTalukas([]);
    setVillages([]);
    if (!state) return;
    setDistrictsLoading(true);
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(state)}/districts`);
      setDistricts(res.data.data);
    } catch {
      toast.error('Failed to load districts');
    } finally {
      setDistrictsLoading(false);
    }
  };

  const handleDistrictChange = async (district: string) => {
    setSelectedDistrict(district);
    setSelectedTaluka('');
    setSelectedVillage('');
    setTalukas([]);
    setVillages([]);
    if (!district || !selectedState) return;
    setTalukasLoading(true);
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(selectedState)}/districts/${encodeURIComponent(district)}/talukas`);
      setTalukas(res.data.data);
    } catch {
      toast.error('Failed to load talukas');
    } finally {
      setTalukasLoading(false);
    }
  };

  const handleTalukaChange = async (taluka: string) => {
    setSelectedTaluka(taluka);
    setSelectedVillage('');
    setVillages([]);
    if (!taluka || !selectedState || !selectedDistrict) return;
    setVillagesLoading(true);
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(selectedState)}/districts/${encodeURIComponent(selectedDistrict)}/talukas/${encodeURIComponent(taluka)}/villages`);
      setVillages(res.data.data);
    } catch {
      toast.error('Failed to load villages');
    } finally {
      setVillagesLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const registrationData: any = {
        name,
        mobile,
        email,
        password,
        csp_code: cspCode,
        bank_id: parseInt(bankId),
        branch_id: branchId ? parseInt(branchId) : undefined,
        state: selectedState,
        district: selectedDistrict,
        taluka: selectedTaluka,
        village_city: selectedVillage,
      };

      if (isOtherBank && otherBankName.trim()) {
        registrationData.location = `Other Bank: ${otherBankName.trim()}`;
      }

      await api.post('/auth/register', registrationData);

      localStorage.setItem('registration_mobile', mobile);
      toast.success('Registration successful! Please verify OTP sent to your mobile.');
      router.push('/verify-otp');
    } catch (error: any) {
      const errMsg = error.response?.data?.errors?.join('. ') || error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Contains uppercase & lowercase', valid: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Contains a number', valid: /\d/.test(password) },
  ];

  return (
    <div className="h-screen flex items-start justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-4 py-6 overflow-y-auto">
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
        <div className="bg-white p-8 md:p-12 flex flex-col justify-center max-h-screen overflow-y-auto">
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
              <label className="text-sm font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm font-medium text-gray-600">Mobile Number <span className="text-red-500">*</span></label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
                required
                maxLength={10}
              />
            </div>

            {/* CSP Code */}
            <div>
              <label className="text-sm font-medium text-gray-600">CSP Code <span className="text-red-500">*</span></label>
              <input
                value={cspCode}
                onChange={(e) => setCspCode(e.target.value.toUpperCase())}
                placeholder="CSPA7K2M9"
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none uppercase"
                required
              />
            </div>

            {/* Bank Selection */}
            <div>
              <label className="text-sm font-medium text-gray-600">Bank <span className="text-red-500">*</span></label>
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                required
              >
                <option value="">Select Bank</option>
                {BANK_OPTIONS.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Other Bank Name (shown when Other selected) */}
            {isOtherBank && (
              <div>
                <label className="text-sm font-medium text-gray-600">Enter Bank Name <span className="text-red-500">*</span></label>
                <input
                  value={otherBankName}
                  onChange={(e) => setOtherBankName(e.target.value)}
                  placeholder="e.g., Maharashtra Gramin Bank"
                  className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
                  required={isOtherBank}
                />
                <p className="text-xs text-gray-500 mt-1">Admin will verify and add this bank to the system.</p>
              </div>
            )}

            {/* Branch ID (Optional) */}
            <div>
              <label className="text-sm font-medium text-gray-600">Branch ID (Optional)</label>
              <input
                type="number"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                placeholder="Enter branch ID if available"
                className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* ---- Location Section ---- */}
            <div className="border-t pt-4 mt-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Location Details</h3>

              {/* State */}
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-600">State <span className="text-red-500">*</span></label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  required
                >
                  <option value="">{statesLoading ? 'Loading...' : 'Select State'}</option>
                  {states.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-600">District <span className="text-red-500">*</span></label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!selectedState}
                  className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">{districtsLoading ? 'Loading...' : 'Select District'}</option>
                  {districts.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Taluka */}
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-600">Taluka <span className="text-red-500">*</span></label>
                <select
                  value={selectedTaluka}
                  onChange={(e) => handleTalukaChange(e.target.value)}
                  disabled={!selectedDistrict}
                  className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">{talukasLoading ? 'Loading...' : 'Select Taluka'}</option>
                  {talukas.map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Village/City */}
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-600">Village/City <span className="text-red-500">*</span></label>
                <select
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  disabled={!selectedTaluka}
                  className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">{villagesLoading ? 'Loading...' : 'Select Village/City'}</option>
                  {villages.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
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
