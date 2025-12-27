/**
 * GET /api/questions/[id]
 * Returns questions for a specific jurisdiction
 */

import { getJurisdictionQuestions } from '../../../lib/jurisdictions/index.js';

export async function onRequestGet(context) {
  const { params } = context;
  const jurisdictionId = params.id;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  
  try {
    const questions = getJurisdictionQuestions(jurisdictionId);
    
    if (!questions) {
      return new Response(
        JSON.stringify({ error: `Jurisdiction '${jurisdictionId}' not found` }),
        { status: 404, headers: corsHeaders }
      );
    }
    
    return new Response(
      JSON.stringify(questions),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`Error fetching questions for ${jurisdictionId}:`, error);
    return new Response(
      JSON.stringify({ error: 'Failed to load questions' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
