'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { loginCSP, registerCSP } from '@/redux/slices/authslice';
import { initRecaptcha, sendOTP, verifyOTP as verifyFirebaseOTP, cleanupRecaptcha, resetConfirmation } from '@/services/firebaseOtp';
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
  const [showPassword, setShowPassword] = useState(false);

  const [login, setLogin] = useState({
    username: "",
    password: "",
    remember_me: false,
  });
  const [reg, setReg] = useState({
    name: '', mobile: '', email: '',
    password: '',
    state: '', district: '', taluka: '', village_city: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(null);
  const lastSentMobile = useRef('');
  const sendingOTP = useRef(false);

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

  useEffect(() => {
    if (!isLogin) {
      try {
        initRecaptcha('firebase-recaptcha-btn');
        setRecaptchaReady(true);
      } catch (err) {
        console.error('reCAPTCHA init failed:', err);
      }
    }
    return () => { cleanupRecaptcha(); };
  }, [tab]);

  const handleSendFirebaseOtp = useCallback(async () => {
    if (sendingOTP.current) return;
    const mobile = reg.mobile;
    if (mobile.length !== 10 || !/^[6-9]/.test(mobile)) {
      toast.error('वैध 10 अंकी मोबाईल नंबर टाका');
      return;
    }
    if (otpAttempts >= 3) {
      toast.error('अधिकतम प्रयतन वापरले गएले. कृपया नंतर पुन्हा प्रयत्न करा.');
      return;
    }
    sendingOTP.current = true;
    setBusy(true);
    try {
      await sendOTP(`+91${mobile}`);
      lastSentMobile.current = mobile;
      toast.success('OTP पाठवला गया!');
      setOtpCode('');
      setOtpSent(true);
      setOtpTimer(30);
      setOtpAttempts((a) => a + 1);
    } catch (err: any) {
      console.error('Firebase sendOTP error:', err);
      toast.error(err.message || 'OTP पाठवण्यात त्रुटी');
    } finally {
      sendingOTP.current = false;
      setBusy(false);
    }
  }, [reg.mobile, otpAttempts]);

  const handleVerifyOtp = async () => {
    if (otpCode.trim().length < 6) {
      toast.error('वैध OTP टाका');
      return;
    }
    setBusy(true);
    try {
      const result = await verifyFirebaseOTP(otpCode.trim());
      const idToken = await result.user.getIdToken();
      setFirebaseIdToken(idToken);
      toast.success('मोबाईल सत्यापित!');
      setMobileVerified(true);
      setOtpSent(false);
      setOtpTimer(0);
    } catch (err: any) {
      console.error('Firebase verifyOTP error:', err);
      toast.error(err.message || 'OTP पडताळणी अयशस्वी');
    } finally {
      setBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    lastSentMobile.current = '';
    await handleSendFirebaseOtp();
  };

  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

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
    setDistrictsLoading(true);
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(reg.state)}/districts/${encodeURIComponent(districtVal)}/talukas`);
      setTalukas(res.data.data);
    } catch {
      toast.error('तालुके लोड करताना त्रुटी');
    } finally {
      setDistrictsLoading(false);
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
    setOtpSent(false);
    setMobileVerified(false);
    setOtpCode('');
    setOtpAttempts(0);
    setOtpTimer(0);
    setFirebaseIdToken(null);
    lastSentMobile.current = '';
    onTab(t);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = login.username.trim();

    if (!username || !login.password) {
      toast.error("ईमेल आयडी / मोबाईल नंबर आणि पासवर्ड आवश्यक आहे.");
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const isMobile = /^[0-9]{10}$/.test(username);

    if (!isEmail && !isMobile) {
      toast.error("कृपया वैध ईमेल आयडी किंवा १० अंकी मोबाईल नंबर प्रविष्ट करा.");
      return;
    }

    setBusy(true);

    const res = await dispatch(
      loginCSP({
        ...(isEmail
          ? { email: username }
          : { mobile: username }),
        password: login.password,
        remember_me: login.remember_me,
      })
    );

    setBusy(false);

    if (loginCSP.fulfilled.match(res)) {
      toast.success("आपले स्वागत आहे!");
      router.push("/dashboard");
    } else {
      toast.error((res.payload as string) || "लॉगिन अयशस्वी.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileVerified) {
      toast.error('कृपया प्रथम मोबाईल नंबर सत्यापित करा');
      return;
    }
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
    if (registerCSP.fulfilled.match(res)) {
      // Send Firebase idToken to backend to activate the account
      if (firebaseIdToken) {
        try {
          await api.post('/auth/verify-firebase', { idToken: firebaseIdToken });
        } catch (err) {
          console.error('Backend verify-firebase failed:', err);
        }
      }
      setBusy(false);
      toast.success('नोंदणी यशस्वी! आता लॉगिन करा.');
      setLogin((p) => ({ ...p, username: reg.mobile }));
      setMobileVerified(false);
      setFirebaseIdToken(null);
      onTab('login');
    } else {
      setBusy(false);
      toast.error((res.payload as string) || 'नोंदणी अयशस्वी');
    }
  };

  const title = isLogin ? 'BC एजंट लॉगिन' : 'नवीन नोंदणी';
  const subtitle = isLogin
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
          <div className="p-tabs">
            <button className={isLogin ? 'on' : ''} onClick={() => switchTab('login')}>लॉगिन</button>
            <button className={!isLogin ? 'on' : ''} onClick={() => switchTab('register')}>नोंदणी</button>
          </div>

          {/* ── LOGIN ── */}
          {isLogin && (
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email ID / Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter Email ID or Mobile Number"
                  value={login.username}
                  onChange={(e) =>
                    setLogin({
                      ...login,
                      username: e.target.value,
                    })
                  }
                  required
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
          {!isLogin && (
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

              {/* Mobile Number + Send OTP */}
              <div className="field">
                <label>मोबाईल नंबर <span className="req">*</span></label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', flex: 1 }}>
                    <span style={{ padding: '12px 10px', backgroundColor: '#f1f5f9', fontWeight: 600, fontSize: '0.95rem', color: '#334155', borderRight: '1.5px solid #e2e8f0', whiteSpace: 'nowrap' }}>+91</span>
                    <input
                      type="tel"
                      placeholder="10 अंकी मोबाईल नंबर"
                      maxLength={10}
                      value={reg.mobile}
                      onChange={(e) => {
                        const newMobile = onlyDigits(e.target.value, 10);
                        if (newMobile !== reg.mobile) {
                          setMobileVerified(false);
                          setOtpSent(false);
                          setOtpCode('');
                          setOtpTimer(0);
                          setFirebaseIdToken(null);
                          lastSentMobile.current = '';
                          resetConfirmation();
                        }
                        setReg({ ...reg, mobile: newMobile });
                      }}
                      style={{ border: 'none', outline: 'none', flex: 1, padding: '12px 14px', fontSize: '0.95rem' }}
                      required
                    />
                  </div>
                  {!mobileVerified && (
                    <button
                      type="button"
                      onClick={handleSendFirebaseOtp}
                      disabled={busy || otpSent || reg.mobile.length !== 10 || !/^[6-9]/.test(reg.mobile)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: '1.5px solid #2563eb',
                        backgroundColor: (busy || otpSent || reg.mobile.length !== 10 || !/^[6-9]/.test(reg.mobile)) ? '#e2e8f0' : '#2563eb',
                        color: (busy || otpSent || reg.mobile.length !== 10 || !/^[6-9]/.test(reg.mobile)) ? '#94a3b8' : '#fff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: (busy || otpSent || reg.mobile.length !== 10 || !/^[6-9]/.test(reg.mobile)) ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {busy ? '...' : 'Send OTP'}
                    </button>
                  )}
                </div>
                {mobileVerified && (
                  <div style={{ color: '#16a34a', fontWeight: 600, fontSize: '.85rem', marginTop: 4 }}>
                    ✔ मोबाईल सत्यापित
                  </div>
                )}
                {!mobileVerified && !otpSent && (
                  <div className="hint">OTP याच नंबरवर पाठवला जाईल</div>
                )}
              </div>

              {/* Inline OTP Section */}
              {otpSent && !mobileVerified && (
                <div className="field" style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>OTP पडताळणी</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'stretch', marginTop: 8 }}>
                    <input
                      type="tel"
                      placeholder="6 अंकी OTP टाका"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(onlyDigits(e.target.value, 6))}
                      style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '0.95rem', outline: 'none' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={busy || otpCode.trim().length < 6}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 12,
                        border: '1.5px solid #16a34a',
                        backgroundColor: (busy || otpCode.trim().length < 6) ? '#e2e8f0' : '#16a34a',
                        color: (busy || otpCode.trim().length < 6) ? '#94a3b8' : '#fff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: (busy || otpCode.trim().length < 6) ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {busy ? '...' : 'Verify'}
                    </button>
                  </div>
                  <div style={{ marginTop: 10, textAlign: 'center' }}>
                    {otpTimer > 0 ? (
                      <span style={{ color: '#64748b', fontSize: '.82rem' }}>
                        पुन्हा OTP पाठवा {otpTimer}s
                      </span>
                    ) : (
                      <a
                        href="javascript:void(0)"
                        onClick={handleResendOtp}
                        style={{ color: '#2563eb', fontSize: '.82rem', fontWeight: 500 }}
                      >
                        OTP पुन्हा पाठवा
                      </a>
                    )}
                  </div>
                </div>
              )}

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
        </div>
      </div>

      <div id="firebase-recaptcha-btn" style={{ display: 'none' }} />

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
