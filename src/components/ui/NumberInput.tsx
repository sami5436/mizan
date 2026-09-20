"use client";

interface NumberInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Short unit shown inside the field, such as a currency code or `g`. */
  suffix?: string;
  describedBy?: string;
  invalid?: boolean;
  step?: string;
  max?: number;
}

/**
 * Text input restricted to number-ish characters. Kept as a string so a half
 * typed value such as `12.` survives a keystroke, and parsed at the boundary.
 */
export function NumberInput({
  id,
  value,
  onChange,
  placeholder = "0",
  suffix,
  describedBy,
  invalid,
  step,
  max,
}: NumberInputProps) {
  return (
    <div
      className={`group flex items-center gap-2 rounded-card border bg-card px-3 transition-colors focus-within:border-ink ${
        invalid ? "border-high" : "border-rule"
      }`}
    >
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="decimal"
        type="text"
        autoComplete="off"
        spellCheck={false}
        step={step}
        max={max}
        placeholder={placeholder}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        dir="ltr"
        className="num w-full bg-transparent py-3 text-[17px] text-ink outline-none placeholder:text-muted/50"
      />
      {suffix ? (
        <span className="label shrink-0 whitespace-nowrap ltr:pr-0.5 rtl:pl-0.5">{suffix}</span>
      ) : null}
    </div>
  );
}
