import { STEPS } from '../data';

export default function HowItWorks() {
  return (
    <section className="sec tight" style={{ paddingTop: 56 }}>
      <div className="sec-top">
        <div className="sec-lbl">प्रक्रिया</div>
        <h2>फक्त ४ स्टेप्समध्ये</h2>
      </div>
      <div className="steps">
        {STEPS.map((s, i) => (
          <div className="step" key={s.num}>
            <div className="step-n">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            {i < STEPS.length - 1 && <div className="step-arr">→</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
