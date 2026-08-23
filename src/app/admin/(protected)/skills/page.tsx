import { getSkills } from "@/lib/content/queries";
import { BilingualInput, DeleteButton, Field, SaveButton, TextInput } from "@/components/admin/fields";
import { removeSkill, saveSkill } from "./actions";

export default async function AdminSkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const skills = await getSkills();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-text-primary">უნარები</h1>
      <p className="mt-2 text-text-muted">ძირითადი უნარების სია გვერდებზე „ექსპერტიზა“ და „ჩემ შესახებ“.</p>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <div className="mt-10 flex flex-col gap-6">
        {skills.map((skill) => (
          <form
            key={skill.id}
            action={saveSkill}
            className="flex flex-col gap-4 border border-hairline bg-surface p-6 sm:flex-row sm:items-end"
          >
            <input type="hidden" name="id" value={skill.id} />
            <div className="w-24 shrink-0">
              <Field label="რიგითობა">
                <TextInput name="order" type="number" defaultValue={skill.order} />
              </Field>
            </div>
            <div className="flex-1">
              <BilingualInput name="label" ka={skill.label.ka} en={skill.label.en} />
            </div>
            <div className="flex shrink-0 gap-3">
              <SaveButton />
              <DeleteButton formAction={removeSkill} />
            </div>
          </form>
        ))}
      </div>

      <form action={saveSkill} className="mt-10 flex flex-col gap-4 border border-dashed border-hairline p-6 sm:flex-row sm:items-end">
        <div className="w-24 shrink-0">
          <Field label="რიგითობა">
            <TextInput name="order" type="number" defaultValue={skills.length + 1} />
          </Field>
        </div>
        <div className="flex-1">
          <BilingualInput name="label" />
        </div>
        <div className="shrink-0">
          <SaveButton>დამატება</SaveButton>
        </div>
      </form>
    </div>
  );
}
