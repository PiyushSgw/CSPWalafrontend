'use client';

import { useState } from 'react';
import { DOC_FORMS, SERVICE_ITEMS, KYC_FORMS, SCHEMES } from '../data';
import type { OpenAuth } from '../data';

type Tab = 'aof' | 'svc' | 'kyc' | 'sch';

const TABS = [
  { id: 'aof' as Tab, label: '📄 Account Opening Forms' },
  { id: 'svc' as Tab, label: '🔧 Service Request' },
  { id: 'kyc' as Tab, label: '📋 KYC / Data Update' },
  { id: 'sch' as Tab, label: '🏛️ APY · PMJJBY · PMSBY' },
];

export default function ServicesSection({ openAuth }: { openAuth: OpenAuth }) {
  const [active, setActive] = useState<Tab>('aof');

  return (
    <section className="sec tight" id="forms">
      <div className="sec-top">
        <div className="sec-lbl">मुख्य सेवा</div>
        <h2>Union Bank of India — AOF व सरकारी योजना फॉर्म्स</h2>
        <p>बँक निवडा — त्याच बँकेचे फॉर्म्स आपोआप लोड होतात. ग्राहकाची माहिती एकदाच भरा.</p>
      </div>
      <div className="focus-wrap">
        <div className="fw-tabs">
          {TABS.map((t) => (
            <div
              key={t.id}
              className={`fw-tab${active === t.id ? ' on' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </div>
          ))}
        </div>
        <div className="fw-body">
          {active === 'aof' && (
            <div>
              <div className="aof-grid">
                {DOC_FORMS.map((f) => (
                  <div className="aof-card" key={f.code}>
                    <div className="code">{f.code}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                    <div className="go" onClick={() => openAuth('login')}>→ फॉर्म भरा</div>
                  </div>
                ))}
              </div>
              <div className="bundle-bar">
                <p><b>एकदाच भरा</b> — AOF + DA-1 + FATCA + Integrity Pledge = <b>4 फॉर्म्स एकत्र प्रिंट</b></p>
                <div className="bundle-pills">
                  {['AOF','DA-1','FATCA','Integrity Pledge','+ Schemes'].map((p) => (
                    <div className="bundle-pill" key={p}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {active === 'svc' && (
            <div>
              <p style={{ fontSize: '.88rem', color: 'var(--soft)', marginBottom: 20 }}>
                Union Bank of India च्या सर्व सेवा विनंती एकाच ठिकाणी — फॉर्म भरा, प्रिंट घ्या, बँकेत जमा करा.
              </p>
              <div className="svc-grid">
                {SERVICE_ITEMS.map((s, i) => (
                  <div className="svc-item" key={i} onClick={() => openAuth('login')}>
                    <div className="svc-icon-box">{s.icon}</div>
                    <div className="svc-content">
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                    <span className="svc-arrow">→</span>
                  </div>
                ))}
              </div>
              <div className="bundle-bar" style={{ marginTop: 20 }}>
                <p><b>१४ सेवा विनंती</b> — एकाच पोर्टलवर भरा, प्रिंट घ्या, बँकेत जमा करा</p>
                <div className="bundle-pills">
                  {['Union Bank','सर्व PSB बँका','Print Ready'].map((p) => (
                    <div className="bundle-pill" key={p}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {active === 'kyc' && (
            <div>
              <p style={{ fontSize: '.88rem', color: 'var(--soft)', marginBottom: 20 }}>
                ग्राहकाची KYC माहिती अद्यतन करणे आता सोपे — योग्य फॉर्म निवडा, भरा आणि बँकेत सादर करा.
              </p>
              <div className="kyc-grid">
                {KYC_FORMS.map((k) => (
                  <div className="kyc-card" key={k.code}>
                    <div className="kcode">{k.code}</div>
                    <h4>{k.title}</h4>
                    <p>{k.desc}</p>
                    <div className="go" onClick={() => openAuth('login')}>→ फॉर्म भरा</div>
                  </div>
                ))}
              </div>
              <div className="bundle-bar" style={{ marginTop: 20, background: 'linear-gradient(90deg,#052e16,#14532d)' }}>
                <p style={{ color: '#86efac' }}><b style={{ color: '#fff' }}>९ KYC फॉर्म्स LIVE</b> — ग्राहकाची माहिती अद्यतन करणे आता झटक्यात</p>
                <div className="bundle-pills">
                  {['Aadhaar','PAN','Re-KYC','DBT Consent'].map((p) => (
                    <div className="bundle-pill" key={p} style={{ color: '#86efac' }}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {active === 'sch' && (
            <div>
              <div className="scheme-grid">
                {SCHEMES.map((s) => (
                  <div className={`sc-card ${s.badgeClass}`} key={s.badge}>
                    <span className="sc-badge">{s.badge}</span>
                    <h3>{s.title}</h3>
                    <div className="sc-fullnm">{s.full}</div>
                    <p className="sc-desc">{s.desc}</p>
                    <div className="sc-rows">
                      {s.details.map((d) => (
                        <div className="sc-row" key={d.label}>
                          <span className="l">{d.label}</span>
                          <span className="v">{d.val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="sc-tags">
                      {s.tags.map((t) => (
                        <span className="sc-tag" key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bundle-bar" style={{ marginTop: 20 }}>
                <p><b>एकदाच भरा</b> — AOF सोबत APY + PMJJBY + PMSBY = <b>ग्राहकाला ४ लाभ एकत्र</b></p>
                <div className="bundle-pills">
                  {['AOF','APY','PMJJBY','PMSBY'].map((p) => (
                    <div className="bundle-pill" key={p}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
