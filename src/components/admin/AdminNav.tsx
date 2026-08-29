import Link from "next/link";
import { logout } from "@/app/admin/(protected)/logout-action";

const SECTIONS = [
  { href: "/admin", label: "მთავარი" },
  { href: "/admin/hero", label: "თავსართი" },
  { href: "/admin/about", label: "ჩემ შესახებ" },
  { href: "/admin/skills", label: "უნარები" },
  { href: "/admin/workflow", label: "სამუშაო პროცესი" },
  { href: "/admin/categories", label: "კატეგორიები" },
  { href: "/admin/portfolio", label: "პორტფოლიო" },
  { href: "/admin/ai-assistant", label: "AI ასისტენტი" },
  { href: "/admin/settings", label: "საიტის პარამეტრები" },
];

export function AdminNav() {
  return (
    <nav className="flex shrink-0 flex-col border-b border-hairline bg-surface p-4 sm:p-6 md:w-56 md:border-r md:border-b-0">
      <div className="flex items-center justify-between md:block">
        <span className="font-display text-lg text-text-primary">მართვის პანელი</span>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-text-primary md:hidden"
        >
          საიტის ნახვა ↗
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-1 md:mt-8 md:flex-col">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded px-3 py-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:bg-ink hover:text-gold"
          >
            {section.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-6 md:mt-auto md:flex-col md:items-start md:gap-3 md:pt-8">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden font-mono text-xs uppercase tracking-widest text-text-muted hover:text-text-primary md:block"
        >
          საიტის ნახვა ↗
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-red-400 cursor-pointer"
          >
            გასვლა
          </button>
        </form>
      </div>
    </nav>
  );
}
