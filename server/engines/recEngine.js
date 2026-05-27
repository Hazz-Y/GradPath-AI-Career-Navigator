// Recommendation Engine — Cosine Similarity matching
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let universities = [];
try {
  universities = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'universities.json'), 'utf-8'));
} catch (e) {
  console.error('Failed to load universities:', e.message);
}

function normalizeVector(vec) {
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return magnitude === 0 ? vec : vec.map(v => v / magnitude);
}

function cosineSimilarity(a, b) {
  const normA = normalizeVector(a);
  const normB = normalizeVector(b);
  return normA.reduce((sum, v, i) => sum + v * normB[i], 0);
}

function profileToVector(profile) {
  return [
    (profile.gpa || 0) / 10,
    (profile.greScore || 0) / 340,
    (profile.gmatScore || 0) / 800,
    (profile.ieltsScore || 0) / 9,
    (profile.toeflScore || 0) / 120,
    profile.budgetMax ? Math.min(profile.budgetMax / 100000, 1) : 0.5,
    profile.preferStem ? 1 : 0,
    profile.workYears ? Math.min(profile.workYears / 10, 1) : 0
  ];
}

function universityToVector(uni) {
  return [
    uni.gre_avg ? uni.gre_avg / 340 : 0.5,
    uni.gre_avg ? uni.gre_avg / 340 : 0.5,
    uni.gmat_avg ? uni.gmat_avg / 800 : 0.5,
    uni.ielts_min ? uni.ielts_min / 9 : 0.5,
    uni.toefl_min ? uni.toefl_min / 120 : 0.5,
    uni.tuition ? Math.min(uni.tuition / 100000, 1) : 0.5,
    uni.department && ['CS', 'CSE', 'EECS', 'SCS', 'CoC', 'Viterbi', 'SCAI', 'D-INFK', 'IC', 'CIS', 'SCSE'].includes(uni.department) ? 1 : 0,
    0.5
  ];
}

export function getRecommendations(profile, options = {}) {
  const maxResults = options.maxResults || 10;
  const profileVec = profileToVector(profile);

  let filteredUnis = [...universities];

  // Filter by country preference
  if (profile.targetCountries && profile.targetCountries.length > 0) {
    filteredUnis = filteredUnis.filter(u =>
      profile.targetCountries.some(c => u.country.toLowerCase().includes(c.toLowerCase()))
    );
  }

  // Filter by course type
  if (profile.courseType) {
    if (profile.courseType === 'ms') {
      filteredUnis = filteredUnis.filter(u => u.course.toLowerCase().includes('ms') || u.course.toLowerCase().includes('master') || u.course.toLowerCase().includes('mphil') || u.course.toLowerCase().includes('m.tech') || u.course.toLowerCase().includes('mmath'));
    } else if (profile.courseType === 'mba') {
      filteredUnis = filteredUnis.filter(u => u.course.toLowerCase().includes('mba') || u.course.toLowerCase().includes('pgp'));
    }
  }

  // If no results after filtering, fallback to all
  if (filteredUnis.length === 0) filteredUnis = [...universities];

  const scored = filteredUnis.map(uni => {
    const uniVec = universityToVector(uni);
    const similarity = cosineSimilarity(profileVec, uniVec);

    // Bonus factors
    let bonus = 0;
    if (profile.greScore && uni.gre_avg && profile.greScore >= uni.gre_avg) bonus += 0.1;
    if (profile.gmatScore && uni.gmat_avg && profile.gmatScore >= uni.gmat_avg) bonus += 0.1;
    if (profile.ieltsScore && uni.ielts_min && profile.ieltsScore >= uni.ielts_min) bonus += 0.05;
    if (uni.scholarship) bonus += 0.03;

    const matchScore = Math.min((similarity + bonus) * 100, 99);

    // Categorize
    let category;
    if (matchScore >= 75) category = 'Safe';
    else if (matchScore >= 55) category = 'Moderate';
    else category = 'Ambitious';

    return { ...uni, matchScore: Math.round(matchScore), category };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, maxResults);
}

export function getAllUniversities() {
  return universities;
}
