import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PDFDropzone from '../components/PDFDropzone';
import { Type, FileUp, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CreateJD() {
  const [activeTab, setActiveTab] = useState('typed'); // 'typed' | 'pdf'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a Job Title');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'typed') {
        if (!description.trim()) {
          setError('Please enter the job description text');
          setLoading(false);
          return;
        }

        const resp = await api.post('/api/jd/create', {
          title: title,
          description: description
        });

        const jdId = resp.data.jd_id;
        navigate(`/upload/${jdId}`);
      } else {
        if (!pdfFile) {
          setError('Please upload a PDF file for the Job Description');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', pdfFile);

        const resp = await api.post('/api/jd/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const jdId = resp.data.jd_id;
        navigate(`/upload/${jdId}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save Job Description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Job Description</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Define the job specifications for Gemini AI to screen candidate resumes against
        </p>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#FB7185', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--border-card)', padding: '6px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border-card)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('typed')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: activeTab === 'typed' ? '1px solid var(--border-card-hover)' : '1px solid transparent',
              background: activeTab === 'typed' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'typed' ? 'var(--bg-card)' : 'var(--text-main)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              opacity: activeTab === 'typed' ? 1 : 0.65
            }}
          >
            <Type size={18} /> Type Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: activeTab === 'pdf' ? '1px solid var(--border-card-hover)' : '1px solid transparent',
              background: activeTab === 'pdf' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'pdf' ? 'var(--bg-card)' : 'var(--text-main)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              opacity: activeTab === 'pdf' ? 1 : 0.65
            }}
          >
            <FileUp size={18} /> Upload PDF JD
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Job Title Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#E2E8F0' }}>
              Job Position Title
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Senior Backend Engineer (Python/FastAPI)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {activeTab === 'typed' ? (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#E2E8F0' }}>
                Job Description & Key Requirements
              </label>
              <textarea
                className="glass-input"
                rows={10}
                placeholder="Paste the full job responsibilities, mandatory skills, minimum experience years, education qualifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#E2E8F0' }}>
                Upload Job Description PDF
              </label>
              <PDFDropzone
                multiple={false}
                onFilesSelected={(files) => setPdfFile(files[0])}
              />
              {pdfFile && (
                <div style={{ marginTop: '12px', background: 'rgba(16,185,129,0.1)', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} /> Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            >
              {loading ? 'Saving Job Description...' : 'Save & Continue to Resume Upload'} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
