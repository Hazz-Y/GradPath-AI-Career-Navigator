export function formatCurrency(amount, currency = 'INR') {
  if (currency === 'INR') {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getCountryFlag(country) {
  const codes = {
    'USA': 'US', 'UK': 'GB', 'Canada': 'CA', 'Germany': 'DE',
    'Australia': 'AU', 'France': 'FR', 'Switzerland': 'CH',
    'Netherlands': 'NL', 'Sweden': 'SE', 'Singapore': 'SG',
    'India': 'IN', 'Japan': 'JP', 'South Korea': 'KR'
  };
  return codes[country] || '';
}

export function getScoreColor(score) {
  if (score >= 901) return '#C9A96E';
  if (score >= 751) return '#2DD4BF';
  if (score >= 551) return '#10B981';
  if (score >= 301) return '#8A6E42';
  return '#4A5568';
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function animateValue(start, end, duration, callback) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    callback(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
