import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * ConfirmAndSubmit page
 * - Route: /cases/:caseId/submit
 * - Uses AppLayout via RoutedLayout in App.js
 * - Shows summary header, missing fields warning banner (mock), primary/secondary actions
 * - Confirmation dialog before submission
 * - Mock API call randomly succeeds/fails and shows appropriate success/failure states and toasts
 * - Typography and spacing per theme tokens
 */
export default function ConfirmAndSubmit() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  // Mock missing fields toggle (can be used to simulate error state)
  const [missingFields, setMissingFields] = useState(true);

  // Toast state
  const [toast, setToast] = useState(null); // { type: 'success'|'error'|'info', text: '' }
  const showToast = (type, text, timeout = 3000) => {
    setToast({ type, text });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), timeout);
  };

  // Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'failure' | null

  // Mock summary data
  const summary = useMemo(
    () => ({
      decedentName: 'John A. Smith',
      caseNumber: caseId || 'AUTO-12345',
      serviceType: 'Memorial Service',
      location: 'Chapel A',
      primaryContact: 'Jane Doe (Spouse)',
    }),
    [caseId]
  );

  // Simulate missing fields toast on mount if applicable
  useEffect(() => {
    if (missingFields) {
      showToast('error', 'There are missing required fields.');
      // Also prompt review toast example
      setTimeout(() => showToast('error', 'Please review the highlighted fields.'), 1200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openConfirm = () => {
    // If missing fields, still allow submission per requirement,
    // but we already surfaced error toasts and banner.
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmOpen(false);
    setIsSubmitting(true);
    // Mock API call with random outcome
    window.setTimeout(() => {
      const ok = Math.random() > 0.5;
      setIsSubmitting(false);
      if (ok) {
        setResult('success');
        showToast('success', 'Case submitted successfully.');
      } else {
        setResult('failure');
        // Show error toasts per requirements (examples)
        showToast('error', 'There are missing required fields.');
        window.setTimeout(() => showToast('error', 'Please review the highlighted fields.'), 1000);
      }
    }, 1200);
  };

  const resetAndEdit = () => {
    setResult(null);
    navigate(`/cases/${caseId}/review`);
  };

  const viewInBizarr = () => {
    // Placeholder link/action
    window.open('#', '_blank', 'noopener,noreferrer');
  };

  const exportCase = () => {
    // Simple mock export as JSON
    const blob = new Blob([JSON.stringify({ ...summary }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case-${summary.caseNumber}-export.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.wrap}>
      {/* Toast */}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            ...styles.toast,
            ...(toast.type === 'success'
              ? styles.toastSuccess
              : toast.type === 'error'
              ? styles.toastError
              : styles.toastInfo),
          }}
        >
          {toast.text}
        </div>
      ) : null}

      {/* Summary Section */}
      <Card
        title="Confirm and Submit"
        footer={
          result ? (
            // Footer varies on result
            result === 'success' ? (
              <>
                <button className="button ghost" onClick={resetAndEdit}>
                  Back to Review
                </button>
                <button className="button" style={styles.primaryBtn} onClick={viewInBizarr}>
                  View in Bizarr
                </button>
              </>
            ) : (
              <>
                <button className="button ghost" onClick={resetAndEdit}>
                  Edit Information
                </button>
                <button className="button" style={styles.primaryBtn} onClick={exportCase}>
                  Export Case
                </button>
              </>
            )
          ) : (
            <>
              <button
                className="button ghost"
                onClick={() => navigate(`/cases/${caseId}/review`)}
                title="Return to Case Review"
              >
                Edit Information
              </button>
              <button
                className="button"
                style={styles.primaryBtn}
                onClick={openConfirm}
                title="Confirm and submit to Bizarr"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Confirm and Submit'}
              </button>
            </>
          )
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <h2 style={styles.sectionTitle}>Review summary before submission</h2>

          {/* Missing fields banner */}
          {missingFields && !result ? (
            <div role="alert" style={styles.warningBanner}>
              <div style={styles.warningIcon} aria-hidden>⚠️</div>
              <div>
                <div style={styles.warningTitle}>Some required fields are missing.</div>
                <div style={styles.warningBody}>
                  Please complete missing items or confirm you will follow up manually.
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <label style={styles.miniToggle}>
                  <input
                    type="checkbox"
                    checked={missingFields}
                    onChange={(e) => setMissingFields(e.target.checked)}
                  />
                  <span>Simulate missing fields</span>
                </label>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <label style={styles.miniToggle}>
                <input
                  type="checkbox"
                  checked={missingFields}
                  onChange={(e) => setMissingFields(e.target.checked)}
                />
                <span>Simulate missing fields</span>
              </label>
            </div>
          )}

          {/* Summary card content */}
          {!result && (
            <div style={styles.summaryGrid}>
              <SummaryItem label="Case Number" value={summary.caseNumber} />
              <SummaryItem label="Decedent Name" value={summary.decedentName} />
              <SummaryItem label="Service Type" value={summary.serviceType} />
              <SummaryItem label="Location" value={summary.location} />
              <SummaryItem label="Primary Contact" value={summary.primaryContact} />
            </div>
          )}

          {/* Result states */}
          {result === 'success' && (
            <div style={styles.resultBoxSuccess}>
              <h3 style={styles.resultHeading}>Submission successful</h3>
              <p style={styles.resultText}>
                The case has been successfully pushed to Bizarr funeral home software.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="button ghost" onClick={resetAndEdit}>
                  Back to Review
                </button>
                <button className="button" style={styles.primaryBtn} onClick={viewInBizarr}>
                  View in Bizarr
                </button>
              </div>
            </div>
          )}
          {result === 'failure' && (
            <div style={styles.resultBoxFailure}>
              <h3 style={styles.resultHeading}>Submission failed</h3>
              <p style={styles.resultText}>
                Unable to push case to Bizarr. Please try again or export data manually.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="button ghost" onClick={resetAndEdit}>
                  Edit Information
                </button>
                <button className="button" style={styles.primaryBtn} onClick={exportCase}>
                  Export Case
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Confirmation Dialog */}
      {confirmOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" style={styles.dialogOverlay}>
          <div style={styles.dialog}>
            <h3 id="confirm-title" style={styles.dialogTitle}>Submit case to Bizarr</h3>
            <p style={styles.dialogBody}>
              Are you sure you want to submit this case to Bizarr? Once submitted, changes may need to
              be made directly in Bizarr.
            </p>
            <div style={styles.dialogActions}>
              <button className="button ghost" onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
              <button className="button" style={styles.primaryBtn} onClick={handleConfirmSubmit}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div style={styles.summaryItem}>
      <div style={styles.summaryLabel}>{label}</div>
      <div style={styles.summaryValue}>{value || '—'}</div>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'grid',
    gap: 24,
  },
  primaryBtn: {
    background: 'var(--color-primary)', // #0A3977
    color: '#fff',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: 'var(--color-text-dark)',
  },

  warningBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px',
    borderRadius: 12,
    border: '1px solid rgba(245,158,11,0.35)',
    background: 'rgba(245,158,11,0.08)',
    boxShadow: 'var(--shadow-sm)',
  },
  warningIcon: { fontSize: 18, marginTop: 2 },
  warningTitle: { fontSize: 14, fontWeight: 600, color: 'var(--color-warning)' },
  warningBody: { fontSize: 14, color: 'var(--color-text-dark)' },
  miniToggle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-medium)' },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: 12,
    boxShadow: 'var(--shadow-sm)',
  },
  summaryItem: {
    display: 'grid',
    gap: 4,
    padding: 8,
    border: '1px solid var(--color-border)',
    background: '#fff',
    borderRadius: 10,
  },
  summaryLabel: { fontSize: 12, color: 'var(--color-text-medium)' },
  summaryValue: { fontSize: 14, fontWeight: 600, color: 'var(--color-text-dark)' },

  resultBoxSuccess: {
    display: 'grid',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    border: '1px solid rgba(52,168,83,0.35)',
    background: 'rgba(52,168,83,0.08)',
  },
  resultBoxFailure: {
    display: 'grid',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    border: '1px solid rgba(217,48,37,0.35)',
    background: 'rgba(217,48,37,0.08)',
  },
  resultHeading: { fontSize: 18, fontWeight: 600, color: 'var(--color-text-dark)' },
  resultText: { fontSize: 14, color: 'var(--color-text-dark)' },

  // Dialog
  dialogOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 50,
  },
  dialog: {
    width: 'min(520px, 92vw)',
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 12,
    padding: 16,
    boxShadow: 'var(--shadow-lg)',
  },
  dialogTitle: { fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-dark)' },
  dialogBody: { fontSize: 14, color: 'var(--color-text-dark)', marginBottom: 12 },
  dialogActions: { display: 'flex', justifyContent: 'flex-end', gap: 8 },

  // Toast
  toast: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    marginBottom: 12,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-md)',
    background: '#fff',
    fontSize: 14,
  },
  toastSuccess: {
    borderColor: 'rgba(52,168,83,0.4)',
    background: 'rgba(52,168,83,0.08)',
    color: 'var(--color-text-dark)',
  },
  toastError: {
    borderColor: 'rgba(217,48,37,0.4)',
    background: 'rgba(217,48,37,0.08)',
    color: 'var(--color-text-dark)',
  },
  toastInfo: {
    borderColor: 'rgba(26,61,124,0.4)',
    background: 'rgba(26,61,124,0.08)',
    color: 'var(--color-text-dark)',
  },
};
