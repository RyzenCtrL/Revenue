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
      className="flex gap-1 overflow-x-auto no-scrollbar rounded-full border border-border bg-surface-inner p-1"
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
            className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 ${
              active
                ? "accent-glass text-accent-bright"
                : "border border-transparent text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        );
      })}
    </div>
  );
}
