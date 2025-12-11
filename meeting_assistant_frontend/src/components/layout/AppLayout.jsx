import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from './NavItem';

// PUBLIC_INTERFACE
export default function AppLayout({ title = 'Dashboard', actions, breadcrumbs = [], children }) {
  /**
   * This component renders a responsive application layout with:
   * - Left sidebar with navigation (Dashboard, Cases, Documents, Settings)
   * - Main content with optional breadcrumbs, page header and content
   */
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', to: '/' },
    { label: 'Cases', to: '/cases' },
    { label: 'Documents', to: '/documents' },
    { label: 'Settings', to: '/settings' },
  ];

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar} aria-label="Primary">
        <div style={styles.brand}>
          <div style={styles.brandLogo} aria-hidden>🎧</div>
          <div>
            <div style={styles.brandTitle}>Arrangement Assistant</div>
            <div style={styles.brandSubtitle}>Case Manager</div>
          </div>
        </div>
        <nav aria-label="Main navigation">
          <ul style={styles.navList}>
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                label={item.label}
                active={location.pathname === item.to}
                onClick={() => navigate(item.to)}
              />
            ))}
          </ul>
        </nav>
      </aside>

      <main style={styles.main}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" style={styles.breadcrumbs}>
            <ol style={styles.breadcrumbList}>
              {breadcrumbs.map((bc, idx) => (
                <li key={idx} style={styles.breadcrumbItem}>
                  {bc.to ? (
                    <NavLink to={bc.to} style={styles.breadcrumbLink}>{bc.label}</NavLink>
                  ) : (
                    <span aria-current="page" style={styles.breadcrumbCurrent}>{bc.label}</span>
                  )}
                  {idx < breadcrumbs.length - 1 && <span style={styles.breadcrumbSeparator}>›</span>}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>{title}</h1>
          <div style={styles.actions}>{actions}</div>
        </div>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
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
    color: '#ffffff',
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
  breadcrumbs: {
    marginBottom: 'var(--space-4)',
  },
  breadcrumbList: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    color: 'var(--color-text-medium)',
    fontSize: 13,
  },
  breadcrumbItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  breadcrumbLink: {
    color: 'var(--color-text-medium)',
    textDecoration: 'none',
  },
  breadcrumbCurrent: {
    color: 'var(--color-text-dark)',
    fontWeight: 600,
  },
  breadcrumbSeparator: {
    color: 'var(--color-text-medium)',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 'var(--space-6)',
  },
  pageTitle: {
    fontSize: 'var(--font-h1)',
    fontWeight: 'var(--weight-heading)',
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
