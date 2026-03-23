// ─────────────────────────────────────────
// FILE: src/pages/AdminDashboard.js
// ─────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/common/Navbar';
import { Card, Button, Input, Textarea, Select, Modal, Badge, StatusBadge, EmptyState, Spinner } from '../components/common/UI';
import { fetchJobs, createJob, deleteJob } from '../redux/slices/jobsSlice';
import { fetchAllApplications, updateApplicationStatus } from '../redux/slices/applicationsSlice';
import { fetchAllInterviews, scheduleInterview } from '../redux/slices/interviewsSlice';
import { fetchStudents } from '../redux/slices/studentsSlice';

const BRANCHES = ['Computer Science','Information Technology','Electronics','Mechanical','Civil','MBA','Commerce','Arts'];

// ── Stat card ────────────────────────────
function StatCard({ num, label, color = '#4f8ef7' }) {
  return (
    <div style={{
      background: '#111c2e', border: '1px solid #1e2d45', borderRadius: '16px', padding: '22px 20px',
      transition: 'transform 0.2s', cursor: 'default',
    }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{num}</div>
      <div style={{ fontSize: '0.8rem', color: '#5a6a82', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

// ── Tab button ───────────────────────────
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

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { list: jobs,  loading: jLoading } = useSelector(s => s.jobs);
  const { list: apps,  loading: aLoading } = useSelector(s => s.applications);
  const { list: intv,  loading: iLoading } = useSelector(s => s.interviews);
  const { list: students } = useSelector(s => s.students);

  const [tab, setTab] = useState('jobs');
  const [jobModal, setJobModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [jobForm, setJobForm] = useState({ title: '', branch: '', description: '' });
  const [jobErrors, setJobErrors] = useState({});
  const [schedForm, setSchedForm] = useState({ scheduledAt: '', mode: 'Online', locationOrLink: '' });
  const [schedErrors, setSchedErrors] = useState({});
  const [jLoading2, setJLoading2] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchAllApplications());
    dispatch(fetchAllInterviews());
    dispatch(fetchStudents());
  }, [dispatch]);

  // ── Submit job ──────────────────────────
  const validateJob = () => {
    const e = {};
    if (!jobForm.title || jobForm.title.length < 5) e.title = 'Min 5 characters';
    if (!jobForm.branch) e.branch = 'Select a branch';
    if (!jobForm.description || jobForm.description.length < 20) e.description = 'Min 20 characters';
    setJobErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitJob = async () => {
    if (!validateJob()) return;
    setJLoading2(true);
    await dispatch(createJob(jobForm));
    setJLoading2(false);
    setJobModal(false);
    setJobForm({ title: '', branch: '', description: '' });
  };

  // ── Submit interview ────────────────────
  const validateSched = () => {
    const e = {};
    if (!schedForm.scheduledAt) e.scheduledAt = 'Select a future date & time';
    else if (new Date(schedForm.scheduledAt) <= new Date()) e.scheduledAt = 'Must be a future date';
    if (!schedForm.locationOrLink) e.locationOrLink = 'Required';
    setSchedErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitSchedule = async () => {
    if (!validateSched()) return;
    await dispatch(scheduleInterview({
      jobApplicationId: selectedApp.id,
      scheduledAt: schedForm.scheduledAt,
      mode: schedForm.mode,
      locationOrLink: schedForm.locationOrLink,
    }));
    setScheduleModal(false);
    setSchedForm({ scheduledAt: '', mode: 'Online', locationOrLink: '' });
    dispatch(fetchAllInterviews());
  };

  const approvedWithoutInterview = apps.filter(a =>
    a.status === 'APPROVED' && !intv.find(i => i.jobApplication?.id === a.id)
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
          <p style={{ color: '#5a6a82', fontSize: '0.88rem', marginTop: '4px' }}>Manage jobs, applications & interviews</p>
        </div>

        {/* Stats */}
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px', marginBottom: '28px' }}>
          <StatCard num={jobs.length}     label="Job Postings"  color="#4f8ef7" />
          <StatCard num={apps.length}     label="Applications"  color="#06d6c7" />
          <StatCard num={apps.filter(a => a.status === 'APPROVED').length} label="Approved" color="#10e090" />
          <StatCard num={intv.length}     label="Interviews"    color="#f5c518" />
          <StatCard num={students.length} label="Students"      color="#8899b0" />
        </div>

        {/* Tabs */}
        <div className="fade-up" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <Tab active={tab === 'jobs'}     onClick={() => setTab('jobs')}>📋 Job Postings</Tab>
          <Tab active={tab === 'approvals'} onClick={() => setTab('approvals')}>✅ Applications</Tab>
          <Tab active={tab === 'interviews'} onClick={() => setTab('interviews')}>📅 Interviews</Tab>
          <Tab active={tab === 'students'} onClick={() => setTab('students')}>👥 Students</Tab>
        </div>

        {/* ── JOBS TAB ── */}
        {tab === 'jobs' && (
          <Card className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📋 Job Postings</h2>
              <Button onClick={() => setJobModal(true)}>+ Add Job</Button>
            </div>
            {jLoading ? <Spinner /> : jobs.length === 0 ? <EmptyState icon="📭" text="No jobs posted yet" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {jobs.map(j => (
                  <div key={j.id} style={{
                    background: '#0d1424', border: '1px solid #1e2d45', borderRadius: '12px', padding: '18px',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{j.title}</div>
                      <div style={{ color: '#8899b0', fontSize: '0.8rem', margin: '4px 0 8px' }}>{j.description?.slice(0,100)}...</div>
                      <Badge type="warning">{j.branch}</Badge>
                    </div>
                    <Button variant="danger" onClick={() => dispatch(deleteJob(j.id))} style={{ flexShrink: 0 }}>Delete</Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ── APPLICATIONS TAB ── */}
        {tab === 'approvals' && (
          <Card className="fade-up">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>✅ Applications Review</h2>
            {aLoading ? <Spinner /> : apps.length === 0 ? <EmptyState icon="📬" text="No applications yet" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {apps.map(a => (
                  <div key={a.id} style={{
                    background: '#0d1424', border: '1px solid #1e2d45', borderRadius: '12px', padding: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{a.student?.name || 'Student'}</div>
                      <div style={{ color: '#8899b0', fontSize: '0.78rem', marginTop: '2px' }}>
                        {a.jobPosting?.title} · {a.student?.email}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <StatusBadge status={a.status} />
                      {a.status === 'APPLIED' && (
                        <>
                          <Button variant="success" onClick={() => dispatch(updateApplicationStatus({ id: a.id, status: 'APPROVED' }))}>Approve</Button>
                          <Button variant="danger"  onClick={() => dispatch(updateApplicationStatus({ id: a.id, status: 'REJECTED' }))}>Reject</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ── INTERVIEWS TAB ── */}
        {tab === 'interviews' && (
          <Card className="fade-up">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>📅 Schedule Interviews</h2>
            {approvedWithoutInterview.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#f5c518', fontSize: '0.82rem', marginBottom: '12px' }}>⚡ Approved applications awaiting interview scheduling:</p>
                {approvedWithoutInterview.map(a => (
                  <div key={a.id} style={{
                    background: '#0d1424', border: '1px solid rgba(245,197,24,0.2)', borderRadius: '12px', padding: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.student?.name}</div>
                      <div style={{ color: '#8899b0', fontSize: '0.78rem' }}>{a.jobPosting?.title}</div>
                    </div>
                    <Button onClick={() => { setSelectedApp(a); setScheduleModal(true); }}>Schedule</Button>
                  </div>
                ))}
              </div>
            )}
            <p style={{ color: '#5a6a82', fontSize: '0.82rem', marginBottom: '12px' }}>Scheduled interviews:</p>
            {iLoading ? <Spinner /> : intv.length === 0 ? <EmptyState icon="🗓️" text="No interviews scheduled yet" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {intv.map(i => (
                  <div key={i.id} style={{
                    background: '#0d1424', border: '1px solid #1e2d45', borderRadius: '12px', padding: '16px',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{i.jobApplication?.student?.name}</div>
                    <div style={{ color: '#8899b0', fontSize: '0.78rem', margin: '3px 0' }}>{i.jobApplication?.jobPosting?.title}</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <Badge type="info">📅 {new Date(i.scheduledAt).toLocaleString()}</Badge>
                      <Badge type="default">{i.mode}</Badge>
                      <Badge type="success">{i.status}</Badge>
                    </div>
                    <div style={{ color: '#8899b0', fontSize: '0.78rem', marginTop: '6px' }}>📍 {i.locationOrLink}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ── STUDENTS TAB ── */}
        {tab === 'students' && (
          <Card className="fade-up">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>👥 Registered Students</h2>
            {students.length === 0 ? <EmptyState icon="🎓" text="No students registered yet" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {students.map(s => (
                  <div key={s.id} style={{
                    background: '#0d1424', border: '1px solid #1e2d45', borderRadius: '12px', padding: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                      <div style={{ color: '#8899b0', fontSize: '0.78rem' }}>{s.email} · {s.branch}</div>
                    </div>
                    <Badge type="warning">{s.branch}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* ── Add Job Modal ── */}
      <Modal open={jobModal} onClose={() => setJobModal(false)} title="📋 Add New Job Posting">
        <Input label="Job Title" placeholder="e.g. Software Engineer Intern"
          value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} error={jobErrors.title} />
        <Select label="Branch" value={jobForm.branch} onChange={e => setJobForm({ ...jobForm, branch: e.target.value })}>
          <option value="">-- Select Branch --</option>
          {BRANCHES.map(b => <option key={b}>{b}</option>)}
        </Select>
        {jobErrors.branch && <p style={{ color: '#f04f5a', fontSize: '0.75rem', marginTop: '-12px', marginBottom: '12px' }}>{jobErrors.branch}</p>}
        <Textarea label="Description" placeholder="Describe the role..." rows={4}
          value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} />
        {jobErrors.description && <p style={{ color: '#f04f5a', fontSize: '0.75rem', marginTop: '-12px', marginBottom: '12px' }}>{jobErrors.description}</p>}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <Button variant="ghost" onClick={() => setJobModal(false)} style={{ flex: 1 }}>Cancel</Button>
          <Button onClick={submitJob} loading={jLoading2} style={{ flex: 1 }}>Post Job</Button>
        </div>
      </Modal>

      {/* ── Schedule Interview Modal ── */}
      <Modal open={scheduleModal} onClose={() => setScheduleModal(false)} title="📅 Schedule Interview">
        <p style={{ color: '#8899b0', fontSize: '0.85rem', marginBottom: '16px' }}>
          Applicant: <strong style={{ color: '#e8edf5' }}>{selectedApp?.student?.name}</strong>
        </p>
        <Input label="Date & Time" type="datetime-local"
          value={schedForm.scheduledAt} onChange={e => setSchedForm({ ...schedForm, scheduledAt: e.target.value })} error={schedErrors.scheduledAt} />
        <Select label="Interview Mode" value={schedForm.mode} onChange={e => setSchedForm({ ...schedForm, mode: e.target.value })}>
          <option>Online</option>
          <option>In-Person</option>
          <option>Phone Call</option>
        </Select>
        <Input label="Location / Meeting Link" placeholder="https://meet.google.com/... or office address"
          value={schedForm.locationOrLink} onChange={e => setSchedForm({ ...schedForm, locationOrLink: e.target.value })} error={schedErrors.locationOrLink} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <Button variant="ghost" onClick={() => setScheduleModal(false)} style={{ flex: 1 }}>Cancel</Button>
          <Button onClick={submitSchedule} style={{ flex: 1 }}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}
