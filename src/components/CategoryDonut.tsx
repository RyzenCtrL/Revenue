"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategorySlice } from "@/lib/types";
import { formatCompact } from "@/lib/format";

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: CategorySlice }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const slice = payload[0].payload;
  return (
    <div className="glass rounded-xl px-3.5 py-2.5 text-xs shadow-xl">
      <div className="flex items-center gap-2 text-ink-primary">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: slice.color }}
        />
        {slice.name}
      </div>
      <p className="mt-1 text-ink-secondary">
        <span className="tabular text-ink-primary">
          {formatCompact(slice.value)}
        </span>{" "}
        · {slice.percent.toFixed(1)}%
      </p>
    </div>
  );
}

export function CategoryDonut({ slices }: { slices: CategorySlice[] }) {
  const total = slices.reduce((acc, s) => acc + s.value, 0);

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-4 md:p-5">
      <h2 className="text-sm font-semibold text-ink-primary md:text-base">
        Продажи по категориям
      </h2>

      <div className="relative mx-auto mt-3 h-[180px] w-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="66%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((s) => (
                <Cell key={s.name} fill={s.color} />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-ink-muted">Всего</span>
          <span className="font-mono tabular text-base font-semibold text-ink-primary">
            {formatCompact(total)}
          </span>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {slices.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex min-w-0 items-center gap-2 text-ink-secondary">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="truncate">{s.name}</span>
            </span>
            <span className="shrink-0 tabular font-medium text-ink-primary">
              {s.percent.toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
