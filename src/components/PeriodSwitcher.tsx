"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
  const btnRefs = useRef<Partial<Record<Period, HTMLButtonElement>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const btn = btnRefs.current[value];
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [value]);

  return (
    <div
      className="relative flex gap-1 overflow-x-auto no-scrollbar rounded-full border border-border bg-surface-inner p-1"
      role="tablist"
      aria-label="Период"
    >
      <span
        aria-hidden="true"
        className="accent-glass pointer-events-none absolute inset-y-1 left-0 rounded-full transition-all duration-300 ease-out"
        style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
      />
      {PERIODS.map((p) => {
        const active = p === value;
        return (
          <button
            key={p}
            ref={(el) => {
              btnRefs.current[p] = el ?? undefined;
            }}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(p)}
            className={`relative z-10 shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 ${
              active
                ? "text-accent-bright"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        );
      })}
    </div>
  );
}
