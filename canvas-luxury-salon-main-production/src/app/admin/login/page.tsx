"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { HumaLogo } from "@/components/brand/HumaLogo";
import { ADMIN_ROLE_THEME } from "@/lib/admin-role-ui";

const ROLE_HINTS = [
  { username: "huma.owner", ...ADMIN_ROLE_THEME.owner },
  { username: "huma.reception", ...ADMIN_ROLE_THEME.reception },
  { username: "huma.contact", ...ADMIN_ROLE_THEME.contact },
] as const;

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const matchedHint = ROLE_HINTS.find((r) => r.username === username.trim());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Login failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/12 bg-black/50 px-4 py-3.5 text-sm text-white outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/20";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(201,169,98,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(-12deg, transparent, transparent 80px, rgba(201,169,98,0.9) 80px, rgba(201,169,98,0.9) 81px)`,
        }}
        aria-hidden
      />

      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <span className="mx-auto inline-flex items-center justify-center">
            <HumaLogo variant="ornate" size="md" />
          </span>
          <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">
            Control room
          </h1>
          <p className="mt-2 text-sm text-white/45">
            Bookings · services · offers · courses · team
          </p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {ROLE_HINTS.map((role) => (
            <button
              key={role.username}
              type="button"
              onClick={() => setUsername(role.username)}
              className={`rounded-xl border px-2 py-3 text-center transition ${
                username === role.username
                  ? `${role.border} bg-white/[0.06]`
                  : "border-white/10 bg-black/20 hover:border-white/20"
              }`}
            >
              <span className="block text-sm opacity-80" aria-hidden>
                {role.icon}
              </span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.12em] text-white/55">
                {role.label}
              </span>
            </button>
          ))}
        </div>

        <motion.form
          onSubmit={onSubmit}
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-black/40 p-8 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl md:p-10"
        >
          {matchedHint ? (
            <div
              className={`mb-5 rounded-xl border px-4 py-3 ${matchedHint.badge}`}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">
                Signing in as {matchedHint.label}
              </p>
              <p className="mt-1 text-xs opacity-90">{matchedHint.tagline}</p>
            </div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              autoComplete="username"
              placeholder="huma.owner"
              required
            />
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Password
            </span>
            <div className="flex gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 rounded-xl border border-white/12 px-3 text-[10px] uppercase tracking-wider text-white/50 hover:border-gold/30 hover:text-gold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          {err ? (
            <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {err}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-black transition hover:shadow-[0_8px_30px_-8px_rgba(201,169,98,0.6)] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Enter dashboard"}
          </button>
        </motion.form>

        <p className="mt-6 text-center text-xs text-white/35">
          <Link href="/" className="hover:text-gold transition-colors">
            ← Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
