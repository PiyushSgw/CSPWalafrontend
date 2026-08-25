import type { Metadata } from "next";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFBFF",
        fontFamily: "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
        color: "#18202F",
        lineHeight: 1.7,
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(250,251,255,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #DDE3F0",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#0D1B35",
              fontWeight: 800,
              fontSize: "1.15rem",
              fontFamily: "'Noto Serif Devanagari', serif",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                background: "#1B54D8",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.6rem",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              BC
            </span>
            BcUnion<span style={{ color: "#4B8FE8" }}>.in</span>
          </a>
          <a
            href="/"
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#1B54D8",
              textDecoration: "none",
            }}
          >
            Home
          </a>
        </div>
      </header>

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {children}
      </main>

      <footer
        style={{
          background: "#0D1B35",
          color: "#4A6080",
          padding: "24px",
          textAlign: "center",
          fontSize: "0.78rem",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          <a href="/legal/terms-and-conditions" style={{ color: "#7090B0", textDecoration: "none" }}>
            Terms & Conditions
          </a>
          <a href="/legal/privacy-policy" style={{ color: "#7090B0", textDecoration: "none" }}>
            Privacy Policy
          </a>
          <a href="/legal/refund-cancellation-policy" style={{ color: "#7090B0", textDecoration: "none" }}>
            Refund Policy
          </a>
          <a href="/legal/shipping-policy" style={{ color: "#7090B0", textDecoration: "none" }}>
            Shipping Policy
          </a>
          <a href="/legal/about-us" style={{ color: "#7090B0", textDecoration: "none" }}>
            About Us
          </a>
          <a href="/legal/contact-us" style={{ color: "#7090B0", textDecoration: "none" }}>
            Contact Us
          </a>
        </div>
        <div style={{ color: "#364050" }}>
          &copy; 2026 BcUnion.in — Shiv Infotech / Alpha Vision Labs, Mahagaon, Yavatmal
        </div>
      </footer>
    </div>
  );
}
