// ROI Calculator Engine
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let salaryData = {};
try {
  salaryData = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'salaryData.json'), 'utf-8'));
} catch (e) {
  console.error('Failed to load salary data:', e.message);
}

export function calculateROI(params) {
  const { country, tuition, duration, avgSalary, courseType, livingCostOverride } = params;

  const countryData = salaryData.countries[country] || salaryData.countries['USA'];
  const exchangeRate = salaryData.exchangeRates[countryData.currency] || 83.5;
  const progression = salaryData.salaryProgression[courseType] || salaryData.salaryProgression['default'];

  const durationYears = (duration || 24) / 12;
  const yearlyTuition = tuition || 40000;
  const totalTuition = yearlyTuition * durationYears;
  const yearlyLiving = livingCostOverride || countryData.avg_living_cost_yearly;
  const totalLiving = yearlyLiving * durationYears;
  const visaCost = countryData.visa_cost || 0;
  const totalCost = totalTuition + totalLiving + visaCost;
  const totalCostINR = Math.round(totalCost * exchangeRate);

  const baseSalary = avgSalary || 80000;
  const salaryYear1 = Math.round(baseSalary * progression.year1);
  const salaryYear3 = Math.round(baseSalary * progression.year3);
  const salaryYear5 = Math.round(baseSalary * progression.year5);
  const salaryYear10 = Math.round(baseSalary * progression.year10);

  // Opportunity cost (average Indian salary for the duration)
  const opportunityCostPerYear = 800000; // 8L per year
  const opportunityCost = opportunityCostPerYear * durationYears;

  // Calculate break-even
  const annualSavingsRate = 0.35;
  let cumulativeEarnings = 0;
  let breakEvenYear = null;
  const yearlyData = [];

  for (let year = 1; year <= 15; year++) {
    let salary;
    if (year <= 1) salary = salaryYear1;
    else if (year <= 3) salary = salaryYear1 + (salaryYear3 - salaryYear1) * ((year - 1) / 2);
    else if (year <= 5) salary = salaryYear3 + (salaryYear5 - salaryYear3) * ((year - 3) / 2);
    else salary = salaryYear5 + (salaryYear10 - salaryYear5) * ((year - 5) / 5);

    const annualSavings = salary * annualSavingsRate;
    cumulativeEarnings += annualSavings;

    yearlyData.push({
      year,
      salary: Math.round(salary),
      salaryINR: Math.round(salary * exchangeRate),
      cumulativeEarnings: Math.round(cumulativeEarnings),
      cumulativeEarningsINR: Math.round(cumulativeEarnings * exchangeRate),
      netROI: Math.round(cumulativeEarnings - totalCost),
      netROI_INR: Math.round((cumulativeEarnings - totalCost) * exchangeRate)
    });

    if (!breakEvenYear && cumulativeEarnings >= totalCost) {
      breakEvenYear = year;
    }
  }

  const roi5Year = ((cumulativeEarnings - totalCost) / totalCost * 100);
  const totalEarnings10Y = yearlyData.find(y => y.year === 10)?.cumulativeEarnings || 0;

  return {
    totalCost,
    totalCostINR,
    costBreakdown: {
      tuition: totalTuition,
      living: totalLiving,
      visa: visaCost,
      opportunityCost,
      tuitionINR: Math.round(totalTuition * exchangeRate),
      livingINR: Math.round(totalLiving * exchangeRate)
    },
    salary: {
      year1: salaryYear1,
      year3: salaryYear3,
      year5: salaryYear5,
      year10: salaryYear10,
      year1INR: Math.round(salaryYear1 * exchangeRate),
      year3INR: Math.round(salaryYear3 * exchangeRate),
      year5INR: Math.round(salaryYear5 * exchangeRate),
      year10INR: Math.round(salaryYear10 * exchangeRate)
    },
    breakEvenYear: breakEvenYear || 'N/A',
    roiPercentage: Math.round(roi5Year),
    yearlyData,
    country: countryData,
    exchangeRate
  };
}
