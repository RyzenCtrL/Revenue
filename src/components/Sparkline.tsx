"use client";

import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import type { MetricUnit, SparklinePoint } from "@/lib/types";
import { formatByUnit } from "@/lib/format";
import { useCurrency } from "@/lib/currency";

function SparkTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: { payload: SparklinePoint }[];
  unit: MetricUnit;
}) {
  const { currency } = useCurrency();
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="pointer-events-none rounded-lg border border-border-strong bg-surface-solid/95 px-2.5 py-1.5 text-[11px] backdrop-blur-xl">
      <p className="text-ink-muted">{point.label}</p>
      <p className="tabular font-medium text-ink-primary">
        {formatByUnit(point.value, unit, currency)}
      </p>
    </div>
  );
}

export function Sparkline({
  data,
  positive,
  unit,
}: {
  data: SparklinePoint[];
  positive: boolean;
  unit: MetricUnit;
}) {
  const uid = useId();
  const color = positive ? "var(--accent-bright)" : "var(--negative)";
  const lightColor = positive ? "#a7f5c8" : "#f4bcb8";
  const fillId = `spark-fill-${uid}`;
  const strokeId = `spark-stroke-${uid}`;

  return (
    <div className="h-11 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 3, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={lightColor} />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
          <Tooltip
            content={<SparkTooltip unit={unit} />}
            cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={`url(#${strokeId})`}
            strokeWidth={1.5}
            fill={`url(#${fillId})`}
            isAnimationActive={true}
            animationDuration={450}
            animationEasing="ease-out"
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: "var(--page)", strokeWidth: 1.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
