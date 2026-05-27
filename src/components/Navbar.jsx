import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../App';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { dreamScore, streak } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L7 2L12 7V12H9V9H5V12H2V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
    { path: '/pathfinder', label: 'PathFinder', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5L7.5 7.5L5 9L6.5 6.5L9 5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg> },
    { path: '/loans', label: 'LoanOracle', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="1.5" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5H9M5 7.5H9M5 10H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { path: '/scorebooster', label: 'SOP Gen', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 11L7 3L10.5 11" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4.8 8.5H9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11.5 2L12 3L11.5 4L11 3L11.5 2Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/></svg> },
    { path: '/growth', label: 'GrowthEngine', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 7C5.5 7 4.5 5 3 5C1.5 5 1 6 1 7C1 8 1.5 9 3 9C4.5 9 5.5 7 5.5 7Z" stroke="currentColor" strokeWidth="1.2"/><path d="M8.5 7C8.5 7 9.5 5 11 5C12.5 5 13 6 13 7C13 8 12.5 9 11 9C9.5 9 8.5 7 8.5 7Z" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 7H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { path: '/roi', label: 'ROI Calc', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5 7.5L7.5 9.5L10.5 5.5L12.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11H12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4"/></svg> },
    { path: '/timeline', label: 'Timeline', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 1.5V3.5M9 1.5V3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M1.5 6H12.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.5"/></svg> },
  ];

  const StreakIcon = () => (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M6 1L2 7.5H5.5L4 13L10 6H6.5L8 1H6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M5.5 1L6.8 4.2H10.2L7.5 6.2L8.5 9.5L5.5 7.5L2.5 9.5L3.5 6.2L0.8 4.2H4.2L5.5 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );

  const MenuIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 5H15M3 9H15M3 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
          <div className="nav-logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5L13.5 4.75V11.25L8 14.5L2.5 11.25V4.75L8 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="nav-logo-text">
            <div className="nav-logo-name">GradPath</div>
            <div className="nav-logo-sub">AI</div>
          </div>
        </Link>

        <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
              >
                <span className="nav-link-icon">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-cta">
          {dreamScore && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginRight: '8px'
            }}>
              {streak > 0 && (
                <span style={{
                  fontSize: '0.82rem',
                  color: 'var(--gold)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <StreakIcon /> {streak}
                </span>
              )}
              <Link to="/dashboard" className="nav-score-pill">
                <StarIcon />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{dreamScore.totalScore}</span>
              </Link>
            </div>
          )}

          {!dreamScore ? (
            <Link to="/quiz" className="btn btn-primary btn-sm">
              Get Dream Score
            </Link>
          ) : (
            <Link to="/dashboard" className="btn btn-ghost btn-sm">
              Dashboard
            </Link>
          )}

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
}
