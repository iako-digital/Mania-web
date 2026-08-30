"use client";

import { useState } from "react";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export function QuizPanel({ courseId }: { courseId: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setSubmitted(false);
    setAnswers({});
    try {
      const res = await fetch("/api/learning/ai-tutor/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.questions)) {
        setError(data?.error || "ქვიზის შექმნა ვერ მოხერხდა.");
        return;
      }
      setQuestions(data.questions);
    } catch {
      setError("ქსელის შეცდომა.");
    } finally {
      setLoading(false);
    }
  }

  const score = questions ? questions.filter((q, i) => answers[i] === q.correctIndex).length : 0;

  async function submit() {
    if (!questions) return;
    setSubmitted(true);
    try {
      await fetch("/api/learning/ai-tutor/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, score, total: questions.length }),
      });
    } catch {
      // Attempt logging is best-effort — the student's result is already shown either way.
    }
  }

  if (!questions) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-text-muted">გაიარეთ AI-ს მიერ გენერირებული ქვიზი კურსის მასალაზე დაყრდნობით.</p>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gold px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
        >
          {loading ? "იქმნება…" : "ქვიზის დაწყება"}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {questions.map((q, qi) => (
        <div key={qi}>
          <p className="text-text-primary">
            {qi + 1}. {q.question}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = oi === q.correctIndex;
              const showResult = submitted;
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                  className={
                    "flex items-center justify-between gap-2 border px-4 py-2.5 text-left text-sm transition-colors " +
                    (showResult
                      ? isCorrect
                        ? "border-gold text-gold"
                        : selected
                          ? "border-red-400 text-red-400"
                          : "border-hairline text-text-muted"
                      : selected
                        ? "border-gold text-gold"
                        : "border-hairline text-text-muted hover:border-text-primary hover:text-text-primary cursor-pointer")
                  }
                >
                  {opt}
                  {showResult && isCorrect && <CheckCircle2 size={16} />}
                  {showResult && selected && !isCorrect && <XCircle size={16} />}
                </button>
              );
            })}
          </div>
          {submitted && q.explanation && <p className="mt-2 text-xs text-text-muted">{q.explanation}</p>}
        </div>
      ))}

      {!submitted ? (
        <button
          type="button"
          onClick={submit}
          disabled={Object.keys(answers).length < questions.length}
          className="w-fit bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
        >
          პასუხების გადამოწმება
        </button>
      ) : (
        <div className="flex items-center gap-4 border-t border-hairline pt-6">
          <p className="text-text-primary">
            შედეგი: <span className="text-gold">{score}</span> / {questions.length}
          </p>
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-2 border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold cursor-pointer"
          >
            <RefreshCw size={14} />
            ახალი ქვიზი
          </button>
        </div>
      )}
    </div>
  );
}
