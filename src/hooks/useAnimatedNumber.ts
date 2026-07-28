"use client";

import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Smoothly counts from whatever it was showing toward `target` whenever
// target changes — used for KPI headline numbers and the donut center
// value so switching period/currency/category reads as a count, not a
// snap. No animation library: requestAnimationFrame + an easing curve.
// Starts at `target` on first mount (no count-up out of nowhere on load).
export function useAnimatedNumber(target: number, duration = 500): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const mounted = useRef(false);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      valueRef.current = target;
      setValue(target);
      return;
    }

    const from = valueRef.current;
    if (from === target) return;

    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const next = from + (target - from) * eased;
      valueRef.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}
