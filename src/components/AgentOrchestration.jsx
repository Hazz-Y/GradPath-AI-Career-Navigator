import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentOrchestration.css';

const CompassIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M11.5 6.5L9.5 9.5L6.5 11.5L8.5 8.5L11.5 6.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>;
const StarIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L11 7H16L12 10L13.5 15L9 12L4.5 15L6 10L2 7H7L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
const GemIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 7L9 2L14 7L9 16L4 7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4 7H14" stroke="currentColor" strokeWidth="1.1"/></svg>;
const InfinityIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 9C7 9 5.5 6.5 3.5 6.5C1.5 6.5 1 8 1 9C1 10 1.5 11.5 3.5 11.5C5.5 11.5 7 9 7 9Z" stroke="currentColor" strokeWidth="1.2"/><path d="M11 9C11 9 12.5 6.5 14.5 6.5C16.5 6.5 17 8 17 9C17 10 16.5 11.5 14.5 11.5C12.5 11.5 11 9 11 9Z" stroke="currentColor" strokeWidth="1.2"/><path d="M7 9H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const BoltIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L3 9H7.5L6 15L13 7H8.5L10 1H8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>;

const AGENTS = [
  { icon: <CompassIcon />, name: 'PathFinder', loading: 'Matching 55+ programs to your profile...', done: '12 universities matched', color: 'var(--teal)' },
  { icon: <StarIcon />, name: 'ScoreEngine', loading: 'Computing Dream Score across 5 pillars...', done: null, color: 'var(--gold)' },
  { icon: <GemIcon />, name: 'LoanOracle', loading: 'Pre-qualifying your loan eligibility...', done: 'Pre-qualified for 25L', color: 'var(--info)' },
  { icon: <InfinityIcon />, name: 'GrowthEngine', loading: 'Personalizing your engagement journey...', done: 'Your roadmap is ready', color: 'var(--violet)' },
];

export default function AgentOrchestration({ dreamScore, onComplete }) {
  const navigate = useNavigate();
  const [visibleAgents, setVisibleAgents] = useState([]);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [progress, setProgress] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    AGENTS.forEach((_, i) => {
      setTimeout(() => { setVisibleAgents(prev => [...prev, i]); }, i * 800);
      setTimeout(() => { setCompletedAgents(prev => [...prev, i]); }, i * 800 + 1200);
    });
    const progressInterval = setInterval(() => {
      setProgress(prev => { if (prev >= 100) { clearInterval(progressInterval); return 100; } return prev + 2.5; });
    }, 100);
    const doneTimer = setTimeout(() => { setAllDone(true); }, 4200);
    return () => { clearInterval(progressInterval); clearTimeout(doneTimer); };
  }, []);

  const getAgentDoneText = (agent, index) => {
    if (index === 1 && dreamScore) return `Dream Score: ${dreamScore.totalScore}`;
    return agent.done;
  };

  const handleContinue = () => { if (onComplete) onComplete(); navigate('/dashboard'); };

  return (
    <div className="agent-overlay">
      <div className="agent-container animate-fade-in">
        <h2 className="agent-title"><BoltIcon /> AI Agents at Work</h2>
        <p className="agent-subtitle">Preparing your personalized GradPath experience...</p>
        <div className="agent-cards">
          {AGENTS.map((agent, i) => {
            const isVisible = visibleAgents.includes(i);
            const isComplete = completedAgents.includes(i);
            return (
              <div key={i} className={`agent-card ${isVisible ? 'visible' : ''} ${isComplete ? 'complete' : ''}`} style={{ '--agent-color': agent.color }}>
                <span className="agent-card-icon">{agent.icon}</span>
                <div className="agent-card-content">
                  <span className="agent-card-name">{agent.name}</span>
                  <span className="agent-card-status">
                    {isComplete ? getAgentDoneText(agent, i) : agent.loading}
                  </span>
                </div>
                <div className="agent-card-indicator">
                  {isComplete ? (
                    <span className="agent-check"><CheckIcon /></span>
                  ) : isVisible ? (
                    <span className="agent-spinner" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="agent-progress-bar">
          <div className="agent-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        {allDone && (
          <button className="btn btn-primary btn-lg agent-continue animate-fade-in-up" onClick={handleContinue}>
            Your GradPath is ready
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
