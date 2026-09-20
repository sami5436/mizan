interface LedgerRowProps {
  label: string;
  value: string;
  /** Secondary text under the label, such as a percentage of gold value. */
  note?: string;
  tone?: "default" | "muted" | "gold" | "ok" | "warn" | "high";
  strong?: boolean;
}

const toneClass = {
  default: "text-ink",
  muted: "text-muted",
  gold: "text-gold",
  ok: "text-ok",
  warn: "text-warn",
  high: "text-high",
} as const;

/** One line of the breakdown: label, dotted leader, right aligned figure. */
export function LedgerRow({ label, value, note, tone = "default", strong }: LedgerRowProps) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className={`text-[13.5px] ${strong ? "font-semibold text-ink" : "text-muted"}`}>
          {label}
        </span>
        <span
          className={`num shrink-0 ${strong ? "text-[16px] font-semibold" : "text-[15px]"} ${
            toneClass[tone]
          }`}
        >
          {value}
        </span>
      </div>
      {note ? <span className="text-xs text-muted/80">{note}</span> : null}
    </div>
  );
}
