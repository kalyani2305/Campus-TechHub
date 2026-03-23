// ─────────────────────────────────────────
// FILE: src/components/common/UI.js
// Reusable UI components used everywhere
// ─────────────────────────────────────────
import React from 'react';

const s = {
  // Button
  btnBase: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '10px 20px', borderRadius: '10px', border: 'none', fontFamily: 'Sora, sans-serif',
    fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
    letterSpacing: '0.2px',
  },
};

export function Button({ children, variant = 'primary', loading, onClick, type = 'button', style = {}, disabled }) {
  const variants = {
    primary:  { background: 'linear-gradient(135deg,#4f8ef7,#06d6c7)', color: '#fff' },
    danger:   { background: 'rgba(240,79,90,0.15)', color: '#f04f5a', border: '1.5px solid rgba(240,79,90,0.3)' },
    success:  { background: 'rgba(16,224,144,0.12)', color: '#10e090', border: '1.5px solid rgba(16,224,144,0.25)' },
    ghost:    { background: 'transparent', color: '#8899b0', border: '1.5px solid #1e2d45' },
    warning:  { background: 'rgba(245,197,24,0.12)', color: '#f5c518', border: '1.5px solid rgba(245,197,24,0.25)' },
  };
  return (
    <button
      type={type} onClick={onClick} disabled={loading || disabled}
      style={{ ...s.btnBase, ...variants[variant], opacity: (loading || disabled) ? 0.6 : 1, ...style }}
    >
      {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : children}
    </button>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#5a6a82', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>}
      <input
        {...props}
        style={{
          width: '100%', padding: '11px 14px',
          background: '#070b14', border: `1.5px solid ${error ? '#f04f5a' : '#1e2d45'}`,
          borderRadius: '10px', color: '#e8edf5', fontFamily: 'Sora,sans-serif', fontSize: '0.9rem',
          outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#4f8ef7'}
        onBlur={e => e.target.style.borderColor = error ? '#f04f5a' : '#1e2d45'}
      />
      {error && <p style={{ color: '#f04f5a', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#5a6a82', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>}
      <select
        {...props}
        style={{
          width: '100%', padding: '11px 14px',
          background: '#070b14', border: '1.5px solid #1e2d45',
          borderRadius: '10px', color: '#e8edf5', fontFamily: 'Sora,sans-serif', fontSize: '0.9rem',
          outline: 'none', cursor: 'pointer',
        }}
      >
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#5a6a82', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>}
      <textarea
        {...props}
        style={{
          width: '100%', padding: '11px 14px', minHeight: '90px', resize: 'vertical',
          background: '#070b14', border: '1.5px solid #1e2d45',
          borderRadius: '10px', color: '#e8edf5', fontFamily: 'Sora,sans-serif', fontSize: '0.9rem',
          outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = '#4f8ef7'}
        onBlur={e => e.target.style.borderColor = '#1e2d45'}
      />
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#111c2e', border: '1px solid #1e2d45', borderRadius: '16px',
      padding: '24px', ...style,
    }}>
      {children}
    </div>
  );
}

export function Badge({ children, type = 'default' }) {
  const colors = {
    default:  { bg: 'rgba(79,142,247,0.12)', color: '#4f8ef7', border: 'rgba(79,142,247,0.25)' },
    success:  { bg: 'rgba(16,224,144,0.12)', color: '#10e090', border: 'rgba(16,224,144,0.25)' },
    danger:   { bg: 'rgba(240,79,90,0.12)',  color: '#f04f5a', border: 'rgba(240,79,90,0.25)' },
    warning:  { bg: 'rgba(245,197,24,0.12)', color: '#f5c518', border: 'rgba(245,197,24,0.25)' },
    info:     { bg: 'rgba(6,214,199,0.12)',  color: '#06d6c7', border: 'rgba(6,214,199,0.25)' },
  };
  const c = colors[type] || colors.default;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem',
      fontWeight: 600, fontFamily: 'DM Mono,monospace', letterSpacing: '0.3px',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    APPLIED:   'default',
    APPROVED:  'success',
    REJECTED:  'danger',
    SCHEDULED: 'info',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  };
  return <Badge type={map[status] || 'default'}>{status}</Badge>;
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#111c2e', border: '1px solid #1e2d45', borderRadius: '20px',
        padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
        animation: 'fadeUp 0.25s ease',
      }}>
        {title && <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0', color: '#5a6a82' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{icon}</div>
      <p style={{ fontSize: '0.9rem' }}>{text}</p>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );
}
