"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BibLookup() {
  const router = useRouter();
  const [bib, setBib] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(bib.trim());
    if (!Number.isInteger(n) || n <= 0) {
      setError("Enter your bib number — digits only.");
      return;
    }
    setError("");
    router.push(`/bib/${n}`);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-charcoal/8">
      <label
        htmlFor="bib"
        className="block text-[12px] font-bold tracking-[2px] uppercase text-charcoal/60 mb-2"
      >
        Bib Number
      </label>
      <input
        id="bib"
        name="bib"
        inputMode="numeric"
        autoComplete="off"
        value={bib}
        onChange={(e) => setBib(e.target.value)}
        placeholder="101"
        className="w-full text-[24px] font-black tracking-tight bg-cream rounded-xl px-4 py-3 border border-charcoal/10 outline-none focus:border-yellow transition-colors mb-2"
      />
      {error && <p className="text-[13px] text-red-oromo mb-2">{error}</p>}
      <button
        type="submit"
        className="w-full yellow-card rounded-xl px-6 py-3.5 font-bold text-[14px] tracking-wider uppercase cursor-pointer border-none hover:-translate-y-0.5 transition-transform mt-3"
      >
        Open Printable Bib
      </button>
    </form>
  );
}
