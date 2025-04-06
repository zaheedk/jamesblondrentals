
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
 * Based on the actual API format shown in Postman collection
 */
export function generateSignature({
  method,
  path,
  timestamp,
  apiKey,
  apiSecret,
  body = ''
}: SignatureParams): string {
  // Using the body directly as the string to sign
  const stringToSign = body || '{}';
  
  // Log for debugging
  console.log('RCM API - String to sign:', stringToSign);
  
  // Generate HMAC SHA256 signature using the API secret as the key
  const signature = HmacSHA256(stringToSign, apiSecret);
  
  // Return HEX encoded signature (uppercase)
  const hexSignature = Hex.stringify(signature).toUpperCase();
  
  // Log the final signature for debugging
  console.log('RCM API - Generated signature:', hexSignature);
  
  return hexSignature;
}
