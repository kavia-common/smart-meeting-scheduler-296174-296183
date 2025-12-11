import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Dashboard page for the Arrangement Meeting Assistant.
 * Renders a professional two-column layout with:
 * - Start New Case (left column, top)
 * - Recent Cases (left column, bottom)
 * - Quick Actions (right column)
 * Typography: headings 24px/600, card titles 18px/600, body 14px/400.
 * Colors: primary #0A3977, accent #2F9C95, background #F5F7FA, card #FFFFFF, text #1A1A1A.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const recentCases = []; // In absence of data, empty state is shown.

  return (
    <div style={styles.grid}>
      {/* Left Column */}
      <div style={styles.leftCol}>
        <Card title="Start New Case">
          <p style={styles.bodyText}>
            Start by uploading evidence in audio or document format. Our assistant will extract key information and set up the case workspace.
          </p>
          <div style={styles.buttonRow}>
            <button className="button" style={styles.primaryBtn} onClick={() => navigate('/new-case/upload-audio')}>Upload Audio</button>
            <button className="button ghost" style={styles.outlineBtn}>Upload Document</button>
          </div>
          <p style={styles.helperText}>
            Supported formats: MP3, WAV, M4A, PDF, DOCX.
          </p>
        </Card>

        <Card title="Recent Cases">
          {recentCases.length === 0 ? (
            <div style={styles.emptyState}>No recent cases available</div>
          ) : (
            <ul style={styles.caseList} aria-label="Recent cases">
              {recentCases.map((c) => (
                <li key={c.id} style={styles.caseRow}>
                  <div style={styles.caseCell}><span style={styles.caseLabel}>Case ID</span>{c.id}</div>
                  <div style={styles.caseCell}><span style={styles.caseLabel}>Client Name</span>{c.clientName}</div>
                  <div style={styles.caseCell}><span style={styles.caseLabel}>Status</span>{c.status}</div>
                  <div style={styles.caseCell}><span style={styles.caseLabel}>Last Updated</span>{c.updatedAt}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Right Column */}
      <div style={styles.rightCol}>
        <Card title="Quick Actions">
          <div style={styles.actionsStack}>
            <button className="button" style={styles.primaryBtn} onClick={() => navigate('/new-case/upload-audio')}>Upload Audio</button>
            <button className="button ghost" style={styles.outlineBtn}>View All Cases</button>
            <button className="button ghost" style={styles.outlineBtn}>Continue Pending Case</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: 24, /* 24px gap as required */
  },
  leftCol: {
    display: 'grid',
    gap: 24,
  },
  rightCol: {
    display: 'grid',
    gap: 24,
  },
  bodyText: {
    fontSize: '14px',
    fontWeight: 400,
    color: 'var(--color-text-dark)',
    marginBottom: 'var(--space-4)',
  },
  buttonRow: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  helperText: {
    fontSize: '12px',
    color: 'var(--color-text-medium)',
    marginTop: 8,
  },
  primaryBtn: {
    background: 'var(--color-primary)', /* #0A3977 */
    color: '#ffffff',
    borderColor: 'transparent',
  },
  outlineBtn: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-border)',
  },
  emptyState: {
    fontSize: '14px',
    color: 'var(--color-text-medium)',
    padding: '12px',
    border: '1px dashed var(--color-border)',
    borderRadius: '8px',
    background: '#fff',
  },
  actionsStack: {
    display: 'grid',
    gap: 12,
  },
  caseList: {
    display: 'grid',
    gap: 8,
    marginTop: 4,
  },
  caseRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    padding: '12px 8px',
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    boxShadow: 'var(--shadow-sm)',
  },
  caseCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 14,
    color: 'var(--color-text-dark)',
  },
  caseLabel: {
    fontSize: 12,
    color: 'var(--color-text-medium)',
  },
};
