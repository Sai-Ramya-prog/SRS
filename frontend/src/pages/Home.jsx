import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PlusCircle, FileText, ArrowRight, Sparkles, Layers } from 'lucide-react';

export default function Home() {
  const [jds, setJds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJDs();
  }, []);

  const fetchJDs = async () => {
    try {
      const resp = await api.get('/api/jd/all');
      setJds(resp.data);
    } catch (err) {
      console.error('Failed to load JDs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="glass-panel" style={{ padding: '48px 36px', textAlign: 'left', marginBottom: '36px' }}>
        <span className="overline" style={{ marginBottom: '12px' }}>
          OVERVIEW
        </span>

        <h1 style={{ fontSize: '3.2rem', marginBottom: '16px', lineHeight: 1.1 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '680px', marginBottom: '28px', fontFamily: 'var(--font-mono)' }}>
          Your recruitment pipeline at a glance. Screen 100+ resumes in seconds with Gemini AI precision.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/jd" className="btn-primary" style={{ padding: '12px 24px' }}>
            <PlusCircle size={18} /> + Add Job Position
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <span className="overline" style={{ fontSize: '0.7rem' }}>ACTIVE POSITIONS</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
            {jds.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <span className="overline" style={{ fontSize: '0.7rem' }}>AI ENGINE</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '8px', color: 'var(--secondary)' }}>
            Gemini 3.6 Flash
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <span className="overline" style={{ fontSize: '0.7rem' }}>AUTOMATION</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            100% Real-Time
          </div>
        </div>
      </div>

      {/* Recent JDs Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="overline">DIRECTORY</span>
            <h2 style={{ fontSize: '2.2rem' }}>Job Positions</h2>
          </div>
          <Link to="/jd" className="btn-secondary btn-small">
            <PlusCircle size={14} /> + Add JD
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading saved Job Descriptions...</div>
        ) : jds.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <FileText size={40} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px' }}>No Job Descriptions Created Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>Create your first Job Description to begin bulk resume screening.</p>
            <Link to="/jd" className="btn-primary">
              <PlusCircle size={16} /> Get Started Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {jds.map((jd) => (
              <div key={jd.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{jd.title}</h3>
                    <span className="badge" style={{ background: 'rgba(74,93,54,0.12)', color: 'var(--secondary)' }}>
                      {jd.input_type === 'pdf' ? 'PDF Import' : 'Typed Text'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', height: '60px', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {jd.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button
                    onClick={() => navigate(`/upload/${jd.id}`)}
                    className="btn-primary btn-small"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Upload Resumes <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => navigate(`/screening/${jd.id}`)}
                    className="btn-secondary btn-small"
                    style={{ justifyContent: 'center' }}
                  >
                    Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
