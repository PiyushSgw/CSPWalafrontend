'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { loginCSP, registerCSP } from '@/redux/slices/authslice';
import { initRecaptcha, sendOTP, verifyOTP as verifyFirebaseOTP, cleanupRecaptcha, resetConfirmation } from '@/services/firebaseOtp';
import { isValidEmail, sendEmailVerification, verifyEmailOtp, checkEmailVerificationStatus } from '@/services/firebaseEmailVerification';
import api from '@/utils/axios';
import LocationForm from '@/components/location/LocationForm';
import type { LocationFormValue } from '@/components/location/LocationForm';

type Tab = 'login' | 'register';

interface Props {
  open: boolean;
  tab: Tab;
  onClose: () => void;
  onTab: (tab: Tab) => void;
}

const onlyDigits = (v: string, max = 10) => v.replace(/\D/g, '').slice(0, max);

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
  });
  const [location, setLocation] = useState<LocationFormValue>({
    state: '',
    district: '',
    subDistrict: '',
    villageCity: '',
    pinCode: '',
    fullAddress: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const otpCodeRef = useRef('');
  const [otpSent, setOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const recaptchaInited = useRef(false);
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(null);
  const lastSentMobile = useRef('');
  const sendingOTP = useRef(false);

  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);

  const isLogin = tab === 'login';

  useEffect(() => {
    if (!isLogin && !recaptchaInited.current) {
      try {
        initRecaptcha('firebase-recaptcha-btn');
        recaptchaInited.current = true;
      } catch (err) {
        console.error('reCAPTCHA init failed:', err);
      }
    }
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

  const handleVerifyOtp = useCallback(async () => {
    const code = otpCodeRef.current;
    if (code.trim().length < 6) {
      toast.error('वैध OTP टाका');
      return;
    }
    setBusy(true);
    try {
      const result = await verifyFirebaseOTP(code.trim());
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
  }, []);

  useEffect(() => { otpCodeRef.current = otpCode; }, [otpCode]);

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

  // ── Email Verification Handler ──
  const handleSendEmailVerification = useCallback(async () => {
    const email = reg.email.trim();
    if (!email) {
      toast.error('कृपया ईमेल पत्ता टाका');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('कृपया वैध ईमेल पत्ता टाका');
      return;
    }
    setEmailSending(true);
    try {
      const result = await sendEmailVerification(email);
      if (result.success) {
        toast.success(result.message || 'सत्यापन ईमेल पाठवला गेला. आपला इनबॉक्स तपासा.');
        setEmailSent(true);
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'ईमेल सत्यापन पाठवण्यात त्रुटी');
    } finally {
      setEmailSending(false);
    }
  }, [reg.email]);

  // ── Verify Email OTP ──
  const handleVerifyEmailOtp = useCallback(async () => {
    const email = reg.email.trim();
    const otp = emailOtpCode.trim();
    if (!email || !isValidEmail(email)) {
      toast.error('कृपया वैध ईमेल पत्ता टाका');
      return;
    }
    if (otp.length !== 6) {
      toast.error('कृपया 6 अंकी OTP टाका');
      return;
    }
    setEmailChecking(true);
    try {
      const result = await verifyEmailOtp(email, otp);
      if (result.success) {
        setEmailVerified(true);
        setEmailSent(false);
        setEmailOtpCode('');
        toast.success(result.message || 'ईमेल सत्यापित!');
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'OTP पडताळणी अयशस्वी');
    } finally {
      setEmailChecking(false);
    }
  }, [reg.email, emailOtpCode]);

  // ── Check if email is already verified on blur ──
  const handleEmailBlur = useCallback(async (e?: React.FocusEvent<HTMLInputElement>) => {
    const email = reg.email.trim();
    if (!email || !isValidEmail(email)) return;
    if (emailVerified || emailSent) return;

    // Skip the auto-check when the user is clicking the "Verify Email Address"
    // button — otherwise the button unmounts mid-click and swallows the first click.
    const relatedTarget = e?.relatedTarget as HTMLElement | null;
    if (relatedTarget?.closest?.('[data-verify-email-btn]')) return;

    setEmailChecking(true);
    try {
      const result = await checkEmailVerificationStatus(email);
      if (result.success && result.verified) {
        setEmailVerified(true);
        setEmailSent(false);
      }
    } catch {
      // Silent fail
    } finally {
      setEmailChecking(false);
    }
  }, [reg.email, emailVerified, emailSent]);

  const switchTab = useCallback((t: Tab) => {
    setOtpSent(false);
    setMobileVerified(false);
    setOtpCode('');
    setOtpAttempts(0);
    setOtpTimer(0);
    setFirebaseIdToken(null);
    setEmailVerified(false);
    setEmailSent(false);
    setEmailSending(false);
    setEmailOtpCode('');
    setEmailChecking(false);
    lastSentMobile.current = '';
    onTab(t);
  }, [onTab]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
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
  }, [login.username, login.password, login.remember_me, dispatch, router]);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileVerified) {
      toast.error('कृपया प्रथम मोबाईल नंबर सत्यापित करा');
      return;
    }
    if (!reg.name.trim() || !reg.mobile.trim() || !reg.password) {
      toast.error('कृपया सर्व आवश्यक माहिती भरा');
      return;
    }

    if (reg.email.trim() && !isValidEmail(reg.email.trim())) {
      toast.error('कृपया वैध ईमेल पत्ता टाका');
      return;
    }

    const finalState = location.state.trim();
    const finalDistrict = location.district.trim();
    const finalTaluka = location.subDistrict.trim();
    const finalVillage = location.villageCity.trim();

    if (!finalState || !finalDistrict || !finalTaluka || !finalVillage) {
      toast.error('कृपया सर्व ठिकाण भरा');
      return;
    }

    setBusy(true);
    const res = await dispatch(
      registerCSP({
        name: reg.name.trim(),
        mobile: reg.mobile.trim(),
        email: reg.email.trim(),
        password: reg.password,
        state: finalState,
        district: finalDistrict,
        taluka: finalTaluka,
        village_city: finalVillage,
        pin_code: location.pinCode.trim(),
        address: location.fullAddress.trim(),
        phone_verified: mobileVerified ? 1 : 0,
        email_verified: emailVerified ? 1 : 0,
      })
    );
    if (registerCSP.fulfilled.match(res)) {
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
      setEmailVerified(false);
      setEmailSent(false);
      setEmailOtpCode('');
      setFirebaseIdToken(null);
      onTab('login');
    } else {
      setBusy(false);
      toast.error((res.payload as string) || 'नोंदणी अयशस्वी');
    }
  }, [mobileVerified, reg, emailVerified, firebaseIdToken, location, dispatch, onTab]);

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
                          setEmailVerified(false);
                          setEmailSent(false);
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
                <label>ईमेल / Email <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>(पर्यायी)</span></label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={reg.email}
                  onChange={(e) => {
                    setReg({ ...reg, email: e.target.value });
                    if (emailVerified || emailSent) {
                      setEmailVerified(false);
                      setEmailSent(false);
                      setEmailOtpCode('');
                    }
                  }}
                  onBlur={(e) => handleEmailBlur(e)}
                />
                {/* Email Verification Button & Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {!emailVerified && !emailSent && (
                    <button
                      type="button"
                      data-verify-email-btn
                      onClick={handleSendEmailVerification}
                      disabled={
                        emailSending ||
                        emailChecking ||
                        !reg.email.trim() ||
                        !isValidEmail(reg.email.trim()) 
                      }
                      style={{
                        padding: '8px 14px',
                        borderRadius: 10,
                        border: '1.5px solid #7c3aed',
                        backgroundColor:
                          emailSending || emailChecking || !reg.email.trim() || !isValidEmail(reg.email.trim()) 
                            ? '#e2e8f0'
                            : '#7c3aed',
                        color:
                          emailSending || emailChecking || !reg.email.trim() || !isValidEmail(reg.email.trim()) 
                            ? '#94a3b8'
                            : '#fff',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor:
                          emailSending || emailChecking || !reg.email.trim() || !isValidEmail(reg.email.trim()) 
                            ? 'not-allowed'
                            : 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                      }}
                    >
                      {emailSending ? '...' : emailChecking ? 'Checking...' : 'Verify Email Address'}
                    </button>
                  )}
                  {emailVerified && (
                    <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '.85rem' }}>
                      ✔ Verified
                    </span>
                  )}
                  {!emailVerified && !emailSent && !emailChecking && (
                    <span className="hint" style={{ width: '100%' }}>
                      ईमेल पत्ता प्रविष्ट करा आणि सत्यापन बटण दाबा (पर्यायी)
                    </span>
                  )}
                </div>

                {/* Inline Email OTP Section */}
                {emailSent && !emailVerified && (
                  <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', marginTop: 10 }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>ईमेल OTP पडताळणी</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'stretch', marginTop: 8 }}>
                      <input
                        type="tel"
                        placeholder="6 अंकी OTP टाका"
                        maxLength={6}
                        value={emailOtpCode}
                        onChange={(e) => setEmailOtpCode(onlyDigits(e.target.value, 6))}
                        style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '0.95rem', outline: 'none' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOtp}
                        disabled={emailChecking || emailOtpCode.trim().length < 6}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 12,
                          border: '1.5px solid #16a34a',
                          backgroundColor: (emailChecking || emailOtpCode.trim().length < 6) ? '#e2e8f0' : '#16a34a',
                          color: (emailChecking || emailOtpCode.trim().length < 6) ? '#94a3b8' : '#fff',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: (emailChecking || emailOtpCode.trim().length < 6) ? 'not-allowed' : 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {emailChecking ? '...' : 'Verify'}
                      </button>
                    </div>
                    <div style={{ marginTop: 10, textAlign: 'center' }}>
                      <a
                        href="javascript:void(0)"
                        onClick={handleSendEmailVerification}
                        style={{ color: '#7c3aed', fontSize: '.82rem', fontWeight: 500 }}
                      >
                        OTP पुन्हा पाठवा
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Location Section */}
              <div className="loc-label">📍 तुमचे ठिकाण <span className="req">*</span></div>
              <LocationForm value={location} onChange={setLocation} showAddressField={true} />

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
              <button className="p-submit" type="submit" disabled={busy || !mobileVerified} style={{ marginTop: 14 }}>
                {busy ? 'नोंदणी होत आहे...' : 'नोंदणी करा'}
              </button>
              {!mobileVerified && (
                <p style={{ textAlign: 'center', fontSize: '.75rem', color: '#dc2626', marginTop: 8 }}>
                  कृपया मोबाईल नंबर सत्यापित करा
                </p>
              )}
              {mobileVerified && !emailVerified && (
                <p style={{ textAlign: 'center', fontSize: '.75rem', color: '#64748b', marginTop: 8 }}>
                  ईमेल सत्यापन पर्यायी आहे. तुमचा ईमेल नंतर सत्यापित करू शकता.
                </p>
              )}
              <p className="p-link-cta" style={{ marginTop: 16 }}>
                आधीच खाते आहे? <a href="javascript:void(0)" onClick={() => switchTab('login')}>लॉगिन करा</a>
              </p>
            </form>
          )}
        </div>
      </div>

      <div id="firebase-recaptcha-btn" style={{ display: 'none' }} />

      <style jsx>{`
        .loc-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #0f172a;
          margin: 18px 0 10px;
        }
      `}</style>
    </>
  );
}
