"use client";

import { createContext, useContext, useMemo } from "react";
import {
  formatMoney,
  formatNumber,
  formatPercent,
  type CurrencyCode,
} from "@/lib/currency";
import { createTranslator, direction, type Language, type TranslationKey } from "@/lib/i18n";

interface PrefsValue {
  language: Language;
  dir: "ltr" | "rtl";
  currency: CurrencyCode;
  t: (key: TranslationKey) => string;
  money: (value: number | null | undefined, options?: { signed?: boolean }) => string;
  number: (value: number | null | undefined, decimals?: number) => string;
  percent: (value: number | null | undefined, options?: { signed?: boolean; decimals?: number }) => string;
}

const PrefsContext = createContext<PrefsValue | null>(null);

export function PrefsProvider({
  language,
  currency,
  children,
}: {
  language: Language;
  currency: CurrencyCode;
  children: React.ReactNode;
}) {
  const value = useMemo<PrefsValue>(() => {
    const t = createTranslator(language);
    return {
      language,
      currency,
      dir: direction(language),
      t,
      money: (amount, options) => formatMoney(amount, currency, language, options),
      number: (amount, decimals) => formatNumber(amount, language, decimals),
      percent: (amount, options) => formatPercent(amount, language, options),
    };
  }, [language, currency]);

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsValue {
  const value = useContext(PrefsContext);
  if (!value) throw new Error("usePrefs must be used inside PrefsProvider");
  return value;
}
