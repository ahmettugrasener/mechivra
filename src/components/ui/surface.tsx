interface SurfaceProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function Surface({
  children,
  className = "",
}: SurfaceProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </div>
  );
}