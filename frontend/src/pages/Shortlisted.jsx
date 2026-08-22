import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import CandidateCard from '../components/CandidateCard';
import { Download, UserCheck, ArrowLeft, FileSpreadsheet, Sparkles } from 'lucide-react';

export default function Shortlisted() {
  const { jd_id } = useParams();
  const [jd, setJd] = useState(null);
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShortlisted();
  }, [jd_id]);

  const fetchShortlisted = async () => {
    try {
      const resp = await api.get(`/api/screening/shortlisted/${jd_id}`);
      setShortlisted(resp.data.results || []);
      setJd({ id: resp.data.jd_id, title: resp.data.jd_title });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (screeningId) => {
    try {
      await api.patch(`/api/screening/${screeningId}/status`, { status: 'rejected' });
      setShortlisted((prev) => prev.filter((item) => item.screening_id !== screeningId));
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    if (shortlisted.length === 0) return;

    const headers = ['Rank', 'Candidate Name', 'Email', 'Match Score', 'Matched Skills', 'Missing Skills', 'Justification', 'Strengths'];
    
    const rows = shortlisted.map((c, idx) => [
      idx + 1,
      `"${(c.candidate_name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      c.match_score,
      `"${(c.matched_skills || []).join(', ').replace(/"/g, '""')}"`,
      `"${(c.missing_skills || []).join(', ').replace(/"/g, '""')}"`,
      `"${(c.justification || '').replace(/"/g, '""')}"`,
      `"${(c.strengths || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Shortlisted_Candidates_${(jd?.title || 'JD').replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <Link to={`/screening/${jd_id}`} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <ArrowLeft size={14} /> Back to Screening Dashboard
          </Link>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck color="var(--primary)" size={24} /> Shortlisted Candidates
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {jd?.title} • {shortlisted.length} candidate(s) shortlisted
          </p>
        </div>

        <div>
          <button
            onClick={exportToCSV}
            disabled={shortlisted.length === 0}
            className="btn-primary"
            style={{ opacity: shortlisted.length === 0 ? 0.5 : 1 }}
          >
            <FileSpreadsheet size={18} /> Export as CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading shortlisted candidates...</div>
      ) : shortlisted.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <Sparkles size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>No Candidates Shortlisted Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Go to the Screening Dashboard and mark top matching candidates as shortlisted.
          </p>
          <Link to={`/screening/${jd_id}`} className="btn-primary">
            Return to Screening Results
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {shortlisted.map((candidate) => (
            <CandidateCard
              key={candidate.screening_id}
              candidate={candidate}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
