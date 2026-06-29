'use client';

import { useState } from 'react';
import type { OpenAuth } from './types';

const NAV_LINKS = [
  { href: '#forms', label: 'फॉर्म्स' },
  { href: '#schemes', label: 'सरकारी योजना' },
  { href: '#passbook', label: 'पासबुक प्रिंट' },
  { href: '#how', label: 'कसं चालतं' },
  { href: '#contact', label: 'संपर्क' },
];

export default function LandingHeader({ openAuth }: { openAuth: OpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header>
      <div className="nav-wrap">
        <div className="logo">
          <span className="seal">BC</span>BcUnion<span style={{ color: 'var(--gold)' }}>.in</span>
        </div>

        <nav className="nav-links">
          {NAV_LINKS.map((n) => (
            <a key={n.href} href={n.href}>{n.label}</a>
          ))}
        </nav>

        <div className="nav-actions">
          <span className="btn btn-outline" onClick={() => openAuth('login')}>लॉगिन</span>
          <span className="btn btn-primary" onClick={() => openAuth('register')}>मोफत सुरु करा</span>
        </div>

        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' open' : ''}`}
          aria-label="मेनू"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown — collapsed via max-height on desktop it's hidden entirely */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((n) => (
          <a key={n.href} href={n.href} onClick={close}>{n.label}</a>
        ))}
        <div className="mobile-actions">
          <span className="btn btn-outline" onClick={() => { close(); openAuth('login'); }}>लॉगिन</span>
          <span className="btn btn-primary" onClick={() => { close(); openAuth('register'); }}>मोफत सुरु करा</span>
        </div>
      </div>
    </header>
  );
}
