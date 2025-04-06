
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

interface SignatureParams {
  method: string;
  path: string;
  timestamp: string;
  apiKey: string;
  apiSecret: string;
  body?: string;
}

/**
 * Generates HMACSHA256 signature for RCM API authentication as per:
 * https://support.rentalcarmanager.com/portal/en/kb/developer-s-support
 * 
 * The signature is created by:
 * 1. Constructing a string to sign with method, path, timestamp, apiKey, and body
 * 2. Creating an HMAC SHA256 hash of this string using the API secret
 * 3. Base64 encoding the resulting hash
 */
export function generateSignature({
  method,
  path,
  timestamp,
  apiKey,
  apiSecret,
  body = ''
}: SignatureParams): string {
  // Create the string to sign exactly as per RCM docs
  // Format: METHOD\nPATH\nTIMESTAMP\nAPI_KEY\nBODY
  // Note: The path must not include the base URL
  const stringToSign = [
    method.toUpperCase(),
    path.startsWith('/') ? path.slice(1) : path,
    timestamp,
    apiKey,
    body
  ].join('\n');
  
  // Log for debugging
  console.log('RCM API - String to sign:', stringToSign);
  
  // Generate HMAC SHA256 signature using the API secret as the key
  const signature = HmacSHA256(stringToSign, apiSecret);
  
  // Base64 encode the signature as required by RCM
  const base64Signature = Base64.stringify(signature);
  
  // Log the final signature for debugging
  console.log('RCM API - Generated signature:', base64Signature);
  
  return base64Signature;
}
