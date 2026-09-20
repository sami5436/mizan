"use client";

import { CURRENCIES, CURRENCY_CODES, type CurrencyCode } from "@/lib/currency";
import type { Language } from "@/lib/i18n";
import { usePrefs } from "./prefs";

/** Two weights on a tipped beam: the thing being compared, reduced. */
function Mark() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden className="h-8 w-8 shrink-0 text-ink">
      <path
        d="M4.5 17 L23.5 11.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="4.8" cy="17.4" r="3.2" fill="currentColor" />
      <circle cx="23.2" cy="11.2" r="2.4" stroke="currentColor" strokeWidth="1.6" fill="none" />
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
          <Mark />
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
