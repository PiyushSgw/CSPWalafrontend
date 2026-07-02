import { COMING_SOON_ITEMS } from '../data';
import type { OpenAuth } from '../data';

export default function ComingSoonSection({ openAuth }: { openAuth: OpenAuth }) {
  return (
    <section className="sec tight" style={{ paddingTop: 56 }} id="coming">
      <div className="cs-wrap">
        <div className="cs-head">
          <div className="cs-badge">⏳ COMING SOON</div>
          <h2>लवकरच येत आहे...</h2>
          <p>या सेवा आम्ही तयार करत आहोत. नोंदणी करा — सुरु झाल्यावर लगेच सूचना मिळेल.</p>
        </div>
        <div className="cs-grid">
          {COMING_SOON_ITEMS.map((item, i) => (
            <div className="cs-item" key={i}>
              <div className="cs-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <span className="cs-tag">COMING SOON</span>
            </div>
          ))}
        </div>
        <div className="cs-notify">
          <p>सर्व नवीन सेवांची सूचना सर्वप्रथम मिळवण्यासाठी आत्ताच मोफत नोंदणी करा.</p>
          <span className="btn btn-gold" onClick={() => openAuth('register')}>🔔 मोफत नोंदणी — सूचना मिळवा</span>
        </div>
      </div>
    </section>
  );
}
