// Loan Eligibility Engine — NBFC Rule-Based
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let loanRules = {};
try {
  loanRules = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'loanRules.json'), 'utf-8'));
} catch (e) {
  console.error('Failed to load loan rules:', e.message);
}

export function checkEligibility(profile) {
  const issues = [];
  const el = loanRules.eligibility;

  if (profile.age && (profile.age < el.min_age || profile.age > el.max_age)) {
    issues.push(`Age must be between ${el.min_age} and ${el.max_age}`);
  }
  if (profile.cibilScore && profile.cibilScore < el.min_cibil_coborrower) {
    issues.push(`Co-borrower CIBIL score should be above ${el.min_cibil_coborrower}`);
  }
  if (!profile.hasAdmission) {
    issues.push('Confirmed admission/offer letter required for final approval');
  }

  return {
    eligible: issues.length === 0 || (issues.length === 1 && !profile.hasAdmission),
    conditionallyEligible: !profile.hasAdmission && issues.length <= 1,
    issues
  };
}

export function calculateLoanDetails(profile) {
  const hasCollateral = profile.hasCollateral || false;
  const range = hasCollateral ? loanRules.loanRanges.collateral : loanRules.loanRanges.noCollateral;

  // Base interest rate
  let interestRate = (range.interest_rate_min + range.interest_rate_max) / 2;
  const factors = loanRules.interestFactors;

  // Apply adjustment factors
  if (profile.universityRanking && profile.universityRanking <= 50) interestRate += factors.top50_university;
  if (profile.isStem) interestRate += factors.stem_course;
  if (profile.gpa && profile.gpa >= 8.5) interestRate += factors.high_gpa;
  if ((profile.greScore && profile.greScore >= 320) || (profile.gmatScore && profile.gmatScore >= 700)) interestRate += factors.high_test_score;
  if (profile.coborrowerIncome && profile.coborrowerIncome >= 15) interestRate += factors.coborrower_income_high;
  if (profile.cibilScore) {
    if (profile.cibilScore >= 750) interestRate += factors.excellent_cibil;
    else if (profile.cibilScore >= 700) interestRate += factors.good_cibil;
  }
  if (!hasCollateral) interestRate += factors.no_collateral;

  // Clamp
  interestRate = Math.max(range.interest_rate_min, Math.min(interestRate, range.interest_rate_max));
  interestRate = Math.round(interestRate * 10) / 10;

  // Max loan amount
  let maxLoan = range.max;
  if (profile.coborrowerIncome) {
    const incomeBasedMax = profile.coborrowerIncome * 100000 * 8;
    maxLoan = Math.min(maxLoan, Math.max(incomeBasedMax, range.min));
  }

  const requestedAmount = profile.loanAmount || maxLoan;
  const approvedAmount = Math.min(requestedAmount, maxLoan);

  // Calculate EMI for each repayment option
  const emiOptions = loanRules.repaymentOptions.map(option => {
    const r = interestRate / 100 / 12;
    const n = option.years * 12;
    const emi = approvedAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - approvedAmount;

    return {
      ...option,
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  });

  return {
    approvedAmount,
    maxLoan,
    interestRate,
    hasCollateral,
    emiOptions,
    moratorium: loanRules.moratoriumPeriod,
    processingFee: Math.round(approvedAmount * 0.01)
  };
}

export function getDocumentChecklist(profile) {
  const docs = { ...loanRules.documentChecklist };
  if (!profile.hasCollateral) {
    docs.financial_coborrower = docs.financial_coborrower.filter(d => !d.includes('Property'));
  }
  return docs;
}

export function getLenderOffers(profile, loanDetails) {
  return loanRules.lenders.map(lender => {
    const rates = lender.interest_range.split(' - ').map(r => parseFloat(r));
    let adjustedRate = (rates[0] + rates[1]) / 2;

    if (profile.universityRanking && profile.universityRanking <= 50) adjustedRate -= 0.3;
    if (profile.cibilScore && profile.cibilScore >= 750) adjustedRate -= 0.5;

    adjustedRate = Math.max(rates[0], Math.min(adjustedRate, rates[1]));

    return {
      ...lender,
      personalizedRate: `${adjustedRate.toFixed(1)}%`,
      estimatedEMI: Math.round(loanDetails.approvedAmount * (adjustedRate / 100 / 12) * Math.pow(1 + adjustedRate / 100 / 12, 84) / (Math.pow(1 + adjustedRate / 100 / 12, 84) - 1)),
      approvalChance: profile.cibilScore >= 750 ? 'High' : profile.cibilScore >= 700 ? 'Good' : 'Moderate'
    };
  });
}
