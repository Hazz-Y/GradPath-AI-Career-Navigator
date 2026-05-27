import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import './GrowthEngineRoom.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const PhoneIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3.5" y="1" width="7" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 11H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>;
const NoteIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5H9M5 7.5H9M5 10H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const GiftIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M2 6H12V8H2V6Z" stroke="currentColor" strokeWidth="1.1"/><path d="M7 6V12" stroke="currentColor" strokeWidth="1"/></svg>;
const BankIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 6L7 2L12 6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 6V11M7 6V11M10 6V11" stroke="currentColor" strokeWidth="1.1"/><path d="M2 11H12" stroke="currentColor" strokeWidth="1.2"/></svg>;
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const BoltIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L3 8H6.5L5 13L11 6H7.5L9 1H7Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>;
const ChartIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 7L7 9L10 5L12 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const GradIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 5L7 2L13 5L7 8L1 5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M10 6.5V10C10 10 8.5 11.5 7 11.5C5.5 11.5 4 10 4 10V6.5" stroke="currentColor" strokeWidth="1.1"/></svg>;
const WalletIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3.5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="7" r="0.8" fill="currentColor"/></svg>;
const MailIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 3L7 7.5L12.5 3" stroke="currentColor" strokeWidth="1.1"/></svg>;
const LinkIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 8L8 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M9 5L10.5 3.5A1.5 1.5 0 009 1.5L7.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 9L3.5 10.5A1.5 1.5 0 005 12.5L6.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 1V3M9 1V3M1.5 5.5H12.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const GearIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1V2.5M7 11.5V13M1 7H2.5M11.5 7H13M2.5 2.5L3.6 3.6M10.4 10.4L11.5 11.5M11.5 2.5L10.4 3.6M3.6 10.4L2.5 11.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 13C2 10 4 8.5 7 8.5C10 8.5 12 10 12 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const StarIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5H12.5L9 7.5L10 11.5L7 9L4 11.5L5 7.5L1.5 5H5.5L7 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>;
const GlobeIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M1 7H13M7 1C5 3.5 5 10.5 7 13M7 1C9 3.5 9 10.5 7 13" stroke="currentColor" strokeWidth="1"/></svg>;
const RefreshIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7C2 4.2 4.2 2 7 2C9.8 2 12 4.2 12 7C12 9.8 9.8 12 7 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M2 4V7H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const ICON_MAP = { phone: <PhoneIcon />, note: <NoteIcon />, gift: <GiftIcon />, bank: <BankIcon />, search: <SearchIcon />, bolt: <BoltIcon />, chart: <ChartIcon />, grad: <GradIcon />, wallet: <WalletIcon />, mail: <MailIcon />, link: <LinkIcon />, calendar: <CalendarIcon />, gear: <GearIcon />, check: <CheckIcon />, globe: <GlobeIcon /> };

const ACTION_TEMPLATES = [
  { iconKey: 'phone', text: 'WhatsApp nudge sent to {name} — "{msg}"' },
  { iconKey: 'note', text: 'Blog post auto-published — "{title}"' },
  { iconKey: 'gift', text: 'Referral reward triggered — {name} referred {name2}, both +25 Dream Score' },
  { iconKey: 'bank', text: 'Loan application auto-routed to {lender}' },
  { iconKey: 'search', text: 'New user acquired via SEO — "{query}" blog post' },
  { iconKey: 'bolt', text: 'Smart nudge sent — IELTS deadline reminder for {name}' },
  { iconKey: 'chart', text: 'Dream Score recalculated for {name} — {score}' },
  { iconKey: 'grad', text: 'PathFinder match updated — {name} now has 15 university matches' },
  { iconKey: 'wallet', text: 'EMI calculator engagement spike detected — pushed loan CTA to {count} users' },
  { iconKey: 'mail', text: 'Automated email campaign sent — "{subject}"' },
  { iconKey: 'link', text: 'Referral link clicked {count} times from Instagram bio' },
  { iconKey: 'calendar', text: 'Timeline deadline alert sent to {count} students — Application due in 7 days' },
  { iconKey: 'gear', text: 'GrowthEngine auto-generated 3 new blog outlines' },
  { iconKey: 'check', text: 'Document checklist reminder sent to {name} — 2 docs pending' },
  { iconKey: 'globe', text: 'Country preference shift detected — {count} more students choosing Canada over UK' },
];

const NAMES = ['Arjun S.', 'Priya P.', 'Rohit K.', 'Sneha I.', 'Vikram S.', 'Ananya N.', 'Karan M.', 'Divya R.'];
const LENDERS = ['HDFC Credila', 'Avanse Financial', 'Auxilo Finserve', 'ICICI Bank'];
const TITLES = ['Top 7 CS Programs in USA Under 50L', 'How to Get Education Loan Without Collateral', 'UK vs Canada: Which is Better for MBA?', 'GRE vs GMAT: The Ultimate Guide for 2025'];
const QUERIES = ['MS CS USA 2025 scholarship', 'education loan India low interest', 'best MBA colleges Canada for Indians', 'study abroad without IELTS'];
const SUBJECTS = ['Your Dream Score improved!', 'New scholarship alert', '3 universities match your profile', 'Application deadline in 14 days'];

function generateAction() {
  const template = ACTION_TEMPLATES[Math.floor(Math.random() * ACTION_TEMPLATES.length)];
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const name2 = NAMES[Math.floor(Math.random() * NAMES.length)];
  const lender = LENDERS[Math.floor(Math.random() * LENDERS.length)];
  const title = TITLES[Math.floor(Math.random() * TITLES.length)];
  const query = QUERIES[Math.floor(Math.random() * QUERIES.length)];
  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const score = Math.floor(550 + Math.random() * 400);
  const count = Math.floor(5 + Math.random() * 50);
  const msg = `Your IELTS deadline is in ${Math.floor(7 + Math.random() * 30)} days...`;
  let text = template.text.replace('{name}', name).replace('{name2}', name2).replace('{lender}', lender).replace('{title}', title).replace('{query}', query).replace('{subject}', subject).replace('{score}', score).replace('{count}', count).replace('{msg}', msg);
  return { iconKey: template.iconKey, text, time: 'Just now' };
}

export default function GrowthEngineRoom() {
  const [counters, setCounters] = useState({ users: 2847, scored: 2103, nudges: 8492, loanEnquiries: 1204, conversions: 347 });
  const [actions, setActions] = useState([
    { iconKey: 'phone', text: 'WhatsApp nudge sent to Arjun S. — "Your IELTS deadline is in 30 days..."', time: '2 min ago' },
    { iconKey: 'note', text: 'Blog post published — "Top 7 CS programs in USA under 50L"', time: '5 min ago' },
    { iconKey: 'gift', text: 'Referral reward triggered — Priya P. referred Rohit K., both +25 Dream Score', time: '8 min ago' },
    { iconKey: 'bank', text: 'Loan application auto-routed to HDFC Credila', time: '12 min ago' },
    { iconKey: 'search', text: 'New user acquired via SEO — "MS CS USA 2025 scholarship" blog post', time: '18 min ago' },
  ]);
  const [nudgeStage, setNudgeStage] = useState('Exploration');
  const [nudgeResult, setNudgeResult] = useState(null);
  const [loadingNudge, setLoadingNudge] = useState(false);
  const [blogResult, setBlogResult] = useState({ title: 'Top 5 Scholarships for Indian Students in USA 2025', summary: 'Discover fully-funded opportunities at Stanford, MIT, and Carnegie Mellon that many students overlook.' });
  const [loadingBlog, setLoadingBlog] = useState(false);

  useEffect(() => {
    const intervals = [
      setInterval(() => setCounters(p => ({ ...p, users: p.users + 1 })), 8000),
      setInterval(() => setCounters(p => ({ ...p, scored: p.scored + 1 })), 10000),
      setInterval(() => setCounters(p => ({ ...p, nudges: p.nudges + 1 })), 3000),
      setInterval(() => setCounters(p => ({ ...p, loanEnquiries: p.loanEnquiries + 1 })), 15000),
      setInterval(() => setCounters(p => ({ ...p, conversions: p.conversions + 1 })), 45000),
    ];
    return () => intervals.forEach(clearInterval);
  }, []);

  useEffect(() => { const interval = setInterval(() => { setActions(prev => [generateAction(), ...prev].slice(0, 8)); }, 12000); return () => clearInterval(interval); }, []);

  const generateNudge = async () => {
    setLoadingNudge(true); setNudgeResult(null);
    try { const res = await fetch(`${API_BASE}/growth/generate-content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'nudge', profile: { stage: nudgeStage.toLowerCase() } }) }); const data = await res.json(); setNudgeResult(data.message || 'Hey! Your GradPath journey awaits. Check your score today!'); }
    catch { setNudgeResult('Hey! Your GradPath journey awaits. Check your score today!'); }
    setLoadingNudge(false);
  };

  const generateBlog = async () => {
    setLoadingBlog(true);
    try { const res = await fetch(`${API_BASE}/growth/generate-content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'blog', profile: {} }) }); const data = await res.json(); setBlogResult({ title: data.title || 'Study Abroad Insights 2025', summary: data.preview || data.summary || '' }); }
    catch { setBlogResult({ title: 'Study Abroad Insights 2025', summary: 'An overview of the latest trends in international education.' }); }
    setLoadingBlog(false);
  };

  return (
    <div className="page growth-room-page">
      <div className="container">
        <div className="gr-header animate-fade-in-up">
          <div><h1><svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M7 11C7 11 5.5 8 3.5 8C1.5 8 1 9.5 1 11C1 12.5 1.5 14 3.5 14C5.5 14 7 11 7 11Z" stroke="currentColor" strokeWidth="1.3"/><path d="M15 11C15 11 16.5 8 18.5 8C20.5 8 21 9.5 21 11C21 12.5 20.5 14 18.5 14C16.5 14 15 11 15 11Z" stroke="currentColor" strokeWidth="1.3"/><path d="M7 11H15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> GrowthEngine Control Room</h1>
            <p>Zero-human intervention AI growth loop — autonomous acquisition, engagement, and conversion.</p></div>
          <div className="gr-live-badge"><span className="gr-live-dot" /> LIVE</div>
        </div>
        <div className="gr-metrics animate-fade-in-up stagger-1">
          {[
            { label: 'Users Acquired', value: counters.users, icon: <UserIcon /> },
            { label: 'Profiles Scored', value: counters.scored, icon: <StarIcon /> },
            { label: 'Nudges Sent', value: counters.nudges, icon: <PhoneIcon /> },
            { label: 'Loan Enquiries', value: counters.loanEnquiries, icon: <WalletIcon /> },
            { label: 'Conversions', value: counters.conversions, icon: <CheckIcon /> },
          ].map((m, i) => (
            <div key={i} className="gr-metric-card card">
              <span className="gr-metric-icon">{m.icon}</span>
              <span className="gr-metric-value" style={{ fontFamily: 'var(--font-mono)' }}>{m.value.toLocaleString()}</span>
              <span className="gr-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="gr-section animate-fade-in-up stagger-2">
          <h3><GearIcon /> Recent AI Actions</h3>
          <div className="gr-feed">
            {actions.map((action, i) => (
              <div key={i} className="gr-feed-item card" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="gr-feed-icon">{ICON_MAP[action.iconKey] || <BoltIcon />}</span>
                <span className="gr-feed-text">{action.text}</span>
                <span className="gr-feed-time">{action.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="gr-demo-grid animate-fade-in-up stagger-3">
          <div className="gr-demo-card glass-strong">
            <h4><PhoneIcon /> WhatsApp Nudge Simulator</h4>
            <div className="input-group" style={{ marginTop: '12px' }}><label>Journey Stage</label>
              <select value={nudgeStage} onChange={e => setNudgeStage(e.target.value)}><option value="Exploration">Exploration</option><option value="Application In Progress">Application In Progress</option><option value="Awaiting Visa">Awaiting Visa</option><option value="Loan Approved">Loan Approved</option></select>
            </div>
            <button className="btn btn-primary" onClick={generateNudge} disabled={loadingNudge} style={{ marginTop: '12px', width: '100%' }}>{loadingNudge ? <><span className="spinner" /> Generating...</> : <><BoltIcon /> Generate Nudge</>}</button>
            {nudgeResult && (<div className="gr-whatsapp-bubble animate-fade-in"><div className="gr-wa-header"><span className="gr-wa-name">GradPath AI</span><span className="gr-wa-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div><p className="gr-wa-text">{nudgeResult}</p><span className="gr-wa-ticks"><svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 5L4 8L9 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5L9 8L14 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></span></div>)}
          </div>
          <div className="gr-demo-card glass-strong">
            <h4><NoteIcon /> Latest Auto-Published Post</h4>
            <div className="gr-blog-card" style={{ marginTop: '16px' }}>
              {loadingBlog ? (<div className="gr-blog-shimmer"><div className="skeleton-line" style={{ width: '80%', height: '18px' }} /><div className="skeleton-line" style={{ width: '100%', height: '14px', marginTop: '12px' }} /><div className="skeleton-line" style={{ width: '60%', height: '14px' }} /></div>) : (
                <><h4 style={{ fontSize: '1rem', marginBottom: '8px', lineHeight: 1.4 }}>{blogResult.title}</h4><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{blogResult.summary}</p><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Published {new Date().toLocaleDateString()} · Auto-generated by GrowthEngine</span></>
              )}
            </div>
            <button className="btn btn-ghost" onClick={generateBlog} disabled={loadingBlog} style={{ marginTop: '12px', width: '100%' }}>{loadingBlog ? 'Generating...' : <><RefreshIcon /> Generate New Post</>}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
