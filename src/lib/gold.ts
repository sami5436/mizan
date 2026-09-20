import { work } from "./precision.ts";

/** Karats this app supports, lightest to purest. */
export const KARATS = [18, 21, 22, 24] as const;

export type Karat = (typeof KARATS)[number];

export const PUREST_KARAT: Karat = 24;

export function isKarat(value: unknown): value is Karat {
  return typeof value === "number" && (KARATS as readonly number[]).includes(value);
}

/** Gold content of a karat as a ratio, so 18K is 0.75 pure. */
export function purity(karat: Karat): number {
  return karat / PUREST_KARAT;
}

/** Purity as a percentage, for display. */
export function purityPercent(karat: Karat): number {
  return work(purity(karat) * 100);
}

/**
 * Derives the price of one gram of a karat from the 24K market price.
 * 18K = 18 / 24 x 24K, and so on.
 */
export function pricePerGram(marketPrice24k: number, karat: Karat): number {
  return work(marketPrice24k * purity(karat));
}

export interface KaratRate {
  karat: Karat;
  purity: number;
  pricePerGram: number;
}

/** Builds the full rate table shown in the rates panel. */
export function buildRateTable(marketPrice24k: number): KaratRate[] {
  return KARATS.map((karat) => ({
    karat,
    purity: purity(karat),
    pricePerGram: pricePerGram(marketPrice24k, karat),
  }));
}
