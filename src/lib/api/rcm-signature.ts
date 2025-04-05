
import { createHmac } from 'crypto-js';
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
 */
export function generateSignature({
  method,
  path,
  timestamp,
  apiKey,
  apiSecret,
  body = ''
}: SignatureParams): string {
  // Create the string to sign
  const stringToSign = `${method.toUpperCase()}\n${path}\n${timestamp}\n${apiKey}\n${body}`;
  
  // Generate HMAC SHA256 signature
  const signature = HmacSHA256(stringToSign, apiSecret);
  
  // Return Base64 encoded signature
  return Base64.stringify(signature);
}
