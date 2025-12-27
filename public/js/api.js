/**
 * AI Control Kit — API Client
 * Handles all communication with the Cloudflare Workers backend
 */

const API_BASE = '/api';

/**
 * Fetch available jurisdictions
 * @returns {Promise<{jurisdictions: Array}>}
 */
async function fetchJurisdictions() {
  const res = await fetch(`${API_BASE}/jurisdictions`);
  if (!res.ok) {
    throw new Error('Failed to load jurisdictions');
  }
  return res.json();
}

/**
 * Fetch questions for a specific jurisdiction
 * @param {string} jurisdictionId 
 * @returns {Promise<{jurisdiction: string, questions: Array}>}
 */
async function fetchQuestions(jurisdictionId) {
  const res = await fetch(`${API_BASE}/questions/${jurisdictionId}`);
  if (!res.ok) {
    throw new Error(`Failed to load questions for ${jurisdictionId}`);
  }
  return res.json();
}

/**
 * Generate a policy from answers
 * @param {string[]} jurisdictions 
 * @param {Object} answers 
 * @returns {Promise<{policy: Object, pdfToken: string}>}
 */
async function generatePolicy(jurisdictions, answers) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jurisdictions, answers })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to generate policy');
  }
  return res.json();
}

/**
 * Download the PDF
 * @param {string} token 
 */
async function downloadPdfFromServer(token) {
  const res = await fetch(`${API_BASE}/pdf?token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    throw new Error('Failed to generate PDF');
  }
  
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ai-governance-policy.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

/**
 * Subscribe to waitlist
 * @param {string} email 
 * @param {Object} metadata 
 * @returns {Promise<{success: boolean}>}
 */
async function subscribe(email, metadata = {}) {
  const res = await fetch(`${API_BASE}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...metadata })
  });
  if (!res.ok) {
    throw new Error('Failed to subscribe');
  }
  return res.json();
}
