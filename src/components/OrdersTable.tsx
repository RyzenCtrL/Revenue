"use client";

import { useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { SortIcon } from "./icons";

type SortKey = "id" | "product" | "amount" | "status" | "date";
type SortDir = "asc" | "desc";

const STATUS_ORDER: Record<OrderStatus, number> = {
  delivered: 0,
  shipped: 1,
  processing: 2,
  pending: 3,
  cancelled: 4,
};

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "id", label: "Заказ" },
  { key: "product", label: "Товар / категория" },
  { key: "amount", label: "Сумма", align: "right" },
  { key: "status", label: "Статус" },
  { key: "date", label: "Дата" },
];

const PAGE_SIZE = 8;

function ProductPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block max-w-full truncate rounded-full border border-[color:var(--accent-border)] px-3 py-1 text-[13px] text-ink-primary">
      {children}
    </span>
  );
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  }

  const sorted = useMemo(() => {
    const copy = [...orders];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id":
          cmp = a.id.localeCompare(b.id);
          break;
        case "product":
          cmp = a.product.localeCompare(b.product, "ru");
          break;
        case "amount":
          cmp = a.amount - b.amount;
          break;
        case "status":
          cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
          break;
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [orders, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageItems = sorted.slice(
    clampedPage * PAGE_SIZE,
    clampedPage * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-medium tracking-tight text-ink-primary">
            Заказы
          </h2>
          <p className="mt-1 text-[12px] text-ink-muted">
            {sorted.length} записей за период
          </p>
        </div>
      </div>

      {/* Mobile: card list */}
      <ul className="mt-5 flex flex-col gap-2 md:hidden">
        {pageItems.map((o) => (
          <li key={o.id} className="inset p-4">
            <div className="flex items-start justify-between gap-3">
              <ProductPill>{o.product}</ProductPill>
              <span className="tabular shrink-0 text-[14px] font-medium text-ink-primary">
                {formatCurrency(o.amount)}
              </span>
            </div>
            <p className="mt-2.5 truncate text-[11px] text-ink-muted">
              {o.category} · {o.id}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
              <StatusBadge status={o.status} />
              <span className="tabular text-[11px] text-ink-muted">
                {formatDate(o.date)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="mt-5 hidden md:block">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={`select-none pb-3 text-[11px] font-medium uppercase tracking-wide text-ink-muted ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <button
                    onClick={() => toggleSort(col.key)}
                    className={`inline-flex items-center gap-1.5 transition-colors hover:text-ink-secondary ${
                      col.align === "right" ? "flex-row-reverse" : ""
                    } ${sortKey === col.key ? "text-ink-secondary" : ""}`}
                  >
                    {col.label}
                    <SortIcon
                      className={`h-2.5 w-2.5 ${
                        sortKey === col.key && sortDir === "asc"
                          ? "rotate-180"
                          : ""
                      } ${sortKey === col.key ? "opacity-100" : "opacity-25"}`}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((o) => (
              <tr
                key={o.id}
                className="border-b border-border/50 last:border-0 transition-colors hover:bg-surface-hover"
              >
                <td className="py-4 font-mono text-[12px] text-ink-muted">
                  {o.id}
                </td>
                <td className="py-4 pr-4">
                  <ProductPill>{o.product}</ProductPill>
                  <p className="mt-1.5 text-[11px] text-ink-muted">
                    {o.category}
                  </p>
                </td>
                <td className="tabular py-4 text-right font-medium text-ink-primary">
                  {formatCurrency(o.amount)}
                </td>
                <td className="py-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="tabular py-4 text-[12px] text-ink-secondary">
                  {formatDate(o.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="tabular text-[12px] text-ink-muted">
          Стр. {clampedPage + 1} из {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={clampedPage === 0}
            className="rounded-full border border-border px-4 py-1.5 text-[12px] text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink-primary disabled:opacity-25 disabled:hover:bg-transparent"
          >
            Назад
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={clampedPage >= pageCount - 1}
            className="rounded-full border border-border px-4 py-1.5 text-[12px] text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink-primary disabled:opacity-25 disabled:hover:bg-transparent"
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
}
