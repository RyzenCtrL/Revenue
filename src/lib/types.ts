export type Period = "today" | "week" | "month" | "year";

export type OrderStatus =
  | "delivered"
  | "shipped"
  | "processing"
  | "pending"
  | "cancelled";

export interface Order {
  id: string;
  customer: string;
  category: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string; // ISO date
}

export interface MonthlyPoint {
  month: string;
  revenue: number;
  previousRevenue: number;
}

export interface CategorySlice {
  name: string;
  value: number;
  percent: number;
  color: string;
  colorFrom: string;
  colorTo: string;
}

export type MetricUnit = "currency" | "count" | "percent";

export interface SparklinePoint {
  label: string;
  value: number;
}

export interface KpiMetric {
  id: string;
  label: string;
  // Raw value in the metric's base unit — RUB for currency, a plain count
  // for count, percentage points for percent. Formatted for display at
  // render time (so currency-unit metrics can react to the selected
  // display currency instead of baking in a fixed formatted string).
  rawValue: number;
  delta: number; // signed, percent
  isPositive: boolean;
  unit: MetricUnit;
  sparkline: SparklinePoint[];
}
