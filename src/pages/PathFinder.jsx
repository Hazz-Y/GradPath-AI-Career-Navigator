import { useState, useContext } from 'react';
import { AppContext } from '../App';
import { api } from '../utils/api';
import { getCountryFlag, formatCurrency } from '../utils/helpers';
import './PathFinder.css';

const CompassIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M11.5 6.5L9.5 9.5L6.5 11.5L8.5 8.5L11.5 6.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>;
const SparkleIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L7 4.5H10.5L7.5 6.5L8.5 10L6 8L3.5 10L4.5 6.5L1.5 4.5H5L6 1Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/></svg>;
const CalendarIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1.5" y="2.5" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M4 1.5V3M8 1.5V3M1.5 5H10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>;
const AwardIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="5" r="3.5" stroke="currentColor" strokeWidth="1"/><path d="M4.5 8L3.5 11L6 9.5L8.5 11L7.5 8" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>;
const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M15 15L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const LightbulbIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C3.8 1 2 2.8 2 5C2 6.7 3 8 4.5 8.5V10H7.5V8.5C9 8 10 6.7 10 5C10 2.8 8.2 1 6 1Z" stroke="currentColor" strokeWidth="1.1"/><path d="M4.5 11H7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>;
const AlertIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><path d="M6 4.5V6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><circle cx="6" cy="8" r="0.5" fill="currentColor"/></svg>;

export default function PathFinder() {
  const { userData } = useContext(AppContext);
  const [filters, setFilters] = useState({
    gpa: userData?.gpa || '', greScore: userData?.greScore || '', gmatScore: userData?.gmatScore || '',
    ieltsScore: userData?.ieltsScore || '', courseType: userData?.courseType || 'ms',
    targetCountries: userData?.targetCountries || [],
    budgetMax: userData?.budgetRange ? userData.budgetRange * 100000 / 83.5 : '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [explainCache, setExplainCache] = useState({});
  const [loadingExplain, setLoadingExplain] = useState(null);

  const countries = ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 'Switzerland', 'Netherlands', 'Sweden', 'France', 'India'];
  const toggleCountry = (c) => { setFilters(prev => ({ ...prev, targetCountries: prev.targetCountries.includes(c) ? prev.targetCountries.filter(x => x !== c) : [...prev.targetCountries, c] })); };

  const handleSearch = async () => {
    setLoading(true); setSearched(true);
    try { const data = await api.getRecommendations(filters); setResults(data.recommendations || []); } catch (e) { /* handled silently */ }
    setLoading(false);
  };

  return (
    <div className="page pathfinder-page">
      <div className="container">
        <div className="pf-header animate-fade-in-up">
          <h1><CompassIcon /> PathFinder AI</h1>
          <p>AI-powered university matching using cosine similarity. Find your perfect-fit programs from 55+ universities across 11 countries.</p>
        </div>

        <div className="pf-filters glass-strong animate-fade-in-up stagger-1">
          <div className="pf-filters-grid">
            <div className="input-group"><label>GPA (out of 10)</label><input className="input" type="number" step="0.1" min="0" max="10" placeholder="e.g. 8.5" value={filters.gpa} onChange={e => setFilters(p => ({ ...p, gpa: parseFloat(e.target.value) || '' }))} /></div>
            <div className="input-group"><label>GRE Score</label><input className="input" type="number" min="260" max="340" placeholder="e.g. 320" value={filters.greScore} onChange={e => setFilters(p => ({ ...p, greScore: parseFloat(e.target.value) || '' }))} /></div>
            <div className="input-group"><label>GMAT Score</label><input className="input" type="number" min="200" max="800" placeholder="e.g. 710" value={filters.gmatScore} onChange={e => setFilters(p => ({ ...p, gmatScore: parseFloat(e.target.value) || '' }))} /></div>
            <div className="input-group"><label>IELTS Score</label><input className="input" type="number" step="0.5" min="0" max="9" placeholder="e.g. 7.5" value={filters.ieltsScore} onChange={e => setFilters(p => ({ ...p, ieltsScore: parseFloat(e.target.value) || '' }))} /></div>
            <div className="input-group"><label>Degree Type</label><select value={filters.courseType} onChange={e => setFilters(p => ({ ...p, courseType: e.target.value }))}><option value="ms">MS / Masters</option><option value="mba">MBA / PGP</option></select></div>
          </div>
          <div className="input-group" style={{ marginTop: '16px' }}>
            <label>Target Countries</label>
            <div className="multi-select-grid">
              {countries.map(c => (<button key={c} type="button" className={`multi-select-chip ${filters.targetCountries.includes(c) ? 'selected' : ''}`} onClick={() => toggleCountry(c)}>{getCountryFlag(c)} {c}</button>))}
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleSearch} disabled={loading} style={{ marginTop: '20px', width: '100%' }}>
            {loading ? <><span className="spinner" /> Matching...</> : <><CompassIcon /> Find Best-Fit Universities</>}
          </button>
        </div>

        {loading && (<div className="pf-loading"><div className="pf-loading-grid">{[1,2,3,4,5,6].map(i => (<div key={i} className="card skeleton" style={{ height: '220px' }} />))}</div></div>)}

        {!loading && searched && results.length > 0 && (
          <div className="pf-results animate-fade-in-up">
            <h3 style={{ marginBottom: '20px' }}>
              {results.length} Matches Found
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '12px' }}>Ranked by cosine similarity match score</span>
            </h3>
            <div className="pf-results-grid">
              {results.map((uni, i) => (
                <div key={uni.id} className="uni-card card animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="uni-card-top">
                    <div className="uni-match-badge" style={{
                      background: uni.matchScore >= 75 ? 'var(--teal-subtle)' : uni.matchScore >= 55 ? 'var(--gold-subtle)' : 'var(--error-subtle)',
                      color: uni.matchScore >= 75 ? 'var(--teal)' : uni.matchScore >= 55 ? 'var(--gold)' : 'var(--error)',
                      borderColor: uni.matchScore >= 75 ? 'var(--teal-border)' : uni.matchScore >= 55 ? 'var(--gold-border)' : 'var(--error-border)',
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{uni.matchScore}%</span> match
                    </div>
                    <span className={`tag ${uni.category === 'Safe' ? 'tag-emerald' : uni.category === 'Moderate' ? 'tag-amber' : 'tag-rose'}`}>{uni.category}</span>
                  </div>
                  <h4 className="uni-name">{getCountryFlag(uni.country)} {uni.name}</h4>
                  <p className="uni-course">{uni.course}</p>
                  <p className="uni-location">{uni.city}, {uni.country}</p>
                  <div className="uni-stats">
                    <div className="uni-stat"><span className="uni-stat-value" style={{ fontFamily: 'var(--font-mono)' }}>#{uni.ranking}</span><span className="uni-stat-label">QS Rank</span></div>
                    <div className="uni-stat"><span className="uni-stat-value" style={{ fontFamily: 'var(--font-mono)' }}>${(uni.tuition / 1000).toFixed(0)}K</span><span className="uni-stat-label">Tuition/yr</span></div>
                    <div className="uni-stat"><span className="uni-stat-value" style={{ fontFamily: 'var(--font-mono)' }}>{uni.acceptance_rate}%</span><span className="uni-stat-label">Accept Rate</span></div>
                    <div className="uni-stat"><span className="uni-stat-value" style={{ fontFamily: 'var(--font-mono)' }}>{uni.duration}mo</span><span className="uni-stat-label">Duration</span></div>
                  </div>
                  {uni.gre_avg && <p className="uni-req">GRE Avg: {uni.gre_avg}</p>}
                  {uni.gmat_avg && <p className="uni-req">GMAT Avg: {uni.gmat_avg}</p>}
                  {uni.aiInsight && (
                    <div className="uni-insight">
                      <span style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><SparkleIcon /> AI Insight</span>
                      <p>{uni.aiInsight}</p>
                    </div>
                  )}
                  <div className="uni-tags">{uni.specializations?.slice(0, 3).map(s => (<span key={s} className="tag tag-emerald" style={{ fontSize: '0.72rem' }}>{s}</span>))}</div>
                  <div className="uni-footer">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarIcon /> {uni.deadline} · {uni.intake}</span>
                    {uni.scholarship && <span className="tag tag-amber" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}><AwardIcon /> Scholarship</span>}
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: '10px', width: '100%', fontSize: '0.8rem' }}
                    onClick={() => {
                      if (expandedCard === uni.id) { setExpandedCard(null); return; }
                      setExpandedCard(uni.id);
                      if (!explainCache[uni.id]) {
                        setLoadingExplain(uni.id);
                        api.explainPathfinderMatch(uni, filters, uni.matchScore).then(data => { setExplainCache(prev => ({ ...prev, [uni.id]: data })); setLoadingExplain(null); }).catch(() => setLoadingExplain(null));
                      }
                    }}>
                    {expandedCard === uni.id ? 'Hide Details' : 'Why this match?'}
                  </button>
                  {expandedCard === uni.id && (
                    <div className="uni-explain animate-fade-in" style={{ marginTop: '12px' }}>
                      {loadingExplain === uni.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}><div className="skeleton-line" style={{ width: '80%', height: '14px' }} /><div className="skeleton-line" style={{ width: '60%', height: '14px' }} /><div className="skeleton-line" style={{ width: '90%', height: '14px' }} /></div>
                      ) : explainCache[uni.id] ? (
                        <>
                          {explainCache[uni.id].probabilityBreakdown && <p style={{ fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-secondary)' }}>{explainCache[uni.id].probabilityBreakdown}</p>}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                            {(explainCache[uni.id].strengths || []).map((s, j) => (<span key={j} className="tag tag-emerald" style={{ fontSize: '0.72rem' }}><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> {s}</span>))}
                            {(explainCache[uni.id].gaps || []).map((g, j) => (<span key={j} className="tag tag-amber" style={{ fontSize: '0.72rem' }}><AlertIcon /> {g}</span>))}
                          </div>
                          {explainCache[uni.id].boostTip && (
                            <div style={{ padding: '10px 14px', background: 'var(--gold-subtle)', border: '1px solid var(--gold-border)', borderRadius: 'var(--r-md)', fontSize: '0.82rem', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                              <LightbulbIcon /> <span><strong>Boost Tip:</strong> {explainCache[uni.id].boostTip}</span>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="pf-empty animate-fade-in">
            <SearchIcon />
            <h3>No matches found</h3>
            <p>Try adjusting your filters or adding more countries.</p>
          </div>
        )}
      </div>
    </div>
  );
}
