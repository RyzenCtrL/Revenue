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

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: number; // signed, percent
  isPositive: boolean;
  sparkline: number[];
}
