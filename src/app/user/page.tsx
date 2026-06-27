'use client';

import { useEffect, useState } from 'react';
import './user.css';
import LandingHeader from './components/LandingHeader';
import Hero from './components/Hero';
import FormsSection from './components/FormsSection';
import PassbookSection from './components/PassbookSection';
import HowItWorks from './components/HowItWorks';
import SchemesSection from './components/SchemesSection';
import LandingFooter from './components/LandingFooter';
import AuthPanel from './components/AuthPanel';
import type { OpenAuth } from './components/types';

export default function UserLandingPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Load the landing-page fonts once (Devanagari serif/sans + JetBrains Mono).
  useEffect(() => {
    if (document.getElementById('bc-landing-fonts')) return;
    const link = document.createElement('link');
    link.id = 'bc-landing-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  // Enable normal document scrolling for the landing (the global app shell
  // sets html/body to overflow:hidden). Reverts on unmount so the dashboard
  // keeps its fixed-shell layout.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('bc-scroll');
    return () => html.classList.remove('bc-scroll', 'bc-locked');
  }, []);

  // Freeze background scroll while the auth panel is open.
  useEffect(() => {
    document.documentElement.classList.toggle('bc-locked', panelOpen);
  }, [panelOpen]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openAuth: OpenAuth = (tab) => {
    setAuthTab(tab);
    setPanelOpen(true);
  };

  return (
    <div className="bc-landing">
      <LandingHeader openAuth={openAuth} />
      <main>
        <Hero openAuth={openAuth} />
        <FormsSection />
        <PassbookSection openAuth={openAuth} />
        <HowItWorks />
        <SchemesSection openAuth={openAuth} />
      </main>
      <LandingFooter openAuth={openAuth} />

      <AuthPanel
        open={panelOpen}
        tab={authTab}
        onClose={() => setPanelOpen(false)}
        onTab={setAuthTab}
      />
    </div>
  );
}
