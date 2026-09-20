import { divide, work } from "./precision.ts";

/** How a jeweller expresses the workmanship charge. */
export type MakingChargeMode = "per_gram" | "percent";

export interface FairPriceInput {
  /** Item weight in grams. */
  weightGrams: number;
  /** Price of one gram of gold at the item's karat. */
  pricePerGram: number;
  makingMode: MakingChargeMode;
  /** Currency amount per gram, or a percentage of the raw gold value. */
  makingValue: number;
  /** Tax or added fees, as a percentage of the subtotal. */
  taxPercent: number;
  /** What the shop actually asked for, if the user has a quote. */
  quotedPrice: number | null;
}

export interface FairPriceResult {
  goldValue: number;
  makingCharge: number;
  /** Making charge as a share of the raw gold value, whichever mode was used. */
  makingPercentOfGold: number | null;
  subtotal: number;
  tax: number;
  expectedTotal: number;
  /** Expected total spread across the weight. */
  expectedPerGram: number | null;
  quotedPrice: number | null;
  /** Quoted price minus expected total. Positive means the shop asks for more. */
  differenceFromExpected: number | null;
  /** That difference as a percentage of the expected total. */
  differencePercent: number | null;
  /** Quoted price minus raw gold value. */
  markupAmount: number | null;
  /** That markup as a percentage of the raw gold value. */
  markupPercent: number | null;
  /** Everything the buyer pays, per gram. Uses the quote when there is one. */
  allInPerGram: number | null;
}

/**
 * Thresholds for the status indicator, as a percentage above the expected
 * total. Change these two numbers to retune the green / yellow / red bands.
 */
export const STATUS_THRESHOLDS = {
  close: 5,
  moderate: 15,
} as const;

export type PriceStatus = "none" | "below" | "close" | "moderate" | "high";

/**
 * Compares a quote against the expected total. This is arithmetic on the
 * numbers the user entered, nothing more.
 */
export function priceStatus(differencePercent: number | null): PriceStatus {
  if (differencePercent === null) return "none";
  if (differencePercent < -STATUS_THRESHOLDS.close) return "below";
  if (differencePercent <= STATUS_THRESHOLDS.close) return "close";
  if (differencePercent <= STATUS_THRESHOLDS.moderate) return "moderate";
  return "high";
}

/** Raw Gold Value = Weight x Gold Price per Gram */
export function goldValue(weightGrams: number, pricePerGram: number): number {
  return work(Math.max(0, weightGrams) * Math.max(0, pricePerGram));
}

/**
 * Making Charge = Weight x charge per gram, or Raw Gold Value x charge percent.
 */
export function makingCharge(
  mode: MakingChargeMode,
  value: number,
  weightGrams: number,
  rawGoldValue: number,
): number {
  const amount = Math.max(0, value);
  if (mode === "per_gram") return work(Math.max(0, weightGrams) * amount);
  return work(rawGoldValue * (amount / 100));
}

/** Runs the full forward calculation. Pure, with no UI or locale concerns. */
export function calculateFairPrice(input: FairPriceInput): FairPriceResult {
  const weight = Math.max(0, input.weightGrams);
  const gold = goldValue(weight, input.pricePerGram);
  const making = makingCharge(input.makingMode, input.makingValue, weight, gold);
  const subtotal = work(gold + making);
  const tax = work(subtotal * (Math.max(0, input.taxPercent) / 100));
  const expectedTotal = work(subtotal + tax);

  const quoted =
    input.quotedPrice !== null && Number.isFinite(input.quotedPrice) && input.quotedPrice > 0
      ? work(input.quotedPrice)
      : null;

  const differenceFromExpected = quoted === null ? null : work(quoted - expectedTotal);
  const differenceRatio =
    quoted === null ? null : divide(quoted - expectedTotal, expectedTotal);
  const markupRatio = quoted === null ? null : divide(quoted - gold, gold);

  return {
    goldValue: gold,
    makingCharge: making,
    makingPercentOfGold: gold > 0 ? work((making / gold) * 100) : null,
    subtotal,
    tax,
    expectedTotal,
    expectedPerGram: weight > 0 ? work(expectedTotal / weight) : null,
    quotedPrice: quoted,
    differenceFromExpected,
    differencePercent: differenceRatio === null ? null : work(differenceRatio * 100),
    markupAmount: quoted === null ? null : work(quoted - gold),
    markupPercent: markupRatio === null ? null : work(markupRatio * 100),
    allInPerGram:
      weight > 0 ? work((quoted ?? expectedTotal) / weight) : null,
  };
}
