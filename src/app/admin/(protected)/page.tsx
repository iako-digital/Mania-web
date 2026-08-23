import Link from "next/link";

const CARDS = [
  { href: "/admin/hero", title: "Hero", description: "Home page headline, subheadline, and cover media." },
  { href: "/admin/about", title: "About", description: "Bio, career narrative, achievements, portrait, programs." },
  { href: "/admin/skills", title: "Skills", description: "The core skills list shown on Expertise and About." },
  { href: "/admin/workflow", title: "Workflow", description: "The 5-step process shown on the Expertise page." },
  { href: "/admin/categories", title: "Categories", description: "Portfolio category labels and slugs." },
  { href: "/admin/portfolio", title: "Portfolio", description: "Add, edit, and remove portfolio projects." },
  { href: "/admin/settings", title: "Site Settings", description: "Site name, tagline, phone, email, social links." },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-text-primary">Content</h1>
      <p className="mt-2 text-text-muted">Choose a section to edit.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-hairline bg-surface p-6 transition-colors hover:border-gold"
          >
            <h2 className="font-display text-lg text-text-primary">{card.title}</h2>
            <p className="mt-2 text-sm text-text-muted">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
