import { WHY_ITEMS } from '../data';

export default function WhySection() {
  return (
    <section className="sec tight" style={{ paddingTop: 56 }}>
      <div className="sec-top">
        <div className="sec-lbl">का निवडावे</div>
        <h2>BcUnion.in का वापरावे?</h2>
      </div>
      <div className="why-grid">
        {WHY_ITEMS.map((w, i) => (
          <div className="why-card" key={i}>
            <div className="why-icon">{w.icon}</div>
            <h3>{w.title}</h3>
            <p>{w.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
