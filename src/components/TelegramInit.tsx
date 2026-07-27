"use client";

import { useEffect } from "react";

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  disableVerticalSwipes?: () => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}

// No-ops outside Telegram (e.g. a plain browser tab on the Vercel URL) —
// window.Telegram only exists when the page is opened as a Mini App.
export function TelegramInit() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();
    tg.disableVerticalSwipes?.();
    try {
      tg.setHeaderColor("#050706");
      tg.setBackgroundColor("#050706");
    } catch {
      // Older Telegram clients may not support these calls.
    }
  }, []);

  return null;
}
