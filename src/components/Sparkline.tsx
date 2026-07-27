"use client";

import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function Sparkline({
  data,
  positive,
}: {
  data: number[];
  positive: boolean;
}) {
  const uid = useId();
  const points = data.map((v, i) => ({ i, v }));
  const color = positive ? "var(--accent-bright)" : "var(--negative)";
  const lightColor = positive ? "#a7f5c8" : "#f4bcb8";
  const fillId = `spark-fill-${uid}`;
  const strokeId = `spark-stroke-${uid}`;

  return (
    <div className="h-11 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 3, right: 0, bottom: 0, left: 0 }}>
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
          <Area
            type="monotone"
            dataKey="v"
            stroke={`url(#${strokeId})`}
            strokeWidth={1.5}
            fill={`url(#${fillId})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
