import Link from "next/link";
import { getPortfolioItems } from "@/lib/content/queries";
import { optimizeCloudinaryUrl } from "@/lib/media";
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
          <h1 className="font-display text-3xl text-text-primary">პორტფოლიო</h1>
          <p className="mt-2 text-text-muted">პროექტები, რომლებიც ჩანს პორტფოლიოს გვერდზე.</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="bg-gold px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-text-primary transition-colors"
        >
          ახალი პროექტი
        </Link>
      </div>

      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <div className="mt-10 flex flex-col gap-3">
        {items.length === 0 && <p className="text-text-muted">ჯერ არცერთი პროექტი არ არის.</p>}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border border-hairline bg-surface p-4"
          >
            {item.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={optimizeCloudinaryUrl(item.coverImageUrl)} alt="" className="h-16 w-16 shrink-0 object-cover" />
            ) : (
              <div className="h-16 w-16 shrink-0 bg-ink" />
            )}
            <div className="flex-1">
              <p className="text-text-primary">{item.title.ka || item.title.en || "(უსათაურო)"}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                {item.category?.title.ka || item.categorySlug} · {item.slug}
                {item.featured ? " · გამორჩეული" : ""}
              </p>
            </div>
            <Link
              href={`/admin/portfolio/${item.id}`}
              className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold"
            >
              რედაქტირება
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
