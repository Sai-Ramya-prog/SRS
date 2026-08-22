import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Layers } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, margin: '0 0 24px 0', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <span className="overline" style={{ fontSize: '0.78rem', letterSpacing: '0.12em' }}>
              SMART RESUME SCREENER
            </span>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
              AI Candidate Ranking
            </span>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/"
            className={isActive('/') ? 'btn-primary btn-small' : 'btn-secondary btn-small'}
          >
            <Layers size={14} /> Dashboard
          </Link>
          <Link
            to="/jd"
            className={isActive('/jd') ? 'btn-primary btn-small' : 'btn-secondary btn-small'}
          >
            <PlusCircle size={14} /> New Screening
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
