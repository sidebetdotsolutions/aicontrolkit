/**
 * POST /api/generate
 * Generates policy document from answers
 */

import { generatePolicy } from '../lib/jurisdictions/index.js';
import { trackGeneration } from '../lib/hooks/analytics.js';
import { signToken } from '../lib/auth/tokens.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  
  try {
    const body = await request.json();
    const { jurisdictions: selectedIds, answers, sessionId } = body;
    
    // Validate input
    if (!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one jurisdiction must be selected' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (!answers || typeof answers !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Answers are required' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Analytics hook (non-blocking)
    try {
      await trackGeneration({
        jurisdictions: selectedIds,
        sessionId,
        request
      });
    } catch (e) {
      console.error('Analytics error:', e);
      // Don't fail the request for analytics errors
    }
    
    // Generate policy
    const policy = generatePolicy(selectedIds, answers);
    
    // Create PDF token (for later PDF download)
    let pdfToken = null;
    try {
      pdfToken = await signToken(
        { 
          selectedIds, 
          answers,
          generatedAt: policy.generatedAt 
        },
        env.TOKEN_SECRET || 'development-secret-change-in-production',
        { expiresIn: 600 } // 10 minutes
      );
    } catch (e) {
      console.error('Token signing error:', e);
      // PDF will fall back to client-side generation
    }
    
    return new Response(
      JSON.stringify({ policy, pdfToken }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Generate error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate policy' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
