'use client';

import type { OpenAuth } from '../data';

const FOCUS_ITEMS = [
  { dot: '#4CAF7D', label: 'AOF + DA-1 + FATCA + Pledge', active: true },
  { dot: '#4CAF7D', label: 'Service Request (१४ सेवा)', active: true },
  { dot: '#4CAF7D', label: 'KYC / Data Update (९ फॉर्म)', active: true },
  { dot: '#4CAF7D', label: 'APY · PMJJBY · PMSBY', active: true },
  { dot: '#E8A020', label: 'Passbook Printing', soon: true },
  { dot: '#E8A020', label: 'RTGS / NEFT Forms', soon: true },
  { dot: '#E8A020', label: 'Cash Deposit Slip', soon: true },
];

export default function HeroSection({ openAuth }: { openAuth: OpenAuth }) {
  return (
    <div className="hero-bg">
      <div className="hero-glow" />
      <div className="hero-glow2" />
      <section className="hero">
        <div>
          <div className="badge">BC एजंट डिजिटल पोर्टल</div>
          <h1>Account Opening Form<br />आता <em>झटक्यात</em> तयार.</h1>
          <p className="lead">
            हाताने भरण्याचा त्रास संपला. ग्राहकाची माहिती एकदाच टाईप करा — AOF, DA-1, FATCA, Integrity Pledge आणि APY · PMJJBY · PMSBY सर्व फॉर्म्स एकत्र रेडिमेड प्रिंट मिळवा.
          </p>
          <div className="hero-btns">
            <span className="btn btn-gold" onClick={() => openAuth('register')}>🚀 मोफत सुरु करा</span>
            <span className="btn" style={{ background: 'rgba(255,255,255,.09)', color: '#fff', borderColor: 'rgba(255,255,255,.22)' }} onClick={() => document.getElementById('forms')?.scrollIntoView()}>
              फॉर्म्स बघा →
            </span>
          </div>
          <div className="chips">
            <div className="chip"><b>12</b> राष्ट्रीय बँका</div>
            <div className="chip">AOF + <b>4</b> सोबत फॉर्म्स</div>
            <div className="chip"><b>14</b> सेवा विनंती फॉर्म्स</div>
            <div className="chip"><b>9</b> KYC अपडेट फॉर्म्स</div>
            <div className="chip"><b>APY · PMJJBY · PMSBY</b></div>
          </div>
        </div>
        <div className="focus-card">
          <div className="fc-head">
            <div className="fc-head-icon c-ubi" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700 }}>UBI</div>
            <div className="fc-head-txt">
              <h4>उपलब्ध सेवा</h4>
              <span>Available Services</span>
            </div>
          </div>
          <div className="fc-items">
            {FOCUS_ITEMS.map((item, idx) => (
              <div key={idx}>
                {idx === 4 && <div className="fc-divider" />}
                <div className={`fc-item${item.active ? ' active' : ''}`}>
                  <div className="fc-dot" style={{ background: item.dot }} />
                  <span className="fc-lbl">{item.label}</span>
                  <span className={`fc-tag ${item.soon ? 'tag-inc' : 'tag-live'}`}>{item.soon ? 'SOON' : 'LIVE'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
