"use client";

import { useState } from "react";
import type { Period } from "@/lib/types";
import { categorySlices, kpiByPeriod, monthlyRevenue, orders } from "@/lib/mock-data";
import { Header } from "./Header";
import { KpiGrid } from "./KpiGrid";
import { RevenueChart } from "./RevenueChart";
import { CategoryDonut } from "./CategoryDonut";
import { OrdersTable } from "./OrdersTable";

export function Dashboard() {
  const [period, setPeriod] = useState<Period>("month");

  return (
    <div className="min-h-screen w-full">
      <Header period={period} onPeriodChange={setPeriod} />

      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:gap-6 md:px-8 md:py-6">
        <KpiGrid metrics={kpiByPeriod[period]} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={monthlyRevenue} />
          </div>
          <div>
            <CategoryDonut slices={categorySlices} />
          </div>
        </div>

        <OrdersTable orders={orders} />
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-[11px] text-ink-muted md:px-8">
        Демо-дашборд · все данные сгенерированы случайно
      </footer>
    </div>
  );
}
