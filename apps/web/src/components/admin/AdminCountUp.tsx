'use client';

import { useEffect, useRef, useState } from 'react';

// DS-MOTION: animated number counter for KPI cards

type AdminCountUpProps = {
  /** Target value as a string (may contain ฿, commas, +) */
  value: string;
  /** Duration in ms (default 1200) */
  duration?: number;
};

export function parseNumeric(raw: string): { prefix: string; numeric: number; suffix: string } {
  const match = raw.match(/^([฿+\-]*)([0-9,]+)(.*)$/);
  if (!match) return { prefix: '', numeric: 0, suffix: raw };
  const prefix = match[1] ?? '';
  const numeric = Number((match[2] ?? '0').replace(/,/g, ''));
  const suffix = match[3] ?? '';
  return { prefix, numeric, suffix };
}

function formatNumber(n: number): string {
  return n.toLocaleString('th-TH');
}

export function AdminCountUp({ value, duration = 1200 }: AdminCountUpProps) {
  const { prefix, numeric, suffix } = parseNumeric(value);
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;

    function tick(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * numeric));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [numeric, duration]);

  return (
    <span>
      {prefix}
      {formatNumber(display)}
      {suffix}
    </span>
  );
}
