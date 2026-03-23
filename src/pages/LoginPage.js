// ─────────────────────────────────────────
// FILE: src/pages/LoginPage.js
// ─────────────────────────────────────────
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { Button, Input } from '../components/common/UI';
import svg from '../../src/components/common/job-work-svgrepo-com.svg'

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@gmail\.com$/i.test(form.email)) e.email = 'Must be a valid @gmail.com address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validate()) dispatch(loginUser(form));
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,199,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="fade-up" style={{ width: '100%', maxWidth: '420px', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
           <img
          src={svg}
          style={{ width: '38px', height: '38px' }}
        />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Welcome To TechZone</h1>
          <p style={{ color: '#5a6a82', fontSize: '0.85rem', marginTop: '6px' }}>Campus-TechHub</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#111c2e', border: '1px solid #1e2d45', borderRadius: '20px', padding: '36px',
        }}>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@gmail.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />

            <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: '#4f8ef7', cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>

            <Button type="submit" loading={loading} style={{ width: '100%', padding: '13px' }}>
              Sign In →
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem', color: '#5a6a82' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4f8ef7', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
