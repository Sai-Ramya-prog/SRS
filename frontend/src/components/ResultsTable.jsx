import React, { useState } from 'react';
import { Award, Check, X, Eye, Sparkles, Filter, Search, UserCheck, UserX } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResultsTable({ results = [], onStatusUpdate, onSelectCandidate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecommendation, setFilterRecommendation] = useState('all');

  const handleStatusChange = async (e, screeningId, status) => {
    e.stopPropagation();
    if (status === 'shortlisted') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    await onStatusUpdate(screeningId, status);
  };

  const filteredResults = results.filter((item) => {
    const matchesSearch =
      item.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matched_skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterRecommendation === 'all' ||
      item.status === filterRecommendation ||
      item.recommendation === filterRecommendation;

    return matchesSearch && matchesFilter;
  });

  const getScoreBadgeClass = (score) => {
    if (score >= 8) return 'badge-score-high';
    if (score >= 5) return 'badge-score-medium';
    return 'badge-score-low';
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Table Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div>
          <span className="overline">DIRECTORY</span>
          <h3 style={{ fontSize: '2rem' }}>
            Ranked Candidates
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
            Sorted by Gemini AI match score (Highest match first)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search candidate or skill..."
              className="glass-input"
              style={{ paddingLeft: '36px', fontSize: '0.8rem', height: '38px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter dropdown */}
          <select
            className="glass-input"
            style={{ width: 'auto', fontSize: '0.8rem', height: '38px', cursor: 'pointer' }}
            value={filterRecommendation}
            onChange={(e) => setFilterRecommendation(e.target.value)}
          >
            <option value="all">All Candidates</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending Decision</option>
          </select>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <Sparkles size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p>No candidates match your current filter or processing is still underway.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
            <thead>
              <tr style={{ background: '#EFECE3', borderBottom: '1px solid #E5DFD1', color: 'var(--text-overline)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', borderTopLeftRadius: '4px' }}>RANK</th>
                <th style={{ padding: '12px 16px' }}>CANDIDATE</th>
                <th style={{ padding: '12px 16px' }}>SCORE</th>
                <th style={{ padding: '12px 16px' }}>MATCHED SKILLS</th>
                <th style={{ padding: '12px 16px' }}>AI REC</th>
                <th style={{ padding: '12px 16px' }}>DECISION</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', borderTopRightRadius: '4px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((candidate, idx) => (
                <tr
                  key={candidate.screening_id || candidate.candidate_id}
                  onClick={() => onSelectCandidate(candidate)}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
                >
                  {/* Rank */}
                  <td style={{ padding: '16px', fontWeight: 700, fontSize: '1.1rem', color: idx === 0 ? '#FBBF24' : (idx === 1 ? '#9CA3AF' : (idx === 2 ? '#B45309' : 'var(--text-dim)')) }}>
                    #{idx + 1}
                  </td>

                  {/* Name & Email */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{candidate.candidate_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{candidate.email}</div>
                  </td>

                  {/* Score */}
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${getScoreBadgeClass(candidate.match_score)}`} style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                      {candidate.match_score} / 10
                    </span>
                  </td>

                  {/* Matched Skills */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '280px' }}>
                      {candidate.matched_skills && candidate.matched_skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="badge badge-skill">
                          {skill}
                        </span>
                      ))}
                      {candidate.matched_skills && candidate.matched_skills.length > 4 && (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                          +{candidate.matched_skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* AI Recommendation */}
                  <td style={{ padding: '16px' }}>
                    <span
                      className="badge"
                      style={{
                        background: candidate.recommendation === 'shortlist' ? 'rgba(16,185,129,0.12)' : (candidate.recommendation === 'reject' ? 'rgba(244,63,94,0.12)' : 'rgba(245,158,11,0.12)'),
                        color: candidate.recommendation === 'shortlist' ? '#34D399' : (candidate.recommendation === 'reject' ? '#FB7185' : '#FBBF24'),
                        textTransform: 'capitalize'
                      }}
                    >
                      {candidate.recommendation}
                    </span>
                  </td>

                  {/* HR Status Decision */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        title="Shortlist Candidate"
                        onClick={(e) => handleStatusChange(e, candidate.screening_id, 'shortlisted')}
                        style={{
                          background: candidate.status === 'shortlisted' ? '#10B981' : 'rgba(255, 255, 255, 0.05)',
                          color: candidate.status === 'shortlisted' ? '#ffffff' : 'var(--text-muted)',
                          border: candidate.status === 'shortlisted' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                      >
                        <UserCheck size={14} /> Shortlist
                      </button>
                      <button
                        title="Reject Candidate"
                        onClick={(e) => handleStatusChange(e, candidate.screening_id, 'rejected')}
                        style={{
                          background: candidate.status === 'rejected' ? '#F43F5E' : 'rgba(255, 255, 255, 0.05)',
                          color: candidate.status === 'rejected' ? '#ffffff' : 'var(--text-muted)',
                          border: candidate.status === 'rejected' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                      >
                        <UserX size={14} /> Reject
                      </button>
                    </div>
                  </td>

                  {/* Drawer trigger */}
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button
                      className="btn-secondary btn-small"
                      onClick={() => onSelectCandidate(candidate)}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
