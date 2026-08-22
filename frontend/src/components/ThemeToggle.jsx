import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('srs-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('srs-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn-secondary btn-small"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.82rem',
        fontWeight: 600,
        transition: 'all 0.3s ease'
      }}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={16} color="#FBBF24" /> Light Mode
        </>
      ) : (
        <>
          <Moon size={16} color="#6366F1" /> Dark Mode
        </>
      )}
    </button>
  );
}
