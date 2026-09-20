"use client";

import { useId } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string | null;
  optional?: string;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;
}

/** Label, control, and message, wired together for screen readers. */
export function Field({ label, hint, error, optional, children }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-medium text-ink">
        <span>{label}</span>
        {optional ? <span className="label">{optional}</span> : null}
      </label>
      {children({ id, describedBy: message ? messageId : undefined, invalid: Boolean(error) })}
      {message ? (
        <p
          id={messageId}
          className={`text-xs leading-snug ${error ? "text-high" : "text-muted"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
