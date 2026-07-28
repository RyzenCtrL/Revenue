"use client";

import type { KpiMetric } from "@/lib/types";
import { formatHeadlineFromConverted, formatNumber, formatPercent } from "@/lib/format";
import { useCurrency, convertAmount } from "@/lib/currency";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { ArrowDownIcon, ArrowUpIcon } from "./icons";
import { Sparkline } from "./Sparkline";

export function KpiCard({
  metric,
  className = "",
}: {
  metric: KpiMetric;
  className?: string;
}) {
  const { label, rawValue, delta, isPositive, sparkline, unit } = metric;
  const { currency } = useCurrency();
  const DeltaIcon = delta >= 0 ? ArrowUpIcon : ArrowDownIcon;

  // Animate the already-converted number, not the raw RUB value, so a
  // period change AND a ₽↔$ toggle both trigger a count-up (the raw value
  // alone doesn't change when only the currency does).
  const target = unit === "currency" ? convertAmount(rawValue, currency) : rawValue;
  const animated = useAnimatedNumber(target);

  const displayValue =
    unit === "currency"
      ? formatHeadlineFromConverted(animated, currency)
      : unit === "percent"
        ? formatPercent(animated)
        : formatNumber(Math.round(animated));

  return (
    <div className={`card flex flex-col p-5 md:p-6 ${className}`}>
      <span className="text-[12px] font-medium text-ink-secondary">
        {label}
      </span>

      <div className="mt-4 flex items-end justify-between gap-2">
        <span className="tabular whitespace-nowrap text-[24px] font-medium leading-none tracking-tight text-ink-primary md:text-[28px]">
          {displayValue}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={`flex items-center gap-1 text-[12px] font-medium tabular ${
            isPositive ? "text-accent-bright" : "text-negative"
          }`}
        >
          <DeltaIcon className="h-2.5 w-2.5" />
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="text-[11px] text-ink-muted">за период</span>
      </div>

      <div className="mt-5 -mx-1">
        <Sparkline data={sparkline} positive={isPositive} unit={unit} />
      </div>
    </div>
  );
}
