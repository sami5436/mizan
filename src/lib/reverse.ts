import { divide, work } from "./precision.ts";

export interface ReverseInput {
  weightGrams: number;
  /** Price of one gram of gold at the item's karat. */
  pricePerGram: number;
  /** The total the shop is charging. */
  totalPrice: number;
  /** Tax already baked into that total, if any, as a percentage. */
  includedTaxPercent: number;
}

export interface ReverseResult {
  goldValue: number;
  /** Total with any included tax stripped back out. */
  preTaxTotal: number;
  /** Tax portion of the quoted total. */
  taxPortion: number;
  /** What is left once the raw gold is paid for. */
  impliedPremium: number;
  /** That premium spread across the weight. */
  impliedPremiumPerGram: number | null;
  /** That premium as a percentage of the raw gold value. */
  impliedPremiumPercent: number | null;
  /** Share of the total that is gold, as a percentage. */
  goldShareOfTotal: number | null;
  /** What the buyer pays per gram, all in. */
  effectivePricePerGram: number | null;
}

/**
 * Works backwards from a shop total to the premium hidden inside it.
 * The premium covers making, profit, and anything else not raw metal.
 */
export function calculateReverse(input: ReverseInput): ReverseResult {
  const weight = Math.max(0, input.weightGrams);
  const total = Math.max(0, input.totalPrice);
  const taxRate = Math.max(0, input.includedTaxPercent) / 100;

  const gold = work(weight * Math.max(0, input.pricePerGram));
  const preTaxTotal = work(total / (1 + taxRate));
  const taxPortion = work(total - preTaxTotal);
  const impliedPremium = work(preTaxTotal - gold);
  const premiumRatio = divide(impliedPremium, gold);
  const goldShare = divide(gold, total);

  return {
    goldValue: gold,
    preTaxTotal,
    taxPortion,
    impliedPremium,
    impliedPremiumPerGram: weight > 0 ? work(impliedPremium / weight) : null,
    impliedPremiumPercent: premiumRatio === null ? null : work(premiumRatio * 100),
    goldShareOfTotal: goldShare === null ? null : work(goldShare * 100),
    effectivePricePerGram: weight > 0 ? work(total / weight) : null,
  };
}
