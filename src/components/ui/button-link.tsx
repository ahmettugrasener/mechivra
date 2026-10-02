import { Link } from "@/i18n/navigation";

type ButtonLinkVariant =
  | "primary"
  | "secondary"
  | "ghost";

interface ButtonLinkProps {
  readonly href: string;
  readonly children: React.ReactNode;
  readonly variant?: ButtonLinkVariant;
  readonly className?: string;
}

const variantClasses: Record<
  ButtonLinkVariant,
  string
> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover border-brand",
  secondary:
    "bg-surface text-foreground hover:bg-surface-subtle border-border-strong",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-subtle border-transparent",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}