"use client";

import type { Period } from "@/lib/types";
import { PERIOD_LABELS } from "@/lib/mock-data";

const PERIODS: Period[] = ["today", "week", "month", "year"];

export function PeriodSwitcher({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto no-scrollbar md:gap-1 md:rounded-xl md:border md:border-border md:bg-surface-solid md:p-1"
      role="tablist"
      aria-label="Период"
    >
      {PERIODS.map((p) => {
        const active = p === value;
        return (
          <button
            key={p}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(p)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors md:px-4 md:py-1.5 ${
              active
                ? "bg-accent-soft text-accent-bright border border-accent/30 md:border-0"
                : "text-ink-secondary border border-border md:border-0 hover:text-ink-primary hover:bg-surface-hover"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        );
      })}
    </div>
  );
}
