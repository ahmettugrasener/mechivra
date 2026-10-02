interface EyebrowProps {
  readonly children: React.ReactNode;
}

export function Eyebrow({
  children,
}: EyebrowProps) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
      {children}
    </p>
  );
}