import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — BcUnion.in",
  description: "Refund and cancellation policy for BcUnion.in CSP operator portal services and wallet recharges.",
};

export default function RefundCancellationPolicyPage() {
  return (
    <article>
      <h1 style={{ fontSize: "2rem", color: "#0D1B35", marginBottom: 8, fontFamily: "'Noto Serif Devanagari', serif" }}>
        Refund &amp; Cancellation Policy
      </h1>
      <p style={{ fontSize: "0.85rem", color: "#596275", marginBottom: 32 }}>
        Last updated: August 2026
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          1. Wallet Recharge
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          All wallet recharges are final. Once a payment is successfully processed through our payment gateway (Cashfree), the amount is credited to your wallet balance and is <strong>non-refundable</strong>.
        </p>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          If a recharge fails due to a technical error and the amount is debited from your account but not credited to the wallet, please contact our support team within 48 hours with your transaction details.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          2. Service Subscriptions
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          Service subscription fees (monthly/annual plans) are non-refundable once the subscription period has begun. If you wish to cancel your subscription, you may do so at any time, but the cancellation will take effect at the end of the current billing period.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          3. Failed Transactions
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F", marginBottom: 8 }}>
          In case of a failed transaction where money has been debited from your bank account:
        </p>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24, marginTop: 8 }}>
          <li>Amount is typically auto-reversed within 5-7 business days by your bank/payment gateway</li>
          <li>If not reversed, contact our support with transaction reference number</li>
          <li>We will assist in raising a dispute with Cashfree Payment Gateway</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          4. Cancellation by User
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          You may cancel your account at any time by contacting our support team. Upon cancellation:
        </p>
        <ul style={{ fontSize: "0.92rem", color: "#18202F", paddingLeft: 24, marginTop: 8 }}>
          <li>Your remaining wallet balance is not refundable</li>
          <li>Your data will be deleted within 30 days as per our Privacy Policy</li>
          <li>Any active subscriptions will continue until the end of the billing period</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          5. Cancellation by BcUnion.in
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          We reserve the right to suspend or terminate your account if you are found violating our Terms &amp; Conditions. In such cases, any remaining wallet balance will be forfeited.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", color: "#0D1B35", marginBottom: 12, fontFamily: "'Noto Serif Devanagari', serif" }}>
          6. Contact for Refund Issues
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#18202F" }}>
          For any refund or cancellation queries, please reach out to our support team at{" "}
          <a href="/legal/contact-us" style={{ color: "#1B54D8", fontWeight: 600 }}>Contact Us</a>. We aim to resolve all queries within 7 business days.
        </p>
      </section>
    </article>
  );
}
