import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';

export default function StatusTracker({ total = 0, done = 0, failed = 0, candidates = [] }) {
  const inProgress = total - (done + failed);
  const percentage = total > 0 ? Math.round(((done + failed) / total) * 100) : 0;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span className="overline">STATUS</span>
          <h3 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Live Processing Pipeline
            {inProgress > 0 && <Loader2 size={18} className="pulse-glow" style={{ animation: 'spin 1.5s linear infinite', color: 'var(--primary)' }} />}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
            Gemini AI is parsing and scoring uploaded candidate resumes in real time
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
            {percentage}%
          </span>
          <span style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {done + failed} of {total} completed
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '8px',
        width: '100%',
        background: '#E5DFD1',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '20px',
        display: 'flex'
      }}>
        <div style={{
          width: `${(done / (total || 1)) * 100}%`,
          background: '#4A5D36',
          transition: 'width 0.4s ease'
        }} />
        <div style={{
          width: `${(failed / (total || 1)) * 100}%`,
          background: '#8B3A2B',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Grid Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <span className="overline" style={{ fontSize: '0.68rem' }}>COMPLETED</span>
          <div style={{ fontSize: '2rem', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-heading)', marginTop: '2px', color: '#4A5D36' }}>{done}</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span className="overline" style={{ fontSize: '0.68rem' }}>PROCESSING</span>
          <div style={{ fontSize: '2rem', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-heading)', marginTop: '2px', color: '#2563EB' }}>{inProgress}</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span className="overline" style={{ fontSize: '0.68rem' }}>FAILED</span>
          <div style={{ fontSize: '2rem', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-heading)', marginTop: '2px', color: '#8B3A2B' }}>{failed}</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <span className="overline" style={{ fontSize: '0.68rem' }}>TOTAL BATCH</span>
          <div style={{ fontSize: '2rem', fontWeight: 600, fontStyle: 'italic', fontFamily: 'var(--font-heading)', marginTop: '2px', color: 'var(--text-main)' }}>{total}</div>
        </div>
      </div>
    </div>
  );
}
