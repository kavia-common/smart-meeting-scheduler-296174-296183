import React from 'react';
import { NavItem } from './NavItem';

// PUBLIC_INTERFACE
export default function AppLayout({ title = 'Dashboard', actions, children }) {
  /**
   * This component renders a responsive application layout with:
   * - Left sidebar (fixed width) with navigation
   * - Main content area with page header and content
   */
  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar} aria-label="Primary">
        <div style={styles.brand}>
          <div style={styles.brandLogo} aria-hidden>🤖</div>
          <div>
            <div style={styles.brandTitle}>Arrangement Assistant</div>
            <div style={styles.brandSubtitle}>Case Manager</div>
          </div>
        </div>
        <nav aria-label="Main navigation">
          <ul style={styles.navList}>
            <NavItem label="Dashboard" active />
            <NavItem label="Cases" />
            <NavItem label="Documents" />
            <NavItem label="Settings" />
          </ul>
        </nav>
      </aside>

      <main style={styles.main}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>{title}</h1>
          <div style={styles.actions}>{actions}</div>
        </div>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: 'var(--sidebar-width) 1fr',
    minHeight: '100%',
    background: 'var(--color-bg)',
  },
  sidebar: {
    position: 'sticky',
    top: 0,
    alignSelf: 'start',
    height: '100vh',
    width: 'var(--sidebar-width)',
    background: 'var(--color-sidebar-bg)',
    color: '#ffffff', /* enforce white text */
    padding: '24px 16px',
    boxShadow: 'var(--shadow-lg)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    marginBottom: '24px',
  },
  brandLogo: {
    display: 'grid',
    placeItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg, rgba(47,156,149,0.25), rgba(10,57,119,0.25))',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.25) inset',
    color: '#fff'
  },
  brandTitle: {
    fontWeight: 700,
    letterSpacing: 0.2,
    lineHeight: 1.1,
    color: '#fff'
  },
  brandSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  navList: {
    display: 'grid',
    gap: 6,
  },
  main: {
    minWidth: 0,
    padding: 'var(--space-8)',
    background: 'var(--color-bg)',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 'var(--space-6)',
  },
  pageTitle: {
    fontSize: 'var(--font-h1)', /* 24px */
    fontWeight: 'var(--weight-heading)', /* 600 */
    letterSpacing: -0.2,
    color: 'var(--color-text-dark)'
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  content: {
    display: 'grid',
    gap: 'var(--space-6)',
  },
};
