"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint } from "@/lib/types";
import { formatAxisTick, formatCompact } from "@/lib/format";
import { BarChartIcon, LineChartIcon } from "./icons";

type ChartMode = "line" | "bar";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const current = payload.find((p) => p.dataKey === "revenue")?.value ?? 0;
  const previous =
    payload.find((p) => p.dataKey === "previousRevenue")?.value ?? 0;

  return (
    <div className="rounded-xl border border-border-strong bg-surface-solid/95 px-3.5 py-2.5 text-[12px] backdrop-blur-xl">
      <p className="mb-2 font-medium text-ink-primary">{label}</p>
      <div className="flex items-center gap-2 text-ink-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
        Текущий
        <span className="tabular ml-auto pl-3 text-ink-primary">
          {formatCompact(current)}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-ink-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-ink-muted" />
        Прошлый
        <span className="tabular ml-auto pl-3 text-ink-primary">
          {formatCompact(previous)}
        </span>
      </div>
    </div>
  );
}

export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  const [mode, setMode] = useState<ChartMode>("line");

  return (
    <div className="card card-glow-top flex h-full flex-col p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-medium tracking-tight text-ink-primary">
            Динамика выручки
          </h2>
          <p className="mt-1 text-[12px] text-ink-muted">
            Помесячно, с наложением прошлого периода
          </p>
        </div>

        <div className="flex shrink-0 gap-0.5 rounded-full border border-border bg-surface-inner p-1">
          <button
            aria-label="Линейный график"
            aria-pressed={mode === "line"}
            onClick={() => setMode("line")}
            className={`rounded-full p-1.5 transition-colors ${
              mode === "line"
                ? "bg-accent-soft text-accent-bright"
                : "text-ink-muted hover:text-ink-secondary"
            }`}
          >
            <LineChartIcon className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Столбчатый график"
            aria-pressed={mode === "bar"}
            onClick={() => setMode("bar")}
            className={`rounded-full p-1.5 transition-colors ${
              mode === "bar"
                ? "bg-accent-soft text-accent-bright"
                : "text-ink-muted hover:text-ink-secondary"
            }`}
          >
            <BarChartIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-[11px] text-ink-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
          Текущий период
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-muted" />
          Прошлый период
        </span>
      </div>

      <div className="mt-5 h-[220px] w-full md:h-[300px] lg:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          {mode === "line" ? (
            <AreaChart data={data} margin={{ top: 8, right: 4, left: -6, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-bright)" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="var(--accent-bright)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={16}
                tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
                dy={4}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={62}
                tick={{ fill: "var(--ink-muted)", fontSize: 10 }}
                tickFormatter={formatAxisTick}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-strong)" }} />
              <Area
                type="monotone"
                dataKey="previousRevenue"
                stroke="var(--ink-muted)"
                strokeWidth={1.5}
                strokeOpacity={0.55}
                fill="none"
                isAnimationActive={false}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--accent-bright)"
                strokeWidth={2}
                fill="url(#revenueFill)"
                isAnimationActive={false}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--accent-bright)",
                  stroke: "var(--page)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 4, left: -6, bottom: 0 }} barGap={3}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={16}
                tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
                dy={4}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={62}
                tick={{ fill: "var(--ink-muted)", fontSize: 10 }}
                tickFormatter={formatAxisTick}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-hover)" }} />
              <Bar
                dataKey="previousRevenue"
                fill="var(--ink-muted)"
                fillOpacity={0.3}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                maxBarSize={14}
              />
              <Bar
                dataKey="revenue"
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                maxBarSize={14}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
