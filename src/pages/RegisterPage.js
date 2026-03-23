// ─────────────────────────────────────────
// FILE: src/pages/RegisterPage.js
// ─────────────────────────────────────────
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { Button, Input } from '../components/common/UI';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector(s => s.auth);
  const [role, setRole] = useState('USER');
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '', adminCode: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName || form.fullName.length < 3) e.fullName = 'Name must be at least 3 characters';
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!/^[^\s@]+@gmail\.com$/i.test(form.email)) e.email = 'Must be a valid @gmail.com address';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password))
      e.password = 'Min 8 chars with uppercase, lowercase & number';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (role === 'ADMIN' && form.adminCode !== 'admin123') e.adminCode = 'Invalid admin secret code';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    dispatch(registerUser({ ...form, role }));
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,199,0.07) 0%, transparent 70%)' }} />
      </div>

      <div className="fade-up" style={{ width: '100%', maxWidth: '440px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: '#5a6a82', fontSize: '0.85rem', marginTop: '6px' }}>Join Campus-TechHub</p>
        </div>

        <div style={{ background: '#111c2e', border: '1px solid #1e2d45', borderRadius: '20px', padding: '32px' }}>
          {/* Role tabs */}
          <div style={{ display: 'flex', background: '#070b14', borderRadius: '10px', padding: '4px', marginBottom: '24px', gap: '4px' }}>
            {['USER', 'ADMIN'].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: '9px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'Sora,sans-serif', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
                background: role === r ? '#111c2e' : 'transparent',
                color: role === r ? '#e8edf5' : '#5a6a82',
              }}>{r === 'USER' ? '👤 Student' : '🛡️ Admin'}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <Input label="Full Name" placeholder="Rahul Sharma" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} error={errors.fullName} />
            <Input label="Username" placeholder="rahul_sharma" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} error={errors.username} />
            <Input label="Email" type="email" placeholder="you@gmail.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Input label="Password" type="password" placeholder="Min 8 chars, A-Z, a-z, 0-9" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} error={errors.password} />
            <Input label="Confirm Password" type="password" placeholder="Re-enter password" value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} />
            {role === 'ADMIN' && (
              <Input label="Admin Secret Code" type="password" placeholder="Enter secret code" value={form.adminCode}
                onChange={e => setForm({ ...form, adminCode: e.target.value })} error={errors.adminCode} />
            )}
            <Button type="submit" loading={loading} style={{ width: '100%', padding: '13px', marginTop: '4px' }}>
              Create Account
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem', color: '#5a6a82' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f8ef7', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
