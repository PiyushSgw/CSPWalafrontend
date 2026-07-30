'use client';

import { useState } from 'react';
import { BANKS } from '../data';

export default function BanksSection() {
  const [selected, setSelected] = useState('Union Bank of India');

  return (
    <section className="sec" id="banks">
      <div className="sec-top">
        <div className="sec-lbl">समर्थित बँका</div>
        <h2>१२ राष्ट्रीयीकृत बँका</h2>
        <p>तुमची बँक निवडा — त्याच बँकेचे AOF व सर्व फॉर्म्स आपोआप तयार होतात.</p>
      </div>
      <div className="banks-grid">
        {BANKS.map((b) => (
          <div
            key={b.code}
            className={`bk${b.name === selected ? ' sel' : ''}`}
            onClick={() => setSelected(b.name)}
          >
            <div className={`bk-logo ${b.cls}`}>{b.code}</div>
            <h4>{b.name}</h4>
            <span className="btp">PSB · Govt</span>
          </div>
        ))}
      </div>
    </section>
  );
}
