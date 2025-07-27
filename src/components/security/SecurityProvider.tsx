import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateCSRFToken, formSubmissionLimiter, authLimiter } from '@/lib/security';

interface SecurityContextType {
  csrfToken: string;
  refreshCSRFToken: () => void;
  checkFormRateLimit: (identifier: string) => boolean;
  checkAuthRateLimit: (identifier: string) => boolean;
  isSecurityReady: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [csrfToken, setCSRFToken] = useState<string>('');
  const [isSecurityReady, setIsSecurityReady] = useState(false);

  const refreshCSRFToken = () => {
    const newToken = generateCSRFToken();
    setCSRFToken(newToken);
    sessionStorage.setItem('csrf_token', newToken);
  };

  const checkFormRateLimit = (identifier: string): boolean => {
    return formSubmissionLimiter.isAllowed(identifier);
  };

  const checkAuthRateLimit = (identifier: string): boolean => {
    return authLimiter.isAllowed(identifier);
  };

  useEffect(() => {
    // Initialize CSRF token
    const existingToken = sessionStorage.getItem('csrf_token');
    if (existingToken && existingToken.length === 64) {
      setCSRFToken(existingToken);
    } else {
      refreshCSRFToken();
    }
    
    setIsSecurityReady(true);

    // Refresh CSRF token every 15 minutes
    const interval = setInterval(refreshCSRFToken, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const value: SecurityContextType = {
    csrfToken,
    refreshCSRFToken,
    checkFormRateLimit,
    checkAuthRateLimit,
    isSecurityReady,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}