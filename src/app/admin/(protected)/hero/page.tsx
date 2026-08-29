import { getHeroContent } from "@/lib/content/queries";
import { BilingualInput, BilingualTextarea, SaveButton } from "@/components/admin/fields";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { UploadGateProvider } from "@/components/admin/UploadGateContext";
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

      <UploadGateProvider>
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

          <MediaUploadField
            name="videoUrl"
            label="თავსართის ვიდეო — თუ ატვირთავთ, ის ავტომატურად გამოჩნდება ფოტოს ნაცვლად"
            defaultValue={hero.videoUrl}
            accept="video/*"
            placeholder="ატვირთეთ ფაილი, ან ჩასვით https://youtu.be/… ბმული"
            hint="ნებისმიერი ზომის (რეკომენდებულია 16:9 HD/4K 1920x1080 ან ვერტიკალური)"
          />

          <MediaUploadField
            name="imageUrl"
            label="თავსართის ფოტო — გამოჩნდება, თუ ვიდეო არ არის ატვირთული"
            defaultValue={hero.imageUrl}
            accept="image/*"
            placeholder="ატვირთეთ ფაილი ან ჩასვით URL"
            hint="ნებისმიერი ზომის (რეკომენდებულია 16:9 HD/4K 1920x1080 ან ვერტიკალური)"
          />

          <MediaUploadField
            name="posterUrl"
            label="ვიდეოს გარეკანის სურათი (არასავალდებულო — ჩანს ვიდეოს ჩატვირთვამდე)"
            defaultValue={hero.posterUrl}
            accept="image/*"
          />

          <div>
            <SaveButton />
          </div>
        </form>
      </UploadGateProvider>
    </div>
  );
}
