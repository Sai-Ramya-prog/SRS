import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PDFDropzone from '../components/PDFDropzone';
import { FileText, X, ArrowRight, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadResumes() {
  const { jd_id } = useParams();
  const [jd, setJd] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJD();
  }, [jd_id]);

  const fetchJD = async () => {
    try {
      const resp = await api.get(`/api/jd/${jd_id}`);
      setJd(resp.data);
    } catch (err) {
      console.error(err);
      setError('Job Description not found');
    }
  };

  const handleFilesSelected = (files) => {
    // Avoid duplicate filenames
    const existingNames = new Set(selectedFiles.map((f) => f.name));
    const newFiles = files.filter((f) => !existingNames.has(f.name));
    setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 50));
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartScreening = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least 1 PDF resume file to screen.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('jd_id', jd_id);
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await api.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/screening/${jd_id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to upload resumes for screening');
      setUploading(false);
    }
  };

  return (
    <div className="container">
      {/* Target JD Context Banner */}
      {jd && (
        <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              TARGET JOB POSITION
            </span>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{jd.title}</h2>
          </div>
          <span className="badge badge-skill" style={{ padding: '6px 12px' }}>
            ID: {jd.id.substring(0, 8)}...
          </span>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#FB7185', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Dropzone */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Upload Candidate Resumes</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Select multiple PDF resumes from your laptop (up to 50 candidates per batch)
          </p>

          <PDFDropzone onFilesSelected={handleFilesSelected} multiple={true} maxFiles={50} />
        </div>

        {/* Selected File List Preview */}
        {selectedFiles.length > 0 && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>
                Selected Candidates ({selectedFiles.length} / 50)
              </h3>
              <button
                onClick={() => setSelectedFiles([])}
                className="btn-secondary btn-small"
                style={{ color: '#FB7185' }}
              >
                Clear All
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <FileText size={20} color="var(--primary)" />
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleStartScreening}
                className="btn-primary"
                disabled={uploading}
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem' }}
              >
                {uploading ? 'Initiating Gemini AI Screening...' : `Start AI Screening (${selectedFiles.length} Resumes)`} <Sparkles size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
