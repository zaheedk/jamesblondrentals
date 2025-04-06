
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
 * Generates HMACSHA256 signature for RCM API authentication
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
  // Create the string to sign (newline separated values)
  // Format: METHOD\nPATH\nTIMESTAMP\nAPI_KEY\nBODY
  const stringToSign = `${method.toUpperCase()}\n${path}\n${timestamp}\n${apiKey}\n${body}`;
  
  // Log for debugging
  console.log('String to sign:', stringToSign);
  
  // Generate HMAC SHA256 signature using the API secret as the key
  const signature = HmacSHA256(stringToSign, apiSecret);
  
  // Return Base64 encoded signature
  return Base64.stringify(signature);
}
