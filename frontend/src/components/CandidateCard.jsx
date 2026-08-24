import React from 'react';
import { Mail, CheckCircle2, UserX } from 'lucide-react';

export default function CandidateCard({ candidate, onReject }) {
  const getScoreBadgeClass = (score) => {
    if (score >= 8) return 'badge-score-high';
    if (score >= 5) return 'badge-score-medium';
    return 'badge-score-low';
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontStyle: 'normal', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '4px' }}>
              {candidate.candidate_name}
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={14} /> {candidate.email}
            </span>
          </div>
          <span className={`badge ${getScoreBadgeClass(candidate.match_score)}`} style={{ fontSize: '0.95rem', padding: '4px 10px' }}>
            {candidate.match_score} / 10
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '16px', lineHeight: 1.5 }}>
          {candidate.justification || candidate.strengths}
        </p>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>
            MATCHED SKILLS
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {candidate.matched_skills && candidate.matched_skills.map((skill, idx) => (
              <span key={idx} className="badge badge-skill">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <CheckCircle2 size={12} /> Shortlisted
        </span>

        <button
          onClick={() => onReject(candidate.screening_id)}
          className="btn-secondary btn-small"
          style={{ color: '#E11D48', borderColor: 'rgba(244, 63, 94, 0.3)' }}
        >
          <UserX size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
