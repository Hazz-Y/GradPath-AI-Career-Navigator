import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { api } from '../utils/api';
import AgentOrchestration from '../components/AgentOrchestration';
import './Quiz.css';

const BookIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 6H12M6 9H12M6 12H9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const WalletIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M12 9.5A0.5 0.5 0 1012 8.5A0.5 0.5 0 1012 9.5Z" fill="currentColor"/><path d="M2 7H16" stroke="currentColor" strokeWidth="1.1"/></svg>;
const ProfileIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 16C3 12.5 5.5 10 9 10C12.5 10 15 12.5 15 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
const TargetIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="9" cy="9" r="1" fill="currentColor"/></svg>;
const RocketIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 13 5 13 10C13 15 9 17 9 17C9 17 5 15 5 10C5 5 9 2 9 2Z" stroke="currentColor" strokeWidth="1.3"/><circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.1"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SparkleIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8 5H12L9 7.5L10 11.5L7 9L4 11.5L5 7.5L2 5H6L7 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>;

const STEP_ICONS = [<BookIcon />, <WalletIcon />, <ProfileIcon />, <TargetIcon />, <RocketIcon />];

const STEPS = [
  { id: 'academic', title: 'Academic Profile', fields: [
    { key: 'gpa', label: 'Current GPA / Percentage', type: 'number', placeholder: 'e.g. 8.5 (out of 10)', step: 0.1, min: 0, max: 10 },
    { key: 'gpaScale', label: 'GPA Scale', type: 'select', options: [{ value: 10, label: 'Out of 10' }, { value: 4, label: 'Out of 4.0' }] },
    { key: 'undergradTier', label: 'Undergraduate Institution Tier', type: 'select', options: [
      { value: 'tier1', label: 'Tier 1 (IITs, NITs, BITS, Top 50 globally)' }, { value: 'tier2', label: 'Tier 2 (Established state/private universities)' },
      { value: 'tier3', label: 'Tier 3 (Other recognized institutions)' }, { value: 'other', label: 'Other' }
    ]},
    { key: 'greScore', label: 'GRE Score (leave blank if not taken)', type: 'number', placeholder: 'e.g. 320', min: 260, max: 340 },
    { key: 'gmatScore', label: 'GMAT Score (leave blank if not taken)', type: 'number', placeholder: 'e.g. 710', min: 200, max: 800 },
    { key: 'ieltsScore', label: 'IELTS Score', type: 'number', placeholder: 'e.g. 7.5', step: 0.5, min: 0, max: 9 },
    { key: 'toeflScore', label: 'TOEFL Score (alternative)', type: 'number', placeholder: 'e.g. 105', min: 0, max: 120 },
  ]},
  { id: 'financial', title: 'Financial Readiness', fields: [
    { key: 'familyIncome', label: 'Annual Family Income (in Lakhs)', type: 'number', placeholder: 'e.g. 12', min: 0 },
    { key: 'hasCollateral', label: 'Collateral Available (Property/FD)', type: 'checkbox' },
    { key: 'hasSavings', label: 'Education Savings Fund Available', type: 'checkbox' },
    { key: 'cobilScore', label: 'Co-borrower CIBIL Score (approx)', type: 'number', placeholder: 'e.g. 750', min: 300, max: 900 },
    { key: 'scholarshipExpected', label: 'Expecting Scholarship / Aid', type: 'checkbox' },
  ]},
  { id: 'profile', title: 'Profile Strength', fields: [
    { key: 'hasResume', label: 'Resume / CV Updated', type: 'checkbox' },
    { key: 'hasSOP', label: 'Statement of Purpose Drafted', type: 'checkbox' },
    { key: 'hasLOR', label: 'Letters of Recommendation Secured', type: 'checkbox' },
    { key: 'lorCount', label: 'Number of LORs', type: 'number', placeholder: '0-3', min: 0, max: 5, condition: 'hasLOR' },
    { key: 'hasWorkExperience', label: 'Work Experience', type: 'checkbox' },
    { key: 'workYears', label: 'Years of Work Experience', type: 'number', placeholder: 'e.g. 2', min: 0, max: 20, condition: 'hasWorkExperience' },
    { key: 'hasResearch', label: 'Research Publications / Papers', type: 'checkbox' },
    { key: 'hasProjects', label: 'Notable Projects / Portfolio', type: 'checkbox' },
    { key: 'hasExtracurriculars', label: 'Strong Extracurriculars', type: 'checkbox' },
  ]},
  { id: 'targets', title: 'Your Targets', fields: [
    { key: 'targetCountries', label: 'Target Countries', type: 'multiselect', options: ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 'Switzerland', 'Netherlands', 'France', 'Sweden', 'India'] },
    { key: 'courseType', label: 'Degree Type', type: 'select', options: [{ value: 'ms', label: 'MS / M.Tech / Masters' }, { value: 'mba', label: 'MBA / PGP' }, { value: 'phd', label: 'PhD' }] },
    { key: 'intakeTimeline', label: 'Target Intake', type: 'select', options: [{ value: 'fall2025', label: 'Fall 2025' }, { value: 'spring2026', label: 'Spring 2026' }, { value: 'fall2026', label: 'Fall 2026' }, { value: 'spring2027', label: 'Spring 2027' }] },
    { key: 'budgetRange', label: 'Total Budget (in Lakhs)', type: 'number', placeholder: 'e.g. 40', min: 5 },
  ]},
  { id: 'progress', title: 'Application Progress', fields: [
    { key: 'testsTaken', label: 'Entrance Tests Taken (GRE/GMAT/IELTS)', type: 'checkbox' },
    { key: 'applicationsStarted', label: 'Started University Applications', type: 'checkbox' },
    { key: 'applicationsSubmitted', label: 'Applications Submitted', type: 'number', placeholder: '0', min: 0, max: 20 },
    { key: 'offersReceived', label: 'Offers Received', type: 'number', placeholder: '0', min: 0, max: 20 },
    { key: 'visaApplied', label: 'Visa Application Submitted', type: 'checkbox' },
  ]},
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ gpaScale: 10, targetCountries: [], courseType: 'ms' });
  const [loading, setLoading] = useState(false);
  const [showOrchestration, setShowOrchestration] = useState(false);
  const { setUserData, setDreamScore, dreamScore } = useContext(AppContext);
  const navigate = useNavigate();

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const updateField = (key, value) => { setFormData(prev => ({ ...prev, [key]: value })); };
  const toggleCountry = (country) => { setFormData(prev => { const c = prev.targetCountries || []; return { ...prev, targetCountries: c.includes(country) ? c.filter(x => x !== country) : [...c, country] }; }); };
  const handleNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await api.calculateDreamScore(formData);
      setUserData(formData); setDreamScore(result);
      localStorage.setItem('gradpath_user', JSON.stringify(formData));
      localStorage.setItem('gradpath_score', JSON.stringify(result));
      setShowOrchestration(true);
    } catch (error) { navigate('/dashboard'); }
    finally { setLoading(false); }
  };

  const renderField = (field) => {
    if (field.condition && !formData[field.condition]) return null;
    if (field.type === 'checkbox') return (
      <label className="checkbox-group quiz-checkbox" key={field.key}>
        <input type="checkbox" checked={!!formData[field.key]} onChange={e => updateField(field.key, e.target.checked)} />
        <span>{field.label}</span>
      </label>
    );
    if (field.type === 'select') return (
      <div className="input-group" key={field.key}><label>{field.label}</label>
        <select value={formData[field.key] || ''} onChange={e => updateField(field.key, e.target.value)}>
          <option value="">Select...</option>{field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    );
    if (field.type === 'multiselect') return (
      <div className="input-group" key={field.key}><label>{field.label}</label>
        <div className="multi-select-grid">{field.options.map(opt => (
          <button key={opt} type="button" className={`multi-select-chip ${(formData.targetCountries || []).includes(opt) ? 'selected' : ''}`} onClick={() => toggleCountry(opt)}>{opt}</button>
        ))}</div>
      </div>
    );
    return (
      <div className="input-group" key={field.key}><label>{field.label}</label>
        <input className="input" type="number" placeholder={field.placeholder} step={field.step || 1} min={field.min} max={field.max}
          value={formData[field.key] || ''} onChange={e => updateField(field.key, e.target.value ? parseFloat(e.target.value) : '')} />
      </div>
    );
  };

  return (
    <div className="page quiz-page">
      {showOrchestration && <AgentOrchestration dreamScore={dreamScore} onComplete={() => setShowOrchestration(false)} />}
      <div className="container">
        <div className="quiz-wrapper animate-fade-in">
          <div className="quiz-progress"><div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: `${progress}%` }} /></div><span className="quiz-progress-label">Step {currentStep + 1} of {STEPS.length}</span></div>
          <div className="quiz-step-indicators">
            {STEPS.map((s, i) => (
              <button key={s.id} className={`step-indicator ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`} onClick={() => i <= currentStep && setCurrentStep(i)}>
                <span className="step-indicator-icon">{i < currentStep ? <CheckIcon /> : STEP_ICONS[i]}</span>
                <span className="step-indicator-label">{s.title}</span>
              </button>
            ))}
          </div>
          <div className="quiz-form-card glass-strong animate-scale-in" key={currentStep}>
            <div className="quiz-step-header">
              <span className="quiz-step-icon">{STEP_ICONS[currentStep]}</span>
              <h2>{step.title}</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                {currentStep === 0 && 'Tell us about your academic background'}
                {currentStep === 1 && 'Help us assess your financial readiness'}
                {currentStep === 2 && 'How prepared is your application profile?'}
                {currentStep === 3 && 'Where do you want to study?'}
                {currentStep === 4 && "How far along are you in the process?"}
              </p>
            </div>
            <div className="quiz-fields">{step.fields.map(renderField)}</div>
            <div className="quiz-actions">
              {currentStep > 0 && <button className="btn btn-ghost" onClick={handleBack}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6H2M5 9L2 6L5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Back</button>}
              <div style={{ flex: 1 }} />
              {currentStep < STEPS.length - 1 ? (
                <button className="btn btn-primary" onClick={handleNext}>Next <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                  {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="spinner" /> Calculating...</span> : <><SparkleIcon /> Calculate My Dream Score</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
