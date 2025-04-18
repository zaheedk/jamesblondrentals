
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
 * Based on the Postman collection implementation
 */
export function generateSignature({
  method,
  path,
  timestamp,
  apiKey,
  apiSecret,
  body = ''
}: SignatureParams): string {
  // The API expects the raw request body as the string to sign
  const stringToSign = body || '{}';
  
  // Generate HMAC SHA256 signature using the API secret as the key
  const signature = HmacSHA256(stringToSign, apiSecret);
  
  // Return HEX encoded signature
  const hexSignature = Hex.stringify(signature).toUpperCase();
  
  console.log('RCM API - Generated signature for request', {
    stringToSign: stringToSign.length > 100 ? stringToSign.substring(0, 100) + '...' : stringToSign,
    signature: hexSignature
  });
  
  return hexSignature;
}
