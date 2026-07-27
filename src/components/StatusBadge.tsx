import type { OrderStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  delivered: {
    label: "Доставлен",
    dot: "bg-accent",
    bg: "bg-accent-soft",
    text: "text-accent-bright",
  },
  shipped: {
    label: "В пути",
    dot: "bg-ink-secondary",
    bg: "bg-white/[0.06]",
    text: "text-ink-primary",
  },
  processing: {
    label: "В обработке",
    dot: "bg-ink-muted",
    bg: "bg-white/[0.04]",
    text: "text-ink-secondary",
  },
  pending: {
    label: "Ожидает оплаты",
    dot: "bg-warning",
    bg: "bg-warning/10",
    text: "text-warning",
  },
  cancelled: {
    label: "Отменён",
    dot: "bg-negative",
    bg: "bg-negative/10",
    text: "text-negative",
  },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
