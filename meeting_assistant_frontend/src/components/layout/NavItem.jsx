import React from 'react';

export function NavItem({ label, active = false, onClick }) {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.85)',
    background: active ? 'var(--color-sidebar-active)' : 'transparent',
    border: active ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background .2s ease, color .2s ease, border-color .2s ease',
  };
  const hoverStyle = {
    background: active ? 'var(--color-sidebar-active)' : 'rgba(255,255,255,0.08)',
    color: '#fff',
    borderColor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
  };

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        style={baseStyle}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) =>
          Object.assign(e.currentTarget.style, {
            background: active ? 'var(--color-sidebar-active)' : 'transparent',
            color: 'rgba(255,255,255,0.85)',
            borderColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
          })
        }
        onFocus={(e) =>
          (e.currentTarget.style.outline =
            '3px solid rgba(255,255,255,0.35)')
        }
        onBlur={(e) => (e.currentTarget.style.outline = 'none')}
        aria-current={active ? 'page' : undefined}
        aria-label={label}
      >
        <span style={{ flex: 1, textAlign: 'left', fontWeight: active ? 600 : 500 }}>
          {label}
        </span>
      </button>
    </li>
  );
}
