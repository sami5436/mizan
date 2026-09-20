"use client";

import { buildRateTable, type Karat } from "@/lib/gold";
import { NumberInput } from "./ui/NumberInput";
import { usePrefs } from "./prefs";

interface RatesPanelProps {
  price24k: string;
  onPrice24kChange: (value: string) => void;
  selectedKarat: Karat;
  onKaratSelect: (karat: Karat) => void;
  source: "manual" | "live";
  fetchedAt: string | null;
  loading: boolean;
  error: string | null;
  onFetch: () => void;
}

export function RatesPanel({
  price24k,
  onPrice24kChange,
  selectedKarat,
  onKaratSelect,
  source,
  fetchedAt,
  loading,
  error,
  onFetch,
}: RatesPanelProps) {
  const { t, money, number, currency, language } = usePrefs();
  const parsed = Number(price24k.replace(/[,\s]/g, "")) || 0;
  const rates = buildRateTable(parsed);

  const stamp = fetchedAt
    ? new Intl.DateTimeFormat(language === "ar" ? "ar-u-nu-latn" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      }).format(new Date(fetchedAt))
    : null;

  return (
    <section className="rounded-card border border-rule bg-card/80 backdrop-blur-[1px]">
      <div className="flex flex-col gap-4 border-b border-rule-soft px-4 py-4 sm:flex-row sm:items-end sm:gap-5 sm:px-5">
        <div className="flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
            <label htmlFor="rate-24k" className="label">
              {t("rates.marketLabel")}
            </label>
            <span className="label whitespace-nowrap text-gold">
              {source === "live" ? t("rates.source.live") : t("rates.source.manual")}
              {stamp ? ` · ${stamp}` : ""}
            </span>
          </div>
          <div className="mt-2">
            <NumberInput
              id="rate-24k"
              value={price24k}
              onChange={onPrice24kChange}
              suffix={`${currency} / g`}
              placeholder="0.000"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onFetch}
          disabled={loading}
          className="focus-gold flex items-center justify-center gap-2 rounded-card border border-ink bg-ink px-4 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-85 disabled:opacity-50 sm:w-auto"
        >
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="#d8ae4e"
            strokeWidth="1.6"
          >
            <path d="M14 8a6 6 0 1 1-1.8-4.3" strokeLinecap="round" />
            <path d="M14 1.5V4h-2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {loading ? t("rates.fetching") : t("rates.fetch")}
        </button>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <div className="flex items-baseline justify-between">
          <h2 className="label">{t("rates.title")}</h2>
          <span className="label">{t("rates.perGram")}</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {rates.map((rate) => {
            const selected = rate.karat === selectedKarat;
            return (
              <button
                key={rate.karat}
                type="button"
                onClick={() => onKaratSelect(rate.karat)}
                aria-pressed={selected}
                className={`focus-gold group flex flex-col gap-1 rounded-card border px-3 py-3 text-start transition-all ${
                  selected
                    ? "border-gold bg-gold-wash shadow-[inset_0_0_0_1px_rgba(154,108,20,0.25)]"
                    : "border-rule bg-paper/40 hover:border-gold/60"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="num text-[13px] font-semibold text-ink">{rate.karat}K</span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${selected ? "bg-gold" : "bg-rule"}`}
                    aria-hidden
                  />
                </span>
                <span className="num text-[15px] leading-tight font-medium text-ink sm:text-[17px]">
                  {money(rate.pricePerGram)}
                </span>
                <span className="text-[10px] tracking-wide text-muted">
                  {number(rate.purity * 100, 1)}% {t("rates.purity")}
                </span>
              </button>
            );
          })}
        </div>

        <p className={`mt-3 text-xs leading-snug ${error ? "text-high" : "text-muted"}`}>
          {error ?? t("rates.hint")}
        </p>
      </div>
    </section>
  );
}
