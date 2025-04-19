
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
  
  // Log for debugging
  console.log('RCM API - Signature generation:');
  console.log('- API Key:', apiKey);
  console.log('- Method:', method);
  console.log('- Path:', path);
  console.log('- Timestamp:', timestamp);
  console.log('- String to sign:', stringToSign);
  
  // Generate HMAC SHA256 signature using the API secret as the key
  // This matches the Postman collection: CryptoJS.HmacSHA256(requestBody, secret)
  const signature = HmacSHA256(stringToSign, apiSecret);
  
  // Return HEX encoded signature to match Postman: toString(CryptoJS.digest)
  const hexSignature = Hex.stringify(signature).toUpperCase();
  
  // Log the final signature for debugging
  console.log('RCM API - Generated signature:', hexSignature);
  
  return hexSignature;
}
