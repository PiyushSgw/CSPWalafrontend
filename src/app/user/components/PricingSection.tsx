'use client';

import { PAY_PER_FORM_ITEMS } from '../data';
import type { OpenAuth } from '../data';

export default function PricingSection({ openAuth }: { openAuth: OpenAuth }) {
  return (
    <section className="sec tight" style={{ paddingTop: 56 }} id="pricing">
      <div className="sec-top">
        <div className="sec-lbl">किंमत</div>
        <h2>साधं, पारदर्शक मूल्य</h2>
        <p>कोणतीही लपलेली फी नाही — तुमच्या गरजेनुसार प्लॅन निवडा.</p>
      </div>
      <div className="pricing-grid">
        {/* PAY PER FORM */}
        <div className="price-card">
          <div className="pc-top">
            <div className="pc-badge" style={{ background: '#EEF3FF', color: 'var(--blue)', borderColor: 'rgba(27,84,216,.2)' }}>PAY PER FORM</div>
            <h3 className="pc-name">वापरा तेव्हढेच द्या</h3>
            <p className="pc-sub">Pay only for what you use — कोणती सदस्यता नाही</p>
            <div className="pc-price">
              <span className="pc-currency">₹</span>
              <span className="pc-amount">0.10</span>
              <span className="pc-unit">/ फॉर्म</span>
            </div>
            <p className="pc-note">प्रति फॉर्म — Wallet मध्ये balance भरा, वापरा</p>
          </div>
          <div className="pc-divider" />
          <div className="pc-form-list">
            {PAY_PER_FORM_ITEMS.map((item) => (
              <div className="pc-form-row" key={item.name}>
                <div className="pc-form-icon">{item.icon}</div>
                <div className="pc-form-info">
                  <span>{item.name}</span>
                  <small>{item.sub}</small>
                </div>
                <div className="pc-form-price">{item.price}</div>
              </div>
            ))}
          </div>
          <div className="pc-divider" />
          <div className="pc-perks">
            {[
              'No subscription — फक्त वापरा तेव्हढे',
              'Wallet balance — कधीच expire नाही',
              'Branding Poster उपलब्ध',
              'जाहिरातीसाठी Print-Ready Poster',
            ].map((p) => (
              <div className="pc-perk" key={p}>
                <span className="pk-dot green" />
                {p}
              </div>
            ))}
          </div>
          <span className="btn btn-out" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={() => openAuth('register')}>
            Wallet तयार करा — मोफत
          </span>
        </div>

        {/* UNLIMITED PLAN */}
        <div className="price-card featured-card">
          <div className="ltd-badge">⚡ मर्यादित काळ ऑफर</div>
          <div className="pc-top">
            <div className="pc-badge" style={{ background: 'rgba(232,160,32,.15)', color: 'var(--gold)', borderColor: 'rgba(232,160,32,.35)' }}>UNLIMITED PLAN</div>
            <h3 className="pc-name" style={{ color: '#fff' }}>सर्व काही अमर्यादित</h3>
            <p className="pc-sub" style={{ color: '#96B2D0' }}>दरमहा एकच रक्कम — सर्व फॉर्म्स, सर्व सेवा</p>
            <div className="pc-price">
              <span className="pc-currency" style={{ color: 'var(--gold)' }}>₹</span>
              <span className="pc-amount" style={{ color: '#fff' }}>49</span>
              <span className="pc-unit" style={{ color: '#96B2D0' }}>/ महिना</span>
            </div>
            <p className="pc-note" style={{ color: '#7090B0' }}>मर्यादित काळासाठी — नंतर किंमत वाढेल</p>
          </div>
          <div className="pc-divider" style={{ borderColor: 'rgba(255,255,255,.1)' }} />
          <div className="pc-perks">
            {[
              'सर्व फॉर्म्स — अमर्यादित प्रिंट',
              'AOF, RTGS/NEFT, Deposit Slip सर्व',
              'KYC / Data Update फॉर्म्स',
              'Service Request फॉर्म्स (१४ सेवा)',
              'APY · PMJJBY · PMSBY बंडल',
              'Branding Poster — Print-Ready',
              'जाहिरात Poster — WhatsApp Ready',
            ].map((p) => (
              <div className="pc-perk" key={p} style={{ color: '#C0D4EA' }}>
                <span className="pk-dot gold" />
                {p}
              </div>
            ))}
            <div className="pc-perk" style={{ color: '#fff', fontWeight: 600 }}>
              <span className="pk-dot gold" />
              <span>🟢 Special WhatsApp Group<br />
                <small style={{ fontWeight: 400, color: '#96B2D0' }}>Support + Business Expertise + नवीन योजना अपडेट्स</small>
              </span>
            </div>
          </div>
          <div className="pc-divider" style={{ borderColor: 'rgba(255,255,255,.1)' }} />
          <div className="wa-box">
            <div className="wa-icon">💬</div>
            <div>
              <div style={{ color: '#fff', fontSize: '.88rem', fontWeight: 600, marginBottom: 3 }}>WhatsApp Support Group</div>
              <div style={{ color: '#7090B0', fontSize: '.78rem' }}>BC एजंट्सचा exclusive group — बँकिंग टिप्स, योजना अपडेट्स, business growth</div>
            </div>
          </div>
          <span className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={() => openAuth('register')}>
            ₹49 मध्ये सुरु करा →
          </span>
        </div>
      </div>
      <div className="compare-note">
        <div className="cn-item">
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <p>दिवसाला <b>10 फॉर्म्स</b> भरत असाल तर Pay Per Form मध्ये फक्त <b>₹1/दिवस</b> — महिन्याला ₹30. Unlimited Plan ₹49/महिना जास्त किफायतशीर!</p>
        </div>
      </div>
    </section>
  );
}
