'use client';

import type { OpenAuth } from './types';

export default function Hero({ openAuth }: { openAuth: OpenAuth }) {
  return (
    <section className="hero">
      <div>
        <div className="eyebrow">Union Bank BC एजंट्ससाठी</div>
        <h1>
          हाताने फॉर्म भरणं <span>बंद करा</span>.<br />आता फक्त टाईप करा, प्रिंट घ्या.
        </h1>
        <p className="lead">
          Account Opening Form, Nomination (DA-1), FATCA Annexure आणि Integrity Pledge — सर्व फॉर्म्स अचूक भरून,
          बँकेच्या फॉरमॅटमध्ये रेडिमेड प्रिंट मिळवा. फक्त फोटो लावा, सही/शिक्का मारा आणि बँकेत जमा करा.
        </p>
        <div className="hero-ctas">
          <span className="btn btn-primary" onClick={() => openAuth('login')}>लॉगिन करून सुरु करा</span>
          <a className="btn btn-outline" href="#forms">फॉर्म्स बघा</a>
        </div>
        <div className="trust-row">
          <div><b>8+</b> रेडिमेड फॉर्म्स</div>
          <div><b>APY·PMJJBY·PMSBY</b> बंडल</div>
          <div><b>4×6</b> प्रीमियम पासबुक प्रिंट</div>
          <div><b>0</b> खाडाखोड</div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="floating-tab mono">AOF · DA-1 · FATCA</div>
        <div className="form-card">
          <div className="fc-head">
            <b>Account Opening Form</b>
            <span>UNION BANK</span>
          </div>
          <div className="fc-line w90" />
          <div className="fc-line w70" />
          <div className="fc-line w85" />
          <div className="fc-line w50" />
          <div className="fc-line w70" />
          <div className="stamp">VERIFIED<br />BY CSP</div>
        </div>
      </div>
    </section>
  );
}
