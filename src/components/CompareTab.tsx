"use client";

import { compareStores, type CompareContext } from "@/lib/compare";
import type { StoreDraft } from "@/lib/form";
import type { Karat } from "@/lib/gold";
import { parsePositive } from "@/lib/precision";
import { Card } from "./ui/Card";
import { LedgerRow } from "./ui/LedgerRow";
import { NumberInput } from "./ui/NumberInput";
import { usePrefs } from "./prefs";

interface CompareTabProps {
  stores: StoreDraft[];
  onChange: (id: string, patch: Partial<StoreDraft>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  context: CompareContext;
  karat: Karat;
  ready: boolean;
}

export function CompareTab({
  stores,
  onChange,
  onAdd,
  onRemove,
  context,
  karat,
  ready,
}: CompareTabProps) {
  const { t, money, number, percent, currency } = usePrefs();

  const rows = compareStores(
    stores.map((store) => ({
      id: store.id,
      name: store.name,
      quotedTotal: parsePositive(store.quotedTotal),
      statedMakingCharge: parsePositive(store.statedMakingCharge),
    })),
    context,
  );

  return (
    <div className="flex flex-col gap-4">
      <Card
        title={t("compare.context")}
        actions={
          <button
            type="button"
            onClick={onAdd}
            className="focus-gold rounded-card border border-ink bg-ink px-3 py-1.5 text-[11px] font-medium text-paper transition-opacity hover:opacity-85"
          >
            + {t("compare.add")}
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          {[
            { label: t("form.karat"), value: `${karat}K`, strong: false },
            {
              label: t("form.weight"),
              value: `${number(context.weightGrams, 3)} ${t("form.weightUnit")}`,
              strong: false,
            },
            { label: t("results.goldValue"), value: money(context.goldValue), strong: false },
            { label: t("results.expected"), value: money(context.expectedTotal), strong: true },
          ].map((cell) => (
            <div key={cell.label} className="flex flex-col gap-0.5">
              <span className="label">{cell.label}</span>
              <span
                className={`num text-[15px] ${cell.strong ? "font-semibold text-ink" : "text-ink"}`}
              >
                {cell.value}
              </span>
            </div>
          ))}
        </div>
        {!ready ? (
          <p className="mt-2 border-t border-rule-soft pt-3 text-xs text-muted">
            {t("results.empty")}
          </p>
        ) : (
          <p className="mt-2 border-t border-rule-soft pt-3 text-xs text-muted">
            {t("compare.hint")}
          </p>
        )}
      </Card>

      {rows.length === 0 ? (
        <div className="rounded-card border border-dashed border-rule bg-card/50 px-5 py-10 text-center">
          <p className="text-sm text-muted">{t("compare.empty")}</p>
          <button
            type="button"
            onClick={onAdd}
            className="focus-gold mt-3 rounded-card border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-85"
          >
            + {t("compare.add")}
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, index) => {
            const draft = stores[index];
            return (
              <article
                key={row.id}
                className={`rise flex flex-col rounded-card border bg-card/80 ${
                  row.isBest ? "border-ok shadow-[inset_0_0_0_1px_rgba(29,106,71,0.25)]" : "border-rule"
                }`}
              >
                <header className="flex items-center gap-2 border-b border-rule-soft px-3 py-2.5">
                  <span className="num shrink-0 text-[11px] text-muted">{index + 1}</span>
                  <input
                    value={draft.name}
                    onChange={(event) => onChange(row.id, { name: event.target.value })}
                    placeholder={`${t("compare.storePlaceholder")} ${index + 1}`}
                    aria-label={t("compare.storeName")}
                    className="focus-gold min-w-0 flex-1 rounded-[2px] bg-transparent px-1 py-1 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted/60"
                  />
                  {row.isBest ? (
                    <span className="shrink-0 rounded-full bg-ok/10 px-2 py-0.5 text-[10px] font-medium text-ok">
                      {t("compare.best")}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onRemove(row.id)}
                    aria-label={`${t("compare.remove")} ${draft.name || index + 1}`}
                    className="focus-gold shrink-0 rounded-[2px] p-1 text-muted transition-colors hover:text-high"
                  >
                    <svg viewBox="0 0 14 14" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                </header>

                <div className="flex flex-col gap-2 px-3 py-3">
                  <label className="label" htmlFor={`${row.id}-total`}>
                    {t("compare.quotedTotal")}
                  </label>
                  <NumberInput
                    id={`${row.id}-total`}
                    value={draft.quotedTotal}
                    onChange={(quotedTotal) => onChange(row.id, { quotedTotal })}
                    suffix={currency}
                  />
                  <label className="label mt-1" htmlFor={`${row.id}-making`}>
                    {t("compare.making")}
                  </label>
                  <NumberInput
                    id={`${row.id}-making`}
                    value={draft.statedMakingCharge}
                    onChange={(statedMakingCharge) => onChange(row.id, { statedMakingCharge })}
                    suffix={currency}
                  />
                </div>

                <div className="mt-auto divide-y divide-rule-soft border-t border-rule-soft px-3 py-1">
                  <LedgerRow label={t("compare.perGram")} value={money(row.effectivePricePerGram)} />
                  <LedgerRow
                    label={t("compare.vsGold")}
                    value={money(row.differenceFromGoldValue, { signed: true })}
                    note={row.markupPercent !== null ? percent(row.markupPercent, { signed: true }) : undefined}
                    tone="gold"
                  />
                  <LedgerRow
                    label={t("compare.vsExpected")}
                    value={money(row.differenceFromExpected, { signed: true })}
                    tone={
                      row.differenceFromExpected === null
                        ? "muted"
                        : row.differenceFromExpected > 0
                          ? "high"
                          : "ok"
                    }
                    strong
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
