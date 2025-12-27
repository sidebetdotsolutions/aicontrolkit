/**
 * AI Control Kit — Jurisdiction Registry
 * Central registry of all supported jurisdictions
 */

import eu from './eu.js';
import usa from './usa.js';
import uk from './uk.js';
import brazil from './brazil.js';
import china from './china.js';
import australia from './australia.js';
import canada from './canada.js';

export const jurisdictions = {
  eu,
  usa,
  uk,
  brazil,
  china,
  australia,
  canada
};

/**
 * Get jurisdiction metadata for the listing endpoint
 */
export function getJurisdictionList() {
  return Object.values(jurisdictions).map(j => ({
    id: j.id,
    name: j.name,
    regulation: j.regulation,
    icon: j.icon,
    questionCount: j.questions.length
  }));
}

/**
 * Get questions for a specific jurisdiction
 */
export function getJurisdictionQuestions(id) {
  const jurisdiction = jurisdictions[id];
  if (!jurisdiction) return null;
  
  return {
    jurisdiction: id,
    questions: jurisdiction.questions.map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      help: q.help,
      options: q.options,
      dependsOn: q.dependsOn
    }))
  };
}

/**
 * Generate policy for selected jurisdictions
 */
export function generatePolicy(selectedIds, answers) {
  const sections = [];
  
  for (const id of selectedIds) {
    const jurisdiction = jurisdictions[id];
    if (!jurisdiction) continue;
    
    const jurisdictionAnswers = answers[id] || {};
    const content = jurisdiction.generatePolicy(jurisdictionAnswers);
    
    sections.push({
      jurisdiction: id,
      title: `${jurisdiction.name} — ${jurisdiction.regulation}`,
      content
    });
  }
  
  return {
    generatedAt: new Date().toISOString(),
    sections
  };
}
