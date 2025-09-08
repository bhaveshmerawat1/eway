"use client";
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [localStorageIsReady, setLocalStorageIsReady] = useState(false);

  // Load initial value once
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch {
      // ignore quota/privacy errors
    } finally {
      setLocalStorageIsReady(true);
    }
  }, [key, initialValue]);

  const getLocalStorage = (k: string): T | null => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  };

  const setLocalStorage = (k: string, value: T) => {
    try {
      localStorage.setItem(k, JSON.stringify(value));
    } catch {
      // ignore quota errors
    }
  };

  const deleteLocalStorage = (k: string) => {
    try {
      localStorage.removeItem(k);
    } catch {
      // ignore errors
    }
  };

  return { getLocalStorage, setLocalStorage, deleteLocalStorage, localStorageIsReady } as const;
}
