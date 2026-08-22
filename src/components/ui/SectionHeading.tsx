import type { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {kicker && (
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-3">
          {kicker}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-xl text-text-muted text-base md:text-lg leading-relaxed ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
