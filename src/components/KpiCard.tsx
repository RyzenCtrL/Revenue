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
    <div
      className={`glass flex flex-col gap-3 rounded-2xl p-4 md:p-5 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-ink-secondary">{label}</span>
        <span
          className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular ${
            isPositive
              ? "bg-accent-soft text-accent-bright"
              : "bg-negative/10 text-negative"
          }`}
        >
          <DeltaIcon className="h-2.5 w-2.5" />
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>

      <span className="font-mono tabular text-[22px] font-semibold leading-none text-ink-primary md:text-[26px]">
        {value}
      </span>

      <Sparkline data={sparkline} positive={isPositive} />
    </div>
  );
}
