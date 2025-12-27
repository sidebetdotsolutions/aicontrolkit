/**
 * POST /api/subscribe
 * Captures email for waitlist
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  
  try {
    const body = await request.json();
    const { email, jurisdictions = [], source = 'unknown' } = body;
    
    // Validate email
    if (!email || !email.includes('@') || !email.includes('.')) {
      return new Response(
        JSON.stringify({ error: 'Valid email required' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if Resend API key is configured
    if (!env.RESEND_API_KEY) {
      console.log('Waitlist signup (no Resend configured):', {
        email: normalizedEmail,
        jurisdictions,
        source,
        timestamp: new Date().toISOString()
      });
      
      // Still return success for development
      return new Response(
        JSON.stringify({ success: true, message: 'Signed up (dev mode)' }),
        { status: 200, headers: corsHeaders }
      );
    }
    
    // Send welcome email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || 'AI Control Kit <hello@aicontrolkit.com>',
        to: normalizedEmail,
        subject: "You're on the AI Control Kit waitlist",
        html: generateWelcomeEmail(jurisdictions)
      })
    });
    
    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend email error:', error);
      // Don't fail - email is nice-to-have
    }
    
    // Add to Resend Contacts (new global contacts API - no audience ID needed)
    try {
      await fetch('https://api.resend.com/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          unsubscribed: false,
          // Custom properties for segmentation
          properties: {
            jurisdictions: jurisdictions.join(','),
            source,
            signed_up_at: new Date().toISOString(),
            country: request.cf?.country || 'unknown'
          }
        })
      });
    } catch (e) {
      console.error('Resend contacts error:', e);
      // Don't fail the request
    }
    
    // Log signup for analytics
    console.log('Waitlist signup:', {
      email: normalizedEmail,
      jurisdictions,
      source,
      country: request.cf?.country,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
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

function generateWelcomeEmail(jurisdictions) {
  const jurisdictionText = jurisdictions.length > 0
    ? `<p>You generated a policy for: <strong>${jurisdictions.join(', ').toUpperCase()}</strong></p>`
    : '';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-size: 32px; color: #22c55e;">◈</span>
    <h1 style="margin: 10px 0; font-size: 24px;">AI Control Kit</h1>
  </div>
  
  <h2 style="color: #22c55e; margin-bottom: 20px;">Thanks for your interest!</h2>
  
  ${jurisdictionText}
  
  <p>We're building the complete AI governance platform with:</p>
  
  <ul style="padding-left: 20px;">
    <li><strong>Saved policies</strong> with version history</li>
    <li><strong>Compliance updates</strong> when regulations change</li>
    <li><strong>Watermark-free</strong> PDF exports</li>
    <li><strong>Team collaboration</strong> features</li>
    <li>The <strong>"Permit Office"</strong> for AI agent governance</li>
  </ul>
  
  <p>We'll notify you as soon as early access is available.</p>
  
  <p style="margin-top: 30px; color: #666;">
    — The AI Control Kit Team
  </p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #999; text-align: center;">
    You received this email because you signed up for the AI Control Kit waitlist.<br>
    <a href="https://aicontrolkit.com" style="color: #22c55e;">aicontrolkit.com</a>
  </p>
</body>
</html>
  `.trim();
}
