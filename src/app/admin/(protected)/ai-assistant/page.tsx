import { getAiAssistantContent } from "@/lib/content/queries";
import { BilingualInput, Field, SaveButton, Textarea } from "@/components/admin/fields";
import { updateAiAssistant } from "./actions";

export default async function AdminAiAssistantPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const ai = await getAiAssistantContent();
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-text-primary">AI ასისტენტი</h1>
      <p className="mt-2 text-text-muted">
        საიტზე მოძრავი ჩატ-ასისტენტის ცოდნის ბაზა, ქცევის ინსტრუქციები და მისალმების ტექსტი.
      </p>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <p
        className={`mt-4 font-mono text-xs uppercase tracking-widest ${
          geminiConfigured ? "text-gold" : "text-red-400"
        }`}
      >
        {geminiConfigured
          ? "Gemini API გასაღები კონფიგურირებულია."
          : "Gemini API გასაღები არ არის კონფიგურირებული — დაამატეთ GEMINI_API_KEY გარემოს ცვლადებში (Vercel → Settings → Environment Variables)."}
      </p>

      <form action={updateAiAssistant} className="mt-10 flex flex-col gap-8">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={ai.enabled}
            className="h-4 w-4 accent-[var(--gold)]"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
            ასისტენტი აქტიურია საიტზე
          </span>
        </label>

        <Field label="ცოდნის ბაზა — ინფორმაცია მანიას, სერვისებისა და საკონტაქტო არხების შესახებ">
          <Textarea
            name="knowledgeBase"
            defaultValue={ai.knowledgeBase}
            rows={8}
            placeholder="მაგ.: სერვისები, ფასების პრინციპი, სამუშაო საათები, კონტაქტის არხები…"
          />
        </Field>

        <Field label="ქცევის ინსტრუქციები — ტონი და შეზღუდვები, რომლებსაც ასისტენტი უნდა მისდევდეს">
          <Textarea name="systemInstructions" defaultValue={ai.systemInstructions} rows={5} />
        </Field>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">მისალმების ტექსტი</p>
          <div className="mt-2">
            <BilingualInput
              name="welcomeMessage"
              ka={ai.welcomeMessage.ka}
              en={ai.welcomeMessage.en}
            />
          </div>
        </div>

        <div>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
