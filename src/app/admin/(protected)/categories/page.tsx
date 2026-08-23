import { getCategories } from "@/lib/content/queries";
import { BilingualInput, DeleteButton, Field, SaveButton, TextInput } from "@/components/admin/fields";
import { removeCategory, saveCategory } from "./actions";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const categories = await getCategories();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-text-primary">კატეგორიები</h1>
      <p className="mt-2 text-text-muted">პორტფოლიოს კატეგორიების სახელები.</p>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <div className="mt-10 flex flex-col gap-6">
        {categories.map((category) => (
          <form
            key={category.id}
            action={saveCategory}
            className="flex flex-col gap-4 border border-hairline bg-surface p-6 sm:flex-row sm:items-end"
          >
            <input type="hidden" name="id" value={category.id} />
            <div className="w-24 shrink-0">
              <Field label="რიგითობა">
                <TextInput name="order" type="number" defaultValue={category.order} />
              </Field>
            </div>
            <div className="w-40 shrink-0">
              <Field label="Slug">
                <TextInput name="slug" defaultValue={category.slug} />
              </Field>
            </div>
            <div className="flex-1">
              <BilingualInput name="title" ka={category.title.ka} en={category.title.en} />
            </div>
            <div className="flex shrink-0 gap-3">
              <SaveButton />
              <DeleteButton formAction={removeCategory} />
            </div>
          </form>
        ))}
      </div>

      <form
        action={saveCategory}
        className="mt-10 flex flex-col gap-4 border border-dashed border-hairline p-6 sm:flex-row sm:items-end"
      >
        <div className="w-24 shrink-0">
          <Field label="რიგითობა">
            <TextInput name="order" type="number" defaultValue={categories.length + 1} />
          </Field>
        </div>
        <div className="w-40 shrink-0">
          <Field label="Slug (არასავალდებულო)">
            <TextInput name="slug" placeholder="ავტომატურად ინგლისური სათაურიდან" />
          </Field>
        </div>
        <div className="flex-1">
          <BilingualInput name="title" />
        </div>
        <div className="shrink-0">
          <SaveButton>დამატება</SaveButton>
        </div>
      </form>
    </div>
  );
}
