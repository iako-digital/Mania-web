import { getHeroContent } from "@/lib/content/queries";
import { BilingualInput, BilingualTextarea, Field, SaveButton, TextInput } from "@/components/admin/fields";
import { updateHero } from "./actions";

export default async function AdminHeroPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const hero = await getHeroContent();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-text-primary">თავსართი</h1>
      <p className="mt-2 text-text-muted">მთავარი გვერდის სათაური და გარეკანის მედია.</p>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <form action={updateHero} className="mt-10 flex flex-col gap-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">სათაური</p>
          <div className="mt-2">
            <BilingualInput name="headline" ka={hero.headline.ka} en={hero.headline.en} />
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">ქვესათაური</p>
          <div className="mt-2">
            <BilingualTextarea name="subheadline" ka={hero.subheadline.ka} en={hero.subheadline.en} rows={2} />
          </div>
        </div>

        <Field label="მედიის ტიპი">
          <select
            name="mediaType"
            defaultValue={hero.mediaType}
            className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
          >
            <option value="image">ფოტო</option>
            <option value="video">ვიდეო (ციკლური)</option>
          </select>
        </Field>

        <Field label="სურათის URL (გამოიყენება, თუ მედიის ტიპია „ფოტო“)">
          <TextInput name="imageUrl" defaultValue={hero.imageUrl} placeholder="/uploads/hero.jpg ან https://…" />
        </Field>

        <Field label="ვიდეოს URL (გამოიყენება, თუ მედიის ტიპია „ვიდეო“) — YouTube ბმული ან პირდაპირი .mp4 ფაილი">
          <TextInput
            name="videoUrl"
            defaultValue={hero.videoUrl}
            placeholder="https://youtu.be/… ან /uploads/hero.mp4"
          />
        </Field>

        <Field label="ვიდეოს გარეკანის სურათის URL (არასავალდებულო)">
          <TextInput name="posterUrl" defaultValue={hero.posterUrl} />
        </Field>

        <div>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
