"use client";

import { useState } from "react";
import Link from "next/link";
import { tiers, getCurrentTier } from "@/lib/registration";
import { WAVES, WAVE_META, DEFAULT_WAVE } from "@/lib/waves";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function RegisterPage() {
  const currentTier = getCurrentTier();
  const [selectedTier, setSelectedTier] = useState(currentTier.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      age: Number(form.get("age")),
      gender: form.get("gender") as string,
      tshirtSize: form.get("tshirtSize") as string,
      tierId: selectedTier,
      emergencyContact: form.get("emergency") as string,
      wave: form.get("wave") as string,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        setError(result.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const tier = tiers.find((t) => t.id === selectedTier);
  const inputClass =
    "w-full px-4 py-3.5 border-2 border-charcoal/8 rounded-xl bg-white focus:border-yellow focus:ring-2 focus:ring-yellow/10 outline-none transition-all text-[15px] placeholder:text-charcoal/50";
  const labelClass =
    "block text-[11px] font-bold tracking-[2px] uppercase text-charcoal/60 mb-2";

  return (
    <main className="min-h-screen bg-cream">
      {/* ── Hero banner — solid dark, no gradient mess ── */}
      <section className="relative pt-28 pb-14 px-6 md:px-16 lg:px-20 bg-charcoal overflow-hidden">
        {/* Subtle photo overlay — very dark, no color bleed */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `url('https://images.unsplash.com/photo-1461896836934-bd45ba3a560c?w=1600&q=80') center/cover no-repeat`,
          }}
        />
        <div className="absolute inset-0 bg-charcoal/80" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="text-white/65 text-[14px] hover:text-white/85 transition-colors no-underline">Home</Link>
            <span className="text-white/50">/</span>
            <span className="text-yellow text-[14px] font-semibold">Register</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-4 block">Registration</span>
              <h1 className="font-[family-name:var(--font-heading)] text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-[1.1] text-white tracking-tight mb-3">
                Join the Race
              </h1>
              <p className="text-[16px] leading-[1.8] text-white/72 max-w-[420px]">
                Secure your spot at the inaugural Gada Global 5K. All registrations include bib, chip, medal, and t-shirt.
              </p>
            </div>

            <div className="flex gap-8">
              {[
                { value: "5K", label: "Distance" },
                { value: "Oct 3", label: "Race Day" },
                { value: "500", label: "Spots" },
              ].map((stat) => (
                <div key={stat.label} className="text-right">
                  <div className="text-2xl font-black text-white tracking-tight">{stat.value}</div>
                  <div className="text-[11px] font-semibold tracking-[2px] uppercase text-yellow/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content — warm cream background ── */}
      <section className="px-6 md:px-16 lg:px-20 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-stretch">

            {/* ── LEFT COLUMN: Tier cards (vertical stack) + What's Included ── */}
            <ScrollReveal>
              <div className="h-full flex flex-col">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-5 tracking-tight">
                  Choose Your Tier
                </h3>

                <div className="flex flex-col gap-3 mb-6">
                  {tiers.map((t) => {
                    const isActive = selectedTier === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTier(t.id)}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          isActive
                            ? "border-yellow bg-white shadow-[0_8px_32px_rgba(245,200,66,0.1)]"
                            : "border-transparent bg-white/60 hover:bg-white hover:border-charcoal/6"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "yellow-card" : "bg-charcoal/5 text-charcoal/55"}`}>
                          {t.id === "early" ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 2 20 2s-1.2 5-4.5 9.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                          ) : t.id === "standard" ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 2.5-7 .4 2 2.5 3 3 4.5s-.5 3.5-2 5c-.83.83-1.5 2.5-1 4a2.5 2.5 0 002 1"/></svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-[15px] tracking-tight text-charcoal">{t.name}</div>
                          <div className="text-[15px] md:text-[13px] text-charcoal/60">{t.description}</div>
                        </div>
                        <div className="text-2xl font-black text-charcoal tracking-tight">
                          ${t.price / 100}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* What's Included */}
                <div className="bg-white rounded-2xl p-6 border border-charcoal/5 flex-1">
                  <h4 className="font-bold text-[14px] text-charcoal mb-5 tracking-tight">What&apos;s Included</h4>
                  <ul className="space-y-3">
                    {[
                      "Official race bib",
                      "Gada Global 5K finisher medal",
                      "Official race t-shirt",
                      "Post-race Irrecha celebration access",
                      "Cash prize eligibility: top 3 men and women",
                      "Water stations on course",
                      "Professional race photography",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[16px] md:text-[14px] text-charcoal/75">
                        <span className="w-5 h-5 rounded-lg yellow-card flex items-center justify-center shrink-0">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Event Info — dark accent card at bottom of left column */}
                <div className="bg-charcoal rounded-2xl p-6 mt-5 text-white">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, label: "Date", value: "Oct 3, 2026" },
                      { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "Start", value: "9:00 AM ET" },
                      { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: "Location", value: "Rock Creek Tennis Center" },
                      { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, label: "Capacity", value: "500 Runners" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-yellow/10 text-yellow flex items-center justify-center shrink-0">{item.icon}</div>
                        <div>
                          <div className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">{item.label}</div>
                          <div className="text-[13px] font-semibold text-white">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* ── RIGHT COLUMN: Registration form ── */}
            <ScrollReveal>
              <div className="bg-white rounded-3xl p-7 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-charcoal/4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-charcoal tracking-tight mb-1">
                      Registration Form
                    </h3>
                    <p className="text-[16px] md:text-[14px] text-charcoal/60">
                      Fill out your details to proceed
                    </p>
                  </div>
                  <div className="yellow-card px-4 py-2 rounded-xl font-bold text-[14px] tracking-tight shrink-0">
                    {tier?.name} &mdash; ${(tier?.price ?? 0) / 100}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-[14px] mb-6 border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input name="firstName" required placeholder="Abdi" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input name="lastName" required placeholder="Gudeta" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelClass}>Email</label>
                      <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input name="phone" type="tel" placeholder="(202) 555-0123" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelClass}>Age</label>
                      <input name="age" type="number" min={5} max={99} required placeholder="28" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Gender</label>
                      <select name="gender" required defaultValue="" className={`${inputClass} cursor-pointer appearance-none`}>
                        <option value="" disabled>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelClass}>T-Shirt Size</label>
                      <select name="tshirtSize" required defaultValue="" className={`${inputClass} cursor-pointer appearance-none`}>
                        <option value="" disabled>Select size</option>
                        <option value="XS">XS</option>
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Emergency Contact</label>
                      <input name="emergency" required placeholder="Jane Doe - (202) 555-0199" className={inputClass} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={labelClass}>Start Wave</label>
                    <select name="wave" required defaultValue={DEFAULT_WAVE} className={`${inputClass} cursor-pointer appearance-none`}>
                      {WAVES.map((w) => (
                        <option key={w} value={w}>
                          {WAVE_META[w].label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[13px] leading-[1.6] text-charcoal/55 mt-2">
                      Waves start a few minutes apart so faster runners are not
                      weaving through walkers and children. Most adults belong in
                      Open; pick Kids &amp; Family if you are running with children.
                    </p>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 yellow-card rounded-xl font-bold text-[15px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(245,200,66,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
                    >
                      {loading ? "Processing..." : "Proceed to Payment"}
                    </button>

                    <p className="text-[12px] text-charcoal/50 text-center mt-3">
                      Secure payment by Stripe. By registering you agree to the event waiver.
                    </p>
                  </div>
                </form>

                {/* Limited spots banner inside form card */}
                <div className="mt-6 bg-charcoal/4 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg yellow-card flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-charcoal tracking-tight">Limited to 500 runners</div>
                      <div className="text-[12px] text-charcoal/60">Spots are filling up fast</div>
                    </div>
                  </div>
                  <Link href="/shop" className="text-[12px] font-bold text-gold-dim hover:text-charcoal transition-colors no-underline tracking-wider uppercase">
                    Shop Merch
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
