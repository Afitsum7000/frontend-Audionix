'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ApiKeyContextValue = {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
};

const ApiKeyContext = createContext<ApiKeyContextValue | undefined>(undefined);

const STORAGE_KEY = 'audionix_api_key';

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  // Load from sessionStorage on mount (optional persistence)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKeyState(stored);
    }
  }, []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STORAGE_KEY, key);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<ApiKeyContextValue>(
    () => ({
      apiKey,
      setApiKey,
      clearApiKey,
    }),
    [apiKey, setApiKey, clearApiKey],
  );

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
}

export function useApiKey(): ApiKeyContextValue {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return ctx;
}

