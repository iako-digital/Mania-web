import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const inputClass =
  "mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:outline-none";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-widest text-text-muted">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} resize-none ${props.className || ""}`} />;
}

export function BilingualInput({
  name,
  ka,
  en,
}: {
  name: string;
  ka?: string;
  en?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="ქართული">
        <TextInput name={`${name}_ka`} defaultValue={ka} />
      </Field>
      <Field label="English">
        <TextInput name={`${name}_en`} defaultValue={en} />
      </Field>
    </div>
  );
}

export function BilingualTextarea({
  name,
  ka,
  en,
  rows = 5,
}: {
  name: string;
  ka?: string;
  en?: string;
  rows?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="ქართული">
        <Textarea name={`${name}_ka`} defaultValue={ka} rows={rows} />
      </Field>
      <Field label="English">
        <Textarea name={`${name}_en`} defaultValue={en} rows={rows} />
      </Field>
    </div>
  );
}

export function SaveButton({ children = "Save" }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary cursor-pointer"
    >
      {children}
    </button>
  );
}

export function DeleteButton({
  formAction,
  children = "Delete",
}: {
  formAction: string | ((formData: FormData) => void | Promise<void>);
  children?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className="border border-hairline px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors hover:border-red-400 hover:text-red-400 cursor-pointer"
    >
      {children}
    </button>
  );
}
