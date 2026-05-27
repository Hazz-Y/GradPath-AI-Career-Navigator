import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { api } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import './LoanOracle.css';

export default function LoanOracle() {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('eligibility');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedLender, setSelectedLender] = useState(null);
  const [applyForm, setApplyForm] = useState({
    fullName: '', email: '', phone: '',
    targetUniversity: '', program: '', duration: '24',
    loanAmount: '', coApplicantName: '', coApplicantRelation: '', coApplicantEmployment: '',
    confirmed: false
  });

  // Eligibility state
  const [loanProfile, setLoanProfile] = useState({
    age: 22,
    loanAmount: 2500000,
    coborrowerIncome: userData?.familyIncome || 12,
    cibilScore: userData?.cobilScore || 720,
    hasCollateral: userData?.hasCollateral || false,
    hasAdmission: false,
    universityRanking: 50,
    isStem: true,
    gpa: userData?.gpa || 8,
    greScore: userData?.greScore || 315,
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loadingElig, setLoadingElig] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm LoanOracle, your AI education loan specialist. I can help you understand loan options, check eligibility, and plan your finances.\n\nTell me — which country and program are you considering? I'll help you figure out the best financing path." }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messageCount, setMessageCount] = useState(0);
  const chatEndRef = useRef(null);

  // EMI Calculator state
  const [emiAmount, setEmiAmount] = useState(2500000);
  const [emiRate, setEmiRate] = useState(11.5);
  const [emiYears, setEmiYears] = useState(7);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkEligibility = async () => {
    setLoadingElig(true);
    try {
      const result = await api.checkLoanEligibility(loanProfile);
      setEligibilityResult(result);
    } catch (e) {
      /* handled silently */
    }
    setLoadingElig(false);
  };

  const sendMessage = async () => {
    if (!inputMsg.trim() || loadingChat) return;
    const userMsg = { role: 'user', content: inputMsg.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMsg('');
    setLoadingChat(true);

    try {
      const userProfile = {
        dreamScore: userData?.dreamScore,
        targetCountry: userData?.targetCountries?.[0],
        familyIncome: userData?.familyIncome,
        loanAmount: loanProfile.loanAmount,
        coborrowerIncome: loanProfile.coborrowerIncome,
        cibilScore: loanProfile.cibilScore,
        hasCollateral: loanProfile.hasCollateral,
        universityRanking: loanProfile.universityRanking,
      };
      const data = await api.chatLoanOracleWithMemory(inputMsg.trim(), sessionId, userProfile);
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      setMessageCount(data.messageCount || 0);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    }
    setLoadingChat(false);
  };

  const clearConversation = async () => {
    try {
      await api.clearLoanOracleSession(sessionId);
    } catch (e) { /* non-critical */ }
    setMessages([
      { role: 'assistant', content: "Conversation cleared! Let's start fresh.\n\nHow can I help you with your education loan today?" }
    ]);
    setMessageCount(0);
  };

  const calculateEMI = () => {
    const r = emiRate / 100 / 12;
    const n = emiYears * 12;
    const emi = emiAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return {
      emi: Math.round(emi),
      total: Math.round(emi * n),
      interest: Math.round(emi * n - emiAmount)
    };
  };

  const emiCalc = calculateEMI();

  return (
    <div className="page loan-page">
      <div className="container">
        <div className="loan-header animate-fade-in-up">
          <h1><svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{verticalAlign:'middle',marginRight:8}}><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>LoanOracle</h1>
          <p>AI-powered education loan advisor. Check eligibility, compare offers, and plan your finances with conversational AI guidance.</p>
        </div>

        {/* Tabs */}
        <div className="loan-tabs animate-fade-in-up stagger-1">
          {[
            { id: 'eligibility', label: 'Eligibility Check' },
            { id: 'chat', label: 'AI Advisor' },
            { id: 'emi', label: 'EMI Calculator' },
          ].map(tab => (
            <button key={tab.id}
              className={`loan-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Eligibility Tab */}
        {activeTab === 'eligibility' && (
          <div className="loan-content animate-fade-in">
            <div className="loan-elig-layout">
              <div className="loan-form glass-strong">
                <h3>Your Profile</h3>
                <div className="loan-form-grid">
                  <div className="input-group">
                    <label>Loan Amount (₹)</label>
                    <input className="input" type="number" value={loanProfile.loanAmount}
                      onChange={e => setLoanProfile(p => ({ ...p, loanAmount: parseInt(e.target.value) || 0 }))} />
                    <span className="input-hint">{formatCurrency(loanProfile.loanAmount)}</span>
                  </div>
                  <div className="input-group">
                    <label>Co-borrower Annual Income (Lakhs)</label>
                    <input className="input" type="number" value={loanProfile.coborrowerIncome}
                      onChange={e => setLoanProfile(p => ({ ...p, coborrowerIncome: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div className="input-group">
                    <label>Co-borrower CIBIL Score</label>
                    <input className="input" type="number" min="300" max="900" value={loanProfile.cibilScore}
                      onChange={e => setLoanProfile(p => ({ ...p, cibilScore: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="input-group">
                    <label>University Ranking (approx)</label>
                    <input className="input" type="number" value={loanProfile.universityRanking}
                      onChange={e => setLoanProfile(p => ({ ...p, universityRanking: parseInt(e.target.value) || 100 }))} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
                  <label className="checkbox-group quiz-checkbox">
                    <input type="checkbox" checked={loanProfile.hasCollateral}
                      onChange={e => setLoanProfile(p => ({ ...p, hasCollateral: e.target.checked }))} />
                    <span>Collateral Available</span>
                  </label>
                  <label className="checkbox-group quiz-checkbox">
                    <input type="checkbox" checked={loanProfile.hasAdmission}
                      onChange={e => setLoanProfile(p => ({ ...p, hasAdmission: e.target.checked }))} />
                    <span>Confirmed University Admission</span>
                  </label>
                  <label className="checkbox-group quiz-checkbox">
                    <input type="checkbox" checked={loanProfile.isStem}
                      onChange={e => setLoanProfile(p => ({ ...p, isStem: e.target.checked }))} />
                    <span>STEM Course</span>
                  </label>
                </div>

                <button className="btn btn-amber" onClick={checkEligibility} disabled={loadingElig} style={{ width: '100%' }}>
                  {loadingElig ? <><span className="spinner" /> Checking...</> : 'Check Eligibility'}
                </button>
              </div>

              {/* Results Panel */}
              {eligibilityResult && (
                <div className="loan-results animate-slide-in">
                  {/* Eligibility Status */}
                  <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>
                        {eligibilityResult.eligibility.eligible ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="var(--teal)" strokeWidth="1.5"/><path d="M7 12L10.5 15.5L17 8.5" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> : eligibilityResult.eligibility.conditionallyEligible ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L22 20H2L12 2Z" stroke="var(--gold)" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 9V13" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="16" r="0.8" fill="var(--gold)"/></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="var(--error)" strokeWidth="1.5"/><path d="M8 8L16 16M16 8L8 16" stroke="var(--error)" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                      </span>
                      <div>
                        <h4 style={{ color: eligibilityResult.eligibility.eligible ? 'var(--emerald-light)' : 'var(--amber)' }}>
                          {eligibilityResult.eligibility.eligible ? 'Eligible!' : eligibilityResult.eligibility.conditionallyEligible ? 'Conditionally Eligible' : 'Not Eligible'}
                        </h4>
                        {eligibilityResult.eligibility.issues.map((issue, i) => (
                          <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {issue}</p>
                        ))}
                      </div>
                    </div>

                    <div className="result-stats">
                      <div className="result-stat">
                        <span className="result-stat-label">Approved Amount</span>
                        <span className="result-stat-value">{formatCurrency(eligibilityResult.loanDetails.approvedAmount)}</span>
                      </div>
                      <div className="result-stat">
                        <span className="result-stat-label">Interest Rate</span>
                        <span className="result-stat-value">{eligibilityResult.loanDetails.interestRate}%</span>
                      </div>
                      <div className="result-stat">
                        <span className="result-stat-label">Processing Fee</span>
                        <span className="result-stat-value">{formatCurrency(eligibilityResult.loanDetails.processingFee)}</span>
                      </div>
                    </div>
                  </div>

                  {/* EMI Options */}
                  <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
                    <h4 style={{ marginBottom: '16px' }}>Repayment Options</h4>
                    <div className="emi-options">
                      {eligibilityResult.loanDetails.emiOptions.map((opt, i) => (
                        <div key={i} className="emi-option">
                          <span className="emi-option-label">{opt.label}</span>
                          <span className="emi-option-emi">{formatCurrency(opt.emi)}<small>/mo</small></span>
                          <span className="emi-option-total">Total: {formatCurrency(opt.totalPayment)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lender Offers */}
                  <h4 style={{ marginBottom: '12px' }}>Personalized Lender Offers</h4>
                  {eligibilityResult.lenders.map((lender, i) => (
                    <div key={i} className="card lender-card" style={{ padding: '20px', marginBottom: '12px' }}>
                      <div className="lender-header">
                        <div>
                          <h4 style={{ fontSize: '1rem' }}>{lender.name}</h4>
                          <span className="tag tag-emerald">{lender.type}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--emerald-light)' }}>
                            {lender.personalizedRate}
                          </span>
                          <br />
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            EMI ≈ {formatCurrency(lender.estimatedEMI)}/mo
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                        {lender.features.map((f, j) => (
                          <span key={j} className="tag tag-amber" style={{ fontSize: '0.72rem' }}>{f}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Approval: <strong style={{ color: lender.approvalChance === 'High' ? 'var(--emerald-light)' : 'var(--amber)' }}>{lender.approvalChance}</strong>
                          {' · '}{lender.processing_days} days
                        </span>
                        <button className="btn btn-primary btn-sm" onClick={() => {
                          setSelectedLender(lender);
                          setApplyForm(prev => ({ ...prev,
                            loanAmount: formatCurrency(eligibilityResult.loanDetails.approvedAmount)
                          }));
                          setShowApplyForm(true);
                        }}>Apply →</button>
                      </div>
                    </div>
                  ))}

                  {/* Document Checklist */}
                  <div className="card" style={{ padding: '24px', marginTop: '16px' }}>
                    <h4 style={{ marginBottom: '16px' }}>Document Checklist</h4>
                    {Object.entries(eligibilityResult.documents).map(([cat, docs]) => (
                      <div key={cat} style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                          {cat.replace(/_/g, ' ')}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                          {docs.map((doc, i) => (
                            <label key={i} className="checkbox-group" style={{ fontSize: '0.88rem' }}>
                              <input type="checkbox" />
                              <span>{doc}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loan Application Form Overlay */}
        {showApplyForm && (
          <div className="loan-content animate-fade-in">
            <div className="loan-apply-form glass-strong" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3>Loan Application</h3>
                  {selectedLender && (
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                      Applying with <strong style={{ color: 'var(--emerald-light)' }}>{selectedLender.name}</strong>
                      {' · '}{selectedLender.personalizedRate}
                    </p>
                  )}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowApplyForm(false)}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> Close</button>
              </div>

              <div className="loan-apply-grid">
                <div className="input-group">
                  <label>Full Name *</label>
                  <input className="input" placeholder="Enter your full name" value={applyForm.fullName}
                    onChange={e => setApplyForm(p => ({ ...p, fullName: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Email *</label>
                  <input className="input" type="email" placeholder="your@email.com" value={applyForm.email}
                    onChange={e => setApplyForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Phone *</label>
                  <input className="input" type="tel" placeholder="+91 98765 43210" value={applyForm.phone}
                    onChange={e => setApplyForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Loan Amount</label>
                  <input className="input" value={applyForm.loanAmount} readOnly style={{ color: 'var(--amber)' }} />
                </div>
                <div className="input-group">
                  <label>Target University *</label>
                  <input className="input" placeholder="e.g. Georgia Institute of Technology" value={applyForm.targetUniversity}
                    onChange={e => setApplyForm(p => ({ ...p, targetUniversity: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Program *</label>
                  <input className="input" placeholder="e.g. MS Computer Science" value={applyForm.program}
                    onChange={e => setApplyForm(p => ({ ...p, program: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Duration (months)</label>
                  <input className="input" type="number" value={applyForm.duration}
                    onChange={e => setApplyForm(p => ({ ...p, duration: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Co-applicant Name *</label>
                  <input className="input" placeholder="Parent/Guardian name" value={applyForm.coApplicantName}
                    onChange={e => setApplyForm(p => ({ ...p, coApplicantName: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Relationship</label>
                  <select value={applyForm.coApplicantRelation}
                    onChange={e => setApplyForm(p => ({ ...p, coApplicantRelation: e.target.value }))}>
                    <option value="">Select...</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Co-applicant Employment</label>
                  <select value={applyForm.coApplicantEmployment}
                    onChange={e => setApplyForm(p => ({ ...p, coApplicantEmployment: e.target.value }))}>
                    <option value="">Select...</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business">Business Owner</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>

              <div className="loan-apply-full" style={{ marginTop: '16px' }}>
                <label className="checkbox-group quiz-checkbox">
                  <input type="checkbox" checked={applyForm.confirmed}
                    onChange={e => setApplyForm(p => ({ ...p, confirmed: e.target.checked }))} />
                  <span>I confirm the details above are accurate and I consent to share this information with the lender.</span>
                </label>
              </div>

              <div className="loan-apply-actions">
                <button className="btn btn-ghost" onClick={() => setShowApplyForm(false)}>Cancel</button>
                <button className="btn btn-amber btn-lg"
                  disabled={!applyForm.confirmed || !applyForm.fullName || !applyForm.email}
                  onClick={() => {
                    const year = new Date().getFullYear();
                    const rand = Math.floor(100000 + Math.random() * 900000);
                    const applicationId = `GPA-${year}-${rand}`;
                    setShowApplyForm(false);
                    navigate('/loan-confirmation', {
                      state: {
                        applicationId,
                        summary: {
                          name: applyForm.fullName,
                          university: applyForm.targetUniversity,
                          loanAmount: applyForm.loanAmount,
                          lender: selectedLender?.name || 'Not specified',
                        }
                      }
                    });
                  }}>
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="loan-content animate-fade-in">
            <div className="chat-container glass-strong">
              <div className="chat-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{flexShrink:0}}><rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="7.5" cy="10" r="1.2" stroke="currentColor" strokeWidth="1"/><circle cx="12.5" cy="10" r="1.2" stroke="currentColor" strokeWidth="1"/><path d="M10 2V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M8 2H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem' }}>LoanOracle AI</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--teal)' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', marginRight: '4px', verticalAlign: 'middle' }} /> Online · Powered by Llama 3.3 70B</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {messageCount > 2 && (
                    <span className="tag tag-emerald" style={{ fontSize: '0.7rem', animation: 'fadeIn 0.3s ease' }}>
                      Memory active
                    </span>
                  )}
                  {messages.length > 1 && (
                    <button className="btn btn-ghost btn-sm" onClick={clearConversation}
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    {msg.role === 'assistant' && <span className="chat-avatar"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="5.5" cy="8" r="1" stroke="currentColor" strokeWidth="0.9"/><circle cx="10.5" cy="8" r="1" stroke="currentColor" strokeWidth="0.9"/><path d="M8 1.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></span>}
                    <div className="chat-bubble">
                      {msg.content.split('\n').map((line, j) => (
                        <p key={j} style={{ marginBottom: line ? '6px' : '0' }}>{line}</p>
                      ))}
                    </div>
                    {msg.role === 'user' && <span className="chat-avatar"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 14C2.5 11 4.5 9 8 9C11.5 9 13.5 11 13.5 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></span>}
                  </div>
                ))}
                {loadingChat && (
                  <div className="chat-msg assistant">
                    <span className="chat-avatar"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="5.5" cy="8" r="1" stroke="currentColor" strokeWidth="0.9"/><circle cx="10.5" cy="8" r="1" stroke="currentColor" strokeWidth="0.9"/><path d="M8 1.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></span>
                    <div className="chat-bubble typing">
                      <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="chat-input-area">
                <input className="input chat-input"
                  placeholder="Ask about loan eligibility, interest rates, documents..."
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn btn-primary" onClick={sendMessage} disabled={loadingChat}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EMI Calculator Tab */}
        {activeTab === 'emi' && (
          <div className="loan-content animate-fade-in">
            <div className="emi-calc-layout">
              <div className="glass-strong emi-form">
                <h3>EMI Calculator</h3>
                <div className="input-group">
                  <label>Loan Amount: {formatCurrency(emiAmount)}</label>
                  <input type="range" min="100000" max="15000000" step="100000" value={emiAmount}
                    onChange={e => setEmiAmount(parseInt(e.target.value))}
                    className="range-slider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>₹1L</span><span>₹1.5Cr</span>
                  </div>
                </div>

                <div className="input-group">
                  <label>Interest Rate: {emiRate}%</label>
                  <input type="range" min="8" max="16" step="0.5" value={emiRate}
                    onChange={e => setEmiRate(parseFloat(e.target.value))}
                    className="range-slider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>8%</span><span>16%</span>
                  </div>
                </div>

                <div className="input-group">
                  <label>Tenure: {emiYears} years</label>
                  <input type="range" min="3" max="15" step="1" value={emiYears}
                    onChange={e => setEmiYears(parseInt(e.target.value))}
                    className="range-slider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>3 yrs</span><span>15 yrs</span>
                  </div>
                </div>
              </div>

              <div className="emi-result-panel">
                <div className="card emi-result-card">
                  <span className="emi-result-label">Monthly EMI</span>
                  <span className="emi-result-value">{formatCurrency(emiCalc.emi)}</span>
                </div>
                <div className="card emi-result-card">
                  <span className="emi-result-label">Total Payment</span>
                  <span className="emi-result-value">{formatCurrency(emiCalc.total)}</span>
                </div>
                <div className="card emi-result-card">
                  <span className="emi-result-label">Total Interest</span>
                  <span className="emi-result-value" style={{ color: 'var(--rose)' }}>{formatCurrency(emiCalc.interest)}</span>
                </div>
                <div className="card emi-result-card">
                  <span className="emi-result-label">Interest / Principal</span>
                  <span className="emi-result-value">{((emiCalc.interest / emiAmount) * 100).toFixed(0)}%</span>
                  <div className="progress-bar" style={{ marginTop: '8px' }}>
                    <div className="progress-bar-fill" style={{
                      width: `${(emiAmount / emiCalc.total) * 100}%`,
                      background: 'var(--emerald-light)'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Principal</span><span>Interest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
