import { roundTo } from "./precision.ts";

/** Shown wherever a value is not available yet. */
export const PLACEHOLDER = "·";

export interface CurrencyDef {
  code: string;
  /** Minor units the currency is normally quoted in. */
  decimals: number;
  labelEn: string;
  labelAr: string;
}

export const CURRENCIES = {
  KWD: { code: "KWD", decimals: 3, labelEn: "Kuwaiti dinar", labelAr: "دينار كويتي" },
  USD: { code: "USD", decimals: 2, labelEn: "US dollar", labelAr: "دولار أمريكي" },
  SAR: { code: "SAR", decimals: 2, labelEn: "Saudi riyal", labelAr: "ريال سعودي" },
  AED: { code: "AED", decimals: 2, labelEn: "UAE dirham", labelAr: "درهم إماراتي" },
  JOD: { code: "JOD", decimals: 3, labelEn: "Jordanian dinar", labelAr: "دينار أردني" },
} as const satisfies Record<string, CurrencyDef>;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES;
}

export function currencyDecimals(code: CurrencyCode): number {
  return CURRENCIES[code].decimals;
}

/**
 * Latin digits are forced in Arabic too. Gold quotes get read off a phone
 * screen next to a shop's own display, so the digits should match.
 */
function numberLocale(locale: string): string {
  return locale === "ar" ? "ar-u-nu-latn" : "en-US";
}

/** Formats an amount with its currency code, for example `1,234.500 KWD`. */
export function formatMoney(
  value: number | null | undefined,
  code: CurrencyCode,
  locale: string,
  options: { signed?: boolean; decimals?: number } = {},
): string {
  if (value == null || !Number.isFinite(value)) return PLACEHOLDER;

  const decimals = options.decimals ?? currencyDecimals(code);
  const rounded = roundTo(value, decimals);
  const formatted = new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(rounded));

  const sign = rounded < 0 ? "−" : options.signed && rounded > 0 ? "+" : "";
  return `${sign}${formatted} ${code}`;
}

/** Formats a plain number, such as a weight in grams. */
export function formatNumber(
  value: number | null | undefined,
  locale: string,
  decimals = 2,
): string {
  if (value == null || !Number.isFinite(value)) return PLACEHOLDER;
  return new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(roundTo(value, decimals));
}

/** Formats a percentage, with an optional leading plus sign. */
export function formatPercent(
  value: number | null | undefined,
  locale: string,
  options: { signed?: boolean; decimals?: number } = {},
): string {
  if (value == null || !Number.isFinite(value)) return PLACEHOLDER;

  const decimals = options.decimals ?? 1;
  const rounded = roundTo(value, decimals);
  const formatted = new Intl.NumberFormat(numberLocale(locale), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(rounded));

  const sign = rounded < 0 ? "−" : options.signed && rounded > 0 ? "+" : "";
  return `${sign}${formatted}%`;
}
