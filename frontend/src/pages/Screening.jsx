import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StatusTracker from '../components/StatusTracker';
import ResultsTable from '../components/ResultsTable';
import CandidateDrawer from '../components/CandidateDrawer';
import { UserCheck, Sparkles, RefreshCw, Upload, FileText } from 'lucide-react';

export default function Screening() {
  const { jd_id } = useParams();
  const [jd, setJd] = useState(null);
  const [statusData, setStatusData] = useState({ total: 0, done: 0, failed: 0, candidates: [] });
  const [results, setResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollTimerRef = useRef(null);

  useEffect(() => {
    let isSubscribed = true;
    let delay = 2000;

    fetchJD();
    fetchResults();

    const poll = async () => {
      if (!isSubscribed) return;

      try {
        const resp = await api.get(`/api/resume/status/${jd_id}`);
        if (!isSubscribed) return;

        setStatusData(resp.data);
        fetchResults();

        const candidates = resp.data.candidates || [];
        const allDone =
          candidates.length > 0 &&
          candidates.every(
            (c) => c.status === 'done' || c.status === 'failed'
          );

        if (!allDone) {
          delay = Math.min(delay * 1.5, 10000); // max 10 seconds backoff
          pollTimerRef.current = setTimeout(poll, delay);
        }
      } catch (err) {
        console.error('Polling error:', err);
        if (isSubscribed) {
          delay = Math.min(delay * 1.5, 10000);
          pollTimerRef.current = setTimeout(poll, delay);
        }
      }
    };

    poll();

    return () => {
      isSubscribed = false;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [jd_id]);

  const fetchJD = async () => {
    try {
      const resp = await api.get(`/api/jd/${jd_id}`);
      setJd(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    try {
      const resp = await api.get(`/api/screening/results/${jd_id}`);
      setResults(resp.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (screeningId, newStatus) => {
    try {
      await api.patch(`/api/screening/${screeningId}/status`, { status: newStatus });
      // Instant optimistic local update
      setResults((prev) =>
        prev.map((item) =>
          item.screening_id === screeningId ? { ...item, status: newStatus } : item
        )
      );
      if (selectedCandidate && selectedCandidate.screening_id === screeningId) {
        setSelectedCandidate((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update candidate status', err);
    }
  };

  const shortlistedCount = results.filter((r) => r.status === 'shortlisted').length;

  return (
    <div className="container">
      {/* Top Context Navigation */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
            LIVE SCREENING DASHBOARD
          </span>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>{jd ? jd.title : 'Candidate Resume Screening'}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to={`/upload/${jd_id}`} className="btn-secondary btn-small">
            <Upload size={16} /> Upload More Resumes
          </Link>
          <Link to={`/shortlisted/${jd_id}`} className="btn-primary btn-small">
            <UserCheck size={16} /> View Shortlisted ({shortlistedCount})
          </Link>
        </div>
      </div>

      {/* Section A — Live Processing Status Meter */}
      <StatusTracker
        total={statusData.total}
        done={statusData.done}
        failed={statusData.failed}
        candidates={statusData.candidates}
      />

      {/* Section B — Ranked Results Table */}
      <ResultsTable
        results={results}
        onStatusUpdate={handleStatusUpdate}
        onSelectCandidate={(candidate) => setSelectedCandidate(candidate)}
      />

      {/* Candidate Deep-Dive Drawer */}
      <CandidateDrawer
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
