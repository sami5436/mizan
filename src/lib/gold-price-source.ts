import type { CurrencyCode } from "./currency.ts";

/**
 * The single seam between this app and any live gold price feed.
 *
 * The UI only ever asks for a 24K price per gram in one currency, and derives
 * 18K, 21K, and 22K from purity ratios (see `gold.ts`). To swap providers,
 * change `src/app/api/gold-price/route.ts` and keep this shape intact.
 */
export interface GoldPriceQuote {
  /** Price of one gram of 24K gold, in the requested currency. */
  pricePerGram24k: number;
  currency: CurrencyCode;
  /** When the provider priced it, as an ISO timestamp. */
  fetchedAt: string;
  /** Provider name, shown in the rates panel. */
  source: string;
}

export interface GoldPriceError {
  error: string;
}

export type GoldPriceResponse = GoldPriceQuote | GoldPriceError;

export function isGoldPriceQuote(value: GoldPriceResponse): value is GoldPriceQuote {
  return typeof (value as GoldPriceQuote).pricePerGram24k === "number";
}

/** Browser side call into this app's own route. Never talks to a vendor directly. */
export async function fetchGoldPrice(currency: CurrencyCode): Promise<GoldPriceQuote> {
  const response = await fetch(`/api/gold-price?currency=${currency}`, {
    headers: { accept: "application/json" },
  });

  const payload = (await response.json()) as GoldPriceResponse;

  if (!response.ok || !isGoldPriceQuote(payload)) {
    throw new Error(
      isGoldPriceQuote(payload) ? "Unexpected response" : payload.error || "Request failed",
    );
  }

  return payload;
}
