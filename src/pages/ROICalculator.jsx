import { useState } from 'react';
import { api } from '../utils/api';
import { formatCurrency, getCountryFlag } from '../utils/helpers';
import './ROICalculator.css';

const ChartIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 15L6 9L9 12L13 6L16 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 15H16" stroke="currentColor" strokeWidth="1" opacity="0.4"/></svg>;

export default function ROICalculator() {
  const [params, setParams] = useState({ country: 'USA', tuition: 45000, duration: 24, avgSalary: 120000, courseType: 'CS' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const countryOptions = ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 'Switzerland', 'Netherlands', 'Sweden', 'France', 'India'];
  const courseOptions = ['CS', 'Data Science', 'MBA', 'Engineering'];

  const calculate = async () => { setLoading(true); try { const data = await api.calculateROI(params); setResult(data); } catch (e) { /* handled silently */ } setLoading(false); };

  return (
    <div className="page roi-page">
      <div className="container">
        <div className="roi-header animate-fade-in-up">
          <h1><ChartIcon /> ROI Calculator</h1>
          <p>Predict salary outcomes vs education cost. See your break-even year and long-term earnings projection.</p>
        </div>
        <div className="roi-layout">
          <div className="roi-inputs glass-strong animate-fade-in-up stagger-1">
            <h3>Parameters</h3>
            <div className="input-group"><label>Country</label><select value={params.country} onChange={e => setParams(p => ({ ...p, country: e.target.value }))}>{countryOptions.map(c => <option key={c} value={c}>{getCountryFlag(c)} {c}</option>)}</select></div>
            <div className="input-group"><label>Course Type</label><select value={params.courseType} onChange={e => setParams(p => ({ ...p, courseType: e.target.value }))}>{courseOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="input-group"><label>Annual Tuition (USD): ${params.tuition.toLocaleString()}</label><input type="range" min="1000" max="90000" step="1000" value={params.tuition} onChange={e => setParams(p => ({ ...p, tuition: parseInt(e.target.value) }))} className="range-slider" /></div>
            <div className="input-group"><label>Program Duration: {params.duration} months</label><input type="range" min="10" max="36" step="2" value={params.duration} onChange={e => setParams(p => ({ ...p, duration: parseInt(e.target.value) }))} className="range-slider" /></div>
            <div className="input-group"><label>Expected Avg Salary (USD): ${params.avgSalary.toLocaleString()}</label><input type="range" min="20000" max="200000" step="5000" value={params.avgSalary} onChange={e => setParams(p => ({ ...p, avgSalary: parseInt(e.target.value) }))} className="range-slider" /></div>
            <button className="btn btn-primary" onClick={calculate} disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? <><span className="spinner" /> Calculating...</> : <><ChartIcon /> Calculate ROI</>}
            </button>
          </div>
          {result && (
            <div className="roi-results animate-slide-in">
              <div className="roi-summary-grid">
                <div className="card roi-summary-card"><span className="roi-card-label">Total Cost</span><span className="roi-card-value" style={{ fontFamily: 'var(--font-mono)' }}>${result.totalCost.toLocaleString()}</span><span className="roi-card-sub">{formatCurrency(result.totalCostINR)}</span></div>
                <div className="card roi-summary-card"><span className="roi-card-label">Break-Even Year</span><span className="roi-card-value" style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>Year {result.breakEvenYear}</span><span className="roi-card-sub">After graduation</span></div>
                <div className="card roi-summary-card"><span className="roi-card-label">5-Year ROI</span><span className="roi-card-value" style={{ color: result.roiPercentage > 0 ? 'var(--teal)' : 'var(--error)', fontFamily: 'var(--font-mono)' }}>{result.roiPercentage > 0 ? '+' : ''}{result.roiPercentage}%</span><span className="roi-card-sub">Return on investment</span></div>
              </div>
              <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '16px' }}>Cost Breakdown</h4>
                <div className="cost-breakdown">
                  <div className="cost-row"><span>Tuition</span><span>${result.costBreakdown.tuition.toLocaleString()} ({formatCurrency(result.costBreakdown.tuitionINR)})</span></div>
                  <div className="cost-row"><span>Living Expenses</span><span>${result.costBreakdown.living.toLocaleString()} ({formatCurrency(result.costBreakdown.livingINR)})</span></div>
                  <div className="cost-row"><span>Visa</span><span>${result.costBreakdown.visa.toLocaleString()}</span></div>
                  <div className="cost-row total"><span>Total Investment</span><span>${result.totalCost.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '16px' }}>Salary Projection</h4>
                <div className="salary-grid">
                  {[{ label: 'Year 1', val: result.salary.year1, inr: result.salary.year1INR }, { label: 'Year 3', val: result.salary.year3, inr: result.salary.year3INR }, { label: 'Year 5', val: result.salary.year5, inr: result.salary.year5INR }, { label: 'Year 10', val: result.salary.year10, inr: result.salary.year10INR }].map((s, i) => (
                    <div key={i} className="salary-item"><span className="salary-label">{s.label}</span><span className="salary-value" style={{ fontFamily: 'var(--font-mono)' }}>${s.val.toLocaleString()}</span><span className="salary-inr">{formatCurrency(s.inr)}/yr</span></div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ marginBottom: '16px' }}>Cumulative Earnings vs Cost</h4>
                <div className="chart-bars">
                  {result.yearlyData.slice(0, 10).map((yr, i) => {
                    const maxVal = Math.max(result.yearlyData[9]?.cumulativeEarnings || 1, result.totalCost);
                    return (
                      <div key={i} className="chart-bar-row">
                        <span className="chart-label" style={{ fontFamily: 'var(--font-mono)' }}>Y{yr.year}</span>
                        <div className="chart-bar-container"><div className="chart-bar earnings" style={{ width: `${(yr.cumulativeEarnings / maxVal) * 100}%` }} />{i === 0 && <div className="chart-bar cost-line" style={{ left: `${(result.totalCost / maxVal) * 100}%` }} />}</div>
                        <span className={`chart-value ${yr.netROI >= 0 ? 'positive' : 'negative'}`} style={{ fontFamily: 'var(--font-mono)' }}>{yr.netROI >= 0 ? '+' : ''}{formatCurrency(yr.netROI_INR)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="chart-legend"><span><span className="legend-dot" style={{ background: 'var(--teal)' }} /> Cumulative Savings</span><span><span className="legend-dot" style={{ background: 'var(--error)' }} /> Total Cost Line</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
