import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — BcUnion.in",
  description: "Contact BcUnion.in for support, queries, and assistance with CSP operator portal services.",
};

export default function ContactUsPage() {
  return (
    <article>
      <h1 style={{ fontSize: "2rem", color: "#0D1B35", marginBottom: 8, fontFamily: "'Noto Serif Devanagari', serif" }}>
        Contact Us
      </h1>
      <p style={{ fontSize: "0.85rem", color: "#596275", marginBottom: 32 }}>
        We are here to help. Reach out to us through any of the following channels.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 40 }}>
        <ContactCard
          icon="📧"
          title="Email"
          detail="support@bcunion.in"
          subtitle="For general queries and support"
        />
        <ContactCard
          icon="📞"
          title="Phone"
          detail="+91 89990 23250"
          subtitle="Mon–Sat, 9:00 AM – 6:00 PM"
        />
        <ContactCard
          icon="💬"
          title="WhatsApp"
          detail="+91 89990 23250"
          subtitle="Quick response during business hours"
        />
      </div>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          Registered Office
        </h2>
        <div style={{
          background: "#EEF3FF",
          border: "1px solid rgba(27,84,216,0.15)",
          borderRadius: 12,
          padding: 20,
        }}>
          <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 4 }}>
            <strong>Shiv Infotech / Alpha Vision Labs</strong>
          </p>
          <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 4 }}>
            Mahagaon, Yavatmal
          </p>
          <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
            Maharashtra, India
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          Business Hours
        </h2>
        <div style={{
          background: "#FAFBFF",
          border: "1.5px solid #DDE3F0",
          borderRadius: 12,
          padding: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #DDE3F0" }}>
            <span style={{ fontSize: "0.92rem", color: "#18202F", fontWeight: 600 }}>Monday – Friday</span>
            <span style={{ fontSize: "0.92rem", color: "#18202F" }}>9:00 AM – 6:00 PM IST</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #DDE3F0" }}>
            <span style={{ fontSize: "0.92rem", color: "#18202F", fontWeight: 600 }}>Saturday</span>
            <span style={{ fontSize: "0.92rem", color: "#18202F" }}>9:00 AM – 2:00 PM IST</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
            <span style={{ fontSize: "0.92rem", color: "#18202F", fontWeight: 600 }}>Sunday</span>
            <span style={{ fontSize: "0.92rem", color: "#596275" }}>Closed</span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          Grievance Officer
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          As per the Information Technology Act, 2000 and DPDPA, 2023, if you have any grievance regarding your data or our services, you may contact our Grievance Officer:
        </p>
        <div style={{
          background: "#FAFBFF",
          border: "1.5px solid #DDE3F0",
          borderRadius: 12,
          padding: 20,
        }}>
          <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 4 }}>
            <strong>Email:</strong> grievance@bcunion.in
          </p>
          <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
            <strong>Response Time:</strong> Within 24 hours of receiving the complaint
          </p>
        </div>
      </section>
    </article>
  );
}

function ContactCard({
  icon,
  title,
  detail,
  subtitle,
}: {
  icon: string;
  title: string;
  detail: string;
  subtitle: string;
}) {
  return (
    <div style={{
      background: "#FAFBFF",
      border: "1.5px solid #DDE3F0",
      borderRadius: 14,
      padding: 24,
      textAlign: "center",
      transition: "all 0.2s",
    }}>
      <div style={{ fontSize: "2rem", marginBottom: 8 }}>{icon}</div>
      <h3 style={{ fontSize: "1rem", color: "#0D1B35", marginBottom: 6, fontWeight: 700 }}>{title}</h3>
      <p style={{ fontSize: "0.95rem", color: "#1B54D8", fontWeight: 600, marginBottom: 4 }}>{detail}</p>
      <p style={{ fontSize: "0.8rem", color: "#596275" }}>{subtitle}</p>
    </div>
  );
}
