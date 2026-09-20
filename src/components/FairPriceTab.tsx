"use client";

import type { FairPriceResult, MakingChargeMode } from "@/lib/calculator";
import { KARATS, type Karat } from "@/lib/gold";
import type { FairFormState, FormErrors } from "@/lib/form";
import { Card } from "./ui/Card";
import { Field } from "./ui/Field";
import { NumberInput } from "./ui/NumberInput";
import { Segmented } from "./ui/Segmented";
import { ResultsPanel } from "./ResultsPanel";
import { usePrefs } from "./prefs";

interface FairPriceTabProps {
  form: FairFormState;
  onChange: (patch: Partial<FairFormState>) => void;
  errors: FormErrors;
  /** Price per gram coming from the rate table for the selected karat. */
  ratePricePerGram: number;
  result: FairPriceResult;
  ready: boolean;
  onReset: () => void;
  onDemo: () => void;
}

export function FairPriceTab({
  form,
  onChange,
  errors,
  ratePricePerGram,
  result,
  ready,
  onReset,
  onDemo,
}: FairPriceTabProps) {
  const { t, currency, number } = usePrefs();
  const linked = form.priceOverride === null;
  const priceValue = linked ? (ratePricePerGram ? String(ratePricePerGram) : "") : (form.priceOverride ?? "");

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start lg:gap-5">
      <div className="flex flex-col gap-4">
        <Card
          title={t("form.details")}
          actions={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onDemo}
                className="focus-gold rounded-card border border-rule px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-gold hover:text-gold"
              >
                {t("actions.demo")}
              </button>
              <button
                type="button"
                onClick={onReset}
                className="focus-gold rounded-card border border-rule px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:border-high hover:text-high"
              >
                {t("actions.reset")}
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
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
              <Field
                label={t("form.weight")}
                error={errors.weight ? t(errors.weight) : null}
              >
                {({ id, describedBy, invalid }) => (
                  <NumberInput
                    id={id}
                    value={form.weight}
                    onChange={(weight) => onChange({ weight })}
                    suffix={t("form.weightUnit")}
                    describedBy={describedBy}
                    invalid={invalid}
                    placeholder="0.00"
                  />
                )}
              </Field>

              <Field
                label={t("form.pricePerGram")}
                hint={linked ? t("form.pricePerGramHint") : t("form.pricePerGramOverride")}
                error={errors.price ? t(errors.price) : null}
                optional={linked ? `${form.karat}K` : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <NumberInput
                        id={id}
                        value={priceValue}
                        onChange={(value) => onChange({ priceOverride: value })}
                        suffix={currency}
                        describedBy={describedBy}
                        invalid={invalid}
                        placeholder="0.000"
                      />
                    </div>
                    {!linked ? (
                      <button
                        type="button"
                        onClick={() => onChange({ priceOverride: null })}
                        className="focus-gold shrink-0 rounded-card border border-rule px-2.5 py-2 text-[11px] font-medium text-gold transition-colors hover:border-gold"
                      >
                        {t("form.relink")}
                      </button>
                    ) : null}
                  </div>
                )}
              </Field>
            </div>
          </div>
        </Card>

        <Card title={t("form.charges")}>
          <div className="flex flex-col gap-4">
            <Field label={t("form.making")} error={errors.making ? t(errors.making) : null}>
              {({ id, describedBy, invalid }) => (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                  <div className="sm:w-[210px] sm:shrink-0">
                    <Segmented<MakingChargeMode>
                      ariaLabel={t("form.making")}
                      value={form.makingMode}
                      onChange={(makingMode) => onChange({ makingMode })}
                      options={[
                        { value: "per_gram", label: t("form.makingPerGram") },
                        { value: "percent", label: t("form.makingPercent") },
                      ]}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <NumberInput
                      id={id}
                      value={form.makingValue}
                      onChange={(makingValue) => onChange({ makingValue })}
                      suffix={form.makingMode === "per_gram" ? `${currency} / g` : "%"}
                      describedBy={describedBy}
                      invalid={invalid}
                    />
                  </div>
                </div>
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("form.tax")}
                optional={t("form.optional")}
                error={errors.tax ? t(errors.tax) : null}
              >
                {({ id, describedBy, invalid }) => (
                  <NumberInput
                    id={id}
                    value={form.taxPercent}
                    onChange={(taxPercent) => onChange({ taxPercent })}
                    suffix="%"
                    describedBy={describedBy}
                    invalid={invalid}
                  />
                )}
              </Field>

              <Field
                label={t("form.quoted")}
                optional={t("form.optional")}
                hint={t("form.quotedHint")}
                error={errors.quoted ? t(errors.quoted) : null}
              >
                {({ id, describedBy, invalid }) => (
                  <NumberInput
                    id={id}
                    value={form.quotedPrice}
                    onChange={(quotedPrice) => onChange({ quotedPrice })}
                    suffix={currency}
                    describedBy={describedBy}
                    invalid={invalid}
                  />
                )}
              </Field>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:sticky lg:top-4">
        <ResultsPanel result={result} ready={ready} />
      </div>
    </div>
  );
}
