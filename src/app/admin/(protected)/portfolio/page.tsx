import Link from "next/link";
import { getPortfolioItems } from "@/lib/content/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removePortfolioItem } from "./actions";

export default async function AdminPortfolioListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const items = await getPortfolioItems();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary">Portfolio</h1>
          <p className="mt-2 text-text-muted">Projects shown in the portfolio grid.</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="bg-gold px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-text-primary transition-colors"
        >
          New project
        </Link>
      </div>

      {saved && <p className="mt-4 text-sm text-gold">Saved.</p>}

      <div className="mt-10 flex flex-col gap-3">
        {items.length === 0 && <p className="text-text-muted">No projects yet.</p>}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border border-hairline bg-surface p-4"
          >
            {item.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.coverImageUrl} alt="" className="h-16 w-16 shrink-0 object-cover" />
            ) : (
              <div className="h-16 w-16 shrink-0 bg-ink" />
            )}
            <div className="flex-1">
              <p className="text-text-primary">{item.title.en || item.title.ka || "(untitled)"}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                {item.category?.title.en || item.categorySlug} · {item.slug}
                {item.featured ? " · Featured" : ""}
              </p>
            </div>
            <Link
              href={`/admin/portfolio/${item.id}`}
              className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold"
            >
              Edit
            </Link>
            <form action={removePortfolioItem}>
              <input type="hidden" name="id" value={item.id} />
              <DeleteButton formAction={removePortfolioItem} />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
