"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useCurrency } from "@/lib/currency";
import { StatusBadge, STATUS_CONFIG } from "./StatusBadge";
import { SortIcon, SearchIcon } from "./icons";

type SortKey = "id" | "product" | "amount" | "status" | "date";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | OrderStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Все" },
  ...(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((status) => ({
    value: status,
    label: STATUS_CONFIG[status].label,
  })),
];

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

// Shared between the header row and every data row so columns line up —
// a native <table> won't reserve a gap between cells, which is exactly
// what made Сумма and Статус run into each other before.
const GRID_COLS = "104px minmax(0,1fr) 108px 148px 68px";

const PAGE_SIZE = 8;

function ProductPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block max-w-full truncate rounded-full border border-[color:var(--accent-border)] px-3 py-1 text-[13px] text-ink-primary">
      {children}
    </span>
  );
}

export function OrdersTable({
  orders,
  categoryFilter = null,
  onClearCategoryFilter,
}: {
  orders: Order[];
  categoryFilter?: string | null;
  onClearCategoryFilter?: () => void;
}) {
  const { currency } = useCurrency();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  }

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("ru");
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (categoryFilter && o.category !== categoryFilter) return false;
      if (query) {
        const matchesId = o.id.toLowerCase().includes(query);
        const matchesProduct = o.product.toLocaleLowerCase("ru").includes(query);
        if (!matchesId && !matchesProduct) return false;
      }
      return true;
    });
  }, [orders, statusFilter, categoryFilter, searchQuery]);

  // Any filter changing invalidates the current page — start over at 1
  // rather than showing whatever happened to still fit at the old index.
  useEffect(() => {
    setPage(0);
  }, [statusFilter, categoryFilter, searchQuery]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
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
  }, [filtered, sortKey, sortDir]);

  const isEmpty = sorted.length === 0;
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageItems = sorted.slice(
    clampedPage * PAGE_SIZE,
    clampedPage * PAGE_SIZE + PAGE_SIZE
  );

  const goToPage = (next: number) => {
    const clamped = Math.max(0, Math.min(pageCount - 1, next));
    if (clamped === clampedPage) return;
    setDirection(clamped > clampedPage ? 1 : -1);
    setPage(clamped);
  };

  // Swipe-to-paginate for the mobile card list — a horizontal drag that
  // clearly outpaces vertical movement (so it doesn't fight page scroll)
  // moves to the next/previous page, same as the Назад/Далее buttons.
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    goToPage(dx < 0 ? clampedPage + 1 : clampedPage - 1);
  }

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-medium tracking-tight text-ink-primary">
            Заказы
          </h2>
          <p className="mt-1 text-[12px] text-ink-muted">
            {sorted.length} записей за период
          </p>
        </div>
        {categoryFilter && (
          <button
            onClick={onClearCategoryFilter}
            className="accent-glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-accent-bright"
          >
            {categoryFilter}
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>

      {/* Mobile: search */}
      <div className="relative mt-4 md:hidden">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Товар или номер заказа"
          className="w-full rounded-full border border-border bg-surface-inner py-2 pl-9 pr-3 text-[13px] text-ink-primary placeholder:text-ink-muted focus:border-[color:var(--accent-border)] focus:outline-none"
        />
      </div>

      {/* Mobile: status filter chips + price sort toggle */}
      <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar md:hidden">
        {STATUS_FILTERS.map((f) => {
          const active = f.value === statusFilter;
          return (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors duration-200 ${
                active
                  ? "accent-glass text-accent-bright"
                  : "border-border text-ink-secondary hover:text-ink-primary"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        <span className="my-1 w-px shrink-0 bg-border" aria-hidden="true" />
        <button
          onClick={() => toggleSort("amount")}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors duration-200 ${
            sortKey === "amount"
              ? "accent-glass text-accent-bright"
              : "border-border text-ink-secondary hover:text-ink-primary"
          }`}
        >
          Цена
          <SortIcon
            className={`h-2.5 w-2.5 ${
              sortKey === "amount" && sortDir === "asc" ? "rotate-180" : ""
            } ${sortKey === "amount" ? "opacity-100" : "opacity-40"}`}
          />
        </button>
      </div>

      {isEmpty ? (
        <div className="mt-6 flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-border py-12 text-center">
          <SearchIcon className="h-5 w-5 text-ink-muted" />
          <p className="text-[13px] font-medium text-ink-secondary">
            Заказов не найдено
          </p>
          <p className="text-[12px] text-ink-muted">
            Попробуйте изменить фильтры или запрос
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: card list — swipe left/right to page */}
          <ul
            key={clampedPage}
            className="page-slide mt-5 flex flex-col gap-2 md:hidden"
            style={{ "--slide-dir": direction } as React.CSSProperties}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {pageItems.map((o) => (
              <li key={o.id} className="inset p-4">
                <div className="flex items-start justify-between gap-3">
                  <ProductPill>{o.product}</ProductPill>
                  <span className="tabular shrink-0 text-[14px] font-medium text-ink-primary">
                    {formatCurrency(o.amount, currency)}
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

          {pageCount > 1 && (
            <div className="mt-4 flex justify-center gap-1.5 md:hidden">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Страница ${i + 1}`}
                  onClick={() => goToPage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === clampedPage
                      ? "w-4 bg-accent-bright"
                      : "w-1.5 bg-border-strong"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Desktop: grid rows (not a native table — a <table> won't reserve
              a gap between cells, columns need explicit spacing to line up) */}
          <div className="mt-5 hidden md:block" role="table" aria-label="Заказы">
            <div
              role="row"
              className="grid items-center gap-x-5 border-b border-border pb-3"
              style={{ gridTemplateColumns: GRID_COLS }}
            >
              {COLUMNS.map((col) => (
                <div
                  key={col.key}
                  role="columnheader"
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={`select-none text-[11px] font-medium uppercase tracking-wide text-ink-muted ${
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
                        sortKey === col.key && sortDir === "asc" ? "rotate-180" : ""
                      } ${sortKey === col.key ? "opacity-100" : "opacity-25"}`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div
              key={clampedPage}
              className="page-slide flex flex-col"
              style={{ "--slide-dir": direction } as React.CSSProperties}
            >
              {pageItems.map((o) => (
                <div
                  key={o.id}
                  role="row"
                  className="grid items-center gap-x-5 rounded-xl px-2 py-3.5 transition-colors hover:bg-surface-hover"
                  style={{ gridTemplateColumns: GRID_COLS }}
                >
                  <div role="cell" className="font-mono text-[12px] text-ink-muted">
                    {o.id}
                  </div>
                  <div role="cell" className="min-w-0">
                    <ProductPill>{o.product}</ProductPill>
                    <p className="mt-1.5 truncate text-[11px] text-ink-muted">
                      {o.category}
                    </p>
                  </div>
                  <div role="cell" className="tabular text-right font-medium text-ink-primary">
                    {formatCurrency(o.amount, currency)}
                  </div>
                  <div role="cell">
                    <StatusBadge status={o.status} />
                  </div>
                  <div role="cell" className="tabular text-[12px] text-ink-secondary">
                    {formatDate(o.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className="tabular text-[12px] text-ink-muted">
              Стр. {clampedPage + 1} из {pageCount}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(clampedPage - 1)}
                disabled={clampedPage === 0}
                className="rounded-full border border-border px-4 py-1.5 text-[12px] text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink-primary disabled:opacity-25 disabled:hover:bg-transparent"
              >
                Назад
              </button>
              <button
                onClick={() => goToPage(clampedPage + 1)}
                disabled={clampedPage >= pageCount - 1}
                className="rounded-full border border-border px-4 py-1.5 text-[12px] text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink-primary disabled:opacity-25 disabled:hover:bg-transparent"
              >
                Далее
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
