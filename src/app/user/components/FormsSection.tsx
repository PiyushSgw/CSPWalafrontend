import { DOC_FORMS } from '../data';

export default function FormsSection() {
  return (
    <section id="forms">
      <div className="section-head">
        <div className="eyebrow">तयार फॉर्म्स</div>
        <h2>एका सबमिशनमध्ये आठ फॉर्म्स</h2>
        <p>ग्राहकाची माहिती एकदाच भरा — आम्ही ती सर्व आवश्यक फॉर्म्समध्ये भरून, प्रिंट-रेडी PDF स्वरूपात तयार करतो.</p>
      </div>
      <div className="doc-stack">
        {DOC_FORMS.map((f) => (
          <div className="doc-tab" key={f.code}>
            <div className="doc-corner" />
            <span className="doc-code mono">{f.code}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
