import { convertAmount, type Currency } from "./currency";

// Every money formatter here takes the RAW value in RUB (the base unit all
// mock data is generated in) plus the display currency, and converts
// internally — call sites never convert by hand, so there's one place that
// can get the rate wrong instead of a dozen.
//
// Each also has a "FromConverted" counterpart that formats a value that's
// ALREADY in the display currency (no conversion inside) — used by count-up
// animations, which need to interpolate the converted number frame-by-frame
// rather than re-converting a raw RUB value every tick.

export function formatCurrencyFromConverted(value: number, currency: Currency): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrency(rubValue: number, currency: Currency = "RUB"): string {
  return formatCurrencyFromConverted(convertAmount(rubValue, currency), currency);
}

export function formatCompactFromConverted(value: number, currency: Currency): string {
  const symbol = currency === "USD" ? "$" : "₽";
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")} млн ${symbol}`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(0)} тыс ${symbol}`;
  }
  return formatCurrencyFromConverted(value, currency);
}

export function formatCompact(rubValue: number, currency: Currency = "RUB"): string {
  return formatCompactFromConverted(convertAmount(rubValue, currency), currency);
}

// The big headline number in a KPI card: exact rubles/dollars below the
// million mark (matches how a real finance dashboard reads at that scale),
// compact "5,32 млн" notation at and above it.
export function formatHeadlineFromConverted(value: number, currency: Currency): string {
  if (Math.abs(value) >= 1_000_000) {
    const symbol = currency === "USD" ? "$" : "₽";
    const compact = (value / 1_000_000)
      .toFixed(2)
      .replace(".", ",")
      .replace(/0$/, "")
      .replace(/,$/, "");
    return `${compact} млн ${symbol}`;
  }
  return formatCurrencyFromConverted(value, currency);
}

export function formatHeadlineCurrency(
  rubValue: number,
  currency: Currency = "RUB"
): string {
  return formatHeadlineFromConverted(convertAmount(rubValue, currency), currency);
}

// Axis ticks drop the currency symbol so each label stays on one line —
// the unit is carried by the tooltip and the card title instead.
export function formatAxisTick(rubValue: number, currency: Currency = "RUB"): string {
  const value = convertAmount(rubValue, currency);
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".", ",").replace(/,0$/, "")} млн`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${Math.round(value / 1_000)} тыс`;
  }
  return String(Math.round(value));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatByUnit(
  rubValue: number,
  unit: "currency" | "count" | "percent",
  currency: Currency = "RUB"
): string {
  switch (unit) {
    case "currency":
      return formatCompact(rubValue, currency);
    case "percent":
      return formatPercent(rubValue);
    case "count":
      return formatNumber(Math.round(rubValue));
  }
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
