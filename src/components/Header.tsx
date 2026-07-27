"use client";

import type { Period } from "@/lib/types";
import { PeriodSwitcher } from "./PeriodSwitcher";

export function Header({
  period,
  onPeriodChange,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-page/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-border bg-accent-soft text-accent-bright">
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path
                d="M2 12.5l3.5-4.5 3 2.5L14 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-[16px] font-medium leading-tight tracking-tight text-ink-primary">
              Revenue
            </h1>
            <p className="text-[12px] text-ink-muted">Аналитика продаж</p>
          </div>
        </div>
        <PeriodSwitcher value={period} onChange={onPeriodChange} />
      </div>
    </header>
  );
}
