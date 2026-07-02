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

const onlyDigits = (v: string, max = 10) => v.replace(/\D/g, '').slice(0, max);

export default function AuthPanel({ open, tab, onClose, onTab }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<'form' | 'otp'>('form');

  const [login, setLogin] = useState({ csp_code: '', mobile: '', password: '', remember_me: false });
  const [reg, setReg] = useState({ name: '', csp_code: '', mobile: '', location: '', password: '' });
  const [otp, setOtp] = useState({ mobile: '', code: '' });

  const isLogin = tab === 'login';

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
                <label>CSP कोड</label>
                <input
                  type="text"
                  placeholder="उदा. CSP0421"
                  value={login.csp_code}
                  onChange={(e) => setLogin({ ...login, csp_code: e.target.value })}
                  required
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
                  required
                />
              </div>
              <div className="field">
                <label>पासवर्ड</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={login.password}
                  onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  required
                />
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
                <label>पूर्ण नाव <span style={{ color: '#E53E3E' }}>*</span></label>
                <input
                  type="text"
                  placeholder="तुमचे पूर्ण नाव"
                  value={reg.name}
                  onChange={(e) => setReg({ ...reg, name: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>CSP कोड <span style={{ color: '#E53E3E' }}>*</span></label>
                <input
                  type="text"
                  placeholder="उदा. CSP0421"
                  value={reg.csp_code}
                  onChange={(e) => setReg({ ...reg, csp_code: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>मोबाईल नंबर <span style={{ color: '#E53E3E' }}>*</span></label>
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
                <label>गाव / तालुका</label>
                <input
                  type="text"
                  placeholder="उदा. कळी दौ, महागाव"
                  value={reg.location}
                  onChange={(e) => setReg({ ...reg, location: e.target.value })}
                />
              </div>
              <div className="field">
                <label>नवीन पासवर्ड <span style={{ color: '#E53E3E' }}>*</span></label>
                <input
                  type="password"
                  placeholder="किमान 6 अक्षरे"
                  value={reg.password}
                  onChange={(e) => setReg({ ...reg, password: e.target.value })}
                  required
                />
                <div className="hint">किमान 6 अक्षरे</div>
              </div>
              <div className="tc-row" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--blue-pale)', border: '1px solid rgba(27,84,216,.15)', borderRadius: 8, padding: 12, marginTop: 4 }}>
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
    </>
  );
}
