/**
 * GET /api/jurisdictions
 * Returns list of available jurisdictions with metadata
 */

import { getJurisdictionList } from '../lib/jurisdictions/index.js';

export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  
  try {
    const jurisdictions = getJurisdictionList();
    
    return new Response(
      JSON.stringify({ jurisdictions }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching jurisdictions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load jurisdictions' }),
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
