import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — BcUnion.in",
  description: "Shipping and delivery policy for BcUnion.in digital services and CSP operator portal.",
};

export default function ShippingPolicyPage() {
  return (
    <article>
      <h1 style={{ fontSize: "2rem", color: "#0D1B35", marginBottom: 8, fontFamily: "'Noto Serif Devanagari', serif" }}>
        Shipping &amp; Delivery Policy
      </h1>
      <p style={{ fontSize: "0.85rem", color: "#596275", marginBottom: 32 }}>
        Last updated: August 2026
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          1. Digital Services Only
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          BcUnion.in is a purely digital platform. We do not sell, ship, or deliver any physical goods. All services provided through our platform — including Account Opening Forms (AOF), Nomination/DA-1 forms, FATCA Annexure, social security scheme enrollments, and passbook printing — are delivered electronically.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          2. Service Delivery
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          Upon successful payment and wallet recharge, services are made available instantly through your account dashboard. Generated forms and documents can be downloaded or printed directly from the platform. No physical shipping is involved.
        </p>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24, marginTop: 8 }}>
          <li><strong>Wallet Recharge:</strong> Funds are credited to your wallet instantly upon successful payment</li>
          <li><strong>Form Generation:</strong> Forms are generated and available for download immediately</li>
          <li><strong>Scheme Enrollment:</strong> Enrollment confirmations are provided digitally through the platform</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          3. Delivery Timelines
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          All digital services are delivered in real-time. In rare cases of technical delays:
        </p>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24, marginTop: 8 }}>
          <li>Wallet credits may take up to 5 minutes during high-traffic periods</li>
          <li>Form generation is typically instantaneous</li>
          <li>If a service is delayed beyond 30 minutes, please contact our support team</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          4. Contact
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          For any queries regarding service delivery, please contact us at{" "}
          <a href="/legal/contact-us" style={{ color: "#1B54D8", fontWeight: 600 }}>Contact Us</a>.
        </p>
      </section>
    </article>
  );
}
