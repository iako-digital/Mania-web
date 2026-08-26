import { getAboutContent } from "@/lib/content/queries";
import { BilingualTextarea, Field, SaveButton, TextInput } from "@/components/admin/fields";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { UploadGateProvider } from "@/components/admin/UploadGateContext";
import { updateAbout } from "./actions";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const about = await getAboutContent();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-text-primary">ჩემ შესახებ</h1>
      <p className="mt-2 text-text-muted">ბიოგრაფია, კარიერის აღწერა, მიღწევები.</p>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <UploadGateProvider>
        <form action={updateAbout} className="mt-10 flex flex-col gap-8">
          <MediaUploadField
            name="portraitUrl"
            label="პორტრეტის სურათი"
            defaultValue={about.portraitUrl}
            accept="image/*"
            placeholder="ატვირთეთ ფაილი ან ჩასვით URL"
          />

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">ბიოგრაფია / შესავალი</p>
            <div className="mt-2">
              <BilingualTextarea name="bio" ka={about.bio.ka} en={about.bio.en} rows={5} />
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">კარიერის აღწერა</p>
            <div className="mt-2">
              <BilingualTextarea
                name="careerNarrative"
                ka={about.careerNarrative.ka}
                en={about.careerNarrative.en}
                rows={5}
              />
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">მიღწევების აღწერა</p>
            <div className="mt-2">
              <BilingualTextarea
                name="achievementsNarrative"
                ka={about.achievementsNarrative.ka}
                en={about.achievementsNarrative.en}
                rows={5}
              />
            </div>
          </div>

          <Field label="პროგრამები (მძიმით გამოყოფილი)">
            <TextInput name="programs" defaultValue={about.programs.join(", ")} />
          </Field>

          <div>
            <SaveButton />
          </div>
        </form>
      </UploadGateProvider>
    </div>
  );
}
