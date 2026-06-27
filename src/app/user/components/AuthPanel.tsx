'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { loginCSP, registerCSP, verifyOTP } from '@/redux/slices/authslice';

type Tab = 'login' | 'register';

interface Props {
  open: boolean;
  tab: Tab;
  onClose: () => void;
  onTab: (tab: Tab) => void;
}

// Email + password login is kept in code but hidden for now (toggle to re-enable).
const SHOW_EMAIL_LOGIN = false;

const onlyDigits = (v: string, max = 10) => v.replace(/\D/g, '').slice(0, max);

export default function AuthPanel({ open, tab, onClose, onTab }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  // 'form' shows login/register; 'otp' shows the OTP step after registering.
  const [view, setView] = useState<'form' | 'otp'>('form');

  const [login, setLogin] = useState({ csp_code: '', mobile: '', password: '', email: '', remember_me: false });
  const [reg, setReg] = useState({ name: '', csp_code: '', mobile: '', location: '', password: '' });
  const [otp, setOtp] = useState({ mobile: '', code: '' });

  const isLogin = tab === 'login';

  const title = view === 'otp' ? 'OTP पडताळणी' : isLogin ? 'BC एजंट लॉगिन' : 'नवीन नोंदणी';
  const subtitle =
    view === 'otp'
      ? 'तुमच्या मोबाईलवर आलेला OTP टाका'
      : isLogin
        ? 'तुमच्या CSP खात्याने लॉगिन करा'
        : 'काही मिनिटांत खाते तयार करा';

  const switchTab = (t: Tab) => {
    setView('form');
    onTab(t);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.csp_code.trim() || !login.mobile.trim() || !login.password) {
      toast.error('CSP कोड, मोबाईल आणि पासवर्ड आवश्यक आहे');
      return;
    }
    setBusy(true);
    const res = await dispatch(
      loginCSP({
        csp_code: login.csp_code.trim(),
        mobile: login.mobile.trim(),
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
    if (!reg.name.trim() || !reg.csp_code.trim() || !reg.mobile.trim() || !reg.password) {
      toast.error('कृपया सर्व आवश्यक माहिती भरा');
      return;
    }
    setBusy(true);
    const res = await dispatch(
      registerCSP({
        name: reg.name.trim(),
        csp_code: reg.csp_code.trim(),
        mobile: reg.mobile.trim(),
        location: reg.location.trim() || undefined,
        password: reg.password,
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
      setLogin((p) => ({ ...p, csp_code: reg.csp_code, mobile: reg.mobile }));
      setView('form');
      onTab('login');
    } else {
      toast.error((res.payload as string) || 'OTP पडताळणी अयशस्वी');
    }
  };

  return (
    <>
      <div className={`overlay${open ? ' active' : ''}`} onClick={onClose} />
      <div className={`login-panel${open ? ' active' : ''}`}>
        <div className="login-cover">
          <div className="close-btn" onClick={onClose}>✕</div>
          <div className="seal-big mono">BC</div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="login-body">
          {view === 'form' && (
            <div className="tabbar">
              <button className={isLogin ? 'active' : ''} onClick={() => switchTab('login')}>लॉगिन</button>
              <button className={!isLogin ? 'active' : ''} onClick={() => switchTab('register')}>नोंदणी</button>
            </div>
          )}

          {/* ── LOGIN ── */}
          {view === 'form' && isLogin && (
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>CSP कोड</label>
                <input
                  type="text"
                  placeholder="उदा. CSP0421"
                  value={login.csp_code}
                  onChange={(e) => setLogin({ ...login, csp_code: e.target.value })}
                />
              </div>
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
              {SHOW_EMAIL_LOGIN && (
                <div className="field">
                  <label>ईमेल</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={login.email}
                    onChange={(e) => setLogin({ ...login, email: e.target.value })}
                  />
                </div>
              )}
              <div className="field">
                <label>पासवर्ड</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={login.password}
                  onChange={(e) => setLogin({ ...login, password: e.target.value })}
                />
              </div>
              <div className="row-between">
                <label style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--ink-soft)' }}>
                  <input
                    type="checkbox"
                    style={{ width: 'auto' }}
                    checked={login.remember_me}
                    onChange={(e) => setLogin({ ...login, remember_me: e.target.checked })}
                  />{' '}
                  लक्षात ठेवा
                </label>
                <a onClick={() => toast('लवकरच उपलब्ध', { icon: 'ℹ️' })}>पासवर्ड विसरलात?</a>
              </div>
              <button className="login-submit" type="submit" disabled={busy}>
                {busy ? 'लॉगिन होत आहे...' : 'लॉगिन करा'}
              </button>
              <div className="divider-or">किंवा</div>
              <p className="register-cta">
                खाते नाही? <a onClick={() => switchTab('register')}>इथे नोंदणी करा</a>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {view === 'form' && !isLogin && (
            <form onSubmit={handleRegister}>
              <div className="field">
                <label>पूर्ण नाव</label>
                <input
                  type="text"
                  placeholder="तुमचे पूर्ण नाव"
                  value={reg.name}
                  onChange={(e) => setReg({ ...reg, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>CSP कोड</label>
                <input
                  type="text"
                  placeholder="उदा. CSP0421"
                  value={reg.csp_code}
                  onChange={(e) => setReg({ ...reg, csp_code: e.target.value })}
                />
              </div>
              <div className="field">
                <label>मोबाईल नंबर</label>
                <input
                  type="tel"
                  placeholder="10 अंकी मोबाईल नंबर"
                  maxLength={10}
                  value={reg.mobile}
                  onChange={(e) => setReg({ ...reg, mobile: onlyDigits(e.target.value) })}
                />
                <div className="hint">OTP याच नंबरवर पाठवला जाईल</div>
              </div>
              <div className="field">
                <label>गाव / तालुका</label>
                <input
                  type="text"
                  placeholder="उदा. कळी दौ, महागाव"
                  value={reg.location}
                  onChange={(e) => setReg({ ...reg, location: e.target.value })}
                />
              </div>
              <div className="field">
                <label>नवीन पासवर्ड</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={reg.password}
                  onChange={(e) => setReg({ ...reg, password: e.target.value })}
                />
                <div className="hint">किमान 6 अक्षरे</div>
              </div>
              <button className="login-submit" type="submit" disabled={busy}>
                {busy ? 'नोंदणी होत आहे...' : 'नोंदणी करा'}
              </button>
              <p className="register-cta" style={{ marginTop: 18 }}>
                आधीच खाते आहे? <a onClick={() => switchTab('login')}>लॉगिन करा</a>
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
                />
                <div className="hint">{otp.mobile} वर पाठवलेला OTP टाका</div>
              </div>
              <button className="login-submit" type="submit" disabled={busy}>
                {busy ? 'पडताळणी होत आहे...' : 'OTP पडताळा'}
              </button>
              <p className="register-cta" style={{ marginTop: 18 }}>
                <a onClick={() => switchTab('register')}>← नोंदणीकडे परत जा</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
