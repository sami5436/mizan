interface CardProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Paper panel with a ruled header. The basic building block of the page. */
export function Card({ title, actions, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-card border border-rule bg-card/80 shadow-[0_1px_0_rgba(23,23,27,0.04)] backdrop-blur-[1px] ${className}`}
    >
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-rule-soft px-4 py-3 sm:px-5">
          <h2 className="label">{title}</h2>
          {actions}
        </header>
      ) : null}
      <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </section>
  );
}
