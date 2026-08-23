import { notFound } from "next/navigation";
import { getCategories, getPortfolioItems } from "@/lib/content/queries";
import { BilingualInput, BilingualTextarea, Field, SaveButton, Textarea, TextInput } from "@/components/admin/fields";
import { savePortfolioItem } from "../actions";
import type { PortfolioItemContent } from "@/lib/content/types";

const EMPTY: PortfolioItemContent = {
  id: "",
  slug: "",
  title: { ka: "", en: "" },
  categorySlug: "",
  description: { ka: "", en: "" },
  coverImageUrl: "",
  galleryUrls: [],
  videoUrl: "",
  featured: false,
  order: 0,
  year: "",
  occasion: { ka: "", en: "" },
};

export default async function AdminPortfolioEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await getCategories();

  let item: PortfolioItemContent = EMPTY;
  if (id !== "new") {
    const items = await getPortfolioItems();
    const found = items.find((entry) => entry.id === id);
    if (!found) notFound();
    item = found;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-text-primary">{id === "new" ? "New project" : "Edit project"}</h1>

      <form action={savePortfolioItem} className="mt-10 flex flex-col gap-8">
        {id !== "new" && <input type="hidden" name="id" value={item.id} />}

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Title</p>
          <div className="mt-2">
            <BilingualInput name="title" ka={item.title.ka} en={item.title.en} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Slug (optional — auto from English title)">
            <TextInput name="slug" defaultValue={item.slug} />
          </Field>
          <Field label="Category">
            <select
              name="categorySlug"
              defaultValue={item.categorySlug}
              className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
            >
              <option value="">—</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.title.en}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Description</p>
          <div className="mt-2">
            <BilingualTextarea name="description" ka={item.description.ka} en={item.description.en} rows={4} />
          </div>
        </div>

        <Field label="Cover image URL">
          <TextInput name="coverImageUrl" defaultValue={item.coverImageUrl} placeholder="/uploads/project.jpg or https://…" />
        </Field>

        <Field label="Gallery image URLs (one per line)">
          <Textarea name="galleryUrls" defaultValue={item.galleryUrls.join("\n")} rows={4} />
        </Field>

        <Field label="Video URL (optional) — a YouTube link or a direct .mp4 URL">
          <TextInput name="videoUrl" defaultValue={item.videoUrl} placeholder="https://youtu.be/… or /uploads/clip.mp4" />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Year">
            <TextInput name="year" defaultValue={item.year} />
          </Field>
          <Field label="Order">
            <TextInput name="order" type="number" defaultValue={item.order} />
          </Field>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Occasion / client (optional)</p>
          <div className="mt-2">
            <BilingualInput name="occasion" ka={item.occasion?.ka} en={item.occasion?.en} />
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input type="checkbox" name="featured" defaultChecked={item.featured} className="h-4 w-4 accent-[var(--gold)]" />
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted">Featured on Home</span>
        </label>

        <div>
          <SaveButton>{id === "new" ? "Create project" : "Save"}</SaveButton>
        </div>
      </form>
    </div>
  );
}
