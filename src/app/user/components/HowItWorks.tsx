import { STEPS } from '../data';

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="section-head">
        <div className="eyebrow">प्रक्रिया</div>
        <h2>तीन सोप्या स्टेप्समध्ये</h2>
      </div>
      <div className="steps">
        {STEPS.map((s) => (
          <div className="step" key={s.num}>
            <span className="num mono">{s.num}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
