"use client";

import type { FairPriceResult } from "@/lib/calculator";
import { LedgerRow } from "./ui/LedgerRow";
import { StatusIndicator } from "./StatusIndicator";
import { usePrefs } from "./prefs";

export function ResultsPanel({
  result,
  ready,
}: {
  result: FairPriceResult;
  ready: boolean;
}) {
  const { t, money, percent } = usePrefs();

  if (!ready) {
    return (
      <div className="rounded-card border border-dashed border-rule bg-card/50 px-5 py-10 text-center">
        <p className="text-sm text-muted">{t("results.empty")}</p>
      </div>
    );
  }

  const difference = result.differenceFromExpected;
  const differenceTone =
    difference === null ? "muted" : difference > 0 ? "high" : difference < 0 ? "ok" : "default";

  return (
    <div className="flex flex-col gap-3 rise">
      <div className="rounded-card border border-ink bg-ink px-5 py-5 text-paper">
        <p className="label text-gold-leaf">{t("results.expected")}</p>
        <p className="num mt-2 text-[34px] leading-none font-semibold tracking-tight sm:text-[42px]">
          {money(result.expectedTotal)}
        </p>
        <p className="num mt-3 border-t border-paper/15 pt-3 text-xs text-paper/70">
          {money(result.expectedPerGram)} <span className="font-sans">/ g</span>
          <span className="font-sans"> · {t("results.expectedPerGram")}</span>
        </p>
      </div>

      <div className="rounded-card border border-rule bg-card/80 px-4 py-2 sm:px-5">
        <div className="divide-y divide-rule-soft">
          <LedgerRow label={t("results.goldValue")} value={money(result.goldValue)} />
          <LedgerRow
            label={t("results.making")}
            value={money(result.makingCharge)}
            note={
              result.makingPercentOfGold !== null
                ? `${percent(result.makingPercentOfGold)} ${t("results.ofGold")}`
                : undefined
            }
          />
          <LedgerRow label={t("results.subtotal")} value={money(result.subtotal)} tone="muted" />
          <LedgerRow label={t("results.tax")} value={money(result.tax)} />
          <LedgerRow label={t("results.expected")} value={money(result.expectedTotal)} strong />
        </div>
      </div>

      {result.quotedPrice !== null ? (
        <div className="rounded-card border border-rule bg-card/80 px-4 py-2 sm:px-5">
          <div className="divide-y divide-rule-soft">
            <LedgerRow label={t("results.quoted")} value={money(result.quotedPrice)} strong />
            <LedgerRow
              label={t("results.difference")}
              value={money(difference, { signed: true })}
              tone={differenceTone}
            />
            <LedgerRow
              label={t("results.markupAmount")}
              value={money(result.markupAmount, { signed: true })}
              tone="gold"
            />
            <LedgerRow
              label={t("results.markupPercent")}
              value={percent(result.markupPercent, { signed: true })}
              tone="gold"
              strong
            />
            <LedgerRow
              label={t("results.allInPerGram")}
              value={money(result.allInPerGram)}
            />
          </div>
        </div>
      ) : null}

      <StatusIndicator differencePercent={result.differencePercent} />
    </div>
  );
}
