"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { CategorySlice } from "@/lib/types";
import { formatCompactFromConverted } from "@/lib/format";
import { useCurrency, convertAmount } from "@/lib/currency";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

export function CategoryDonut({
  slices,
  activeCategory,
  onToggle,
}: {
  slices: CategorySlice[];
  activeCategory: string | null;
  onToggle: (name: string) => void;
}) {
  const { currency } = useCurrency();
  const total = slices.reduce((acc, s) => acc + s.value, 0);
  const active = slices.find((s) => s.name === activeCategory) ?? null;

  const target = convertAmount(active ? active.value : total, currency);
  const animated = useAnimatedNumber(target);

  return (
    <div className="card flex h-full flex-col p-5 md:p-6">
      <h2 className="text-[15px] font-medium tracking-tight text-ink-primary">
        Продажи по категориям
      </h2>
      <p className="mt-1 text-[12px] text-ink-muted">
        {active
          ? "Заказы ниже отфильтрованы по этой категории"
          : "Нажмите на сегмент, чтобы отфильтровать заказы"}
      </p>

      <div className="chart-well mt-5 flex items-center justify-center py-6">
        <div className="relative h-[168px] w-[168px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {slices.map((s, i) => (
                  <linearGradient
                    key={s.name}
                    id={`donut-grad-${i}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={s.colorFrom} />
                    <stop offset="100%" stopColor={s.colorTo} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                innerRadius="70%"
                outerRadius="100%"
                paddingAngle={2.5}
                stroke="none"
                isAnimationActive={true}
                animationDuration={500}
                animationEasing="ease-out"
                onClick={(_, i) => onToggle(slices[i].name)}
              >
                {slices.map((s, i) => (
                  <Cell
                    key={s.name}
                    fill={`url(#donut-grad-${i})`}
                    fillOpacity={active === null || active.name === s.name ? 1 : 0.2}
                    className="donut-cell"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <span className="text-[11px] text-ink-muted">
              {active ? active.name : "Всего"}
            </span>
            <span className="mt-1 tabular text-[18px] font-medium tracking-tight text-ink-primary">
              {formatCompactFromConverted(animated, currency)}
            </span>
            {active && (
              <span className="mt-0.5 tabular text-[11px] text-accent-bright">
                {active.percent.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-0.5">
        {slices.map((s) => {
          const isActive = active?.name === s.name;
          return (
            <li key={s.name}>
              <button
                onClick={() => onToggle(s.name)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-200 ${
                  isActive ? "bg-surface-hover" : "hover:bg-surface-hover"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${s.colorFrom}, ${s.colorTo})`,
                    }}
                  />
                  <span
                    className={`truncate transition-colors duration-200 ${
                      isActive ? "text-ink-primary" : "text-ink-secondary"
                    }`}
                  >
                    {s.name}
                  </span>
                </span>
                <span
                  className={`shrink-0 tabular font-medium transition-colors duration-200 ${
                    isActive ? "text-accent-bright" : "text-ink-primary"
                  }`}
                >
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
