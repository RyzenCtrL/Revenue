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
import { formatCompact } from "@/lib/format";
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
    <div className="glass rounded-xl px-3.5 py-2.5 text-xs shadow-xl">
      <p className="mb-1.5 font-medium text-ink-primary">{label}</p>
      <div className="flex items-center gap-2 text-ink-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Текущий: <span className="tabular text-ink-primary">{formatCompact(current)}</span>
      </div>
      <div className="flex items-center gap-2 text-ink-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-ink-muted" />
        Прошлый: <span className="tabular text-ink-primary">{formatCompact(previous)}</span>
      </div>
    </div>
  );
}

export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  const [mode, setMode] = useState<ChartMode>("line");

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-4 md:p-5">
      <div className="mb-1 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink-primary md:text-base">
            Динамика выручки
          </h2>
          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-ink-secondary">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Текущий период
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-muted" />
              Прошлый период
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-0.5 rounded-lg border border-border p-0.5">
          <button
            aria-label="Линейный график"
            aria-pressed={mode === "line"}
            onClick={() => setMode("line")}
            className={`rounded-md p-1.5 ${
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
            className={`rounded-md p-1.5 ${
              mode === "bar"
                ? "bg-accent-soft text-accent-bright"
                : "text-ink-muted hover:text-ink-secondary"
            }`}
          >
            <BarChartIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 h-[220px] w-full md:h-[320px] lg:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          {mode === "line" ? (
            <AreaChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                interval={0}
                minTickGap={24}
                tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={44}
                tick={{ fill: "var(--ink-muted)", fontSize: 10 }}
                tickFormatter={(v) => formatCompact(v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-strong)" }} />
              <Area
                type="monotone"
                dataKey="previousRevenue"
                stroke="var(--ink-muted)"
                strokeWidth={1.6}
                strokeOpacity={0.5}
                fill="none"
                isAnimationActive={false}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#revenueFill)"
                isAnimationActive={false}
                dot={false}
                activeDot={{ r: 4, fill: "var(--accent)", stroke: "var(--page)", strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                interval={0}
                minTickGap={24}
                tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={44}
                tick={{ fill: "var(--ink-muted)", fontSize: 10 }}
                tickFormatter={(v) => formatCompact(v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-hover)" }} />
              <Bar
                dataKey="previousRevenue"
                fill="var(--ink-muted)"
                fillOpacity={0.35}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                maxBarSize={16}
              />
              <Bar
                dataKey="revenue"
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
                maxBarSize={16}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
