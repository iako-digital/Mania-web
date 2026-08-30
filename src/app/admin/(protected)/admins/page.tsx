import { requireSuperAdmin } from "@/lib/admin/auth";
import { getAdmins } from "@/lib/admin/queries";
import { DeleteButton, Field, inputClass, SaveButton, TextInput } from "@/components/admin/fields";
import { changeAdminRole, createAdmin, deleteAdmin } from "./actions";

export default async function AdminAdminsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const session = await requireSuperAdmin();
  const admins = await getAdmins();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-text-primary">ადმინისტრატორები</h1>
      <p className="mt-2 text-text-muted">
        ადმინისტრატორების სია, როლის მართვა და დამატება. მხოლოდ Super Admin-ს აქვს ამ გვერდზე წვდომა.
      </p>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-10 flex flex-col gap-4">
        {admins.length === 0 && <p className="text-text-muted">ადმინისტრატორები არ არის დამატებული.</p>}

        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex flex-col gap-4 border border-hairline bg-surface p-6 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <p className="text-text-primary">
                {admin.name}
                {admin.email === session.email && (
                  <span className="ml-2 font-mono text-xs uppercase tracking-widest text-gold">(თქვენ)</span>
                )}
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{admin.email}</p>
            </div>

            <form action={changeAdminRole} className="flex shrink-0 items-end gap-3">
              <input type="hidden" name="id" value={admin.id} />
              <div className="w-40">
                <Field label="როლი">
                  <select name="role" defaultValue={admin.role} className={inputClass}>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </Field>
              </div>
              <SaveButton>განახლება</SaveButton>
            </form>

            <form action={deleteAdmin}>
              <input type="hidden" name="id" value={admin.id} />
              <input type="hidden" name="email" value={admin.email} />
              <DeleteButton formAction={deleteAdmin}>წაშლა</DeleteButton>
            </form>
          </div>
        ))}
      </div>

      <form
        action={createAdmin}
        className="mt-10 flex flex-col gap-4 border border-dashed border-hairline p-6 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Field label="სახელი">
            <TextInput name="name" required />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="ელ-ფოსტა">
            <TextInput name="email" type="email" required />
          </Field>
        </div>
        <div className="w-40 shrink-0">
          <Field label="როლი">
            <select name="role" defaultValue="admin" className={inputClass}>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </Field>
        </div>
        <div className="shrink-0">
          <SaveButton>დამატება</SaveButton>
        </div>
      </form>
    </div>
  );
}
