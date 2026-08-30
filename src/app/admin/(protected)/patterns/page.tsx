import Link from "next/link";
import { getPatterns } from "@/lib/patterns/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removePattern } from "./actions";

export default async function AdminPatternsListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const patterns = await getPatterns();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary">თარგები</h1>
          <p className="mt-2 text-text-muted">PDF თარგების მენეჯერი — თარგების მაღაზიის (/pattern-shop) პროდუქტები.</p>
        </div>
        <Link
          href="/admin/patterns/new/edit"
          className="bg-gold px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-text-primary transition-colors"
        >
          ახალი თარგი
        </Link>
      </div>

      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <div className="mt-10 flex flex-col gap-3">
        {patterns.length === 0 && <p className="text-text-muted">ჯერ არცერთი თარგი არ არის.</p>}

        {patterns.map((pattern) => (
          <div key={pattern.id} className="flex items-center gap-4 border border-hairline bg-surface p-4">
            {pattern.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pattern.coverImageUrl} alt="" className="h-16 w-16 shrink-0 object-cover" />
            ) : (
              <div className="h-16 w-16 shrink-0 bg-ink" />
            )}
            <div className="flex-1">
              <p className="text-text-primary">{pattern.title.ka || pattern.title.en || "(უსათაურო)"}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                {pattern.category || "—"} · {pattern.price} {pattern.currency}
                {pattern.published ? " · გამოქვეყნებული" : " · დრაფტი"}
              </p>
            </div>
            <Link
              href={`/pattern-shop/${pattern.slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold"
            >
              ნახვა ↗
            </Link>
            <Link
              href={`/admin/patterns/${pattern.id}/edit`}
              className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold"
            >
              რედაქტირება
            </Link>
            <form action={removePattern}>
              <input type="hidden" name="id" value={pattern.id} />
              <DeleteButton formAction={removePattern} />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
