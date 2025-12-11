import React, { useCallback, useMemo, useRef, useState } from 'react';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * UploadAudio page
 * - Breadcrumbs expected via AppLayout: Dashboard > Start New Case > Upload Audio
 * - Drag & drop or click-to-browse for audio files (MP3/WAV/M4A), max size 50MB
 * - Preview list: File Name, Duration (mock), Status (mock), Remove
 * - Actions: Process Audio (primary) -> '/transcripts/new', Cancel -> '/'
 */
export default function UploadAudio() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const onBrowse = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const supportedTypes = useMemo(
    () => ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/mp4', 'audio/aac', 'audio/m4a'],
    []
  );

  const validateAndAdd = useCallback((fileList) => {
    const newItems = [];
    Array.from(fileList).forEach((file) => {
      const isSupported = supportedTypes.some((t) => file.type === t || file.name.toLowerCase().endsWith('.mp3') || file.name.toLowerCase().endsWith('.wav') || file.name.toLowerCase().endsWith('.m4a'));
      const sizeOk = file.size <= 50 * 1024 * 1024; // 50MB
      if (isSupported && sizeOk) {
        newItems.push({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          name: file.name,
          size: file.size,
          // Mock duration/status
          duration: mockDuration(file.size),
          status: 'Processing',
        });
      }
    });
    if (newItems.length > 0) {
      setFiles((prev) => [...prev, ...newItems]);
    }
  }, [supportedTypes]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndAdd(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onFileChange = (e) => {
    validateAndAdd(e.target.files || []);
  };

  const onRemove = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const onUploadClick = () => {
    // No backend yet; mimic processing to Ready
    setFiles((prev) => prev.map((f) => ({ ...f, status: 'Ready' })));
  };

  return (
    <div style={styles.page}>
      <div style={styles.centerCol}>
        {/* Section 1 – Audio Upload Card */}
        <Card>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={onBrowse}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onBrowse()}
            aria-label="Drag and drop audio files here or click to browse"
            style={{
              ...styles.dropzone,
              ...(isDragging ? styles.dropzoneActive : {}),
            }}
          >
            <div style={styles.dropzoneIcon} aria-hidden>🎙️</div>
            <div style={styles.dropzoneTextPrimary}>Drag & drop audio files here or click to browse.</div>
            <div style={styles.dropzoneTextSecondary}>Supported formats: MP3, WAV, M4A • Max size: 50MB</div>
            <button className="button" style={styles.primaryBtn} onClick={(e) => { e.stopPropagation(); onBrowse(); }}>
              Upload Audio
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".mp3,.wav,.m4a,audio/*"
              multiple
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <p style={styles.tipText}>Tip: Ensure audio is clear. Multiple files can be uploaded.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="button" style={styles.primaryBtn} onClick={onUploadClick}>Confirm Upload</button>
          </div>
        </Card>

        {/* Section 2 – Uploaded Files Preview */}
        <Card title="Uploaded Files Preview">
          {files.length === 0 ? (
            <div style={styles.emptyState}>No files uploaded yet.</div>
          ) : (
            <div style={styles.table}>
              <div style={{ ...styles.row, ...styles.headerRow }}>
                <div style={styles.colName}>File Name</div>
                <div style={styles.colDuration}>Duration</div>
                <div style={styles.colStatus}>Status</div>
                <div style={styles.colActions}>Actions</div>
              </div>
              {files.map((f) => (
                <div key={f.id} style={styles.row}>
                  <div style={styles.colName}>{f.name}</div>
                  <div style={styles.colDuration}>{f.duration}</div>
                  <div style={styles.colStatus}>{f.status}</div>
                  <div style={styles.colActions}>
                    <button
                      aria-label={`Remove ${f.name}`}
                      title="Remove"
                      className="button ghost"
                      style={styles.removeBtn}
                      onClick={() => onRemove(f.id)}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Section 3 – Next Step Actions */}
        <div style={styles.footerActions}>
          <button className="button ghost" style={styles.cancelBtn} onClick={() => navigate('/')}>Cancel</button>
          <button className="button" style={styles.primaryBtn} onClick={() => navigate('/transcripts/new')}>
            Process Audio
          </button>
        </div>
      </div>
    </div>
  );
}

function mockDuration(size) {
  // Simple mock: size-based pseudo duration (not real)
  const seconds = Math.min(3600, Math.max(30, Math.floor(size / 500000))); // 0.5MB ~ 1s
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const styles = {
  page: {
    background: 'var(--color-bg)', // #F5F7FA
    color: 'var(--color-text-dark)', // #1A1A1A
  },
  centerCol: {
    width: 'min(900px, 100%)',
    marginInline: 'auto',
    display: 'grid',
    gap: '24px',
  },
  dropzone: {
    border: '2px dashed var(--color-border)',
    borderRadius: 'var(--radius-card)',
    background: '#fff',
    padding: '32px',
    display: 'grid',
    justifyItems: 'center',
    gap: 12,
    cursor: 'pointer',
    transition: 'border-color .2s ease, background .2s ease, box-shadow .2s ease',
  },
  dropzoneActive: {
    borderColor: 'var(--color-primary)',
    background: '#F0F4FA',
    boxShadow: 'var(--shadow-sm)',
  },
  dropzoneIcon: {
    fontSize: 36,
  },
  dropzoneTextPrimary: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--color-text-dark)',
    textAlign: 'center',
  },
  dropzoneTextSecondary: {
    fontSize: 13,
    color: 'var(--color-text-medium)',
    textAlign: 'center',
  },
  tipText: {
    fontSize: 12,
    color: 'var(--color-text-medium)',
    marginTop: 12,
  },
  primaryBtn: {
    background: 'var(--color-primary)', // #0A3977
    color: '#fff',
  },
  removeBtn: {
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-dark)',
    background: 'transparent',
  },
  table: {
    display: 'grid',
    gap: 8,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 80px',
    alignItems: 'center',
    padding: '12px',
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
  },
  headerRow: {
    fontWeight: 600,
    background: '#FAFBFC',
  },
  colName: { fontSize: 14, color: 'var(--color-text-dark)' },
  colDuration: { fontSize: 14, color: 'var(--color-text-dark)' },
  colStatus: { fontSize: 14, color: 'var(--color-text-dark)' },
  colActions: { display: 'flex', justifyContent: 'flex-end' },
  footerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-border)',
  },
};
