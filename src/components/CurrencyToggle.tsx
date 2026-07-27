"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useCurrency, type Currency } from "@/lib/currency";

const OPTIONS: { value: Currency; label: string }[] = [
  { value: "RUB", label: "₽" },
  { value: "USD", label: "$" },
];

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  const btnRefs = useRef<Partial<Record<Currency, HTMLButtonElement>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const btn = btnRefs.current[currency];
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [currency]);

  return (
    <div
      className="relative flex gap-0.5 rounded-full border border-border bg-surface-inner p-1"
      role="tablist"
      aria-label="Валюта"
    >
      <span
        aria-hidden="true"
        className="accent-glass pointer-events-none absolute inset-y-1 left-0 rounded-full transition-all duration-300 ease-out"
        style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
      />
      {OPTIONS.map((opt) => {
        const active = opt.value === currency;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              btnRefs.current[opt.value] = el ?? undefined;
            }}
            role="tab"
            aria-selected={active}
            onClick={() => setCurrency(opt.value)}
            className={`relative z-10 w-7 rounded-full py-1 text-[12px] font-medium transition-colors duration-200 ${
              active ? "text-accent-bright" : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
