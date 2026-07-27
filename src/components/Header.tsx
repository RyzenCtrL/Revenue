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
    <header className="sticky top-0 z-30 border-b border-border bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-3 md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent-bright ring-1 ring-accent/25">
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
              <h1 className="text-[15px] font-semibold leading-tight text-ink-primary md:text-lg">
                Revenue
              </h1>
              <p className="hidden text-xs text-ink-muted md:block">
                Аналитика продаж
              </p>
            </div>
          </div>
        </div>
        <PeriodSwitcher value={period} onChange={onPeriodChange} />
      </div>
    </header>
  );
}
