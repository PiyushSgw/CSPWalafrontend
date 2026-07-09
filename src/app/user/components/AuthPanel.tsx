'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { loginCSP, registerCSP, verifyOTP } from '@/redux/slices/authslice';
import api from '@/utils/axios';

type Tab = 'login' | 'register';

interface Props {
  open: boolean;
  tab: Tab;
  onClose: () => void;
  onTab: (tab: Tab) => void;
}

const onlyDigits = (v: string, max = 10) => v.replace(/\D/g, '').slice(0, max);

interface LocationItem { name: string }

export default function AuthPanel({ open, tab, onClose, onTab }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<'form' | 'otp'>('form');
  const [showPassword, setShowPassword] = useState(false);

  const [login, setLogin] = useState({ email: '', mobile: '', password: '', remember_me: false });
  const [reg, setReg] = useState({
    name: '', mobile: '', email: '',
    password: '',
    state: '', district: '', taluka: '', village_city: '',
  });
  const [otp, setOtp] = useState({ mobile: '', code: '' });

  // Location dropdown options
  const [states, setStates] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [talukas, setTalukas] = useState<LocationItem[]>([]);
  const [villages, setVillages] = useState<LocationItem[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [talukasLoading, setTalukasLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(false);

  const isLogin = tab === 'login';

  useEffect(() => {
    if (!isLogin) loadStates();
  }, [tab]);

  const loadStates = async () => {
    setStatesLoading(true);
    try {
      const res = await api.get('/locations/states');
      setStates(res.data.data);
    } catch {
      toast.error('राज्ये लोड करताना त्रुटी');
    } finally {
      setStatesLoading(false);
    }
  };

  const handleStateChange = async (stateVal: string) => {
    setReg({ ...reg, state: stateVal, district: '', taluka: '', village_city: '' });
    setDistricts([]);
    setTalukas([]);
    setVillages([]);
    if (!stateVal) return;
    setDistrictsLoading(true);
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(stateVal)}/districts`);
      setDistricts(res.data.data);
    } catch {
      toast.error('जिल्हे लोड करताना त्रुटी');
    } finally {
      setDistrictsLoading(false);
    }
  };

  const handleDistrictChange = async (districtVal: string) => {
    setReg({ ...reg, district: districtVal, taluka: '', village_city: '' });
    setTalukas([]);
    setVillages([]);
    if (!districtVal || !reg.state) return;
    setTalukasLoading(true);
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(reg.state)}/districts/${encodeURIComponent(districtVal)}/talukas`);
      setTalukas(res.data.data);
    } catch {
      toast.error('तालुके लोड करताना त्रुटी');
    } finally {
      setTalukasLoading(false);
    }
  };

  const handleTalukaChange = async (talukaVal: string) => {
    setReg({ ...reg, taluka: talukaVal, village_city: '' });
    setVillages([]);
    if (!talukaVal || !reg.state || !reg.district) return;
    setVillagesLoading(true);
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(reg.state)}/districts/${encodeURIComponent(reg.district)}/talukas/${encodeURIComponent(talukaVal)}/villages`);
      setVillages(res.data.data);
    } catch {
      toast.error('गावे लोड करताना त्रुटी');
    } finally {
      setVillagesLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setView('form');
    onTab(t);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!login.mobile.trim() && !login.email.trim()) || !login.password) {
      toast.error('मोबाईल/ईमेल आणि पासवर्ड आवश्यक आहे');
      return;
    }
    setBusy(true);
    const res = await dispatch(
      loginCSP({
        ...(login.email.trim() && { email: login.email.trim() }),
        ...(login.mobile.trim() && { mobile: login.mobile.trim() }),
        password: login.password,
        remember_me: login.remember_me,
      })
    );
    setBusy(false);
    if (loginCSP.fulfilled.match(res)) {
      toast.success('स्वागत आहे!');
      router.push('/dashboard');
    } else {
      toast.error((res.payload as string) || 'लॉगिन अयशस्वी');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.name.trim() || !reg.mobile.trim() || !reg.email.trim() || !reg.password) {
      toast.error('कृपया सर्व आवश्यक माहिती भरा');
      return;
    }
    setBusy(true);
    const res = await dispatch(
      registerCSP({
        name: reg.name.trim(),
        mobile: reg.mobile.trim(),
        email: reg.email.trim(),
        password: reg.password,
        state: reg.state.trim(),
        district: reg.district.trim(),
        taluka: reg.taluka.trim(),
        village_city: reg.village_city.trim(),
      })
    );
    setBusy(false);
    if (registerCSP.fulfilled.match(res)) {
      toast.success('OTP तुमच्या मोबाईलवर पाठवला आहे');
      setOtp({ mobile: reg.mobile.trim(), code: '' });
      setView('otp');
    } else {
      toast.error((res.payload as string) || 'नोंदणी अयशस्वी');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.code.trim().length < 4) {
      toast.error('वैध OTP टाका');
      return;
    }
    setBusy(true);
    const res = await dispatch(verifyOTP({ mobile: otp.mobile, otp: otp.code.trim() }));
    setBusy(false);
    if (verifyOTP.fulfilled.match(res)) {
      toast.success('मोबाईल सत्यापित! आता लॉगिन करा.');
      setLogin((p) => ({ ...p, mobile: reg.mobile }));
      setView('form');
      onTab('login');
    } else {
      toast.error((res.payload as string) || 'OTP पडताळणी अयशस्वी');
    }
  };

  const title = view === 'otp' ? 'OTP पडताळणी' : isLogin ? 'BC एजंट लॉगिन' : 'नवीन नोंदणी';
  const subtitle =
    view === 'otp'
      ? 'तुमच्या मोबाईलवर आलेला OTP टाका'
      : isLogin
        ? 'तुमच्या CSP खात्याने लॉगिन करा'
        : 'काही मिनिटांत खाते तयार करा';

  return (
    <>
      <div className={`overlay${open ? ' active' : ''}`} onClick={onClose} />
      <div className={`login-panel${open ? ' active' : ''}`}>
        <div className="p-cover">
          <div className="p-close" onClick={onClose}>✕</div>
          <div className="p-icon">BC</div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="p-body">
          {view === 'form' && (
            <div className="p-tabs">
              <button className={isLogin ? 'on' : ''} onClick={() => switchTab('login')}>लॉगिन</button>
              <button className={!isLogin ? 'on' : ''} onClick={() => switchTab('register')}>नोंदणी</button>
            </div>
          )}

          {/* ── LOGIN ── */}
          {view === 'form' && isLogin && (
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>मोबाईल नंबर</label>
                <input
                  type="tel"
                  placeholder="10 अंकी मोबाईल नंबर"
                  maxLength={10}
                  value={login.mobile}
                  onChange={(e) => setLogin({ ...login, mobile: onlyDigits(e.target.value) })}
                />
              </div>
              <div className="field">
                <label>ईमेल / Email</label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={login.email}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label>पासवर्ड</label>
                <div className="pw-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                    required
                  />
                  <button type="button" className="pw-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="row-sb">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--soft)', fontSize: '.82rem' }}>
                  <input
                    type="checkbox"
                    style={{ width: 'auto' }}
                    checked={login.remember_me}
                    onChange={(e) => setLogin({ ...login, remember_me: e.target.checked })}
                  />
                  लक्षात ठेवा
                </label>
                <a href="javascript:void(0)" onClick={() => toast('लवकरच उपलब्ध', { icon: 'ℹ️' })}>पासवर्ड विसरलात?</a>
              </div>
              <button className="p-submit" type="submit" disabled={busy}>
                {busy ? 'लॉगिन होत आहे...' : 'लॉगिन करा'}
              </button>
              <div className="or">किंवा</div>
              <p className="p-link-cta">
                खाते नाही? <a href="javascript:void(0)" onClick={() => switchTab('register')}>इथे नोंदणी करा</a>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {view === 'form' && !isLogin && (
            <form onSubmit={handleRegister}>
              <div className="field">
                <label>पूर्ण नाव <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="तुमचे पूर्ण नाव"
                  value={reg.name}
                  onChange={(e) => setReg({ ...reg, name: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>मोबाईल नंबर <span className="req">*</span></label>
                <input
                  type="tel"
                  placeholder="10 अंकी मोबाईल नंबर"
                  maxLength={10}
                  value={reg.mobile}
                  onChange={(e) => setReg({ ...reg, mobile: onlyDigits(e.target.value) })}
                  required
                />
                <div className="hint">OTP याच नंबरवर पाठवला जाईल</div>
              </div>
              <div className="field">
                <label>ईमेल / Email <span className="req">*</span></label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={reg.email}
                  onChange={(e) => setReg({ ...reg, email: e.target.value })}
                  required
                />
              </div>

              {/* Location Section */}
              <div className="loc-label">📍 तुमचे ठिकाण <span className="req">*</span></div>
              <div className="loc-grid">
                <div className="loc-field">
                  <label>राज्य / State</label>
                  <select
                    value={reg.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    required
                  >
                    <option value="">{statesLoading ? 'लोड होत आहे...' : 'राज्य / State'}</option>
                    {states.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="loc-field">
                  <label>जिल्हा / District</label>
                  <select
                    value={reg.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={!reg.state}
                    required
                  >
                    <option value="">{districtsLoading ? 'लोड होत आहे...' : 'जिल्हा / District'}</option>
                    {districts.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="loc-field">
                  <label>तालुका / Taluka</label>
                  <select
                    value={reg.taluka}
                    onChange={(e) => handleTalukaChange(e.target.value)}
                    disabled={!reg.district}
                    required
                  >
                    <option value="">{talukasLoading ? 'लोड होत आहे...' : 'तालुका / Taluka'}</option>
                    {talukas.map((t) => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="loc-field">
                  <label>गाव / Village</label>
                  <select
                    value={reg.village_city}
                    onChange={(e) => setReg({ ...reg, village_city: e.target.value })}
                    disabled={!reg.taluka}
                    required
                  >
                    <option value="">{villagesLoading ? 'लोड होत आहे...' : 'गाव / Village'}</option>
                    {villages.map((v) => (
                      <option key={v.name} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>नवीन पासवर्ड <span className="req">*</span></label>
                <div className="pw-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="किमान 8 अक्षरे"
                    value={reg.password}
                    onChange={(e) => setReg({ ...reg, password: e.target.value })}
                    required
                  />
                  <button type="button" className="pw-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="hint">किमान 8 अक्षरे</div>
              </div>
              <div className="tc-row">
                <input type="checkbox" id="tcChk" required style={{ width: 'auto', marginTop: 2 }} />
                <label htmlFor="tcChk" style={{ fontSize: '.78rem', color: 'var(--soft)', lineHeight: 1.5 }}>
                  मी <a href="#" style={{ color: 'var(--blue)' }}>Terms & Conditions</a> आणि <a href="#" style={{ color: 'var(--blue)' }}>Privacy Policy</a> वाचली असून मान्य आहे.
                </label>
              </div>
              <button className="p-submit" type="submit" disabled={busy} style={{ marginTop: 14 }}>
                {busy ? 'नोंदणी होत आहे...' : 'नोंदणी करा'}
              </button>
              <p className="p-link-cta" style={{ marginTop: 16 }}>
                आधीच खाते आहे? <a href="javascript:void(0)" onClick={() => switchTab('login')}>लॉगिन करा</a>
              </p>
            </form>
          )}

          {/* ── OTP ── */}
          {view === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <div className="field">
                <label>OTP</label>
                <input
                  type="tel"
                  placeholder="मोबाईलवर आलेला OTP"
                  maxLength={8}
                  value={otp.code}
                  onChange={(e) => setOtp({ ...otp, code: onlyDigits(e.target.value, 8) })}
                  required
                />
                <div className="hint">{otp.mobile} वर पाठवलेला OTP टाका</div>
              </div>
              <button className="p-submit" type="submit" disabled={busy}>
                {busy ? 'पडताळणी होत आहे...' : 'OTP पडताळा'}
              </button>
              <p className="p-link-cta" style={{ marginTop: 18 }}>
                <a href="javascript:void(0)" onClick={() => switchTab('register')}>← नोंदणीकडे परत जा</a>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Scoped styles only for the location fields — everything else keeps its existing styling */}
      <style jsx>{`
        .loc-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #0f172a;
          margin: 18px 0 10px;
        }

        .loc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 14px;
          margin-bottom: 14px;
        }

        .loc-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .loc-field label {
          font-weight: 600;
          font-size: 0.85rem;
          color: #0f172a;
        }

        .loc-field select {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          background-color: #ffffff;
          font-size: 0.95rem;
          color: #334155;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }

        .loc-field select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .loc-field select:disabled {
          background-color: #f1f5f9;
          color: #94a3b8;
          cursor: not-allowed;
        }

        @media (max-width: 420px) {
          .loc-grid {
            grid-template-columns: 1fr 1fr;
            gap: 14px 10px;
          }
        }
      `}</style>
    </>
  );
}