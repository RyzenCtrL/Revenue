"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type Currency = "RUB" | "USD";

// Mock fixed rate — this is a portfolio project with fake data, not a live
// FX feed. 1 USD ≈ 95 RUB.
const USD_PER_RUB = 1 / 95;

export function convertAmount(rubValue: number, currency: Currency): number {
  return currency === "USD" ? rubValue * USD_PER_RUB : rubValue;
}

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("RUB");
  const value = useMemo(() => ({ currency, setCurrency }), [currency]);
  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
