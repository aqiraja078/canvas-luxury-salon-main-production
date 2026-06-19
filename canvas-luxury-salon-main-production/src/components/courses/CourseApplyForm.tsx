"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COURSE_APPLICATION_LIMITS } from "@/lib/course-application-validation";

type CourseApplyFormProps = {
  courseId: string;
  courseTitle: string;
};

export function CourseApplyForm({ courseId, courseTitle }: CourseApplyFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setMsg("");
    const fd = new FormData(form);
    const body = {
      courseId,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      age: String(fd.get("age") || ""),
      city: String(fd.get("city") || ""),
      message: String(fd.get("message") || ""),
    };
    try {
      const res = await fetch("/api/course-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("ok");
      setMsg(
        "Application received! Hum jald contact karenge — fee payment baad mein discuss hogi."
      );
      form.reset();
    } catch (err) {
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const inputClass =
    "w-full rounded-lg border-2 border-white/15 bg-black/20 px-4 py-3.5 text-sm text-white placeholder-white/60 outline-none transition-all duration-300 focus:border-gold/60 focus:bg-black/25";

  return (
    <motion.form
      onSubmit={onSubmit}
      className="glass-panel-premium space-y-5 rounded-3xl p-6 sm:p-8"
      aria-busy={status === "loading"}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h3 className="font-display text-2xl text-white">Apply for this course</h3>
        <p className="mt-2 text-sm text-white/65">
          {courseTitle} — koi online payment nahi. Form bharne ke baad hum call ya
          WhatsApp par guide karenge.
        </p>
      </div>

      <input type="hidden" name="courseId" value={courseId} />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-gold-light">
            Full name
          </span>
          <input
            name="name"
            required
            maxLength={COURSE_APPLICATION_LIMITS.name}
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-gold-light">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            maxLength={COURSE_APPLICATION_LIMITS.email}
            autoComplete="email"
            className={inputClass}
            placeholder="you@email.com"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-gold-light">
            Phone / WhatsApp
          </span>
          <input
            name="phone"
            type="tel"
            required
            maxLength={COURSE_APPLICATION_LIMITS.phone}
            autoComplete="tel"
            className={inputClass}
            placeholder="03xx xxxxxxx"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-gold-light">
            Age (optional)
          </span>
          <input
            name="age"
            maxLength={COURSE_APPLICATION_LIMITS.age}
            className={inputClass}
            placeholder="e.g. 22"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-gold-light">
            City (optional)
          </span>
          <input
            name="city"
            maxLength={COURSE_APPLICATION_LIMITS.city}
            className={inputClass}
            placeholder="Jhelum, Dina, Gujrat…"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-gold-light">
            Message (optional)
          </span>
          <textarea
            name="message"
            maxLength={COURSE_APPLICATION_LIMITS.message}
            rows={4}
            className={`${inputClass} min-h-[100px] resize-y`}
            placeholder="Previous experience, preferred batch, questions…"
          />
        </label>
      </div>

      {msg ? (
        <p
          className={`text-sm ${status === "ok" ? "text-emerald-300" : "text-rose-300"}`}
          role="status"
        >
          {msg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Submit application"}
      </button>
    </motion.form>
  );
}
