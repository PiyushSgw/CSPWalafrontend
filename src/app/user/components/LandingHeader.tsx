'use client';

import { useState } from 'react';
import type { OpenAuth } from '../data';

const NAV_LINKS = [
  { href: '#banks', label: 'बँका' },
  { href: '#forms', label: 'AOF' },
  { href: '#forms', label: 'सेवा विनंती' },
  { href: '#pricing', label: 'किंमत' },
  { href: '#coming', label: 'Coming Soon' },
];

export default function LandingHeader({ openAuth }: { openAuth: OpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header>
      <div className="nav-wrap">
        <div className="logo">
          <div className="logo-mark">BC</div>
          BcUnion<em>.in</em>
        </div>

        <nav className="nav-links">
          {NAV_LINKS.map((n) => (
            <a key={n.label + n.href} href={n.href} className={n.label === 'AOF' || n.label === 'सेवा विनंती' || n.label === 'किंमत' ? 'hl' : ''}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <span className="btn btn-out" onClick={() => openAuth('login')}>लॉगिन</span>
          <span className="btn btn-blue" onClick={() => openAuth('register')}>मोफत नोंदणी</span>
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

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((n) => (
          <a key={n.label + n.href} href={n.href} onClick={close}>{n.label}</a>
        ))}
        <div className="mobile-actions">
          <span className="btn btn-out" onClick={() => { close(); openAuth('login'); }}>लॉगिन</span>
          <span className="btn btn-blue" onClick={() => { close(); openAuth('register'); }}>मोफत नोंदणी</span>
        </div>
      </div>
    </header>
  );
}
