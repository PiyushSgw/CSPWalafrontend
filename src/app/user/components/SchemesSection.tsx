'use client';

import { SCHEMES } from '../data';
import type { OpenAuth } from './types';

export default function SchemesSection({ openAuth }: { openAuth: OpenAuth }) {
  return (
    <div className="ss-section" id="schemes">
      <div className="ss-box">
        <div className="ss-header">
          <div>
            <div className="ss-badge">सरकारी सामाजिक सुरक्षा योजना</div>
            <h2>खाते उघडताना ३ सरकारी विमा योजना एकत्र भरा</h2>
            <p>
              Account Opening Form सोबत APY, PMJJBY आणि PMSBY चे फॉर्म्स आपोआप तयार होतात — ग्राहकाची माहिती फक्त एकदाच भरा.
            </p>
          </div>
          <button className="ss-enroll-btn" onClick={() => openAuth('login')}>⚡ आत्ता सुरु करा</button>
        </div>

        <div className="ss-grid">
          {SCHEMES.map((s) => (
            <div className="ss-scheme" key={s.badge}>
              <span className={`ss-scheme-badge ${s.badgeClass}`}>{s.badge}</span>
              <h3>{s.title}</h3>
              <div className="ss-full">{s.full}</div>
              <p>{s.desc}</p>
              <div className="ss-detail">
                {s.details.map((d) => (
                  <div className="ss-detail-row" key={d.label}>
                    <span className="label">{d.label}</span>
                    <span className="val">{d.val}</span>
                  </div>
                ))}
              </div>
              <div className="ss-forms-tag">
                {s.tags.map((t) => (
                  <span className="ss-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ss-footer-bar">
          <p>⚡ ग्राहकाची माहिती <strong>एकदाच भरा</strong> — AOF + APY + PMJJBY + PMSBY सर्व फॉर्म्स एकत्र तयार होतात</p>
          <div className="ss-bundle-tag">
            <span>बंडल प्रिंट</span> · AOF + 3 योजना = <span>4 फॉर्म्स एकत्र</span>
          </div>
        </div>
      </div>
    </div>
  );
}
