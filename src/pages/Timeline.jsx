import { useState } from 'react';
import { api } from '../utils/api';
import './Timeline.css';

const PRIORITY_COLORS = { high: 'var(--error)', medium: 'var(--gold)', low: 'var(--teal)' };

const NoteIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5H9M5 7.5H9M5 10H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const ClipboardIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="3" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 1.5H9V3H5V1.5Z" stroke="currentColor" strokeWidth="1.1"/></svg>;
const WalletIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3.5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="7" r="0.8" fill="currentColor"/></svg>;
const PlaneIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 8L13 2L10 12L7 8.5L1 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 8.5V12" stroke="currentColor" strokeWidth="1.1"/></svg>;
const PackIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 4V2.5A2 2 0 019 2.5V4" stroke="currentColor" strokeWidth="1.2"/></svg>;
const PinIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 9V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const CalendarIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M6 1.5V4M12 1.5V4M2 7.5H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;

const CATEGORY_ICONS = { test: <NoteIcon />, application: <ClipboardIcon />, financial: <WalletIcon />, visa: <PlaneIcon />, prep: <PackIcon /> };

export default function Timeline() {
  const [params, setParams] = useState({ intake: 'Fall 2026', country: 'USA', universities: [] });
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const generate = async () => { setLoading(true); try { const data = await api.generateTimeline(params); setTimeline(data.timeline); } catch (e) { /* handled silently */ } setLoading(false); };
  const toggleTask = (monthIdx, taskIdx) => { const key = `${monthIdx}-${taskIdx}`; setCompletedTasks(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; }); };
  const totalTasks = timeline ? timeline.reduce((sum, m) => sum + m.tasks.length, 0) : 0;
  const completedCount = completedTasks.size;

  return (
    <div className="page timeline-page">
      <div className="container">
        <div className="tl-header animate-fade-in-up">
          <h1><CalendarIcon /> Application Timeline</h1>
          <p>AI-generated month-by-month roadmap tailored to your target intake. Track milestones and stay on schedule.</p>
        </div>
        {!timeline && (
          <div className="tl-setup glass-strong animate-fade-in-up stagger-1">
            <h3>Generate Your Timeline</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group"><label>Target Intake</label><select value={params.intake} onChange={e => setParams(p => ({ ...p, intake: e.target.value }))}><option>Fall 2025</option><option>Spring 2026</option><option>Fall 2026</option><option>Spring 2027</option></select></div>
              <div className="input-group"><label>Target Country</label><select value={params.country} onChange={e => setParams(p => ({ ...p, country: e.target.value }))}>{['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={generate} disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
              {loading ? <><span className="spinner" /> Generating with AI...</> : <><CalendarIcon /> Generate Timeline</>}
            </button>
          </div>
        )}
        {timeline && (
          <div className="tl-content animate-fade-in-up">
            <div className="tl-progress-bar-container">
              <div className="tl-progress-info"><span>{completedCount} of {totalTasks} tasks completed</span><span style={{ fontFamily: 'var(--font-mono)' }}>{totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}%</span></div>
              <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }} /></div>
            </div>
            <div className="tl-timeline">
              {timeline.map((month, mIdx) => (
                <div key={mIdx} className="tl-month animate-fade-in-up" style={{ animationDelay: `${mIdx * 0.08}s` }}>
                  <div className="tl-month-marker"><div className="tl-month-dot" /><div className="tl-month-line" /></div>
                  <div className="tl-month-content">
                    <h4 className="tl-month-label">{month.month}</h4>
                    <div className="tl-tasks">
                      {month.tasks.map((task, tIdx) => {
                        const key = `${mIdx}-${tIdx}`;
                        const done = completedTasks.has(key);
                        return (
                          <div key={tIdx} className={`tl-task card ${done ? 'completed' : ''}`} onClick={() => toggleTask(mIdx, tIdx)}>
                            <div className="tl-task-check"><input type="checkbox" checked={done} readOnly /></div>
                            <div className="tl-task-body">
                              <div className="tl-task-title">
                                <span>{CATEGORY_ICONS[task.category] || <PinIcon />}</span>
                                <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{task.title}</span>
                              </div>
                              <p className="tl-task-desc">{task.description}</p>
                              <div className="tl-task-meta">
                                <span className="tl-priority-dot" style={{ background: PRIORITY_COLORS[task.priority] || 'var(--text-muted)' }} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{task.priority} priority</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" onClick={() => { setTimeline(null); setCompletedTasks(new Set()); }} style={{ marginTop: '32px' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6H2M5 9L2 6L5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Regenerate Timeline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
