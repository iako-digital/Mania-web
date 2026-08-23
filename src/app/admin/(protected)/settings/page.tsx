import { getSiteSettings } from "@/lib/content/queries";
import { BilingualInput, Field, SaveButton, Textarea, TextInput } from "@/components/admin/fields";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const settings = await getSiteSettings();
  const socialLinksText = settings.socialLinks.map((link) => `${link.label} | ${link.url}`).join("\n");

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-text-primary">საიტის პარამეტრები</h1>
      <p className="mt-2 text-text-muted">საიტის სახელი, სლოგანი და საკონტაქტო ინფორმაცია.</p>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <form action={updateSettings} className="mt-10 flex flex-col gap-8">
        <Field label="საიტის სახელი">
          <TextInput name="siteName" defaultValue={settings.siteName} />
        </Field>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">სლოგანი</p>
          <div className="mt-2">
            <BilingualInput name="tagline" ka={settings.tagline.ka} en={settings.tagline.en} />
          </div>
        </div>

        <Field label="ტელეფონი">
          <TextInput name="phone" defaultValue={settings.phone} />
        </Field>

        <Field label="ელ. ფოსტა">
          <TextInput name="email" type="email" defaultValue={settings.email} />
        </Field>

        <Field label="მდებარეობა">
          <TextInput name="location" defaultValue={settings.location} placeholder="თბილისი, საქართველო" />
        </Field>

        <Field label="სოციალური ბმულები (თითო ხაზზე, ფორმატით: სახელი | https://ბმული)">
          <Textarea name="socialLinks" defaultValue={socialLinksText} rows={4} />
        </Field>

        <div>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
