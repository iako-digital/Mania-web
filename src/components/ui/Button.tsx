import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] px-6 py-3.5 transition-all duration-300 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-text-primary border border-gold hover:border-text-primary",
  ghost:
    "border border-hairline text-text-primary hover:border-gold hover:text-gold",
};

export function Button({
  variant = "primary",
  className = "",
  href,
  children,
  ...props
}: {
  variant?: Variant;
  className?: string;
  href: ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
} & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
