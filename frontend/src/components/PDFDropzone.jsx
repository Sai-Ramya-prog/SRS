import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function PDFDropzone({ onFilesSelected, multiple = true, maxFiles = 50 }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
      );
      if (validFiles.length > 0) {
        onFilesSelected(multiple ? validFiles.slice(0, maxFiles) : [validFiles[0]]);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter(
        (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
      );
      onFilesSelected(multiple ? validFiles.slice(0, maxFiles) : [validFiles[0]]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragOver ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)'}`,
        background: isDragOver ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.4)',
        borderRadius: '16px',
        padding: '36px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isDragOver ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,application/pdf"
        multiple={multiple}
        style={{ display: 'none' }}
      />
      <div style={{
        display: 'inline-flex',
        padding: '16px',
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.15)',
        color: 'var(--primary)',
        marginBottom: '16px'
      }}>
        <UploadCloud size={32} />
      </div>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
        {multiple ? 'Drag & Drop candidate PDF resumes here' : 'Drag & Drop Job Description PDF'}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '12px' }}>
        or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse files</span> from your computer
      </p>
      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)' }}>
        Supports PDF files {multiple ? `(Up to ${maxFiles} files)` : ''}
      </span>
    </div>
  );
}
