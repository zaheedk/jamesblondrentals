
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';

interface SignatureParams {
  method: string;
  path: string;
  timestamp: string;
  apiKey: string;
  apiSecret: string;
  body?: string;
}

/**
 * Generates signature for RCM API authentication as per:
 * https://support.rentalcarmanager.com/portal/en/kb/developer-s-support
 * 
 * Based on the Postman collection implementation with fixes for production deployment
 */
export function generateSignature({
  method,
  path,
  timestamp,
  apiKey,
  apiSecret,
  body = ''
}: SignatureParams): string {
  // Normalize body to ensure consistent string representation
  const normalizedBody = typeof body === 'string' ? body : JSON.stringify(body || {});
  
  // For production compatibility, ensure we're using a consistent string representation
  const stringToSign = normalizedBody.trim() || '{}';
  
  // Generate HMAC SHA256 signature using the API secret as the key
  const signature = HmacSHA256(stringToSign, apiSecret);
  
  // Return HEX encoded signature
  const hexSignature = Hex.stringify(signature).toUpperCase();
  
  console.log('RCM API - Generating signature', {
    method,
    bodyLength: stringToSign.length,
    signature: hexSignature,
    environment: import.meta.env.MODE || 'unknown'
  });
  
  return hexSignature;
}
