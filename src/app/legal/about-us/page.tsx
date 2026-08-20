import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — BcUnion.in",
  description: "About BcUnion.in — A digital platform for Banking Correspondent agents and CSP operators.",
};

export default function AboutUsPage() {
  return (
    <article>
      <h1 style={{ fontSize: "2rem", color: "#0D1B35", marginBottom: 8, fontFamily: "'Noto Serif Devanagari', serif" }}>
        About Us
      </h1>
      <p style={{ fontSize: "0.85rem", color: "#596275", marginBottom: 32 }}>
        Empowering Banking Correspondents &amp; CSP Operators across India
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          Who We Are
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          BcUnion.in is a digital platform built exclusively for Banking Correspondent (BC) agents and Customer Service Point (CSP) operators working with nationalized and commercial banks across India. Our platform simplifies the daily operations of CSP operators by providing digital tools for form generation, passbook printing, customer management, and more.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          Our Mission
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          To digitize and streamline the operations of CSP agents across India, enabling them to serve rural and semi-urban banking communities with greater efficiency, accuracy, and professionalism. We aim to bridge the technology gap for grassroots-level banking service providers.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          What We Offer
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { title: "Account Opening Forms", desc: "Digital AOF generation for multiple banks with auto-filled data and PDF export." },
            { title: "Social Security Schemes", desc: "Easy enrollment for APY, PMJJBY, and PMSBY schemes with instant form generation." },
            { title: "Passbook Printing", desc: "Print-ready passbook pages with accurate transaction records." },
            { title: "Customer Management", desc: "Track and manage your customer database with search and filter tools." },
            { title: "Wallet Services", desc: "Secure online wallet for seamless service payments via UPI and net banking." },
            { title: "Multi-Bank Support", desc: "Compatible with SBI, Union Bank, BOB, PNB, Canara, and many more banks." },
          ].map((item, i) => (
            <div key={i} style={{
              background: "#FAFBFF",
              border: "1.5px solid #DDE3F0",
              borderRadius: 12,
              padding: 20,
            }}>
              <h3 style={{ fontSize: "0.95rem", color: "#0D1B35", marginBottom: 6, fontWeight: 700 }}>{item.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#596275", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          Our Values
        </h2>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}><strong>Trust &amp; Security:</strong> We follow RBI guidelines and implement industry-standard security measures to protect user data.</li>
          <li style={{ marginBottom: 8 }}><strong>Simplicity:</strong> Our tools are designed to be easy to use, even for users with limited technical knowledge.</li>
          <li style={{ marginBottom: 8 }}><strong>Reliability:</strong> We ensure high uptime and consistent service availability for our operators.</li>
          <li style={{ marginBottom: 8 }}><strong>Support:</strong> Our dedicated team is available via phone, WhatsApp, and email to assist operators.</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          Legal Information
        </h2>
        <div style={{
          background: "#EEF3FF",
          border: "1px solid rgba(27,84,216,0.15)",
          borderRadius: 12,
          padding: 20,
        }}>
          <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 4 }}>
            <strong>Operated by:</strong> Shiv Infotech / Alpha Vision Labs
          </p>
          <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 4 }}>
            <strong>Location:</strong> Mahagaon, Yavatmal, Maharashtra, India
          </p>
          <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
            <strong>Compliance:</strong> IT Act 2000 &middot; DPDPA 2023 &middot; RBI BC Guidelines
          </p>
        </div>
      </section>
    </article>
  );
}
