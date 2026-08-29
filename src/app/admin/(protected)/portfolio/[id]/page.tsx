import { notFound } from "next/navigation";
import { getCategories, getPortfolioItems } from "@/lib/content/queries";
import { BilingualInput, BilingualTextarea, Field, SaveButton, TextInput } from "@/components/admin/fields";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { GalleryUploadField } from "@/components/admin/GalleryUploadField";
import { UploadGateProvider } from "@/components/admin/UploadGateContext";
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
      <h1 className="font-display text-3xl text-text-primary">{id === "new" ? "ახალი პროექტი" : "პროექტის რედაქტირება"}</h1>

      <UploadGateProvider>
        <form action={savePortfolioItem} className="mt-10 flex flex-col gap-8">
          {id !== "new" && <input type="hidden" name="id" value={item.id} />}

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">სათაური</p>
            <div className="mt-2">
              <BilingualInput name="title" ka={item.title.ka} en={item.title.en} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Slug (არასავალდებულო — ავტომატურად ინგლისური სათაურიდან)">
              <TextInput name="slug" defaultValue={item.slug} />
            </Field>
            <Field label="კატეგორია">
              <select
                name="categorySlug"
                defaultValue={item.categorySlug}
                className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
              >
                <option value="">—</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.title.ka || category.title.en}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">აღწერა</p>
            <div className="mt-2">
              <BilingualTextarea name="description" ka={item.description.ka} en={item.description.en} rows={4} />
            </div>
          </div>

          <MediaUploadField
            name="coverImageUrl"
            label="ყდის სურათი"
            defaultValue={item.coverImageUrl}
            accept="image/*"
            placeholder="ატვირთეთ ფაილი ან ჩასვით URL"
            hint="რეკომენდებული ზომა: 1200x800px (3:2) ან 1000x1250px (4:5)"
          />

          <GalleryUploadField
            name="galleryUrls"
            label="გალერეის სურათები"
            defaultValue={item.galleryUrls}
            hint="რეკომენდებული ზომა: 1500px+ სიგანე (ნებისმიერი პროპორცია ავტომატურად ერგება)"
          />

          <MediaUploadField
            name="videoUrl"
            label="ვიდეო (არასავალდებულო) — ატვირთეთ ფაილი ან ჩასვით YouTube ბმული"
            defaultValue={item.videoUrl}
            accept="video/*"
            placeholder="ატვირთეთ ფაილი, ან ჩასვით https://youtu.be/… ბმული"
            hint="ნებისმიერი ზომისა და ფორმატის ფოტო/ვიდეო (ავტომატურად ერგება დიზაინს)"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="წელი">
              <TextInput name="year" defaultValue={item.year} />
            </Field>
            <Field label="რიგითობა">
              <TextInput name="order" type="number" defaultValue={item.order} />
            </Field>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">შემთხვევა / კლიენტი (არასავალდებულო)</p>
            <div className="mt-2">
              <BilingualInput name="occasion" ka={item.occasion?.ka} en={item.occasion?.en} />
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input type="checkbox" name="featured" defaultChecked={item.featured} className="h-4 w-4 accent-[var(--gold)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">გამორჩეული მთავარ გვერდზე</span>
          </label>

          <div>
            <SaveButton>{id === "new" ? "პროექტის შექმნა" : "შენახვა"}</SaveButton>
          </div>
        </form>
      </UploadGateProvider>
    </div>
  );
}
