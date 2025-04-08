
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates required URL parameters are present and logs any missing parameters
 * @param params The URL search params object
 * @param requiredParams Array of required parameter names
 * @returns Object with validation result and any missing parameters
 */
export function validateUrlParams(
  params: URLSearchParams, 
  requiredParams: string[]
): { isValid: boolean; missingParams: string[] } {
  const missingParams = requiredParams.filter(param => !params.get(param));
  
  if (missingParams.length > 0) {
    console.error('Missing required URL parameters:', missingParams);
    console.log('Available parameters:', Object.fromEntries(params));
  }
  
  return {
    isValid: missingParams.length === 0,
    missingParams
  };
}
