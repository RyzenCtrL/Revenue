"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { CategorySlice } from "@/lib/types";
import { formatCompact } from "@/lib/format";

export function CategoryDonut({ slices }: { slices: CategorySlice[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = slices.reduce((acc, s) => acc + s.value, 0);
  const active = activeIndex !== null ? slices[activeIndex] : null;

  function toggle(i: number) {
    setActiveIndex((prev) => (prev === i ? null : i));
  }

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
              onClick={(_, i) => toggle(i)}
            >
              {slices.map((s) => (
                <Cell
                  key={s.name}
                  fill={s.color}
                  fillOpacity={active === null || active.name === s.name ? 1 : 0.3}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="text-[10px] text-ink-muted">
            {active ? active.name : "Всего"}
          </span>
          <span className="font-mono tabular text-base font-semibold text-ink-primary">
            {formatCompact(active ? active.value : total)}
          </span>
          {active && (
            <span className="mt-0.5 text-[10px] text-ink-secondary">
              {active.percent.toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-1">
        {slices.map((s, i) => {
          const isActive = active?.name === s.name;
          return (
            <li key={s.name}>
              <button
                onClick={() => toggle(i)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  isActive ? "bg-surface-hover" : "hover:bg-surface-hover"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2 text-ink-secondary">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span
                    className={`truncate ${
                      isActive ? "text-ink-primary font-medium" : ""
                    }`}
                  >
                    {s.name}
                  </span>
                </span>
                <span className="shrink-0 tabular font-medium text-ink-primary">
                  {s.percent.toFixed(0)}%
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
