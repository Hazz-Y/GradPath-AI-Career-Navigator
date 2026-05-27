import { useState, useContext } from 'react';
import { AppContext } from '../App';
import { fetchStream } from '../utils/api';
import './ScoreBooster.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const PenIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3L15 7L7 15H3V11L11 3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
const SparkleIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8 5H12L9 7.5L10 11.5L7 9L4 11.5L5 7.5L2 5H6L7 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>;
const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10 4V2.5A1.5 1.5 0 008.5 1H2.5A1.5 1.5 0 001 2.5V8.5A1.5 1.5 0 002.5 10H4" stroke="currentColor" strokeWidth="1.2"/></svg>;
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const NoteIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5H9M5 7.5H9M5 10H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const AlertIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M6 4.5V6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><circle cx="6" cy="8" r="0.5" fill="currentColor"/></svg>;
const LightbulbIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C3.8 1 2 2.8 2 5C2 6.7 3 8 4.5 8.5V10H7.5V8.5C9 8 10 6.7 10 5C10 2.8 8.2 1 6 1Z" stroke="currentColor" strokeWidth="1.1"/><path d="M4.5 11H7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>;
const BoltIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L3 7H5.5L4.5 11L9 5H6.5L7.5 1H6Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>;
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;

export default function ScoreBooster() {
  const { userData, dreamScore, setDreamScore } = useContext(AppContext);
  const [formData, setFormData] = useState({ studentName: '', targetUniversity: '', targetProgram: '', targetCountry: 'USA', undergraduateDegree: '', cgpa: '', workExperience: '', researchPapers: '', extracurriculars: '', careerGoal: '', whyThisProgram: '', uniqueAngle: '' });
  const [sopText, setSopText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [scoreBoostApplied, setScoreBoostApplied] = useState(false);

  const updateField = (key, value) => { setFormData(prev => ({ ...prev, [key]: value })); };

  const generateSOP = async () => {
    setSopText(''); setIsGenerating(true); setWordCount(0); setFeedback([]);
    try {
      const response = await fetchStream('/score-booster/sop', formData);
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let fullText = '';
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true }); const lines = buffer.split('\n'); buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') { setIsGenerating(false); break; }
            try { const parsed = JSON.parse(data); if (parsed.text) { fullText += parsed.text; setSopText(fullText); setWordCount(fullText.trim().split(/\s+/).filter(Boolean).length); } if (parsed.error) { setIsGenerating(false); break; } } catch { }
          }
        }
      }
      setIsGenerating(false);
    } catch (err) { setIsGenerating(false); }
  };

  const reviewSOP = async () => {
    const textToReview = showReview ? reviewText : sopText; if (!textToReview.trim()) return;
    setLoadingReview(true); setFeedback([]);
    try {
      const res = await fetch(`${API_BASE}/score-booster/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sopText: textToReview, targetUniversity: formData.targetUniversity, targetProgram: formData.targetProgram }) });
      const data = await res.json(); setFeedback(data.feedback || []);
    } catch (err) { /* handled silently */ }
    setLoadingReview(false);
  };

  const applyScoreBoost = () => { if (dreamScore && !scoreBoostApplied) { const updated = { ...dreamScore, totalScore: Math.min(1000, dreamScore.totalScore + 20) }; setDreamScore(updated); localStorage.setItem('gradpath_score', JSON.stringify(updated)); setScoreBoostApplied(true); } };
  const copyToClipboard = () => { navigator.clipboard.writeText(sopText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const impactColor = (impact) => { if (impact === 'high') return 'var(--error)'; if (impact === 'medium') return 'var(--gold)'; return 'var(--teal)'; };

  return (
    <div className="page scorebooster-page">
      <div className="container">
        <div className="sb-header animate-fade-in-up">
          <h1><PenIcon /> ScoreBooster — SOP Generator</h1>
          <p>Generate a professional Statement of Purpose with AI streaming. Complete an SOP to earn <strong style={{ color: 'var(--gold)' }}>+20 Dream Score</strong>.</p>
        </div>
        <div className="sb-layout animate-fade-in-up stagger-1">
          <div className="sb-form glass-strong">
            <h3>Your Details</h3>
            <div className="sb-form-grid">
              <div className="input-group"><label>Full Name</label><input className="input" placeholder="Your name" value={formData.studentName} onChange={e => updateField('studentName', e.target.value)} /></div>
              <div className="input-group"><label>Target University</label><input className="input" placeholder="e.g. MIT" value={formData.targetUniversity} onChange={e => updateField('targetUniversity', e.target.value)} /></div>
              <div className="input-group"><label>Target Program</label><input className="input" placeholder="e.g. MS Computer Science" value={formData.targetProgram} onChange={e => updateField('targetProgram', e.target.value)} /></div>
              <div className="input-group"><label>Target Country</label><select value={formData.targetCountry} onChange={e => updateField('targetCountry', e.target.value)}>{['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 'Netherlands', 'France', 'Sweden', 'India'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="input-group"><label>UG Degree</label><input className="input" placeholder="e.g. B.Tech CSE" value={formData.undergraduateDegree} onChange={e => updateField('undergraduateDegree', e.target.value)} /></div>
              <div className="input-group"><label>CGPA</label><input className="input" type="number" step="0.1" placeholder="e.g. 8.5" value={formData.cgpa} onChange={e => updateField('cgpa', e.target.value)} /></div>
            </div>
            <div className="input-group" style={{ marginTop: '12px' }}><label>Why This Program? (key reason)</label><textarea className="input sb-textarea" placeholder="What specifically attracts you to this program?" maxLength={500} value={formData.whyThisProgram} onChange={e => updateField('whyThisProgram', e.target.value)} /></div>
            <div className="input-group"><label>Career Goal</label><textarea className="input sb-textarea" placeholder="Your long-term career aspiration" maxLength={300} value={formData.careerGoal} onChange={e => updateField('careerGoal', e.target.value)} /></div>
            <div className="input-group"><label>Unique Angle / Achievement</label><textarea className="input sb-textarea" placeholder="What sets you apart? (optional)" maxLength={300} value={formData.uniqueAngle} onChange={e => updateField('uniqueAngle', e.target.value)} /></div>
            <div className="sb-form-actions">
              <button className="btn btn-primary btn-lg" onClick={generateSOP} disabled={isGenerating || !formData.targetUniversity}>{isGenerating ? <><span className="spinner" /> Generating...</> : <><SparkleIcon /> Generate SOP</>}</button>
              <button className="btn btn-ghost" onClick={() => setShowReview(!showReview)}>{showReview ? 'Hide Review' : <><NoteIcon /> Review My SOP</>}</button>
            </div>
          </div>
          <div className="sb-output">
            <div className="sb-output-card glass-strong">
              <div className="sb-output-header">
                <h3>Generated SOP</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {wordCount > 0 && <span className="tag tag-amber" style={{ fontSize: '0.75rem' }}>{wordCount} words</span>}
                  {isGenerating && <span className="tag tag-emerald" style={{ fontSize: '0.7rem', animation: 'pulse 1.5s infinite' }}><BoltIcon /> Streaming...</span>}
                </div>
              </div>
              <div className="sb-sop-content">
                {sopText ? (<div className="sb-sop-text">{sopText}{isGenerating && <span className="sb-cursor">|</span>}</div>) : (
                  <div className="sb-sop-placeholder"><PenIcon /><p>Your SOP will appear here as it's being generated, streaming in real-time.</p></div>
                )}
              </div>
              {sopText && !isGenerating && (
                <div className="sb-output-actions">
                  <button className="btn btn-primary btn-sm" onClick={copyToClipboard}>{copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy to Clipboard</>}</button>
                  <button className="btn btn-ghost btn-sm" onClick={reviewSOP} disabled={loadingReview}>{loadingReview ? <><span className="spinner" /> Reviewing...</> : <><SearchIcon /> Get AI Review</>}</button>
                  {!scoreBoostApplied && <button className="btn btn-amber btn-sm" onClick={applyScoreBoost}>+20 Score <SparkleIcon /></button>}
                  {scoreBoostApplied && <span className="tag tag-emerald" style={{ fontSize: '0.78rem' }}><CheckIcon /> +20 Score Applied</span>}
                </div>
              )}
            </div>
            {showReview && (
              <div className="sb-review-card glass-strong animate-fade-in">
                <h4><NoteIcon /> Paste Your Existing SOP for Review</h4>
                <textarea className="input sb-textarea-large" placeholder="Paste your existing SOP here..." value={reviewText} onChange={e => setReviewText(e.target.value)} />
                <button className="btn btn-primary" onClick={reviewSOP} disabled={loadingReview || !reviewText.trim()} style={{ marginTop: '12px' }}>{loadingReview ? <><span className="spinner" /> Analyzing...</> : <><SearchIcon /> Review This SOP</>}</button>
              </div>
            )}
            {feedback.length > 0 && (
              <div className="sb-feedback animate-fade-in">
                <h4 style={{ marginBottom: '12px' }}>AI Feedback</h4>
                {feedback.map((fb, i) => (
                  <div key={i} className="card sb-feedback-card" style={{ borderLeft: `3px solid ${impactColor(fb.impact)}` }}>
                    <div className="sb-feedback-header">
                      <span className="sb-feedback-issue"><AlertIcon /> {fb.issue}</span>
                      <span className="tag" style={{ fontSize: '0.7rem', background: `${impactColor(fb.impact)}20`, color: impactColor(fb.impact), border: `1px solid ${impactColor(fb.impact)}40` }}>{fb.impact}</span>
                    </div>
                    <p className="sb-feedback-fix"><LightbulbIcon /> {fb.fix}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
