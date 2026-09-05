import { getPromoCodes } from "@/lib/promo-codes/queries";
import { getCourses } from "@/lib/courses/queries";
import { getPatterns } from "@/lib/patterns/queries";
import { Field, TextInput, inputClass, SaveButton, DeleteButton } from "@/components/admin/fields";
import type { PromoCode } from "@/lib/promo-codes/types";
import { createPromoCodeAction, deletePromoCodeAction, togglePromoCodeAction } from "./actions";

function formatDiscount(promo: PromoCode): string {
  return promo.discountType === "percent" ? `${promo.discountValue}%` : `${promo.discountValue} ₾`;
}

export default async function AdminPromoCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const [codes, courses, patterns] = await Promise.all([getPromoCodes(), getCourses(), getPatterns()]);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-text-primary">პრომო კოდები</h1>
      <p className="mt-2 text-text-muted">
        პროდუქტზე მიბმული ფასდაკლების კოდები. თუ ფასდაკლება საბოლოო ფასს 0 ₾-მდე დაწევს, წვდომა იხსნება მყისიერად,
        ბანკის ქვითრის გარეშე.
      </p>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline font-mono text-xs uppercase tracking-widest text-text-muted">
              <th className="py-3 pr-4">კოდი</th>
              <th className="py-3 pr-4">პროდუქტი</th>
              <th className="py-3 pr-4">ფასდაკლება</th>
              <th className="py-3 pr-4">გამოყენება</th>
              <th className="py-3 pr-4">სტატუსი</th>
              <th className="py-3 pr-4">წაშლა</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((promo) => (
              <tr key={promo.id} className="border-b border-hairline/50">
                <td className="py-3 pr-4 font-mono text-gold">{promo.code}</td>
                <td className="py-3 pr-4 text-sm text-text-muted">
                  {promo.itemTitle}{" "}
                  <span className="text-xs">({promo.itemType === "course" ? "კურსი" : "თარგი"})</span>
                </td>
                <td className="py-3 pr-4 text-sm text-text-primary">{formatDiscount(promo)}</td>
                <td className="py-3 pr-4 text-sm text-text-muted">
                  {promo.usedCount}
                  {promo.usageLimit != null ? ` / ${promo.usageLimit}` : ""}
                </td>
                <td className="py-3 pr-4">
                  <form action={togglePromoCodeAction}>
                    <input type="hidden" name="id" value={promo.id} />
                    <input type="hidden" name="active" value={(!promo.active).toString()} />
                    <button
                      type="submit"
                      className={
                        "font-mono text-xs uppercase tracking-widest cursor-pointer " +
                        (promo.active ? "text-gold hover:text-red-400" : "text-red-400 hover:text-gold")
                      }
                    >
                      {promo.active ? "აქტიური" : "გამორთული"}
                    </button>
                  </form>
                </td>
                <td className="py-3 pr-4">
                  <form action={deletePromoCodeAction}>
                    <input type="hidden" name="id" value={promo.id} />
                    <DeleteButton formAction={deletePromoCodeAction} />
                  </form>
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-text-muted">
                  ჯერ არცერთი პრომო კოდი არ არის შექმნილი.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form
        action={createPromoCodeAction}
        className="mt-12 flex flex-col gap-4 border border-dashed border-hairline p-6 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <p className="w-full font-mono text-xs uppercase tracking-widest text-text-muted">ახალი კოდის შექმნა</p>
        <div className="w-40">
          <Field label="კოდი (არასავალდებულო)">
            <TextInput name="code" placeholder="ავტომატურად გენერირდება" />
          </Field>
        </div>
        <div className="min-w-[220px] flex-1">
          <Field label="პროდუქტი">
            <select name="target" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                აირჩიეთ
              </option>
              <optgroup label="კურსები">
                {courses.map((c) => (
                  <option key={c.id} value={`course:${c.id}`}>
                    {c.title.ka || c.title.en}
                  </option>
                ))}
              </optgroup>
              <optgroup label="თარგები">
                {patterns.map((p) => (
                  <option key={p.id} value={`pattern:${p.id}`}>
                    {p.title.ka || p.title.en}
                  </option>
                ))}
              </optgroup>
            </select>
          </Field>
        </div>
        <div className="w-44">
          <Field label="ტიპი">
            <select name="discountType" defaultValue="fixed" className={inputClass}>
              <option value="fixed">ფიქსირებული (₾)</option>
              <option value="percent">პროცენტული (%)</option>
            </select>
          </Field>
        </div>
        <div className="w-32">
          <Field label="ოდენობა">
            <TextInput name="discountValue" type="number" min={0} step="0.01" required />
          </Field>
        </div>
        <div className="w-36">
          <Field label="ლიმიტი (არასავალდებულო)">
            <TextInput name="usageLimit" type="number" min={1} step={1} placeholder="უსასრულო" />
          </Field>
        </div>
        <div className="w-40">
          <Field label="ვადა (არასავალდებულო)">
            <TextInput name="expiresAt" type="date" />
          </Field>
        </div>
        <div className="shrink-0">
          <SaveButton>შექმნა</SaveButton>
        </div>
      </form>
    </div>
  );
}
