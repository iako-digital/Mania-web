import { MessageSquare } from "lucide-react";

// Static placeholder for the Q&A thread UI — wiring it up to real
// questions/answers needs a persistence layer + student auth that don't
// exist yet (see [[demo-student]]), so this only sketches the layout.
export function QATab() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center text-text-muted">
      <MessageSquare size={28} className="opacity-40" />
      <p className="text-sm">ამ გაკვეთილზე ჯერ არცერთი კითხვა არ არის.</p>
      <button
        type="button"
        disabled
        className="mt-2 border border-hairline px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-text-muted opacity-50"
      >
        კითხვის დასმა
      </button>
    </div>
  );
}
