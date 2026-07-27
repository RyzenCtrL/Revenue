"use client";

import type { Period } from "@/lib/types";
import { PeriodSwitcher } from "./PeriodSwitcher";

export function BottomPeriodBar({
  period,
  onPeriodChange,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-page/90 px-5 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-xl md:hidden"
    >
      <PeriodSwitcher value={period} onChange={onPeriodChange} />
    </div>
  );
}
