import type { KpiMetric } from "@/lib/types";
import { KpiCard } from "./KpiCard";

export function KpiGrid({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
      {metrics.map((m, i) => (
        <KpiCard
          key={m.id}
          metric={m}
          className={
            i === metrics.length - 1 && metrics.length % 2 === 1
              ? "col-span-2 md:col-span-1"
              : ""
          }
        />
      ))}
    </div>
  );
}
