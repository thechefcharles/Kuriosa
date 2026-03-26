"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY_PREFIX = "kuriosa-daily-boost-revealed";

function getTodayKey(): string {
  if (typeof window === "undefined") return "";
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getStored(): boolean {
  if (typeof window === "undefined") return false;
  const key = `${STORAGE_KEY_PREFIX}-${getTodayKey()}`;
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function setStored(value: boolean): void {
  if (typeof window === "undefined") return;
  const key = `${STORAGE_KEY_PREFIX}-${getTodayKey()}`;
  try {
    if (value) {
      localStorage.setItem(key, "true");
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export function useDailyBoostRevealed(): [boolean, (revealed: boolean) => void] {
  const [revealed, setRevealedState] = useState(false);

  useEffect(() => {
    setRevealedState(getStored());
  }, []);

  const setRevealed = useCallback((value: boolean) => {
    setRevealedState(value);
    setStored(value);
  }, []);

  return [revealed, setRevealed];
}
