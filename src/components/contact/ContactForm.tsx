"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full border-b border-hairline bg-transparent py-3 text-text-primary placeholder:text-text-muted/60 focus:border-gold focus:outline-none transition-colors";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <RevealOnScroll>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div>
          <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {t("formName")}
          </label>
          <input id="name" name="name" type="text" required className={`mt-2 ${inputClass}`} />
        </div>

        <div>
          <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {t("formEmail")}
          </label>
          <input id="email" name="email" type="email" required className={`mt-2 ${inputClass}`} />
        </div>

        <div>
          <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {t("formMessage")}
          </label>
          <textarea id="message" name="message" required rows={5} className={`mt-2 resize-none ${inputClass}`} />
        </div>

        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileTap={{ scale: 0.98 }}
          className="w-fit bg-gold px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
        >
          {t("formSubmit")}
        </motion.button>

        {status === "success" && (
          <p className="font-mono text-xs uppercase tracking-widest text-gold">{t("formSuccess")}</p>
        )}
        {status === "error" && (
          <p className="font-mono text-xs uppercase tracking-widest text-red-400">{t("formError")}</p>
        )}
      </form>
    </RevealOnScroll>
  );
}
