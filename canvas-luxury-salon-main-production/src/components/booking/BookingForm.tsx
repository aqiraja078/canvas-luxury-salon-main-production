"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BOOKING_FIELD_LIMITS } from "@/lib/booking-validation";
import {
  buildHairBookingServiceName,
  type HairLength,
} from "@/lib/hair-services-data";
import { bookingServices } from "@/lib/site";

const times = Array.from({ length: 15 }, (_, i) =>
  String(8 + i).padStart(2, "0") + ":00"
);

type BookingFormProps = { defaultService?: string; serviceOptions?: string[] };

export function BookingForm({
  defaultService: defaultServiceProp,
  serviceOptions: serviceOptionsProp,
}: BookingFormProps) {
  const searchParams = useSearchParams();
  const hairLengthParam = searchParams.get("hairLength");
  const hairPriceParam = searchParams.get("price");

  const defaultService = useMemo(() => {
    if (defaultServiceProp) return defaultServiceProp;
    const fromUrl = searchParams.get("service");
    if (!fromUrl) return undefined;
    let serviceName = fromUrl;
    try {
      serviceName = decodeURIComponent(fromUrl);
    } catch {
      serviceName = fromUrl;
    }
    if (hairLengthParam && hairPriceParam) {
      const amount = Number.parseInt(hairPriceParam.replace(/\D/g, ""), 10);
      const length = hairLengthParam as HairLength;
      if (amount > 0 && ["short", "medium", "long"].includes(length)) {
        return buildHairBookingServiceName(serviceName, length, amount);
      }
    }
    return serviceName;
  }, [defaultServiceProp, searchParams, hairLengthParam, hairPriceParam]);

  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle"
  );
  const [msg, setMsg] = useState("");
  const [serviceVal, setServiceVal] = useState("");
  const [serviceOptionsFromApi, setServiceOptionsFromApi] = useState<
    string[] | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Array<{ name: string; active?: boolean }>) => {
        if (cancelled) return;
        const names = Array.from(
          new Set(
            data.filter((s) => s.active !== false).map((s) => s.name.trim())
          )
        ).sort((a, b) => a.localeCompare(b));
        if (names.length > 0) setServiceOptionsFromApi(names);
      })
      .catch(() => {
        /* keep built-in bookingServices fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const serviceOptions = useMemo(() => {
    const base =
      serviceOptionsProp && serviceOptionsProp.length > 0
        ? serviceOptionsProp
        : serviceOptionsFromApi && serviceOptionsFromApi.length > 0
          ? serviceOptionsFromApi
          : bookingServices;
    if (defaultService && !base.includes(defaultService)) {
      return [defaultService, ...base];
    }
    return base;
  }, [defaultService, serviceOptionsProp, serviceOptionsFromApi]);

  useEffect(() => {
    if (defaultService) {
      setServiceVal(defaultService);
    }
  }, [defaultService]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setMsg("");
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service: String(fd.get("service") || ""),
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      message: String(fd.get("message") || ""),
    };
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("ok");
      setMsg("Your appointment request has been received. We will confirm shortly.");
      form.reset();
      // Keep deep-linked / preselected service after reset (controlled select).
      setServiceVal(defaultService ?? "");
    } catch (err) {
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const minDate = new Date().toISOString().split("T")[0];

  const inputClass = "w-full rounded-lg border-2 border-white/15 bg-black/20 px-4 py-3.5 text-sm text-white placeholder-white/60 outline-none appearance-none transition-all duration-300 focus:border-gold/60 focus:bg-black/25 focus:shadow-card-hover active:scale-[0.99]";

  return (
    <motion.form
      onSubmit={onSubmit}
      className="glass-panel-premium mx-auto max-w-2xl space-y-5 rounded-3xl p-6 sm:space-y-6 sm:rounded-3xl sm:p-8 md:p-10"
      aria-busy={status === "loading"}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-2">
        <h3 className="font-display text-2xl font-bold text-white">Reserve Your Time</h3>
        <p className="mt-1 text-sm text-white/70">Fill in your details and pick your perfect time slot</p>
        {defaultService && defaultService.includes(" · ") ? (
          <p className="mt-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-light">
            Selected: <span className="font-semibold text-white">{defaultService}</span>
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2.5 block text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
            Full name
          </span>
          <input
            name="name"
            required
            maxLength={BOOKING_FIELD_LIMITS.name}
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-2.5 block text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            maxLength={BOOKING_FIELD_LIMITS.email}
            autoComplete="email"
            className={inputClass}
            placeholder="you@email.com"
          />
        </label>
        <label className="block">
          <span className="mb-2.5 block text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
            Phone
          </span>
          <input
            name="phone"
            type="tel"
            required
            maxLength={BOOKING_FIELD_LIMITS.phone}
            autoComplete="tel"
            className={inputClass}
            placeholder="+92 ..."
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2.5 block text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
            Service
          </span>
          <select
            name="service"
            required
            value={serviceVal}
            onChange={(e) => setServiceVal(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2.5 block text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
            Preferred date
          </span>
          <input
            name="date"
            type="date"
            required
            min={minDate}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2.5 block text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
            Preferred time
          </span>
          <select
            name="time"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select time
            </option>
            {times.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2.5 block text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
            Notes (optional)
          </span>
          <textarea
            name="message"
            rows={3}
            maxLength={BOOKING_FIELD_LIMITS.message}
            className={`${inputClass} resize-none`}
            placeholder="Occasion, allergies, inspiration..."
          />
        </label>
      </div>

      {msg && (
        <motion.p
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm font-semibold ${
            status === "ok" ? "text-gold-light" : "text-red-300"
          }`}
        >
          {msg}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold-premium w-full py-4 text-xs disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
        <span className="relative z-10">
          {status === "loading" ? "Sending…" : "Request appointment"}
        </span>
      </button>
    </motion.form>
  );
}
