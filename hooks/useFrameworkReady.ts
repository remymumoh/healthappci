import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    // Framework ready logic - this is required for the framework to function properly
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady();
    }
  }, []);
}