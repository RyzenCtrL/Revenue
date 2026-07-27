import type { OrderStatus } from "@/lib/types";

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; dot: string; text: string }
> = {
  delivered: {
    label: "Доставлен",
    dot: "bg-accent-bright",
    text: "text-accent-bright",
  },
  shipped: {
    label: "В пути",
    dot: "bg-ink-secondary",
    text: "text-ink-secondary",
  },
  processing: {
    label: "В обработке",
    dot: "bg-ink-muted",
    text: "text-ink-muted",
  },
  pending: {
    label: "Ожидает оплаты",
    dot: "bg-warning",
    text: "text-warning",
  },
  cancelled: {
    label: "Отменён",
    dot: "bg-negative",
    text: "text-negative",
  },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
