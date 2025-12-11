import React from 'react';

// PUBLIC_INTERFACE
export default function Card({ title, children, footer, style = {} }) {
  /**
   * A themed card with soft shadows, border, and consistent padding/radius.
   */
  return (
    <section className="card" style={{ ...style }}>
      {title ? (
        <header style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
        </header>
      ) : null}
      <div>{children}</div>
      {footer ? <footer style={styles.footer}>{footer}</footer> : null}
    </section>
  );
}

const styles = {
  header: {
    marginBottom: 'var(--space-4)',
  },
  title: {
    fontSize: 'var(--font-h3)',
    fontWeight: 600,
    color: 'var(--color-text-dark)',
  },
  footer: {
    marginTop: 'var(--space-4)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--space-3)',
  },
};
