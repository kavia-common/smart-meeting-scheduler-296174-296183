import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Placeholder page for the new transcription step.
 * Navigation target from Upload Audio -> "Process Audio".
 */
export default function TranscriptsNew() {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>Transcription Setup</h2>
        <p style={styles.body}>
          This is a placeholder for the transcription step. Audio processing will be configured here.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'grid',
    placeItems: 'center',
    minHeight: 300,
  },
  card: {
    background: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-card)',
    padding: 24,
    boxShadow: 'var(--shadow-md)',
    width: 'min(700px, 100%)',
  },
  title: {
    fontSize: 'var(--font-h2)',
    fontWeight: 'var(--weight-heading)',
    marginBottom: 8,
    color: 'var(--color-text-dark)',
  },
  body: {
    fontSize: 14,
    color: 'var(--color-text-medium)',
  },
};
