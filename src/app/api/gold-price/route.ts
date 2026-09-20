import { NextResponse } from "next/server";
import { CURRENCY_CODES, isCurrencyCode } from "@/lib/currency";
import type { GoldPriceQuote } from "@/lib/gold-price-source";
import { roundTo } from "@/lib/precision";

/**
 * Live 24K gold price, one currency at a time.
 *
 * Provider: GoldAPI.io. Swap it by rewriting `readProviderPrice` below. The
 * only contract the client depends on is the `GoldPriceQuote` shape.
 *
 * Responses are cached for 15 minutes so a shared free tier quota is not
 * burned by every page view.
 */

const PROVIDER = "GoldAPI.io";
const CACHE_SECONDS = 21_600; // 6 hours, which keeps a free tier quota alive
const GRAMS_PER_TROY_OUNCE = 31.1034768;

interface GoldApiResponse {
  price?: number;
  price_gram_24k?: number;
  currency?: string;
  timestamp?: number;
  error?: string;
}

function readProviderPrice(payload: GoldApiResponse): number | null {
  if (typeof payload.price_gram_24k === "number" && payload.price_gram_24k > 0) {
    return payload.price_gram_24k;
  }
  // Fall back to the troy ounce spot price when the per gram field is absent.
  if (typeof payload.price === "number" && payload.price > 0) {
    return payload.price / GRAMS_PER_TROY_OUNCE;
  }
  return null;
}

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("currency");
  const currency = isCurrencyCode(requested) ? requested : null;

  if (!currency) {
    return NextResponse.json(
      { error: `Supported currencies: ${CURRENCY_CODES.join(", ")}` },
      { status: 400 },
    );
  }

  const apiKey = process.env.GOLD_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Live pricing is not configured. Enter the 24K price manually." },
      { status: 503 },
    );
  }

  try {
    const upstream = await fetch(`https://www.goldapi.io/api/XAU/${currency}`, {
      headers: { "x-access-token": apiKey, "Content-Type": "application/json" },
      next: { revalidate: CACHE_SECONDS },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Price provider returned ${upstream.status}.` },
        { status: 502 },
      );
    }

    const payload = (await upstream.json()) as GoldApiResponse;
    const pricePerGram = readProviderPrice(payload);

    if (pricePerGram === null) {
      return NextResponse.json({ error: "Price provider returned no price." }, { status: 502 });
    }

    const quote: GoldPriceQuote = {
      pricePerGram24k: roundTo(pricePerGram, 4),
      currency,
      fetchedAt: payload.timestamp
        ? new Date(payload.timestamp * 1000).toISOString()
        : new Date().toISOString(),
      source: PROVIDER,
    };

    return NextResponse.json(quote, {
      headers: { "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=1800` },
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the price provider." }, { status: 502 });
  }
}
