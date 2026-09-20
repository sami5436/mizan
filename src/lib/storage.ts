import { isCurrencyCode, type CurrencyCode } from "./currency.ts";
import { isLanguage, type Language } from "./i18n.ts";

const KEYS = {
  language: "mizan.language",
  currency: "mizan.currency",
  rate: "mizan.rate",
} as const;

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing or a full quota. Preferences simply do not persist.
  }
}

export function loadLanguage(): Language | null {
  const value = read(KEYS.language);
  return isLanguage(value) ? value : null;
}

export function saveLanguage(language: Language): void {
  write(KEYS.language, language);
}

export function loadCurrency(): CurrencyCode | null {
  const value = read(KEYS.currency);
  return isCurrencyCode(value) ? value : null;
}

export function saveCurrency(currency: CurrencyCode): void {
  write(KEYS.currency, currency);
}

export interface StoredRate {
  /** Raw text the user typed, or the fetched price as text. */
  value: string;
  source: "manual" | "live";
  /** ISO timestamp, when the value came from a live fetch. */
  at: string | null;
}

/** The 24K rate is kept per currency, since a dinar price is not a dollar price. */
export function loadRate(currency: CurrencyCode): StoredRate | null {
  const raw = read(`${KEYS.rate}.${currency}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredRate>;
    if (typeof parsed.value !== "string") return null;
    return {
      value: parsed.value,
      source: parsed.source === "live" ? "live" : "manual",
      at: typeof parsed.at === "string" ? parsed.at : null,
    };
  } catch {
    return null;
  }
}

export function saveRate(currency: CurrencyCode, rate: StoredRate): void {
  write(`${KEYS.rate}.${currency}`, JSON.stringify(rate));
}
