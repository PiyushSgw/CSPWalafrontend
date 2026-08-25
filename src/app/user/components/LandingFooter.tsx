import type { OpenAuth } from '../data';

export default function LandingFooter({ openAuth }: { openAuth: OpenAuth }) {
  return (
    <footer>
      <div className="ft-inner">
        <div className="ft-brand">
          <div className="ft-logo">
            <div className="ft-logo-mark">BC</div>
            BcUnion<span style={{ color: '#4B8FE8' }}>.in</span>
          </div>
          <p>सर्व राष्ट्रीयीकृत बँकांच्या BC एजंट्स व CSP ऑपरेटर्ससाठी AOF फॉर्म व सामाजिक सुरक्षा योजना पोर्टल.</p>
        </div>
        <div className="ft-col">
          <h4>मुख्य सेवा</h4>
          <a href="#forms">Account Opening Form</a>
          <a href="#forms">Nomination · DA-1</a>
          <a href="#forms">FATCA Annexure</a>
          <a href="#forms">APY · PMJJBY · PMSBY</a>
        </div>
        <div className="ft-col">
          <h4>लवकरच</h4>
          <a href="#coming">Passbook Print <span className="soon">SOON</span></a>
          <a href="#coming">RTGS / NEFT <span className="soon">SOON</span></a>
          <a href="#coming">Cash Deposit Slip <span className="soon">SOON</span></a>
          <a href="#coming">Cheque Print <span className="soon">SOON</span></a>
        </div>
        <div className="ft-col">
          <h4>बँका</h4>
          <a href="#banks">Union Bank · SBI · BOB</a>
          <a href="#banks">BOM · PNB · Canara</a>
          <a href="#banks">BOI · PSB · IOB</a>
          <a href="#banks">CBI · Indian · UCO</a>
        </div>
        <div className="ft-col">
          <h4>खाते</h4>
          <a href="javascript:void(0)" onClick={() => openAuth('login')}>लॉगिन</a>
          <a href="javascript:void(0)" onClick={() => openAuth('register')}>मोफत नोंदणी</a>
          <a href="/legal/about-us">About Us</a>
          <a href="/legal/contact-us">Contact Us</a>
        </div>
        <div className="ft-col">
          <h4>Legal</h4>
          <a href="/legal/terms-and-conditions">Terms & Conditions</a>
          <a href="/legal/privacy-policy">Privacy Policy</a>
          <a href="/legal/refund-cancellation-policy">Refund Policy</a>
          <a href="/legal/shipping-policy">Shipping Policy</a>
        </div>
      </div>
      <div className="ft-bottom">
        <span>© 2026 BcUnion.in — Shiv Infotech / Alpha Vision Labs, Mahagaon, Yavatmal</span>
        <span>IT Act 2000 · DPDPA 2023 · RBI BC Guidelines</span>
      </div>
    </footer>
  );
}
