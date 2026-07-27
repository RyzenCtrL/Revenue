export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")} млн ₽`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(0)} тыс ₽`;
  }
  return formatCurrency(value);
}

// Axis ticks drop the currency symbol so each label stays on one line —
// the unit is carried by the tooltip and the card title instead.
export function formatAxisTick(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".", ",").replace(/,0$/, "")} млн`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${Math.round(value / 1_000)} тыс`;
  }
  return String(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
}

export function formatDateFull(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
