"use client";

interface SegmentedProps<T extends string | number> {
  options: Array<{ value: T; label: string; caption?: string }>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  /** Fills the row evenly. Turn off for two short options. */
  grow?: boolean;
}

/** Hairline segmented control. Selected segment inverts to ink. */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  grow = true,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex overflow-hidden rounded-card border border-rule bg-card"
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`focus-gold relative flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 text-sm font-medium transition-colors ${
              grow ? "flex-1" : ""
            } ${index > 0 ? "border-s border-rule" : ""} ${
              selected ? "bg-ink text-paper" : "text-muted hover:bg-gold-wash hover:text-ink"
            }`}
          >
            <span className="num text-[15px] leading-tight">{option.label}</span>
            {option.caption ? (
              <span
                className={`text-[10px] leading-none tracking-wide ${
                  selected ? "text-gold-leaf" : "text-muted/70"
                }`}
              >
                {option.caption}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
