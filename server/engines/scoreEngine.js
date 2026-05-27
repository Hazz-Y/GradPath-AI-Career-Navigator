// Dream Score Engine — Rule-based weighted scoring (0-1000)

const WEIGHTS = {
  academic: 0.25,
  financial: 0.25,
  profile: 0.20,
  alignment: 0.15,
  progress: 0.15
};

function computeAcademicScore(data) {
  let score = 0;
  // GPA (out of 10 or 4.0 scale)
  const gpa = data.gpa || 0;
  const gpaScale = data.gpaScale || 10;
  const normalizedGpa = gpaScale === 4 ? (gpa / 4) * 10 : gpa;
  score += Math.min(normalizedGpa / 10, 1) * 350;

  // Test scores
  if (data.greScore) {
    const greMax = 340;
    score += Math.min(data.greScore / greMax, 1) * 250;
  } else if (data.gmatScore) {
    const gmatMax = 800;
    score += Math.min(data.gmatScore / gmatMax, 1) * 250;
  }

  // IELTS/TOEFL
  if (data.ieltsScore) {
    score += Math.min(data.ieltsScore / 9, 1) * 200;
  } else if (data.toeflScore) {
    score += Math.min(data.toeflScore / 120, 1) * 200;
  }

  // University tier
  if (data.undergradTier === 'tier1') score += 200;
  else if (data.undergradTier === 'tier2') score += 140;
  else if (data.undergradTier === 'tier3') score += 80;
  else score += 40;

  return Math.min(score, 1000);
}

function computeFinancialScore(data) {
  let score = 0;
  const income = data.familyIncome || 0; // Annual in lakhs
  if (income >= 25) score += 300;
  else if (income >= 15) score += 220;
  else if (income >= 8) score += 150;
  else if (income >= 4) score += 80;
  else score += 30;

  if (data.hasCollateral) score += 250;
  if (data.hasSavings) score += 150;
  if (data.cobilScore) {
    if (data.cobilScore >= 750) score += 200;
    else if (data.cobilScore >= 700) score += 150;
    else if (data.cobilScore >= 650) score += 80;
    else score += 20;
  } else {
    score += 50; // Unknown = neutral
  }

  if (data.scholarshipExpected) score += 100;

  return Math.min(score, 1000);
}

function computeProfileScore(data) {
  let score = 0;
  if (data.hasResume) score += 150;
  if (data.hasSOP) score += 200;
  if (data.hasLOR) {
    score += Math.min(data.lorCount || 0, 3) * 80;
  }
  if (data.hasWorkExperience) {
    const years = data.workYears || 0;
    score += Math.min(years * 60, 200);
  }
  if (data.hasResearch) score += 100;
  if (data.hasProjects) score += 80;
  if (data.hasExtracurriculars) score += 30;
  return Math.min(score, 1000);
}

function computeAlignmentScore(data) {
  let score = 500; // baseline
  if (data.targetCountries && data.targetCountries.length > 0) score += 100;
  if (data.targetCourses && data.targetCourses.length > 0) score += 100;
  if (data.targetUniversities && data.targetUniversities.length > 0) score += 150;
  if (data.intakeTimeline) score += 80;
  if (data.budgetRange) score += 70;
  return Math.min(score, 1000);
}

function computeProgressScore(data) {
  let score = 0;
  if (data.testsTaken) score += 200;
  if (data.applicationsStarted) score += 150;
  if (data.applicationsSubmitted) {
    score += Math.min(data.applicationsSubmitted * 80, 300);
  }
  if (data.offersReceived) {
    score += Math.min(data.offersReceived * 120, 250);
  }
  if (data.visaApplied) score += 100;
  return Math.min(score, 1000);
}

export function calculateDreamScore(data) {
  const academic = computeAcademicScore(data);
  const financial = computeFinancialScore(data);
  const profile = computeProfileScore(data);
  const alignment = computeAlignmentScore(data);
  const progress = computeProgressScore(data);

  const totalScore = Math.round(
    academic * WEIGHTS.academic +
    financial * WEIGHTS.financial +
    profile * WEIGHTS.profile +
    alignment * WEIGHTS.alignment +
    progress * WEIGHTS.progress
  );

  let tier;
  if (totalScore >= 901) tier = { name: 'Dream Ready', icon: 'trophy', color: '#c4935a' };
  else if (totalScore >= 751) tier = { name: 'Top Performer', icon: 'star', color: '#4a7c6f' };
  else if (totalScore >= 551) tier = { name: 'Strong Contender', icon: 'bolt', color: '#5a8f4a' };
  else if (totalScore >= 301) tier = { name: 'Rising Applicant', icon: 'rocket', color: '#7a6b4a' };
  else tier = { name: 'Early Explorer', icon: 'sprout', color: '#6b6b6b' };

  return {
    totalScore,
    tier,
    breakdown: {
      academic: { score: Math.round(academic), weight: WEIGHTS.academic, weighted: Math.round(academic * WEIGHTS.academic), label: 'Academic Strength' },
      financial: { score: Math.round(financial), weight: WEIGHTS.financial, weighted: Math.round(financial * WEIGHTS.financial), label: 'Financial Readiness' },
      profile: { score: Math.round(profile), weight: WEIGHTS.profile, weighted: Math.round(profile * WEIGHTS.profile), label: 'Profile Completeness' },
      alignment: { score: Math.round(alignment), weight: WEIGHTS.alignment, weighted: Math.round(alignment * WEIGHTS.alignment), label: 'Target Alignment' },
      progress: { score: Math.round(progress), weight: WEIGHTS.progress, weighted: Math.round(progress * WEIGHTS.progress), label: 'Application Progress' }
    }
  };
}

export function getBoosterTips(breakdown, data) {
  const tips = [];

  if (breakdown.academic.score < 600) {
    if (!data.greScore && !data.gmatScore) tips.push({ text: 'Take the GRE/GMAT to boost your academic score by up to +250 points', impact: '+250', pillar: 'Academic' });
    if (!data.ieltsScore && !data.toeflScore) tips.push({ text: 'Complete IELTS/TOEFL to add up to +200 points', impact: '+200', pillar: 'Academic' });
  }

  if (breakdown.financial.score < 500) {
    if (!data.hasCollateral) tips.push({ text: 'Adding collateral documentation can boost financial readiness by +250', impact: '+250', pillar: 'Financial' });
    if (!data.scholarshipExpected) tips.push({ text: 'Research scholarships — even expected ones add +100 points', impact: '+100', pillar: 'Financial' });
  }

  if (breakdown.profile.score < 500) {
    if (!data.hasSOP) tips.push({ text: 'Draft your Statement of Purpose for +200 points', impact: '+200', pillar: 'Profile' });
    if (!data.hasLOR || data.lorCount < 3) tips.push({ text: 'Secure 3 Letters of Recommendation for up to +240 points', impact: '+240', pillar: 'Profile' });
    if (!data.hasResume) tips.push({ text: 'Upload your resume to gain +150 profile points', impact: '+150', pillar: 'Profile' });
  }

  if (breakdown.alignment.score < 700) {
    if (!data.targetUniversities || data.targetUniversities.length === 0) tips.push({ text: 'Shortlist target universities to improve alignment by +150', impact: '+150', pillar: 'Alignment' });
    if (!data.intakeTimeline) tips.push({ text: 'Set your target intake timeline for +80 points', impact: '+80', pillar: 'Alignment' });
  }

  if (breakdown.progress.score < 400) {
    if (!data.testsTaken) tips.push({ text: 'Register for entrance tests to gain +200 progress points', impact: '+200', pillar: 'Progress' });
    if (!data.applicationsStarted) tips.push({ text: 'Start your first application for +150 points', impact: '+150', pillar: 'Progress' });
  }

  return tips.slice(0, 5);
}
