import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { api } from '../utils/api';
import { animateValue, getScoreColor } from '../utils/helpers';
import ShareableScoreCard from '../components/ShareableScoreCard';
import ScoreLeaderboard from '../components/ScoreLeaderboard';
import './Dashboard.css';

const BoltIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L3 8H6.5L5 13L11 6H7.5L9 1H7Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
const CompassIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M10 6L8.5 8.5L6 10L7.5 7.5L10 6Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>;
const DocIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const ChartIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 13L5 8.5L8 11L11 6L14 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 1.5V3.5M11 1.5V3.5M2 6.5H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const PenIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L13 6L6 13H3V10L10 3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
const InfinityIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 8C5.5 8 4.5 6 3 6C1.5 6 1 7 1 8C1 9 1.5 10 3 10C4.5 10 5.5 8 5.5 8Z" stroke="currentColor" strokeWidth="1.2"/><path d="M10.5 8C10.5 8 11.5 6 13 6C14.5 6 15 7 15 8C15 9 14.5 10 13 10C11.5 10 10.5 8 10.5 8Z" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 8H10.5" stroke="currentColor" strokeWidth="1.2"/></svg>;
const ShareIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7V12H12V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 2V9M4 5L7 2L10 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10 4V2.5A1.5 1.5 0 008.5 1H2.5A1.5 1.5 0 001 2.5V8.5A1.5 1.5 0 002.5 10H4" stroke="currentColor" strokeWidth="1.2"/></svg>;
const GiftIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="7" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7H14V9H2V7Z" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7V14" stroke="currentColor" strokeWidth="1.1"/><path d="M8 7C8 7 6 5 5 4C4 3 5 2 6 3C7 4 8 7 8 7Z" stroke="currentColor" strokeWidth="1.1"/><path d="M8 7C8 7 10 5 11 4C12 3 11 2 10 3C9 4 8 7 8 7Z" stroke="currentColor" strokeWidth="1.1"/></svg>;
const GearIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 1V3M8 13V15M1 8H3M13 8H15M2.9 2.9L4.3 4.3M11.7 11.7L13.1 13.1M13.1 2.9L11.7 4.3M4.3 11.7L2.9 13.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const PhoneIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="1" width="8" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 11H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>;
const NoteIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5H9M5 7.5H9M5 10H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const LinkIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 8L8 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 5.5L10 4A2 2 0 0010 1L9 2A2 2 0 009 5L8.5 5.5Z" stroke="currentColor" strokeWidth="1.1"/><path d="M5.5 8.5L4 10A2 2 0 004 13L5 12A2 2 0 005 9L5.5 8.5Z" stroke="currentColor" strokeWidth="1.1"/></svg>;
const ClockIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3V6L8 7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const StreakIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L4 8H7.5L6 15L12 7H8.5L10 1H8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>;

export default function Dashboard() {
  const { userData, dreamScore, setDreamScore, setUserData, streak } = useContext(AppContext);
  const navigate = useNavigate();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [tips, setTips] = useState([]);
  const [growthContent, setGrowthContent] = useState([]);
  const [loadingGrowth, setLoadingGrowth] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!dreamScore) {
      const saved = localStorage.getItem('gradpath_score');
      const savedUser = localStorage.getItem('gradpath_user');
      if (saved && savedUser) { setDreamScore(JSON.parse(saved)); setUserData(JSON.parse(savedUser)); }
      else { navigate('/quiz'); return; }
    }
  }, []);

  useEffect(() => {
    if (dreamScore) { animateValue(0, dreamScore.totalScore, 2000, setAnimatedScore); setTips(dreamScore.tips || []); loadGrowthContent(); }
  }, [dreamScore]);

  const loadGrowthContent = async () => {
    setLoadingGrowth(true);
    try {
      const [nudge, blog, referral] = await Promise.all([
        api.generateContent('nudge', { stage: 'exploring' }), api.generateContent('blog', {}), api.generateContent('referral', {}),
      ]);
      setGrowthContent([nudge, blog, referral]);
    } catch (e) {
      setGrowthContent([
        { type: 'nudge', message: 'Your Dream Score is waiting — take 2 minutes to improve it today!' },
        { type: 'blog', title: '5 Hidden Costs of Studying Abroad', preview: 'When planning your budget, most students forget about health insurance and currency fluctuations...', readTime: '4 min' },
        { type: 'referral', title: 'Share & Earn', message: 'Invite friends and earn +50 Dream Score points!', code: 'GRADAI2025', reward: '+50 Points' },
      ]);
    }
    setLoadingGrowth(false);
  };

  if (!dreamScore) return null;

  const breakdown = dreamScore.breakdown;
  const scoreColor = getScoreColor(dreamScore.totalScore);
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (dreamScore.totalScore / 1000) * circumference;

  return (
    <div className="page dashboard-page">
      <div className="container">
        <div className="dash-header animate-fade-in-up">
          <div><h1>Your Dream Score</h1><p>Track your readiness across all 5 pillars and take action to improve.</p></div>
          {streak > 0 && (
            <div className="streak-badge">
              <span className="streak-fire"><StreakIcon /></span>
              <span className="streak-count">{streak}</span>
              <span className="streak-label">day streak</span>
            </div>
          )}
        </div>

        <div className="dash-score-hero animate-scale-in stagger-1">
          <div className="score-ring-container">
            <svg viewBox="0 0 200 200" className="score-ring-svg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--bg-surface)" strokeWidth="8" />
              <circle cx="100" cy="100" r="90" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="score-ring-progress" transform="rotate(-90 100 100)" />
            </svg>
            <div className="score-ring-center">
              <span className="score-ring-value" style={{ fontFamily: 'var(--font-display)' }}>{animatedScore}</span>
              <span className="score-ring-max" style={{ fontFamily: 'var(--font-display)' }}>/1000</span>
            </div>
          </div>
          <div className="score-tier-info">
            <div className="tier-badge" style={{ color: scoreColor }}>
              <span className="tier-name">{dreamScore.tier?.name}</span>
            </div>
            <p className="tier-desc">
              {dreamScore.totalScore >= 751 ? "Outstanding! You're well-prepared for top programs." :
               dreamScore.totalScore >= 551 ? "Great progress! A few improvements will make you unstoppable." :
               dreamScore.totalScore >= 301 ? "You're on your way! Focus on the tips below to level up." :
               "Just getting started — every journey begins with a single step!"}
            </p>
            <div className="tier-actions">
              <Link to="/pathfinder" className="btn btn-primary btn-sm">Find Universities <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
              <Link to="/loans" className="btn btn-ghost btn-sm">Check Loan Eligibility</Link>
              {dreamScore.totalScore > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowShare(true)} style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}><ShareIcon /> Share Score</button>
              )}
            </div>
          </div>
        </div>

        <div className="dash-section animate-fade-in-up stagger-2">
          <h3>Score Breakdown</h3>
          <div className="breakdown-grid">
            {Object.entries(breakdown).map(([key, pillar]) => (
              <div className="breakdown-card card" key={key}>
                <div className="breakdown-header">
                  <span className="breakdown-label">{pillar.label}</span>
                  <span className="breakdown-score" style={{ fontFamily: 'var(--font-mono)' }}>{pillar.score}<span style={{ color: 'var(--text-muted)' }}>/1000</span></span>
                </div>
                <div className="progress-bar" style={{ height: '3px' }}>
                  <div className="progress-bar-fill" style={{ width: `${pillar.score / 10}%`, background: pillar.score >= 700 ? 'var(--teal)' : pillar.score >= 400 ? 'var(--gold)' : 'var(--error)' }} />
                </div>
                <span className="breakdown-weight">Weight: {(pillar.weight * 100)}% · Contribution: {pillar.weighted} pts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-section animate-fade-in-up stagger-2" style={{ marginTop: 0 }}>
          <ScoreLeaderboard currentScore={dreamScore.totalScore} currentCountry={userData?.targetCountries?.[0]} />
        </div>

        {tips.length > 0 && (
          <div className="dash-section animate-fade-in-up stagger-3">
            <h3><BoltIcon /> ScoreBooster Tips</h3>
            <p style={{ marginBottom: '20px' }}>AI-recommended actions to improve your Dream Score:</p>
            <div className="tips-grid">
              {tips.map((tip, i) => (
                <div className="tip-card card" key={i}>
                  <div className="tip-impact" style={{ color: 'var(--teal)' }}>{tip.impact}</div>
                  <p className="tip-text">{tip.text}</p>
                  <span className="tag tag-emerald">{tip.pillar}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dash-section animate-fade-in-up stagger-4">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <Link to="/pathfinder" className="quick-action card"><span className="qa-icon"><CompassIcon /></span><span className="qa-title">Find Universities</span><span className="qa-desc">AI-matched recommendations</span></Link>
            <Link to="/loans" className="quick-action card"><span className="qa-icon"><DocIcon /></span><span className="qa-title">Loan Eligibility</span><span className="qa-desc">Check with LoanOracle</span></Link>
            <Link to="/roi" className="quick-action card"><span className="qa-icon"><ChartIcon /></span><span className="qa-title">ROI Calculator</span><span className="qa-desc">Cost vs earnings analysis</span></Link>
            <Link to="/timeline" className="quick-action card"><span className="qa-icon"><CalendarIcon /></span><span className="qa-title">Timeline</span><span className="qa-desc">Application schedule</span></Link>
            <Link to="/scorebooster" className="quick-action card"><span className="qa-icon"><PenIcon /></span><span className="qa-title">SOP Generator</span><span className="qa-desc">AI-powered writing</span></Link>
            <Link to="/growth" className="quick-action card"><span className="qa-icon"><InfinityIcon /></span><span className="qa-title">GrowthEngine</span><span className="qa-desc">AI control room</span></Link>
          </div>
        </div>

        <div className="dash-section animate-fade-in-up stagger-4" style={{ marginTop: 0 }}>
          <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h4 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GiftIcon /> Refer & Earn
                <span className="tag tag-amber" style={{ fontSize: '0.72rem' }}>+50 Score</span>
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Share GradPath AI with a friend — both of you earn <strong style={{ color: 'var(--teal)' }}>+50 Dream Score points</strong> when they complete their quiz!
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <code style={{ padding: '8px 18px', background: 'var(--glass-sm)', borderRadius: 'var(--r-md)', fontSize: '1rem', fontWeight: 700, color: 'var(--gold)', border: '1px solid var(--gold-border)', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
                GRAD{Math.random().toString(36).substring(2, 6).toUpperCase()}
              </code>
              <button className="btn btn-primary btn-sm" onClick={() => {
                const code = document.querySelector('.dash-section code');
                if (code) navigator.clipboard.writeText(code.textContent);
              }}>
                <CopyIcon /> Copy
              </button>
            </div>
          </div>
        </div>

        <div className="dash-section animate-fade-in-up stagger-5">
          <div className="growth-header">
            <h3><GearIcon /> GrowthEngine <span className="tag tag-amber" style={{ marginLeft: '8px' }}>AI Auto-Generated</span></h3>
            <p>Zero-human intervention content loop — all generated by AI agents in real time.</p>
          </div>
          <div className="growth-grid">
            {loadingGrowth ? (
              <><div className="card skeleton" style={{ height: '120px' }} /><div className="card skeleton" style={{ height: '120px' }} /><div className="card skeleton" style={{ height: '120px' }} /></>
            ) : (
              growthContent.map((item, i) => (
                <div className="growth-card card" key={i}>
                  {item.type === 'nudge' && (<><div className="growth-card-label"><PhoneIcon /> Smart Nudge (WhatsApp)</div><div className="nudge-bubble">{item.message}</div></>)}
                  {item.type === 'blog' && (<><div className="growth-card-label"><NoteIcon /> AI Blog Post</div><h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>{item.title}</h4><p style={{ fontSize: '0.85rem' }}>{item.preview}</p><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><ClockIcon /> {item.readTime} read</span></>)}
                  {item.type === 'referral' && (<><div className="growth-card-label"><LinkIcon /> Referral Engine</div><h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>{item.title}</h4><p style={{ fontSize: '0.85rem' }}>{item.message}</p><div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><code style={{ padding: '4px 12px', background: 'var(--glass-sm)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{item.code}</code><span className="tag tag-emerald">{item.reward}</span></div></>)}
                </div>
              ))
            )}
          </div>
        </div>

        {showShare && (
          <ShareableScoreCard dreamScore={dreamScore} userData={userData} onClose={() => setShowShare(false)} />
        )}
      </div>
    </div>
  );
}
