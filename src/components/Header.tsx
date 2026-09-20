"use client";

import { CURRENCIES, CURRENCY_CODES, type CurrencyCode } from "@/lib/currency";
import type { Language } from "@/lib/i18n";
import { usePrefs } from "./prefs";

function Scale() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className="h-9 w-9 shrink-0">
      <rect width="32" height="32" rx="6" className="fill-ink" />
      <g stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M16 7.5v17" />
        <path d="M7 11h18" />
        <path d="M9.5 25h13" />
        <path d="M3.5 18.5 7 11l3.5 7.5a3.5 3.5 0 0 1-7 0Z" fill="#ffffff" fillOpacity="0.25" />
        <path d="M21.5 18.5 25 11l3.5 7.5a3.5 3.5 0 0 1-7 0Z" fill="#ffffff" fillOpacity="0.25" />
      </g>
      <circle cx="16" cy="7.5" r="2" fill="#ffffff" />
    </svg>
  );
}

export function Header({
  onLanguageChange,
  currency,
  onCurrencyChange,
  language,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}) {
  const { t } = usePrefs();

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Scale />
          <div className="min-w-0">
            <h1 className="text-[21px] leading-none font-bold tracking-tight text-ink sm:text-[23px]">
              {t("brand.name")}
            </h1>
            <p className="mt-1 truncate text-xs text-muted sm:text-[13px]">{t("brand.tagline")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onLanguageChange(language === "en" ? "ar" : "en")}
            className="focus-ring rounded-card border border-rule bg-card px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink hover:text-ink"
          >
            {t("actions.language")}
          </button>

          <div className="relative">
            <select
              value={currency}
              onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
              aria-label="Currency"
              className="focus-ring num appearance-none rounded-card border border-rule bg-card py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink ltr:pl-3 ltr:pr-8 rtl:pr-3 rtl:pl-8"
            >
              {CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 12 12"
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 text-muted ltr:right-2.5 rtl:left-2.5"
            >
              <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
        </div>
      </div>
      <p className="sr-only">{CURRENCIES[currency].labelEn}</p>
    </header>
  );
}
