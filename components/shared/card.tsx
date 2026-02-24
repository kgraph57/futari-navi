import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  readonly children: ReactNode;
  readonly href?: string;
  readonly className?: string;
  readonly variant?: "default" | "outlined" | "elevated";
}

export function Card({
  children,
  href,
  className,
  variant = "default",
}: CardProps) {
  const baseStyles = "rounded-xl p-7 transition-all duration-200";

  const variantStyles = {
    default:
      "border border-border bg-card hover:border-sage-200 hover:shadow-md hover:-translate-y-0.5",
    outlined:
      "border border-sage-100 bg-white hover:border-sage-300 hover:shadow-md hover:-translate-y-0.5",
    elevated: "bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5",
  } as const;

  const combined = clsx(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <Link href={href} className={clsx(combined, "group block")}>
        {children}
      </Link>
    );
  }

  return <div className={combined}>{children}</div>;
}

interface CardHeaderProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx("flex items-start gap-3", className)}>{children}</div>
  );
}

interface CardTitleProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={clsx(
        "font-heading text-lg font-semibold tracking-wide text-card-foreground",
        className,
      )}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={clsx("text-sm leading-relaxed text-muted", className)}>
      {children}
    </p>
  );
}
