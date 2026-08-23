import { getWorkflowSteps } from "@/lib/content/queries";
import { BilingualInput, BilingualTextarea, DeleteButton, Field, SaveButton, TextInput } from "@/components/admin/fields";
import { removeWorkflowStep, saveWorkflowStep } from "./actions";

export default async function AdminWorkflowPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const steps = await getWorkflowSteps();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-text-primary">Workflow</h1>
      <p className="mt-2 text-text-muted">The 5-step process shown on the Expertise page.</p>
      {saved && <p className="mt-4 text-sm text-gold">Saved.</p>}

      <div className="mt-10 flex flex-col gap-6">
        {steps.map((step) => (
          <form key={step.id} action={saveWorkflowStep} className="flex flex-col gap-4 border border-hairline bg-surface p-6">
            <input type="hidden" name="id" value={step.id} />
            <div className="w-24">
              <Field label="Order">
                <TextInput name="order" type="number" defaultValue={step.order} />
              </Field>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Title</p>
              <div className="mt-2">
                <BilingualInput name="title" ka={step.title.ka} en={step.title.en} />
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Description</p>
              <div className="mt-2">
                <BilingualTextarea name="description" ka={step.description.ka} en={step.description.en} rows={2} />
              </div>
            </div>
            <div className="flex gap-3">
              <SaveButton />
              <DeleteButton formAction={removeWorkflowStep} />
            </div>
          </form>
        ))}
      </div>

      <form action={saveWorkflowStep} className="mt-10 flex flex-col gap-4 border border-dashed border-hairline p-6">
        <div className="w-24">
          <Field label="Order">
            <TextInput name="order" type="number" defaultValue={steps.length + 1} />
          </Field>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Title</p>
          <div className="mt-2">
            <BilingualInput name="title" />
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Description</p>
          <div className="mt-2">
            <BilingualTextarea name="description" rows={2} />
          </div>
        </div>
        <div>
          <SaveButton>Add step</SaveButton>
        </div>
      </form>
    </div>
  );
}
