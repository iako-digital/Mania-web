import { notFound } from "next/navigation";
import { getPatternById } from "@/lib/patterns/queries";
import { BilingualInput, BilingualTextarea, Field, SaveButton, TextInput } from "@/components/admin/fields";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { GalleryUploadField } from "@/components/admin/GalleryUploadField";
import { PdfUploadField } from "@/components/admin/PdfUploadField";
import { UploadGateProvider } from "@/components/admin/UploadGateContext";
import type { Pattern } from "@/lib/patterns/types";
import { savePattern } from "../../actions";

const EMPTY: Pattern = {
  id: "",
  slug: "",
  title: { ka: "", en: "" },
  description: { ka: "", en: "" },
  category: "",
  sizeRange: "",
  difficulty: "intermediate",
  coverImageUrl: "",
  galleryUrls: [],
  pdfUrl: "",
  price: 0,
  currency: "GEL",
  published: false,
  createdAt: "",
  updatedAt: "",
};

export default async function AdminPatternEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;

  let pattern: Pattern = EMPTY;
  if (id !== "new") {
    const found = await getPatternById(id);
    if (!found) notFound();
    pattern = found;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-text-primary">{id === "new" ? "ახალი თარგი" : "თარგის რედაქტირება"}</h1>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <UploadGateProvider>
        <form action={savePattern} className="mt-10 flex flex-col gap-8">
          {id !== "new" && <input type="hidden" name="id" value={pattern.id} />}

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">სათაური</p>
            <div className="mt-2">
              <BilingualInput name="title" ka={pattern.title.ka} en={pattern.title.en} />
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">აღწერა</p>
            <div className="mt-2">
              <BilingualTextarea name="description" ka={pattern.description.ka} en={pattern.description.en} rows={4} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="კატეგორია (slug, მაგ: dresses)">
              <TextInput name="category" defaultValue={pattern.category} />
            </Field>
            <Field label="ზომები">
              <TextInput name="sizeRange" defaultValue={pattern.sizeRange} placeholder="XS–XL" />
            </Field>
            <Field label="სირთულე">
              <select
                name="difficulty"
                defaultValue={pattern.difficulty}
                className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
              >
                <option value="beginner">დამწყები</option>
                <option value="intermediate">საშუალო</option>
                <option value="advanced">გამოცდილი</option>
              </select>
            </Field>
          </div>

          <MediaUploadField
            name="coverImageUrl"
            label="ყდის სურათი"
            defaultValue={pattern.coverImageUrl}
            accept="image/*"
            hint="რეკომენდებული ზომა: 1000x1250px (4:5)"
          />

          <GalleryUploadField
            name="galleryUrls"
            label="გალერეის სურათები"
            defaultValue={pattern.galleryUrls}
            hint="რეკომენდებული ზომა: 1500px+ სიგანე"
          />

          <PdfUploadField name="pdfUrl" label="თარგის PDF ფაილი" defaultValue={pattern.pdfUrl} hint="შესყიდვის შემდეგ ეს ფაილი ხელმისაწვდომი ხდება /dashboard-ზე" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="ფასი">
              <TextInput name="price" type="number" step="0.01" defaultValue={pattern.price} />
            </Field>
            <Field label="ვალუტა">
              <select
                name="currency"
                defaultValue={pattern.currency}
                className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
              >
                <option value="GEL">GEL</option>
                <option value="USD">USD</option>
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-3">
            <input type="checkbox" name="published" defaultChecked={pattern.published} className="h-4 w-4 accent-[var(--gold)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">გამოქვეყნებული</span>
          </label>

          <div>
            <SaveButton>{id === "new" ? "თარგის შექმნა" : "შენახვა"}</SaveButton>
          </div>
        </form>
      </UploadGateProvider>
    </div>
  );
}
