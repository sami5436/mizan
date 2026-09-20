import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calculateFairPrice, goldValue, makingCharge, priceStatus } from "../calculator.ts";
import { compareStores } from "../compare.ts";
import { formatMoney, formatPercent, PLACEHOLDER } from "../currency.ts";
import { buildRateTable, pricePerGram, purity } from "../gold.ts";
import { parseAmount, parsePositive, roundTo } from "../precision.ts";
import { calculateReverse } from "../reverse.ts";

describe("precision", () => {
  it("rounds away float representation error", () => {
    assert.equal(roundTo(0.1 + 0.2, 2), 0.3);
    assert.equal(roundTo(1.005, 2), 1.01);
    assert.equal(roundTo(2.675, 2), 2.68);
  });

  it("keeps three decimal currencies intact", () => {
    assert.equal(roundTo(18.4565, 3), 18.457);
    assert.equal(roundTo(0.0005, 3), 0.001);
  });

  it("parses Arabic Indic digits and separators", () => {
    assert.equal(parseAmount("١٢٣٫٥"), 123.5);
    assert.equal(parseAmount("1,250.75"), 1250.75);
    assert.equal(parseAmount(""), null);
    assert.equal(parseAmount("abc"), null);
  });

  it("clamps negative input to zero", () => {
    assert.equal(parsePositive("-5"), 0);
    assert.equal(parsePositive("7.5"), 7.5);
  });
});

describe("karat purity", () => {
  it("derives lower karats from the 24K price", () => {
    assert.equal(purity(18), 0.75);
    assert.equal(pricePerGram(100, 18), 75);
    assert.equal(pricePerGram(100, 21), 87.5);
    assert.equal(pricePerGram(100, 22), 91.666667);
    assert.equal(pricePerGram(100, 24), 100);
  });

  it("builds a rate row per karat", () => {
    const table = buildRateTable(20);
    assert.equal(table.length, 4);
    assert.deepEqual(
      table.map((row) => row.karat),
      [18, 21, 22, 24],
    );
    assert.equal(table[3].pricePerGram, 20);
  });
});

describe("fair price", () => {
  it("multiplies weight by the price per gram", () => {
    assert.equal(goldValue(10, 18.5), 185);
    assert.equal(goldValue(-4, 18.5), 0);
  });

  it("supports both making charge modes", () => {
    assert.equal(makingCharge("per_gram", 2, 10, 185), 20);
    assert.equal(makingCharge("percent", 10, 10, 185), 18.5);
  });

  it("runs the full chain with tax", () => {
    const result = calculateFairPrice({
      weightGrams: 10,
      pricePerGram: 18.5,
      makingMode: "per_gram",
      makingValue: 2,
      taxPercent: 5,
      quotedPrice: null,
    });

    assert.equal(result.goldValue, 185);
    assert.equal(result.makingCharge, 20);
    assert.equal(result.subtotal, 205);
    assert.equal(result.tax, 10.25);
    assert.equal(result.expectedTotal, 215.25);
    assert.equal(result.expectedPerGram, 21.525);
    assert.equal(result.quotedPrice, null);
    assert.equal(result.markupPercent, null);
  });

  it("measures a quote against the gold value and the expected total", () => {
    const result = calculateFairPrice({
      weightGrams: 10,
      pricePerGram: 18.5,
      makingMode: "per_gram",
      makingValue: 2,
      taxPercent: 0,
      quotedPrice: 246,
    });

    assert.equal(result.expectedTotal, 205);
    assert.equal(result.differenceFromExpected, 41);
    assert.equal(result.markupAmount, 61);
    assert.equal(result.markupPercent, 32.972973);
    assert.equal(result.allInPerGram, 24.6);
  });

  it("returns zeroes rather than NaN for empty input", () => {
    const result = calculateFairPrice({
      weightGrams: 0,
      pricePerGram: 0,
      makingMode: "percent",
      makingValue: 15,
      taxPercent: 5,
      quotedPrice: null,
    });

    assert.equal(result.expectedTotal, 0);
    assert.equal(result.expectedPerGram, null);
    assert.equal(result.makingPercentOfGold, null);
  });
});

describe("status bands", () => {
  it("maps a difference percentage onto a band", () => {
    assert.equal(priceStatus(null), "none");
    assert.equal(priceStatus(-12), "below");
    assert.equal(priceStatus(0), "close");
    assert.equal(priceStatus(5), "close");
    assert.equal(priceStatus(5.1), "moderate");
    assert.equal(priceStatus(15), "moderate");
    assert.equal(priceStatus(15.1), "high");
  });
});

describe("reverse check", () => {
  it("strips included tax before measuring the premium", () => {
    const result = calculateReverse({
      weightGrams: 10,
      pricePerGram: 18.5,
      totalPrice: 231,
      includedTaxPercent: 5,
    });

    assert.equal(result.goldValue, 185);
    assert.equal(result.preTaxTotal, 220);
    assert.equal(result.taxPortion, 11);
    assert.equal(result.impliedPremium, 35);
    assert.equal(result.impliedPremiumPerGram, 3.5);
    assert.equal(result.impliedPremiumPercent, 18.918919);
    assert.equal(result.effectivePricePerGram, 23.1);
  });

  it("handles a total with no tax", () => {
    const result = calculateReverse({
      weightGrams: 5,
      pricePerGram: 20,
      totalPrice: 130,
      includedTaxPercent: 0,
    });

    assert.equal(result.preTaxTotal, 130);
    assert.equal(result.impliedPremium, 30);
    assert.equal(result.goldShareOfTotal, 76.923077);
  });
});

describe("shop comparison", () => {
  const context = { weightGrams: 10, goldValue: 185, expectedTotal: 205 };

  it("scores every quote against the same baseline", () => {
    const rows = compareStores(
      [
        { id: "a", name: "A", quotedTotal: 210, statedMakingCharge: 25 },
        { id: "b", name: "B", quotedTotal: 199, statedMakingCharge: null },
        { id: "c", name: "C", quotedTotal: null, statedMakingCharge: null },
      ],
      context,
    );

    assert.equal(rows[0].effectivePricePerGram, 21);
    assert.equal(rows[0].differenceFromGoldValue, 25);
    assert.equal(rows[0].differenceFromExpected, 5);
    assert.equal(rows[1].isBest, true);
    assert.equal(rows[0].isBest, false);
    assert.equal(rows[2].quotedTotal, null);
    assert.equal(rows[2].markupPercent, null);
  });

  it("does not flag a single quote as the best", () => {
    const rows = compareStores([{ id: "a", name: "A", quotedTotal: 210, statedMakingCharge: null }], context);
    assert.equal(rows[0].isBest, false);
  });
});

describe("formatting", () => {
  it("uses the currency's own decimal places", () => {
    assert.equal(formatMoney(1234.5678, "KWD", "en"), "1,234.568 KWD");
    assert.equal(formatMoney(1234.5678, "USD", "en"), "1,234.57 USD");
    assert.equal(formatMoney(null, "USD", "en"), PLACEHOLDER);
  });

  it("signs differences", () => {
    assert.equal(formatPercent(12.34, "en", { signed: true }), "+12.3%");
    assert.equal(formatPercent(-12.34, "en", { signed: true }), "−12.3%");
  });

  it("keeps Latin digits in Arabic", () => {
    assert.match(formatMoney(1000, "KWD", "ar"), /1/);
  });
});
