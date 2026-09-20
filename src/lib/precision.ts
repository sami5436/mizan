/**
 * Decimal helpers.
 *
 * Money math in binary floating point drifts (0.1 + 0.2 = 0.30000000000000004).
 * Every calculation in this app runs on plain numbers and is rounded once, at
 * the boundary, with an epsilon nudge so values sitting exactly on a half step
 * round up instead of down.
 */

/** Rounds to `decimals` places, correcting float representation error. */
export function roundTo(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON * Math.sign(value || 1)) * factor) / factor;
}

/** Internal working precision: high enough that rounding never accumulates. */
export const WORKING_DECIMALS = 6;

/** Rounds an intermediate result to the shared working precision. */
export function work(value: number): number {
  return roundTo(value, WORKING_DECIMALS);
}

/**
 * Parses user typed text into a finite, non negative number.
 * Accepts Arabic Indic digits and Arabic decimal separators so the RTL
 * keyboard produces usable numbers.
 */
export function parseAmount(input: string | number | null | undefined): number | null {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (input == null) return null;

  const normalized = input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٫،]/g, ".")
    .replace(/[,\s]/g, "")
    .trim();

  if (normalized === "" || normalized === "." || normalized === "-") return null;

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** Parses user text and clamps it to zero or above. Blank input becomes null. */
export function parsePositive(input: string | number | null | undefined): number | null {
  const value = parseAmount(input);
  if (value === null) return null;
  return value < 0 ? 0 : value;
}

/** Safe division that returns null instead of Infinity or NaN. */
export function divide(numerator: number, denominator: number): number | null {
  if (!denominator || !Number.isFinite(denominator) || !Number.isFinite(numerator)) return null;
  return numerator / denominator;
}
