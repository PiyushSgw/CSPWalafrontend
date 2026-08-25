import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — BcUnion.in",
  description: "Privacy policy for BcUnion.in CSP operator portal. How we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1 style={{ fontSize: "2rem", color: "#0D1B35", marginBottom: 8, fontFamily: "'Noto Serif Devanagari', serif" }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: "0.85rem", color: "#596275", marginBottom: 32 }}>
        Last updated: August 2026
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          1. Information We Collect
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          When you use BcUnion.in, we may collect the following types of information:
        </p>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24, marginTop: 8 }}>
          <li><strong>Personal Information:</strong> Name, mobile number, email address, location (state, district, block)</li>
          <li><strong>Business Information:</strong> Bank name, CSP code, agent ID, business category</li>
          <li><strong>Transaction Data:</strong> Wallet balance, recharge history, service usage records</li>
          <li><strong>Device Information:</strong> Browser type, device type, operating system (for security purposes)</li>
          <li><strong>Payment Information:</strong> We do NOT store credit/debit card details. Payments are processed by Razorpay Payment Gateway.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          2. How We Use Your Information
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          We use the collected information for the following purposes:
        </p>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24, marginTop: 8 }}>
          <li>To provide and maintain our services</li>
          <li>To process transactions and manage your wallet</li>
          <li>To send service-related communications (OTP, transaction receipts)</li>
          <li>To improve our platform and user experience</li>
          <li>To comply with legal obligations under RBI guidelines</li>
          <li>To detect and prevent fraudulent activities</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          3. Data Sharing &amp; Disclosure
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          We do NOT sell your personal information. We may share your data with:
        </p>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24, marginTop: 8 }}>
          <li><strong>Payment Gateway:</strong> Razorpay Payment Gateway for processing payments</li>
          <li><strong>Banking Partners:</strong> Banks and financial institutions for form processing</li>
          <li><strong>Cloud Services:</strong> Hosting providers (Render, AWS) for data storage</li>
          <li><strong>Legal Authorities:</strong> When required by law or regulatory authorities</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          4. Data Localization
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          In compliance with the Reserve Bank of India (RBI) guidelines and the Payment and Settlement Systems Act, 2007, all your personal data and transaction data are stored exclusively within data centers located in India. We do not transfer or store any data outside Indian borders.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          6. Data Security
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          We implement industry-standard security measures to protect your data including encrypted transmission (HTTPS/TLS), secure password hashing (bcrypt), JWT-based authentication, and regular security audits. However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          7. Data Retention
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          8. Your Rights (DPDPA 2023 Compliance)
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          Under the Digital Personal Data Protection Act, 2023 (DPDPA) and IT Act 2000, you have the right to:
        </p>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24, marginTop: 8 }}>
          <li>Access your personal data held by us</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal data</li>
          <li>Withdraw consent for data processing</li>
          <li>Grievance redressal for data-related concerns</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          9. Cookies &amp; Client-Side Scripts
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          We use essential cookies and local storage to maintain your session and authentication state. We do not use third-party tracking cookies or advertising cookies.
        </p>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          In compliance with PCI DSS v4.0.1 requirements, all client-side scripts running on our payment pages are inventoried, authorized, and monitored to prevent digital skimming and unauthorized modifications.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          10. Contact
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          For any privacy-related questions or to exercise your rights, please contact us at{" "}
          <a href="/legal/contact-us" style={{ color: "#1B54D8", fontWeight: 600 }}>Contact Us</a>.
        </p>
      </section>
    </article>
  );
}
