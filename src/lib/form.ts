import type { CurrencyCode } from "./currency.ts";
import type { MakingChargeMode } from "./calculator.ts";
import type { Karat } from "./gold.ts";
import type { TranslationKey } from "./i18n.ts";
import { parseAmount } from "./precision.ts";

/** Every input the fair price tab holds, kept as raw text until it is parsed. */
export interface FairFormState {
  karat: Karat;
  weight: string;
  /** Null means the price per gram follows the rate table. */
  priceOverride: string | null;
  makingMode: MakingChargeMode;
  makingValue: string;
  taxPercent: string;
  quotedPrice: string;
}

export const EMPTY_FORM: FairFormState = {
  karat: 21,
  weight: "",
  priceOverride: null,
  makingMode: "per_gram",
  makingValue: "",
  taxPercent: "",
  quotedPrice: "",
};

export interface ReverseFormState {
  karat: Karat;
  weight: string;
  totalPrice: string;
  includedTaxPercent: string;
}

export const EMPTY_REVERSE: ReverseFormState = {
  karat: 21,
  weight: "",
  totalPrice: "",
  includedTaxPercent: "",
};

export interface StoreDraft {
  id: string;
  name: string;
  quotedTotal: string;
  statedMakingCharge: string;
}

export function emptyStore(index: number): StoreDraft {
  return {
    id: `store-${Date.now()}-${index}`,
    name: "",
    quotedTotal: "",
    statedMakingCharge: "",
  };
}

/**
 * Rough 24K prices per gram, used only by the demo button and only when the
 * rate field is still empty. Never treated as a live quote.
 */
export const DEMO_RATE_24K: Record<CurrencyCode, string> = {
  KWD: "32.500",
  USD: "106.00",
  SAR: "397.50",
  AED: "389.00",
  JOD: "75.200",
};

export const DEMO_FORM: Record<CurrencyCode, FairFormState> = {
  KWD: { karat: 21, weight: "12.5", priceOverride: null, makingMode: "per_gram", makingValue: "3", taxPercent: "0", quotedPrice: "" },
  USD: { karat: 18, weight: "12.5", priceOverride: null, makingMode: "per_gram", makingValue: "9", taxPercent: "0", quotedPrice: "" },
  SAR: { karat: 21, weight: "12.5", priceOverride: null, makingMode: "percent", makingValue: "12", taxPercent: "15", quotedPrice: "" },
  AED: { karat: 22, weight: "12.5", priceOverride: null, makingMode: "per_gram", makingValue: "35", taxPercent: "5", quotedPrice: "" },
  JOD: { karat: 21, weight: "12.5", priceOverride: null, makingMode: "per_gram", makingValue: "6", taxPercent: "0", quotedPrice: "" },
};

export type FairField = "weight" | "price" | "making" | "tax" | "quoted";

export type FormErrors = Partial<Record<FairField, TranslationKey>>;

const MAX_AMOUNT = 100_000_000;
const MAX_WEIGHT = 100_000;

/** Validates raw text without blocking typing. Messages are keys, not strings. */
export function validateFair(form: FairFormState, pricePerGram: number): FormErrors {
  const errors: FormErrors = {};

  const weight = parseAmount(form.weight);
  if (form.weight.trim() !== "") {
    if (weight === null || weight <= 0) errors.weight = "validation.weight";
    else if (weight > MAX_WEIGHT) errors.weight = "validation.max";
  }

  if (form.priceOverride !== null && form.priceOverride.trim() !== "") {
    const price = parseAmount(form.priceOverride);
    if (price === null || price <= 0) errors.price = "validation.price";
    else if (price > MAX_AMOUNT) errors.price = "validation.max";
  } else if (form.weight.trim() !== "" && pricePerGram <= 0) {
    errors.price = "validation.price";
  }

  if (form.makingMode === "percent" && form.makingValue.trim() !== "") {
    const making = parseAmount(form.makingValue);
    if (making === null || making < 0 || making > 100) errors.making = "validation.percent";
  }

  if (form.taxPercent.trim() !== "") {
    const tax = parseAmount(form.taxPercent);
    if (tax === null || tax < 0 || tax > 100) errors.tax = "validation.percent";
  }

  if (form.quotedPrice.trim() !== "") {
    const quoted = parseAmount(form.quotedPrice);
    if (quoted === null || quoted < 0) errors.quoted = "validation.price";
    else if (quoted > MAX_AMOUNT) errors.quoted = "validation.max";
  }

  return errors;
}
