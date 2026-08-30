import Link from "next/link";
import { logout } from "@/app/admin/(protected)/logout-action";
import type { AdminRole } from "@/lib/admin/types";

const SECTIONS: { href: string; label: string; superAdminOnly?: boolean }[] = [
  { href: "/admin", label: "მთავარი" },
  { href: "/admin/hero", label: "თავსართი", superAdminOnly: true },
  { href: "/admin/about", label: "ჩემ შესახებ", superAdminOnly: true },
  { href: "/admin/skills", label: "უნარები", superAdminOnly: true },
  { href: "/admin/workflow", label: "სამუშაო პროცესი", superAdminOnly: true },
  { href: "/admin/categories", label: "კატეგორიები", superAdminOnly: true },
  { href: "/admin/portfolio", label: "პორტფოლიო", superAdminOnly: true },
  { href: "/admin/courses", label: "კურსები" },
  { href: "/admin/patterns", label: "თარგები" },
  { href: "/admin/students", label: "მოსწავლეები" },
  { href: "/admin/sales", label: "გაყიდვები" },
  { href: "/admin/verifications", label: "გადახდის დადასტურება" },
  { href: "/admin/ai-assistant", label: "AI ასისტენტი", superAdminOnly: true },
  { href: "/admin/settings", label: "საიტის პარამეტრები", superAdminOnly: true },
  { href: "/admin/admins", label: "ადმინისტრატორები", superAdminOnly: true },
];

export function AdminNav({ role, email }: { role: AdminRole; email: string }) {
  const sections = SECTIONS.filter((section) => !section.superAdminOnly || role === "super_admin");

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
        {sections.map((section) => (
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
        <div className="hidden font-mono text-xs uppercase tracking-widest text-text-muted md:block">
          <p className="truncate">{email}</p>
          <p className="mt-0.5 text-gold">{role === "super_admin" ? "Super Admin" : "Admin"}</p>
        </div>
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
