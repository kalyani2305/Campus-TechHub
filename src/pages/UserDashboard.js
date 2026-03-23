// ─────────────────────────────────────────
// FILE: src/pages/UserDashboard.js
// ─────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/common/Navbar';
import { Card, Button, Input, Select, Modal, Badge, StatusBadge, EmptyState, Spinner } from '../components/common/UI';
import { fetchJobs } from '../redux/slices/jobsSlice';
import { fetchMyApplications, applyForJob } from '../redux/slices/applicationsSlice';
import { fetchMyInterview } from '../redux/slices/interviewsSlice';
import { registerStudent } from '../redux/slices/studentsSlice';

const BRANCHES = ['Computer Science','Information Technology','Electronics','Mechanical','Civil','MBA','Commerce','Arts'];

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
      fontFamily: 'Sora,sans-serif', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
      background: active ? 'linear-gradient(135deg,#4f8ef7,#06d6c7)' : 'transparent',
      color: active ? '#fff' : '#5a6a82',
    }}>{children}</button>
  );
}

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { list: jobs, loading: jLoading } = useSelector(s => s.jobs);
  const { myList: myApps } = useSelector(s => s.applications);
  const { myInterview } = useSelector(s => s.interviews);

  const [tab, setTab] = useState('jobs');
  const [searchKw, setSearchKw] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const [registerModal, setRegisterModal] = useState(false);
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || null);
  const [regForm, setRegForm] = useState({ name: '', email: user?.email || '', branch: '', phone: '' });
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs(searchBranch || undefined));
  }, [dispatch, searchBranch]);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchMyApplications(studentId));
      dispatch(fetchMyInterview(studentId));
    }
  }, [dispatch, studentId]);

  const filteredJobs = jobs.filter(j =>
    (!searchKw || j.title.toLowerCase().includes(searchKw.toLowerCase()) || j.description?.toLowerCase().includes(searchKw.toLowerCase())) &&
    (!searchBranch || j.branch === searchBranch)
  );

  const validateReg = () => {
    const e = {};
    if (!regForm.name || regForm.name.length < 3) e.name = 'Min 3 characters';
    if (!/^[^\s@]+@gmail\.com$/i.test(regForm.email)) e.email = 'Valid @gmail.com required';
    if (!regForm.branch) e.branch = 'Select branch';
    if (!/^[6-9]\d{9}$/.test(regForm.phone)) e.phone = 'Valid 10-digit number';
    setRegErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitRegister = async () => {
    if (!validateReg()) return;
    setRegLoading(true);
    const result = await dispatch(registerStudent({ ...regForm, userId: null }));
    setRegLoading(false);
    if (result.payload?.id) {
      localStorage.setItem('studentId', result.payload.id);
      setStudentId(result.payload.id);
      setRegisterModal(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!studentId) { setRegisterModal(true); return; }
    await dispatch(applyForJob({ studentId: Number(studentId), jobPostingId: jobId }));
    dispatch(fetchMyApplications(studentId));
  };

  const isApplied = (jobId) => myApps.some(a => a.jobPosting?.id === jobId);
  const getAppStatus = (jobId) => myApps.find(a => a.jobPosting?.id === jobId)?.status;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Hey, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#5a6a82', fontSize: '0.88rem', marginTop: '4px' }}>Find your dream job through campus placements</p>
        </div>

        {/* Interview notification */}
        {myInterview && (
          <div className="fade-up" style={{
            background: 'linear-gradient(135deg,rgba(79,142,247,0.1),rgba(6,214,199,0.08))',
            border: '1.5px solid rgba(79,142,247,0.3)', borderRadius: '16px', padding: '20px', marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>🎉</span>
              <span style={{ fontWeight: 700, color: '#4f8ef7' }}>Interview Scheduled!</span>
            </div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>
              📅 {new Date(myInterview.scheduledAt).toLocaleString()}
            </div>
            <div style={{ color: '#8899b0', fontSize: '0.82rem' }}>
              Mode: {myInterview.mode} &nbsp;·&nbsp; {myInterview.locationOrLink}
            </div>
          </div>
        )}

        {/* Register student prompt */}
        {!studentId && (
          <div className="fade-up" style={{
            background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.2)',
            borderRadius: '12px', padding: '16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          }}>
            <p style={{ color: '#f5c518', fontSize: '0.85rem' }}>
              ⚡ Complete your student profile to apply for jobs
            </p>
            <Button onClick={() => setRegisterModal(true)} variant="warning">Register Profile</Button>
          </div>
        )}

        {/* Stats row */}
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { num: jobs.length, label: 'Available Jobs', color: '#4f8ef7' },
            { num: myApps.length, label: 'My Applications', color: '#06d6c7' },
            { num: myApps.filter(a => a.status === 'APPROVED').length, label: 'Approved', color: '#10e090' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#111c2e', border: '1px solid #1e2d45', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.num}</div>
              <div style={{ fontSize: '0.78rem', color: '#5a6a82', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="fade-up" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <Tab active={tab === 'jobs'}   onClick={() => setTab('jobs')}>🔍 Browse Jobs</Tab>
          <Tab active={tab === 'myapps'} onClick={() => setTab('myapps')}>📁 My Applications</Tab>
        </div>

        {/* ── JOBS TAB ── */}
        {tab === 'jobs' && (
          <Card className="fade-up">
            {/* Search */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                placeholder="Search by title or keyword..."
                value={searchKw}
                onChange={e => setSearchKw(e.target.value)}
                style={{
                  flex: 1, minWidth: '200px', padding: '10px 14px',
                  background: '#070b14', border: '1.5px solid #1e2d45', borderRadius: '10px',
                  color: '#e8edf5', fontFamily: 'Sora,sans-serif', fontSize: '0.88rem', outline: 'none',
                }}
              />
              <select
                value={searchBranch}
                onChange={e => setSearchBranch(e.target.value)}
                style={{
                  width: '200px', padding: '10px 14px',
                  background: '#070b14', border: '1.5px solid #1e2d45', borderRadius: '10px',
                  color: '#e8edf5', fontFamily: 'Sora,sans-serif', fontSize: '0.88rem', outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="">All Branches</option>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            {jLoading ? <Spinner /> : filteredJobs.length === 0 ? <EmptyState icon="🔭" text="No jobs found" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredJobs.map(j => (
                  <div key={j.id} style={{
                    background: '#0d1424', border: '1px solid #1e2d45', borderRadius: '14px', padding: '20px',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#4f8ef7'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#1e2d45'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: '4px' }}>{j.title}</div>
                      <div style={{ color: '#8899b0', fontSize: '0.8rem', marginBottom: '10px', lineHeight: 1.5 }}>
                        {j.description?.slice(0, 120)}...
                      </div>
                      <Badge type="warning">{j.branch}</Badge>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {isApplied(j.id)
                        ? <StatusBadge status={getAppStatus(j.id)} />
                        : <Button onClick={() => handleApply(j.id)}>Apply Now</Button>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ── MY APPLICATIONS TAB ── */}
        {tab === 'myapps' && (
          <Card className="fade-up">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>📁 My Applications</h2>
            {myApps.length === 0 ? <EmptyState icon="📭" text="You haven't applied to any jobs yet" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myApps.map(a => {
                  const interview = myInterview && myInterview.jobApplication?.id === a.id ? myInterview : null;
                  return (
                    <div key={a.id} style={{
                      background: '#0d1424', border: '1px solid #1e2d45', borderRadius: '14px', padding: '18px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.jobPosting?.title}</div>
                          <div style={{ color: '#8899b0', fontSize: '0.78rem', marginTop: '3px' }}>
                            Applied: {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : 'N/A'}
                          </div>
                          <Badge type="warning" style={{ marginTop: '6px' }}>{a.jobPosting?.branch}</Badge>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                      {interview && (
                        <div style={{
                          marginTop: '14px', padding: '14px',
                          background: 'linear-gradient(135deg,rgba(79,142,247,0.08),rgba(6,214,199,0.06))',
                          border: '1px solid rgba(79,142,247,0.2)', borderRadius: '10px',
                        }}>
                          <div style={{ color: '#4f8ef7', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                            🎉 Interview Scheduled
                          </div>
                          <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.9rem', fontWeight: 600 }}>
                            📅 {new Date(interview.scheduledAt).toLocaleString()}
                          </div>
                          <div style={{ color: '#8899b0', fontSize: '0.78rem', marginTop: '4px' }}>
                            {interview.mode} · {interview.locationOrLink}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* ── Register Student Modal ── */}
      <Modal open={registerModal} onClose={() => setRegisterModal(false)} title="🎓 Complete Your Profile">
        <p style={{ color: '#8899b0', fontSize: '0.82rem', marginBottom: '16px' }}>
          You need to register as a student before applying for jobs.
        </p>
        <Input label="Full Name" placeholder="Rahul Sharma" value={regForm.name}
          onChange={e => setRegForm({ ...regForm, name: e.target.value })} error={regErrors.name} />
        <Input label="Email" type="email" value={regForm.email}
          onChange={e => setRegForm({ ...regForm, email: e.target.value })} error={regErrors.email} />
        <Select label="Branch" value={regForm.branch} onChange={e => setRegForm({ ...regForm, branch: e.target.value })}>
          <option value="">-- Select Branch --</option>
          {BRANCHES.map(b => <option key={b}>{b}</option>)}
        </Select>
        {regErrors.branch && <p style={{ color: '#f04f5a', fontSize: '0.75rem', marginTop: '-12px', marginBottom: '12px' }}>{regErrors.branch}</p>}
        <Input label="Phone Number" placeholder="9876543210" value={regForm.phone}
          onChange={e => setRegForm({ ...regForm, phone: e.target.value })} error={regErrors.phone} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost" onClick={() => setRegisterModal(false)} style={{ flex: 1 }}>Cancel</Button>
          <Button onClick={submitRegister} loading={regLoading} style={{ flex: 1 }}>Register</Button>
        </div>
      </Modal>
    </div>
  );
}
