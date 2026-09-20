"use client";

import { KARATS, pricePerGram, type Karat } from "@/lib/gold";
import type { ReverseFormState } from "@/lib/form";
import { parsePositive } from "@/lib/precision";
import { calculateReverse } from "@/lib/reverse";
import { Card } from "./ui/Card";
import { Field } from "./ui/Field";
import { LedgerRow } from "./ui/LedgerRow";
import { NumberInput } from "./ui/NumberInput";
import { Segmented } from "./ui/Segmented";
import { usePrefs } from "./prefs";

export function ReverseTab({
  form,
  onChange,
  price24k,
}: {
  form: ReverseFormState;
  onChange: (patch: Partial<ReverseFormState>) => void;
  price24k: number;
}) {
  const { t, money, number, percent, currency } = usePrefs();

  const weight = parsePositive(form.weight) ?? 0;
  const total = parsePositive(form.totalPrice) ?? 0;
  const rate = pricePerGram(price24k, form.karat);
  const ready = weight > 0 && total > 0 && rate > 0;

  const result = calculateReverse({
    weightGrams: weight,
    pricePerGram: rate,
    totalPrice: total,
    includedTaxPercent: parsePositive(form.includedTaxPercent) ?? 0,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start lg:gap-5">
      <Card title={t("reverse.title")}>
        <div className="flex flex-col gap-4">
          <p className="text-xs leading-snug text-muted">{t("reverse.hint")}</p>

          <Field label={t("form.karat")}>
            {() => (
              <Segmented<Karat>
                ariaLabel={t("form.karat")}
                value={form.karat}
                onChange={(karat) => onChange({ karat })}
                options={KARATS.map((karat) => ({
                  value: karat,
                  label: `${karat}K`,
                  caption: `${number((karat / 24) * 100, 1)}%`,
                }))}
              />
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("form.weight")}>
              {({ id }) => (
                <NumberInput
                  id={id}
                  value={form.weight}
                  onChange={(value) => onChange({ weight: value })}
                  suffix={t("form.weightUnit")}
                  placeholder="0.00"
                />
              )}
            </Field>

            <Field label={t("reverse.total")}>
              {({ id }) => (
                <NumberInput
                  id={id}
                  value={form.totalPrice}
                  onChange={(value) => onChange({ totalPrice: value })}
                  suffix={currency}
                />
              )}
            </Field>
          </div>

          <Field label={t("reverse.includedTax")} optional={t("form.optional")}>
            {({ id }) => (
              <NumberInput
                id={id}
                value={form.includedTaxPercent}
                onChange={(value) => onChange({ includedTaxPercent: value })}
                suffix="%"
              />
            )}
          </Field>

          <div className="rounded-card border border-rule bg-paper/50 px-3 py-2">
            <LedgerRow
              label={`${t("form.pricePerGram")} · ${form.karat}K`}
              value={money(rate)}
              tone="gold"
            />
          </div>
        </div>
      </Card>

      {!ready ? (
        <div className="rounded-card border border-dashed border-rule bg-card/50 px-5 py-10 text-center lg:sticky lg:top-4">
          <p className="text-sm text-muted">{t("reverse.empty")}</p>
        </div>
      ) : (
        <div className="rise flex flex-col gap-3 lg:sticky lg:top-4">
          <div className="rounded-card border border-ink bg-ink px-5 py-5 text-paper">
            <p className="label text-gold-leaf">{t("reverse.premium")}</p>
            <p className="num mt-2 text-[34px] leading-none font-semibold tracking-tight sm:text-[42px]">
              {money(result.impliedPremium, { signed: true })}
            </p>
            <p className="num mt-3 border-t border-paper/15 pt-3 text-xs text-paper/70">
              {percent(result.impliedPremiumPercent, { signed: true })}
              <span className="font-sans"> · {t("reverse.premiumPercent")}</span>
            </p>
          </div>

          <div className="rounded-card border border-rule bg-card/80 px-4 py-2 sm:px-5">
            <div className="divide-y divide-rule-soft">
              <LedgerRow label={t("reverse.goldValue")} value={money(result.goldValue)} />
              <LedgerRow label={t("reverse.preTax")} value={money(result.preTaxTotal)} />
              <LedgerRow label={t("reverse.taxPortion")} value={money(result.taxPortion)} />
              <LedgerRow
                label={t("reverse.premiumPerGram")}
                value={money(result.impliedPremiumPerGram)}
                tone="gold"
                strong
              />
              <LedgerRow
                label={t("reverse.goldShare")}
                value={percent(result.goldShareOfTotal)}
              />
              <LedgerRow
                label={t("reverse.effectivePerGram")}
                value={money(result.effectivePricePerGram)}
                strong
              />
            </div>
          </div>

          <p className="px-1 text-[11px] leading-snug text-muted">{t("status.disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
