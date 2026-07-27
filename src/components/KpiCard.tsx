import type { KpiMetric } from "@/lib/types";
import { ArrowDownIcon, ArrowUpIcon } from "./icons";
import { Sparkline } from "./Sparkline";

export function KpiCard({
  metric,
  className = "",
}: {
  metric: KpiMetric;
  className?: string;
}) {
  const { label, value, delta, isPositive, sparkline } = metric;
  const DeltaIcon = delta >= 0 ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className={`card flex flex-col p-5 md:p-6 ${className}`}>
      <span className="text-[12px] font-medium text-ink-secondary">
        {label}
      </span>

      <div className="mt-4 flex items-end justify-between gap-2">
        <span className="tabular whitespace-nowrap text-[24px] font-medium leading-none tracking-tight text-ink-primary md:text-[28px]">
          {value}
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
        <Sparkline data={sparkline} positive={isPositive} />
      </div>
    </div>
  );
}
