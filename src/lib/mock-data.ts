import { mulberry32, pick, randInt } from "./random";
import type {
  CategorySlice,
  KpiMetric,
  MonthlyPoint,
  Order,
  OrderStatus,
  Period,
} from "./types";

const rng = mulberry32(20260727);

const MONTH_NAMES = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];

const CATEGORIES = [
  {
    name: "Электроника",
    color: "#86efac",
    products: [
      "Наушники TWS Pro",
      "Смарт-часы Series 5",
      "Powerbank 20000 мАч",
      "Беспроводная колонка",
      "Экшн-камера 4K",
    ],
  },
  {
    name: "Одежда и обувь",
    color: "#4ade80",
    products: [
      "Кроссовки Runner",
      "Куртка демисезонная",
      "Худи oversize",
      "Джинсы slim",
      "Кеды canvas",
    ],
  },
  {
    name: "Дом и сад",
    color: "#22c55e",
    products: [
      "Диффузор ароматов",
      "Набор кухонных ножей",
      "Умная лампа Wi-Fi",
      "Плед вязаный",
      "Кашпо керамическое",
    ],
  },
  {
    name: "Красота и здоровье",
    color: "#16a34a",
    products: [
      "Сыворотка для лица",
      "Электрическая зубная щётка",
      "Фен-стайлер",
      "Витаминный комплекс",
      "Массажёр для шеи",
    ],
  },
  {
    name: "Спорт и отдых",
    color: "#15803d",
    products: [
      "Коврик для йоги",
      "Гантели наборные",
      "Рюкзак спортивный",
      "Термобутылка",
      "Велоперчатки",
    ],
  },
] as const;

const FIRST_NAMES = [
  "Анна",
  "Дмитрий",
  "Мария",
  "Иван",
  "Екатерина",
  "Алексей",
  "Ольга",
  "Сергей",
  "Наталья",
  "Павел",
  "Юлия",
  "Кирилл",
  "Виктория",
  "Никита",
  "Дарья",
];

const LAST_NAMES = [
  "Смирнова",
  "Кузнецов",
  "Попова",
  "Соколов",
  "Лебедева",
  "Новиков",
  "Морозова",
  "Волков",
  "Егорова",
  "Данилов",
];

const STATUS_WEIGHTS: [OrderStatus, number][] = [
  ["delivered", 0.42],
  ["shipped", 0.16],
  ["processing", 0.15],
  ["pending", 0.1],
  ["cancelled", 0.17],
];

function weightedStatus(): OrderStatus {
  const r = rng();
  let acc = 0;
  for (const [status, weight] of STATUS_WEIGHTS) {
    acc += weight;
    if (r <= acc) return status;
  }
  return "delivered";
}

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0");
}

// ---------- 12-month revenue trend ----------

const now = new Date();

export const monthlyRevenue: MonthlyPoint[] = Array.from({ length: 12 }).map(
  (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const seasonal = 1 + 0.12 * Math.sin((d.getMonth() / 12) * Math.PI * 2);
    const growth = 1 + i * 0.028;
    const noise = 0.9 + rng() * 0.2;
    const revenue = Math.round(2_150_000 * seasonal * growth * noise);
    const prevNoise = 0.85 + rng() * 0.2;
    const previousRevenue = Math.round(revenue * (0.72 + prevNoise * 0.12));
    return {
      month: MONTH_NAMES[d.getMonth()],
      revenue,
      previousRevenue,
    };
  }
);

// ---------- Orders ----------

export const orders: Order[] = Array.from({ length: 56 }).map((_, i) => {
  const category = pick(rng, CATEGORIES);
  const product = pick(rng, category.products);
  const daysAgo = randInt(rng, 0, 89);
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(randInt(rng, 8, 21), randInt(rng, 0, 59), 0, 0);

  const basePrice = randInt(rng, 800, 24000);
  const qty = randInt(rng, 1, 3);
  const amount = basePrice * qty;

  return {
    id: `ORD-${2026}-${pad(1000 + i, 4)}`,
    customer: `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`,
    category: category.name,
    product,
    amount,
    status: weightedStatus(),
    date: d.toISOString(),
  };
});

// ---------- Category breakdown (derived from orders) ----------

export const categorySlices: CategorySlice[] = (() => {
  const totals = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    totals.set(o.category, (totals.get(o.category) ?? 0) + o.amount);
  }
  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0);
  return CATEGORIES.map((c) => {
    const value = totals.get(c.name) ?? 0;
    return {
      name: c.name,
      value,
      percent: grandTotal ? (value / grandTotal) * 100 : 0,
      color: c.color,
    };
  }).sort((a, b) => b.value - a.value);
})();

// ---------- KPI cards per period ----------

function sparkline(points: number, trendUp: boolean): number[] {
  let v = 50 + rng() * 20;
  const arr: number[] = [];
  for (let i = 0; i < points; i++) {
    const drift = (trendUp ? 1 : -1) * (i / points) * 8;
    v += (rng() - 0.45) * 10 + drift * 0.15;
    v = Math.max(10, v);
    arr.push(Math.round(v));
  }
  return arr;
}

function kpi(
  id: string,
  label: string,
  value: string,
  delta: number,
  opts: { invert?: boolean; points?: number } = {}
): KpiMetric {
  const { invert = false, points = 10 } = opts;
  return {
    id,
    label,
    value,
    delta,
    isPositive: invert ? delta <= 0 : delta >= 0,
    sparkline: sparkline(points, delta >= 0),
  };
}

export const kpiByPeriod: Record<Period, KpiMetric[]> = {
  today: [
    kpi("revenue", "Выручка", "184 200 ₽", 6.4),
    kpi("orders", "Заказы", "27", 3.1),
    kpi("aov", "Средний чек", "6 822 ₽", 2.9),
    kpi("conversion", "Конверсия", "3.8%", -0.4),
    kpi("refunds", "Возвраты", "1.9%", -1.2, { invert: true }),
  ],
  week: [
    kpi("revenue", "Выручка", "1 246 800 ₽", 9.2),
    kpi("orders", "Заказы", "182", 5.6),
    kpi("aov", "Средний чек", "6 851 ₽", 3.4),
    kpi("conversion", "Конверсия", "4.1%", 0.6),
    kpi("refunds", "Возвраты", "2.3%", 0.8, { invert: true }),
  ],
  month: [
    kpi("revenue", "Выручка", "5 318 400 ₽", 12.7),
    kpi("orders", "Заказы", "764", 8.9),
    kpi("aov", "Средний чек", "6 962 ₽", 3.5),
    kpi("conversion", "Конверсия", "4.4%", 1.1),
    kpi("refunds", "Возвраты", "2.1%", -0.5, { invert: true }),
  ],
  year: [
    kpi("revenue", "Выручка", "58 940 000 ₽", 24.3),
    kpi("orders", "Заказы", "8 512", 17.8),
    kpi("aov", "Средний чек", "6 924 ₽", 5.2),
    kpi("conversion", "Конверсия", "4.2%", 2.0),
    kpi("refunds", "Возвраты", "2.4%", -0.9, { invert: true }),
  ],
};

export const PERIOD_LABELS: Record<Period, string> = {
  today: "Сегодня",
  week: "Неделя",
  month: "Месяц",
  year: "Год",
};
