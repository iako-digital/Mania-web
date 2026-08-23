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
      <h1 className="font-display text-3xl text-text-primary">Hero</h1>
      <p className="mt-2 text-text-muted">Home page headline and cover media.</p>
      {saved && <p className="mt-4 text-sm text-gold">Saved.</p>}

      <form action={updateHero} className="mt-10 flex flex-col gap-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Headline</p>
          <div className="mt-2">
            <BilingualInput name="headline" ka={hero.headline.ka} en={hero.headline.en} />
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Subheadline</p>
          <div className="mt-2">
            <BilingualTextarea name="subheadline" ka={hero.subheadline.ka} en={hero.subheadline.en} rows={2} />
          </div>
        </div>

        <Field label="Media type">
          <select
            name="mediaType"
            defaultValue={hero.mediaType}
            className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
          >
            <option value="image">Photo</option>
            <option value="video">Video loop</option>
          </select>
        </Field>

        <Field label="Image URL (used when media type is Photo)">
          <TextInput name="imageUrl" defaultValue={hero.imageUrl} placeholder="/uploads/hero.jpg or https://…" />
        </Field>

        <Field label="Video URL (used when media type is Video loop) — a YouTube link or a direct .mp4 URL">
          <TextInput
            name="videoUrl"
            defaultValue={hero.videoUrl}
            placeholder="https://youtu.be/… or /uploads/hero.mp4"
          />
        </Field>

        <Field label="Video poster image URL (optional)">
          <TextInput name="posterUrl" defaultValue={hero.posterUrl} />
        </Field>

        <div>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
