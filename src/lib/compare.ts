import { divide, work } from "./precision.ts";

export interface StoreQuote {
  id: string;
  name: string;
  /** The total the store is asking for. */
  quotedTotal: number | null;
  /** The making charge the store states, if it breaks one out. */
  statedMakingCharge: number | null;
}

export interface StoreComparison {
  id: string;
  name: string;
  quotedTotal: number | null;
  statedMakingCharge: number | null;
  /** Quoted total divided by the weight. */
  effectivePricePerGram: number | null;
  /** Quoted total minus the raw gold value. */
  differenceFromGoldValue: number | null;
  /** That difference as a percentage of the raw gold value. */
  markupPercent: number | null;
  /** Quoted total minus the expected fair total. */
  differenceFromExpected: number | null;
  /** True for the cheapest quote in the set. */
  isBest: boolean;
}

export interface CompareContext {
  weightGrams: number;
  goldValue: number;
  expectedTotal: number;
}

/** Scores every store quote against the same gold value and expected total. */
export function compareStores(
  quotes: StoreQuote[],
  context: CompareContext,
): StoreComparison[] {
  const weight = Math.max(0, context.weightGrams);

  const priced = quotes
    .map((quote) => quote.quotedTotal)
    .filter((total): total is number => total !== null && total > 0);
  const best = priced.length > 0 ? Math.min(...priced) : null;

  return quotes.map((quote) => {
    const total = quote.quotedTotal !== null && quote.quotedTotal > 0 ? quote.quotedTotal : null;
    const markupRatio = total === null ? null : divide(total - context.goldValue, context.goldValue);

    return {
      id: quote.id,
      name: quote.name,
      quotedTotal: total,
      statedMakingCharge: quote.statedMakingCharge,
      effectivePricePerGram: total !== null && weight > 0 ? work(total / weight) : null,
      differenceFromGoldValue: total === null ? null : work(total - context.goldValue),
      markupPercent: markupRatio === null ? null : work(markupRatio * 100),
      differenceFromExpected: total === null ? null : work(total - context.expectedTotal),
      isBest: total !== null && best !== null && total === best && priced.length > 1,
    };
  });
}
