import React from 'react';
import { Award, Mail, CheckCircle2, FileText, UserX } from 'lucide-react';

export default function CandidateCard({ candidate, onReject }) {
  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '4px' }}>{candidate.candidate_name}</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={14} /> {candidate.email}
            </span>
          </div>
          <span className="badge badge-score-high" style={{ fontSize: '1rem', padding: '4px 10px' }}>
            {candidate.match_score} / 10
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#CBD5E1', marginBottom: '16px', lineHeight: 1.5 }}>
          {candidate.justification || candidate.strengths}
        </p>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Matched Core Skills</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {candidate.matched_skills && candidate.matched_skills.map((skill, idx) => (
              <span key={idx} className="badge badge-skill">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
          <CheckCircle2 size={12} /> Shortlisted
        </span>

        <button
          onClick={() => onReject(candidate.screening_id)}
          className="btn-secondary btn-small"
          style={{ color: '#FB7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
        >
          <UserX size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
