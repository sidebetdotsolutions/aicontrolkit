/**
 * AI Control Kit — Token Utilities
 * Simple token signing and verification for PDF downloads
 * 
 * Uses Web Crypto API available in Cloudflare Workers
 */

/**
 * Sign a payload into a token
 * @param {Object} payload - Data to encode
 * @param {string} secret - Secret key for signing
 * @param {Object} options - Options like expiresIn (seconds)
 * @returns {Promise<string>} - Signed token
 */
export async function signToken(payload, secret, options = {}) {
  const { expiresIn = 600 } = options; // Default 10 minutes
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const message = `${encodedHeader}.${encodedPayload}`;
  
  const signature = await sign(message, secret);
  
  return `${message}.${signature}`;
}

/**
 * Verify and decode a token
 * @param {string} token - Token to verify
 * @param {string} secret - Secret key for verification
 * @returns {Promise<Object|null>} - Decoded payload or null if invalid
 */
export async function verifyToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;
    
    // Verify signature
    const expectedSignature = await sign(message, secret);
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }
    
    return payload;
  } catch (e) {
    console.error('Token verification error:', e);
    return null;
  }
}

/**
 * Sign a message with HMAC-SHA256
 */
async function sign(message, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(str) {
  const base64 = btoa(str);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str) {
  let base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  
  return atob(base64);
}
