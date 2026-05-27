import { useRef } from 'react';
import './ShareableScoreCard.css';

const ShareIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8V14H14V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 2V10M5 5L8 2L11 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const GlobeIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1"/><path d="M1 6H11M6 1C4.5 3 4.5 9 6 11M6 1C7.5 3 7.5 9 6 11" stroke="currentColor" strokeWidth="0.9"/></svg>;

export default function ShareableScoreCard({ dreamScore, userData, onClose }) {
  const cardRef = useRef(null);
  if (!dreamScore) return null;

  const score = dreamScore.totalScore || 0;
  const breakdown = dreamScore.breakdown || {};
  const tier = dreamScore.tier || {};
  const targetCountry = userData?.targetCountries?.[0] || 'Abroad';
  const targetField = userData?.courseType === 'mba' ? 'MBA' : 'Masters';
  const pillars = Object.entries(breakdown).map(([key, val]) => ({ label: val.label || key, score: val.score || 0 }));

  const captureAndShare = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const card = cardRef.current; if (!card) return;
      const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#080D18', logging: false });
      if (navigator.share && navigator.canShare) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'gradpath-score.png', { type: 'image/png' });
          try { await navigator.share({ title: `My GradPath Dream Score: ${score}/1000`, text: `I scored ${score}/1000 on GradPath AI! Planning to study ${targetField} in ${targetCountry}. Check yours →`, files: [file] }); } catch { downloadCanvas(canvas); }
        });
      } else { downloadCanvas(canvas); }
    } catch (err) { /* handled silently */ }
  };

  const downloadCanvas = (canvas) => { const link = document.createElement('a'); link.download = `GradPath-Score-${score}.png`; link.href = canvas.toDataURL('image/png'); link.click(); };
  const getScoreBarColor = (s) => { if (s >= 700) return 'var(--teal)'; if (s >= 400) return 'var(--gold)'; return 'var(--error)'; };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3><ShareIcon /> Share Your Score</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="share-preview-wrapper">
          <div ref={cardRef} className="share-card-capture">
            <div className="share-card-inner">
              <div className="share-card-top">
                <span className="share-card-logo">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6, verticalAlign: 'middle' }}><path d="M8 1.5L13.5 4.75V11.25L8 14.5L2.5 11.25V4.75L8 1.5Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>
                  GradPath AI
                </span>
                <span className="share-card-tier">{tier.name}</span>
              </div>
              <div className="share-card-score-section">
                <span className="share-card-score" style={{ fontFamily: 'var(--font-display)' }}>{score}</span>
                <span className="share-card-max" style={{ fontFamily: 'var(--font-display)' }}>/ 1000</span>
              </div>
              <div className="share-card-pillars">
                {pillars.map((p, i) => (
                  <div key={i} className="share-pillar">
                    <div className="share-pillar-header"><span>{p.label}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{p.score}</span></div>
                    <div className="share-pillar-bar"><div className="share-pillar-fill" style={{ width: `${p.score / 10}%`, backgroundColor: getScoreBarColor(p.score) }} /></div>
                  </div>
                ))}
              </div>
              <div className="share-card-footer">
                <span><GlobeIcon /> Target: {targetField} in {targetCountry}</span>
                <span>gradpath-ai.vercel.app</span>
              </div>
            </div>
          </div>
        </div>
        <div className="share-modal-actions">
          <button className="btn btn-primary btn-lg" onClick={captureAndShare}><ShareIcon /> Download & Share</button>
        </div>
      </div>
    </div>
  );
}
