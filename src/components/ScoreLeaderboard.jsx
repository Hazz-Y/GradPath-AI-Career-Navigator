import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import './ScoreLeaderboard.css';

const TrophyIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 2H13V7C13 9.8 10.8 12 8 12H10C10 12 7.2 12 5 9.5C5 9.5 5 7 5 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M5 4H3C2 4 1 5 1 6C1 7 2 8 3 8H5" stroke="currentColor" strokeWidth="1.2"/><path d="M13 4H15C16 4 17 5 17 6C17 7 16 8 15 8H13" stroke="currentColor" strokeWidth="1.2"/><path d="M7 12V14H11V12" stroke="currentColor" strokeWidth="1.2"/><path d="M6 14H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
const BoltIcon = () => <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M5 0.5L1 6.5H4.5L3.5 11.5L9 5.5H5.5L6.5 0.5H5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>;
const GlobeIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1"/><path d="M1 6H11M6 1C4.5 3 4.5 9 6 11M6 1C7.5 3 7.5 9 6 11" stroke="currentColor" strokeWidth="0.9"/></svg>;

// Country flag text representations (kept as text since these are actual flag unicode, not emoji icons)
const COUNTRY_FLAGS = {
  USA: 'US', UK: 'UK', Canada: 'CA', Germany: 'DE', Australia: 'AU',
  Singapore: 'SG', Switzerland: 'CH', Netherlands: 'NL', France: 'FR',
  Sweden: 'SE', India: 'IN',
};

const MOCK_LEADERBOARD = [
  { name: 'Rohan C.', dream_score: 921, target_country: 'USA', target_field: 'Computer Science', streak_days: 28 },
  { name: 'Sneha I.', dream_score: 901, target_country: 'USA', target_field: 'Computer Science', streak_days: 22 },
  { name: 'Akash M.', dream_score: 877, target_country: 'USA', target_field: 'Computer Science', streak_days: 21 },
  { name: 'Kavya M.', dream_score: 863, target_country: 'USA', target_field: 'MBA', streak_days: 19 },
  { name: 'Karan M.', dream_score: 845, target_country: 'USA', target_field: 'Computer Science', streak_days: 17 },
  { name: 'Arnav D.', dream_score: 815, target_country: 'Canada', target_field: 'MBA', streak_days: 15 },
  { name: 'Arjun S.', dream_score: 812, target_country: 'USA', target_field: 'Computer Science', streak_days: 14 },
  { name: 'Rahul V.', dream_score: 798, target_country: 'USA', target_field: 'Computer Science', streak_days: 13 },
  { name: 'Ananya N.', dream_score: 778, target_country: 'Australia', target_field: 'Finance', streak_days: 11 },
  { name: 'Priya P.', dream_score: 756, target_country: 'UK', target_field: 'MBA', streak_days: 8 },
  { name: 'Tanya B.', dream_score: 743, target_country: 'Germany', target_field: 'Engineering', streak_days: 7 },
  { name: 'Siddharth R.', dream_score: 741, target_country: 'Singapore', target_field: 'Finance', streak_days: 9 },
  { name: 'Pooja S.', dream_score: 724, target_country: 'Australia', target_field: 'Nursing', streak_days: 6 },
  { name: 'Divya R.', dream_score: 712, target_country: 'Canada', target_field: 'Biotech', streak_days: 5 },
  { name: 'Rohit K.', dream_score: 689, target_country: 'Canada', target_field: 'Data Science', streak_days: 3 },
  { name: 'Nisha P.', dream_score: 668, target_country: 'UK', target_field: 'Psychology', streak_days: 3 },
  { name: 'Meera G.', dream_score: 655, target_country: 'Netherlands', target_field: 'Design', streak_days: 4 },
  { name: 'Vikram S.', dream_score: 634, target_country: 'Germany', target_field: 'Engineering', streak_days: 1 },
  { name: 'Aditya J.', dream_score: 590, target_country: 'UK', target_field: 'Law', streak_days: 2 },
  { name: 'Ishaan K.', dream_score: 561, target_country: 'France', target_field: 'Culinary Arts', streak_days: 1 },
];

export default function ScoreLeaderboard({ currentScore, currentCountry }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCountry, setFilterCountry] = useState('All');

  useEffect(() => { fetchLeaderboard(); }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').select('name, dream_score, target_country, target_field, streak_days').order('dream_score', { ascending: false }).limit(20);
        if (!error && data?.length > 0) { setLeaderboard(data); setLoading(false); return; }
      } catch (e) { /* fallback to mock data */ }
    }
    setLeaderboard(MOCK_LEADERBOARD); setLoading(false);
  };

  const filtered = filterCountry === 'All' ? leaderboard : leaderboard.filter(u => u.target_country === filterCountry);
  const countries = ['All', ...new Set(leaderboard.map(u => u.target_country).filter(Boolean))];

  const getRankDisplay = (i) => {
    if (i === 0) return <span style={{ color: 'var(--gold)', fontWeight: 700 }}>1st</span>;
    if (i === 1) return <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>2nd</span>;
    if (i === 2) return <span style={{ color: '#CD7F32', fontWeight: 600 }}>3rd</span>;
    return <span style={{ fontFamily: 'var(--font-mono)' }}>#{i + 1}</span>;
  };

  return (
    <div className="leaderboard-section">
      <div className="leaderboard-header">
        <h3><TrophyIcon /> Dream Score Leaderboard</h3>
        <span className="leaderboard-subtitle">Students like you</span>
      </div>
      <div className="leaderboard-filters">
        {countries.map(c => (
          <button key={c} className={`leaderboard-filter-chip ${filterCountry === c ? 'active' : ''}`} onClick={() => setFilterCountry(c)}>
            {c !== 'All' && COUNTRY_FLAGS[c] ? <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', opacity: 0.6, marginRight: '4px' }}>{COUNTRY_FLAGS[c]}</span> : ''}{c}
          </button>
        ))}
      </div>
      <div className="leaderboard-list">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (<div key={i} className="leaderboard-row skeleton" style={{ height: '48px' }} />))
        ) : (
          filtered.slice(0, 15).map((user, i) => {
            const isCurrentUser = currentScore && user.dream_score === currentScore;
            return (
              <div key={i} className={`leaderboard-row ${isCurrentUser ? 'highlight' : ''}`}>
                <span className="lb-rank">{getRankDisplay(i)}</span>
                <div className="lb-info">
                  <span className="lb-name">{user.name}{isCurrentUser ? ' (You)' : ''}</span>
                  <span className="lb-meta">
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', opacity: 0.5 }}>{COUNTRY_FLAGS[user.target_country] || ''}</span> {user.target_field || ''}
                  </span>
                </div>
                <div className="lb-score-section">
                  {user.streak_days > 7 && <span className="lb-streak"><BoltIcon />{user.streak_days}</span>}
                  <span className="lb-score" style={{ fontFamily: 'var(--font-mono)' }}>{user.dream_score}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
