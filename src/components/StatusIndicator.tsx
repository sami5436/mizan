"use client";

import { priceStatus, STATUS_THRESHOLDS, type PriceStatus } from "@/lib/calculator";
import { usePrefs } from "./prefs";

const TONE: Record<PriceStatus, { dot: string; text: string; band: string }> = {
  none: { dot: "bg-rule", text: "text-muted", band: "bg-rule" },
  below: { dot: "bg-ok", text: "text-ok", band: "bg-ok" },
  close: { dot: "bg-ok", text: "text-ok", band: "bg-ok" },
  moderate: { dot: "bg-warn", text: "text-warn", band: "bg-warn" },
  high: { dot: "bg-high", text: "text-high", band: "bg-high" },
};

const LABEL: Record<PriceStatus, "status.none" | "status.below" | "status.close" | "status.moderate" | "status.high"> = {
  none: "status.none",
  below: "status.below",
  close: "status.close",
  moderate: "status.moderate",
  high: "status.high",
};

/** Scale runs from 10% below the expected total to 30% above it. */
const SCALE_MIN = -10;
const SCALE_MAX = 30;

function position(percent: number): number {
  const clamped = Math.min(Math.max(percent, SCALE_MIN), SCALE_MAX);
  return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

export function StatusIndicator({ differencePercent }: { differencePercent: number | null }) {
  const { t, percent, dir } = usePrefs();
  const status = priceStatus(differencePercent);
  const tone = TONE[status];
  const marker = differencePercent === null ? null : position(differencePercent);
  const inset = dir === "rtl" ? "right" : "left";

  return (
    <div className="rounded-card border border-rule bg-paper-deep px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="label">{t("status.title")}</h3>
        {differencePercent !== null ? (
          <span className={`num text-sm font-semibold ${tone.text}`}>
            {percent(differencePercent, { signed: true })}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-start gap-2.5">
        <span
          aria-hidden
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-[1px] ${tone.dot}`}
        />
        <p className={`text-sm leading-snug font-medium ${tone.text}`}>{t(LABEL[status])}</p>
      </div>

      <div className="mt-4">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-rule/60">
          <div
            className="absolute inset-y-0 bg-ok/70"
            style={{ [inset]: 0, width: `${position(STATUS_THRESHOLDS.close)}%` }}
          />
          <div
            className="absolute inset-y-0 bg-warn/70"
            style={{
              [inset]: `${position(STATUS_THRESHOLDS.close)}%`,
              width: `${position(STATUS_THRESHOLDS.moderate) - position(STATUS_THRESHOLDS.close)}%`,
            }}
          />
          <div
            className="absolute inset-y-0 bg-high/70"
            style={{
              [inset]: `${position(STATUS_THRESHOLDS.moderate)}%`,
              width: `${100 - position(STATUS_THRESHOLDS.moderate)}%`,
            }}
          />
          {marker !== null ? (
            <span
              aria-hidden
              className="absolute top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_2px_var(--color-card)]"
              style={{ [inset]: `calc(${marker}% - 1.5px)` }}
            />
          ) : null}
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="num text-[10px] text-muted">{SCALE_MIN}%</span>
          <span className="num text-[10px] text-muted">+{STATUS_THRESHOLDS.close}%</span>
          <span className="num text-[10px] text-muted">+{STATUS_THRESHOLDS.moderate}%</span>
          <span className="num text-[10px] text-muted">+{SCALE_MAX}%</span>
        </div>
      </div>

      <p className="mt-3 border-t border-rule-soft pt-3 text-[11px] leading-snug text-muted">
        {t("status.disclaimer")}
      </p>
    </div>
  );
}
