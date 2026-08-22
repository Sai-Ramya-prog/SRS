import React from 'react';
import { X, Award, CheckCircle, AlertTriangle, Briefcase, GraduationCap, Mail, FileText, UserCheck, UserX } from 'lucide-react';

export default function CandidateDrawer({ candidate, onClose, onStatusUpdate }) {
  if (!candidate) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        height: '100%',
        background: '#0F172A',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px',
        overflowY: 'auto',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>{candidate.candidate_name}</h2>
              <span className="badge badge-score-high" style={{ fontSize: '1rem', padding: '4px 10px' }}>
                {candidate.match_score} / 10
              </span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={14} /> {candidate.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={14} /> {candidate.file_name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: 'var(--text-main)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
          <button
            onClick={() => onStatusUpdate(candidate.screening_id, 'shortlisted')}
            style={{
              flex: 1,
              background: candidate.status === 'shortlisted' ? '#10B981' : 'rgba(16, 185, 129, 0.15)',
              color: candidate.status === 'shortlisted' ? '#ffffff' : '#34D399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserCheck size={16} /> Shortlist Candidate
          </button>
          <button
            onClick={() => onStatusUpdate(candidate.screening_id, 'rejected')}
            style={{
              flex: 1,
              background: candidate.status === 'rejected' ? '#F43F5E' : 'rgba(244, 63, 94, 0.15)',
              color: candidate.status === 'rejected' ? '#ffffff' : '#FB7185',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '10px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserX size={16} /> Reject Candidate
          </button>
        </div>

        {/* AI Justification Summary */}
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.04)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={18} /> Gemini AI Match Justification
          </h4>
          <p style={{ fontSize: '0.92rem', color: '#E2E8F0', lineHeight: 1.6 }}>
            {candidate.justification || 'Candidate matches key job parameters with solid foundational skillsets.'}
          </p>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h5 style={{ color: '#34D399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Key Strengths
            </h5>
            <p style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>{candidate.strengths || 'Strong practical skill alignment.'}</p>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.06)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h5 style={{ color: '#FB7185', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> Potential Gaps / Weaknesses
            </h5>
            <p style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>{candidate.weaknesses || 'No major gaps detected.'}</p>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Skills Match Breakdown</h4>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Matched Skills</span>
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
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Missing / Required Skills</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {candidate.missing_skills && candidate.missing_skills.length > 0 ? (
                candidate.missing_skills.map((skill, i) => (
                  <span key={i} className="badge badge-missing-skill">{skill}</span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#34D399' }}>All key skills matched!</span>
              )}
            </div>
          </div>
        </div>

        {/* Experience & Education */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="var(--primary)" /> Parsed Work Experience
          </h4>
          {Array.isArray(candidate.experience) && candidate.experience.length > 0 ? (
            candidate.experience.map((exp, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid var(--border-card)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{exp.role}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.company} • {exp.years || 1} yrs</div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>No structured experience parsed.</p>
          )}

          <h4 style={{ fontSize: '1rem', margin: '20px 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} color="var(--secondary)" /> Education
          </h4>
          {candidate.education ? (
            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{candidate.education.degree || 'Degree N/A'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{candidate.education.college} {candidate.education.year ? `(${candidate.education.year})` : ''}</div>
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>No education history available.</p>
          )}
        </div>

      </div>
    </div>
  );
}
