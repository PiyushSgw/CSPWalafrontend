"use client";

import React from "react";
import { PageHeaderSection } from "./PageHeaderSection";
import { SupportContactsSection } from "./SupportContactsSection";
import { SupportFAQSection } from "./SupportFAQSection";
// @ts-ignore: side-effect CSS import for global styles
import "./../../styles.css";

export default function SupportPage() {
  return (
    <div className="page active" id="page-support">
      <PageHeaderSection />

      <div
        className="two-col"
        style={{ gap: 20, alignItems: "start" }}
      >
        <div>
          <div
            className="three-col"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr",
              marginBottom: 20,
            }}
          >
            <ContactCard
              icon="📞"
              title="Phone Support"
              desc="+91 98XXXXXX00"
              time="Mon–Sat 9AM–6PM"
              color="var(--green)"
            />
            <ContactCard
              icon="💬"
              title="WhatsApp"
              desc="+91 98XXXXXX00"
              time="Quick response"
              color="var(--green)"
            />
            <ContactCard
              icon="📧"
              title="Email Support"
              desc="support@cspwala.in"
              time="24h response"
              color="var(--ink3)"
            />
          </div>

          <SupportContactsSection />
        </div>

        <SupportFAQSection />
      </div>
    </div>
  );
}

// Reuse this helper; could be in `components/ContactCard.tsx`
function ContactCard({
  icon,
  title,
  desc,
  time,
  color,
}: {
  icon: string;
  title: string;
  desc: string;
  time: string;
  color: string;
}) {
  return (
    <div className="qa-card" style={{ cursor: "default" }}>
      <span className="qa-icon">{icon}</span>
      <div className="qa-title">{title}</div>
      <div className="qa-desc">{desc}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color,
          fontWeight: 600,
        }}
      >
        {time}
      </div>
    </div>
  );
}