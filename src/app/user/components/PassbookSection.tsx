'use client';

import type { OpenAuth } from './types';

const FEATURES = [
  '4×6 प्रीमियम क्वालिटी पासबुक प्रिंट',
  'बँक पासबुकवर थेट डेटा प्रिंट करण्याची सुविधा',
  'स्वच्छ, अचूक आणि बँक-स्टँडर्ड फॉरमॅट',
];

export default function PassbookSection({ openAuth }: { openAuth: OpenAuth }) {
  return (
    <section id="passbook">
      <div className="passbook-wrap">
        <div>
          <h2>4×6 प्रीमियम पासबुक प्रिंटिंग</h2>
          <p>नवीन पासबुक छपाईपासून ते जुन्या पासबुकवर थेट प्रिंट करण्यापर्यंत — सर्व सुविधा एकाच ठिकाणी.</p>
          {FEATURES.map((f) => (
            <div className="pb-feature" key={f}>
              <span className="dot" />
              <span>{f}</span>
            </div>
          ))}
          <span
            className="btn"
            style={{ background: 'var(--gold)', color: 'var(--maroon-dark)', marginTop: 10 }}
            onClick={() => openAuth('login')}
          >
            पासबुक प्रिंट सुरु करा
          </span>
        </div>
        <div className="pb-visual">
          <div className="pb-inner">
            <b>UNION BANK</b>
            <span className="mono">PASSBOOK · 4×6</span>
            <span className="mono">CSP VERIFIED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
