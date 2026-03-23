// ─────────────────────────────────────────
// FILE: src/components/common/Navbar.js
// ─────────────────────────────────────────
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Badge } from './UI';


export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px', borderBottom: '1px solid #1e2d45',
      background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src="./job-work-svgrepo-com.svg"
          style={{ width: '38px', height: '38px' }}
        />

        <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Campus<span style={{ color: '#4f8ef7' }}>-TechHub</span>
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ fontSize: '0.82rem', color: '#8899b0' }}>{user?.fullName}</span>
        <Badge type={user?.role === 'ADMIN' ? 'default' : 'success'}>
          {user?.role}
        </Badge>
        <button
          onClick={() => dispatch(logout())}
          style={{
            padding: '7px 16px', borderRadius: '8px', border: '1px solid #1e2d45',
            background: 'transparent', color: '#5a6a82', fontFamily: 'Sora,sans-serif',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.target.style.color = '#f04f5a'; e.target.style.borderColor = '#f04f5a'; }}
          onMouseOut={e => { e.target.style.color = '#5a6a82'; e.target.style.borderColor = '#1e2d45'; }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
