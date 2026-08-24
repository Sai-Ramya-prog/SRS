import React from 'react';
import { X, Award, CheckCircle, AlertTriangle, Briefcase, GraduationCap, Mail, FileText, UserCheck, UserX } from 'lucide-react';

export default function CandidateDrawer({ candidate, onClose, onStatusUpdate }) {
  if (!candidate) return null;

  const getScoreBadgeClass = (score) => {
    if (score >= 8) return 'badge-score-high';
    if (score >= 5) return 'badge-score-medium';
    return 'badge-score-low';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="drawer-content"
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-card)',
          padding: '32px',
          overflowY: 'auto',
          boxShadow: '-10px 0 35px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          color: 'var(--text-main)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontStyle: 'normal', fontFamily: 'var(--font-body)', color: 'var(--text-main)' }}>
                {candidate.candidate_name}
              </h2>
              <span className={`badge ${getScoreBadgeClass(candidate.match_score)}`} style={{ fontSize: '0.95rem', padding: '4px 10px' }}>
                {candidate.match_score} / 10
              </span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={14} color="var(--text-muted)" /> {candidate.email || 'No email provided'}
              </span>
              {candidate.file_name && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={14} color="var(--text-muted)" /> {candidate.file_name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-main)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
          <button
            onClick={() => onStatusUpdate(candidate.screening_id, 'shortlisted')}
            style={{
              flex: 1,
              background: candidate.status === 'shortlisted' ? '#10B981' : 'rgba(16, 185, 129, 0.1)',
              color: candidate.status === 'shortlisted' ? '#ffffff' : '#059669',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '10px',
              borderRadius: '6px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={16} /> Shortlist Candidate
          </button>
          <button
            onClick={() => onStatusUpdate(candidate.screening_id, 'rejected')}
            style={{
              flex: 1,
              background: candidate.status === 'rejected' ? '#F43F5E' : 'rgba(244, 63, 94, 0.1)',
              color: candidate.status === 'rejected' ? '#ffffff' : '#E11D48',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '10px',
              borderRadius: '6px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <UserX size={16} /> Reject Candidate
          </button>
        </div>

        {/* AI Justification Summary */}
        <div style={{ background: 'var(--bg-main)', padding: '18px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 700, fontStyle: 'normal', fontFamily: 'var(--font-body)' }}>
            <Award size={18} color="var(--secondary)" /> Gemini AI Match Justification
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            {candidate.justification || 'Candidate matches key job parameters with solid foundational skillsets.'}
          </p>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <h5 style={{ color: '#059669', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, fontStyle: 'normal', fontFamily: 'var(--font-body)' }}>
              <CheckCircle size={16} /> Key Strengths
            </h5>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {candidate.strengths || 'Strong practical skill alignment.'}
            </p>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
            <h5 style={{ color: '#E11D48', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, fontStyle: 'normal', fontFamily: 'var(--font-body)' }}>
              <AlertTriangle size={16} /> Potential Gaps / Weaknesses
            </h5>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              {candidate.weaknesses || 'No major gaps detected.'}
            </p>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, fontStyle: 'normal', fontFamily: 'var(--font-body)', marginBottom: '12px', color: 'var(--text-main)' }}>
            Skills Match Breakdown
          </h4>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>
              MATCHED SKILLS
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {candidate.matched_skills && candidate.matched_skills.length > 0 ? (
                candidate.matched_skills.map((skill, i) => (
                  <span key={i} className="badge badge-skill">{skill}</span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>None identified</span>
              )}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>
              MISSING / REQUIRED SKILLS
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {candidate.missing_skills && candidate.missing_skills.length > 0 ? (
                candidate.missing_skills.map((skill, i) => (
                  <span key={i} className="badge badge-missing-skill">{skill}</span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>All key skills matched!</span>
              )}
            </div>
          </div>
        </div>

        {/* Experience & Education */}
        <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, fontStyle: 'normal', fontFamily: 'var(--font-body)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <Briefcase size={16} color="var(--primary)" /> Parsed Work Experience
          </h4>
          {Array.isArray(candidate.experience) && candidate.experience.length > 0 ? (
            candidate.experience.map((exp, idx) => (
              <div key={idx} style={{ background: 'var(--bg-main)', padding: '12px 14px', borderRadius: '6px', marginBottom: '8px', border: '1px solid var(--border-card)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>{exp.role}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.company} {exp.years ? `• ${exp.years} yrs` : ''}</div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No structured experience parsed.</p>
          )}

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, fontStyle: 'normal', fontFamily: 'var(--font-body)', margin: '20px 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <GraduationCap size={16} color="var(--secondary)" /> Education
          </h4>
          {candidate.education ? (
            <div style={{ background: 'var(--bg-main)', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>{candidate.education.degree || 'Degree N/A'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{candidate.education.college} {candidate.education.year ? `(${candidate.education.year})` : ''}</div>
            </div>
          ) : (
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No education history available.</p>
          )}
        </div>

      </div>
    </div>
  );
}
