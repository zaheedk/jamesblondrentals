
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
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
 * Based on the actual API format: 
 * https://apis.rentalcarmanager.com/booking/v3.2/[API_KEY]?apikey=[API_KEY]
 * With request body: {"method":"step1"}
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
  // Format appears to be the JSON body itself
  const stringToSign = body || '{}';
  
  // Log for debugging
  console.log('RCM API - String to sign:', stringToSign);
  
  // Generate HMAC SHA256 signature using the API secret as the key
  const signature = HmacSHA256(stringToSign, apiSecret);
  
  // Return HEX encoded signature (not Base64)
  const hexSignature = Hex.stringify(signature).toUpperCase();
  
  // Log the final signature for debugging
  console.log('RCM API - Generated signature:', hexSignature);
  
  return hexSignature;
}
