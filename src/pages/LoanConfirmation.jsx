import { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { api } from '../utils/api';
import './LoanConfirmation.css';

const DocIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 5.5H10.5M5.5 8H10.5M5.5 10.5H8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
const CopyIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M8.5 3.5V2A1 1 0 007.5 1H2A1 1 0 001 2V7.5A1 1 0 002 8.5H3.5" stroke="currentColor" strokeWidth="1.1"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 4V7L9 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const UploadIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 10V13H14V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 3V10M5 6L8 3L11 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PhoneIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 1.5H6L7.5 5L5.5 6.5C6.5 8.5 7.5 9.5 9.5 10.5L11 8.5L14.5 10V12.5C14.5 13.5 13.5 14.5 12.5 14.5C7 14 2 9 1.5 3.5C1.5 2.5 2.5 1.5 3.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
const MailIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 3L8 8.5L14.5 3" stroke="currentColor" strokeWidth="1.2"/></svg>;
const BankIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 7L8 3L14 7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M4 7V12M8 7V12M12 7V12" stroke="currentColor" strokeWidth="1.2"/><path d="M2 12H14" stroke="currentColor" strokeWidth="1.3"/></svg>;
const DownloadIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 9V12H12V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 2V9M4 6.5L7 9.5L10 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PinIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 2L10 2L11 6L8 8V11L7 13L6 11V8L3 6L4 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>;

export default function LoanConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dreamScore, setDreamScore, userData } = useContext(AppContext);
  const [showCheck, setShowCheck] = useState(false);
  const [scoreUpdated, setScoreUpdated] = useState(false);
  const applicationData = location.state;

  useEffect(() => { if (!applicationData) { navigate('/loans'); return; } const timer = setTimeout(() => setShowCheck(true), 300); return () => clearTimeout(timer); }, []);

  const applicationId = applicationData?.applicationId || (() => { const year = new Date().getFullYear(); const rand = Math.floor(100000 + Math.random() * 900000); return `GPA-${year}-${rand}`; })();

  const handleReturnDashboard = async () => {
    if (userData && dreamScore && !scoreUpdated) {
      try {
        const updatedData = { ...userData, applicationsSubmitted: (userData.applicationsSubmitted || 0) + 1 };
        const result = await api.calculateDreamScore(updatedData);
        if (result) { result.totalScore = Math.min(1000, (result.totalScore || dreamScore.totalScore) + 15); setDreamScore(result); localStorage.setItem('gradpath_score', JSON.stringify(result)); localStorage.setItem('gradpath_user', JSON.stringify(updatedData)); setScoreUpdated(true); }
      } catch (e) { /* non-critical */ }
    }
    navigate('/dashboard');
  };

  const downloadChecklist = () => {
    const checklist = `
GradPath AI — Document Checklist
Application ID: ${applicationId}
Generated: ${new Date().toLocaleDateString()}
================================================

IDENTITY DOCUMENTS
  [ ] Aadhaar Card
  [ ] PAN Card
  [ ] Passport (valid for 18+ months)

ACADEMIC DOCUMENTS
  [ ] 10th Marksheet
  [ ] 12th Marksheet
  [ ] UG Transcripts (all semesters)
  [ ] Degree Certificate
  [ ] GRE/GMAT Score Report
  [ ] IELTS/TOEFL Score Report

ADMISSION DOCUMENTS
  [ ] University Offer Letter
  [ ] I-20 / CAS Letter
  [ ] Fee Structure from University

FINANCIAL — STUDENT
  [ ] Bank Statements (last 6 months)
  [ ] Scholarship Letter (if applicable)

FINANCIAL — CO-APPLICANT
  [ ] Income Tax Returns (last 2 years)
  [ ] Salary Slips (last 3 months)
  [ ] Bank Statements (last 6 months)
  [ ] Property Documents (if collateral)

OTHERS
  [ ] Passport-size Photographs (6 copies)
  [ ] Loan Application Form (signed)

================================================
Note: Keep original + 2 photocopies of each.
Processing time: 3-5 business days.
`.trim();
    const blob = new Blob([checklist], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `GradPath-Checklist-${applicationId}.txt`;
    link.href = url; link.click(); URL.revokeObjectURL(url);
  };

  if (!applicationData) return null;

  const nextSteps = [
    { icon: <UploadIcon />, title: 'Upload Documents', desc: 'Submit KYC, admission letter, and financial proofs' },
    { icon: <PhoneIcon />, title: 'Co-applicant Verification', desc: 'Verification call scheduled within 24 hours' },
    { icon: <MailIcon />, title: 'Loan Agreement', desc: 'Agreement sent to your registered email' },
    { icon: <BankIcon />, title: 'Disbursement', desc: 'Funds disbursed to university within 7 days of approval' },
  ];

  return (
    <div className="page confirmation-page">
      <div className="container">
        <div className="confirmation-wrapper animate-fade-in-up">
          <div className={`confirm-check-container ${showCheck ? 'visible' : ''}`}>
            <div className="confirm-check-ring">
              <svg viewBox="0 0 52 52" className="confirm-check-svg"><circle cx="26" cy="26" r="25" fill="none" className="confirm-check-circle" /><path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="confirm-check-path" /></svg>
            </div>
          </div>
          <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Application Submitted!</h1>
          <p style={{ textAlign: 'center', maxWidth: '100%', marginBottom: '24px' }}>Your loan application has been received and is being processed.</p>
          <div className="confirm-id-badge glass-strong">
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Application ID</span>
            <span className="confirm-id-value" style={{ fontFamily: 'var(--font-mono)' }}>{applicationId}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(applicationId)} style={{ fontSize: '0.75rem' }}><CopyIcon /> Copy</button>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><ClockIcon /> Expected Processing Time: <strong style={{ color: 'var(--gold)' }}>3-5 business days</strong></span>
          </div>
          {applicationData.summary && (
            <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><DocIcon /> Application Summary</h4>
              <div className="confirm-summary-grid">
                {applicationData.summary.name && <div className="confirm-summary-item"><span className="confirm-summary-label">Applicant</span><span className="confirm-summary-value">{applicationData.summary.name}</span></div>}
                {applicationData.summary.university && <div className="confirm-summary-item"><span className="confirm-summary-label">University</span><span className="confirm-summary-value">{applicationData.summary.university}</span></div>}
                {applicationData.summary.loanAmount && <div className="confirm-summary-item"><span className="confirm-summary-label">Loan Amount</span><span className="confirm-summary-value">{applicationData.summary.loanAmount}</span></div>}
                {applicationData.summary.lender && <div className="confirm-summary-item"><span className="confirm-summary-label">Preferred Lender</span><span className="confirm-summary-value">{applicationData.summary.lender}</span></div>}
              </div>
            </div>
          )}
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><PinIcon /> Next Steps</h4>
            <div className="confirm-steps">
              {nextSteps.map((step, i) => (
                <div key={i} className="confirm-step">
                  <div className="confirm-step-number">{i + 1}</div>
                  <div className="confirm-step-content">
                    <span className="confirm-step-icon">{step.icon}</span>
                    <div><strong>{step.title}</strong><p style={{ fontSize: '0.85rem', marginTop: '2px' }}>{step.desc}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="confirm-actions">
            <button className="btn btn-primary" onClick={downloadChecklist}><DownloadIcon /> Download Document Checklist</button>
            <button className="btn btn-amber" onClick={handleReturnDashboard}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6H2M5 9L2 6L5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> Return to Dashboard (+15 Score)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
