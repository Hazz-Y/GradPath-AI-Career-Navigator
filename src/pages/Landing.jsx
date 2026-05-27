import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import './Landing.css';

const SparkleIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8 5H12L9 7.5L10 11.5L7 9L4 11.5L5 7.5L2 5H6L7 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>;
const CompassIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3"/><path d="M13 7L10.5 10.5L7 13L9.5 9.5L13 7Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>;
const DocIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const ChartIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 16L7 10L10 13L14 7L17 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 16H17" stroke="currentColor" strokeWidth="1" opacity="0.4"/></svg>;
const ClipboardIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="4" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 2H13V4H7V2Z" stroke="currentColor" strokeWidth="1.2"/><path d="M7 9H13M7 12H10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const TargetIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="10" r="1" fill="currentColor"/></svg>;
const BankIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 8L10 3L17 8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M5 8V15M10 8V15M15 8V15" stroke="currentColor" strokeWidth="1.2"/><path d="M3 15H17" stroke="currentColor" strokeWidth="1.3"/></svg>;
const RocketIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C10 2 14 5 14 10C14 15 10 18 10 18C10 18 6 15 6 10C6 5 10 2 10 2Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.1"/></svg>;

export default function Landing() {
  const { dreamScore, updateStreak } = useContext(AppContext);
  useEffect(() => { updateStreak(); }, []);

  const features = [
    { icon: <SparkleIcon />, title: 'Dream Score', desc: 'Get your personalized readiness score (0-1000) across 5 key pillars. Know exactly where you stand.', color: 'var(--gold)', link: '/quiz' },
    { icon: <CompassIcon />, title: 'PathFinder AI', desc: 'AI-powered university matching using cosine similarity. Find your perfect-fit programs worldwide.', color: 'var(--teal)', link: '/pathfinder' },
    { icon: <DocIcon />, title: 'LoanOracle', desc: 'Conversational AI loan advisor. Check eligibility, compare lenders, and plan your finances instantly.', color: 'var(--gold)', link: '/loans' },
    { icon: <ChartIcon />, title: 'ROI Calculator', desc: 'Predict salary outcomes vs education cost. See your break-even year and 10-year earnings projection.', color: 'var(--teal)', link: '/roi' },
  ];

  const stats = [
    { value: '55+', label: 'University Programs' },
    { value: '11', label: 'Countries Covered' },
    { value: '4', label: 'AI Agents' },
    { value: '0-1000', label: 'Dream Score Range' },
  ];

  return (
    <div className="page landing-page">
      <div className="landing-ambient">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <span className="tag tag-emerald"><SparkleIcon /> AI-Powered Education Platform</span>
            </div>
            <h1 className="hero-title animate-fade-in-up">
              Your Education Journey,
              <span className="hero-gradient-text"> Supercharged</span>
            </h1>
            <p className="hero-subtitle animate-fade-in-up stagger-1">
              From university discovery to loan approval — GradPath AI's 4 specialized agents
              guide every step. Get your Dream Score, find perfect-fit programs, and secure
              financing — all in one platform.
            </p>
            <div className="hero-actions animate-fade-in-up stagger-2">
              <Link to="/quiz" className="btn btn-primary btn-lg" id="hero-cta-primary">
                <SparkleIcon /> Get Your Dream Score
              </Link>
              <Link to="/pathfinder" className="btn btn-ghost btn-lg" id="hero-cta-secondary">
                Explore Universities
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            {dreamScore && (
              <div className="hero-score-preview animate-scale-in stagger-3">
                <div className="score-mini-ring" style={{ '--score-color': dreamScore.tier?.color }}>
                  <span className="score-mini-value">{dreamScore.totalScore}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your Dream Score</span>
                  <br />
                  <Link to="/dashboard" style={{ color: dreamScore.tier?.color, fontWeight: 600 }}>
                    {dreamScore.tier?.name} — View Dashboard
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 4, verticalAlign: 'middle' }}><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className={`stat animate-fade-in-up stagger-${i + 1}`}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <h2>4 AI Agents. One Unified Journey.</h2>
            <p>Each agent specializes in a critical part of your education path — working together to maximize your readiness.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <Link to={f.link} key={i} className={`feature-card card animate-fade-in-up stagger-${i + 1}`}>
                <div className="feature-icon" style={{ color: f.color }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-link" style={{ color: f.color }}>
                  Explore
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 4 }}><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <h2>From Exploration to Enrollment</h2>
            <p>The platform that nurtures you from Day 1 to Day Done.</p>
          </div>
          <div className="journey-steps">
            {[
              { step: '01', title: 'Take the Dream Score Quiz', desc: 'Answer questions about your academics, finances, and goals. Get your 0-1000 readiness score in seconds.', icon: <ClipboardIcon /> },
              { step: '02', title: 'Get AI University Matches', desc: 'PathFinder uses cosine similarity to match you with best-fit programs from 55+ universities across 11 countries.', icon: <TargetIcon /> },
              { step: '03', title: 'Check Loan Eligibility', desc: 'LoanOracle evaluates your profile against NBFC criteria and shows personalized loan offers with EMI breakdowns.', icon: <BankIcon /> },
              { step: '04', title: 'Plan, Apply, Go!', desc: 'Get your application timeline, improve your Dream Score, and seamlessly apply for education financing.', icon: <RocketIcon /> },
            ].map((s, i) => (
              <div key={i} className={`journey-step animate-fade-in-up stagger-${i + 1}`}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-card glass-strong animate-fade-in-up">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of students who've already discovered their Dream Score and found their path.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/quiz" className="btn btn-primary btn-lg">
                <SparkleIcon /> Take the Quiz — It's Free
              </Link>
              <Link to="/loans" className="btn btn-ghost btn-lg">
                Check Loan Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <span className="nav-logo-icon" style={{ width: '28px', height: '28px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L13.5 4.75V11.25L8 14.5L2.5 11.25V4.75L8 1.5Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>GradPath</span>
                <span style={{ color: 'var(--teal)', fontWeight: 600 }}>AI</span>
              </span>
              <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-muted)' }}>
                AI-powered education journey platform for Indian students.
              </p>
            </div>
            <div className="footer-links-group">
              <h5>Platform</h5>
              <Link to="/quiz">Dream Score</Link>
              <Link to="/pathfinder">PathFinder</Link>
              <Link to="/loans">LoanOracle</Link>
              <Link to="/roi">ROI Calculator</Link>
            </div>
            <div className="footer-links-group">
              <h5>Resources</h5>
              <Link to="/timeline">Timeline</Link>
              <a href="#">Blog</a>
              <a href="#">FAQ</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2025 GradPath AI — Built for TenzorX Hackathon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
