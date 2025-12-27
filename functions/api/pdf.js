/**
 * GET /api/pdf?token=xxx
 * Generates and returns PDF from token
 * 
 * Note: Server-side PDF generation in Workers is limited.
 * This endpoint validates the token and returns data for client-side generation,
 * or could integrate with a PDF service in the future.
 */

import { verifyToken } from '../../lib/auth/tokens.js';
import { generatePolicy } from '../../lib/jurisdictions/index.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
  };
  
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Token required' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  try {
    // Verify token
    const payload = await verifyToken(
      token, 
      env.TOKEN_SECRET || 'development-secret-change-in-production'
    );
    
    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { selectedIds, answers } = payload;
    
    // Regenerate the policy
    const policy = generatePolicy(selectedIds, answers);
    
    // For now, return JSON that client will use for PDF generation
    // In production, you could integrate with a PDF service like:
    // - Puppeteer/Playwright via a separate service
    // - PDFShift, DocRaptor, or similar APIs
    // - A dedicated PDF microservice
    
    return new Response(
      JSON.stringify({ 
        policy,
        message: 'Use client-side PDF generation with this data'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
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
