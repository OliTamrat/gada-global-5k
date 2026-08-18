"use client";

import { useMemo, useState } from "react";
import { Letterhead, LetterSheet, LetterSignOff } from "@/components/Letterhead";
import {
  isSponsorTier,
  SPONSOR_TIERS,
  type SponsorTierId,
} from "@/lib/sponsors";
import {
  LETTER_DEFAULTS,
  letterBenefits,
  letterParagraphs,
  letterPlainText,
  orPlaceholder,
  salutation,
  subjectLine,
} from "@/lib/letter";

/**
 * A draft sponsorship letter that the organizers fill in and print.
 *
 * The controls are a panel above the sheet rather than fields typed into the
 * letter itself. Inline editing looks cleverer and prints worse — a focused
 * input carries a browser's own border and background into the print job, and
 * "why is there a grey box round the business name" is not a question worth
 * having on a letter going out to a business.
 *
 * Nothing is stored. The letter is composed, printed or copied, and gone; a
 * page that quietly kept a list of every business approached would be holding
 * outreach records nobody asked it to hold.
 */
export function SponsorLetter({ today }: { today: string }) {
  const [businessName, setBusinessName] = useState(LETTER_DEFAULTS.businessName);
  const [contactName, setContactName] = useState(LETTER_DEFAULTS.contactName);
  const [senderName, setSenderName] = useState(LETTER_DEFAULTS.senderName);
  const [senderTitle, setSenderTitle] = useState(LETTER_DEFAULTS.senderTitle);
  // The date arrives from the server so the first paint and the hydration
  // agree on it; it stays editable because a letter is often printed one day
  // and posted the next.
  const [date, setDate] = useState(today);
  const [tierId, setTierId] = useState<SponsorTierId | "">("");
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  const tier = useMemo(
    () => SPONSOR_TIERS.find((t) => t.id === tierId),
    [tierId],
  );

  const fields = { businessName, contactName, senderName, senderTitle, date, tier };
  const paragraphs = letterParagraphs(fields);
  const benefits = letterBenefits(tier);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(letterPlainText(fields));
      setCopied("done");
    } catch {
      // Clipboard access is refused outright in some browsers and over plain
      // http. Saying so beats a button that silently does nothing.
      setCopied("failed");
    }
    window.setTimeout(() => setCopied("idle"), 4000);
  }

  return (
    <>
      {/* ══ CONTROLS — screen only ══ */}
      <section className="print:hidden max-w-[7in] mx-auto mb-8">
        <div className="bg-white rounded-2xl border border-charcoal/10 p-6 md:p-7">
          <h2 className="font-[family-name:var(--font-heading)] text-[17px] font-bold tracking-tight mb-1">
            Fill this in, then print or copy
          </h2>
          <p className="text-[13.5px] leading-[1.7] text-charcoal/65 mb-6">
            Anything left blank prints as a bracketed prompt, so a gap is
            impossible to miss on the page.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Business name" value={businessName} onChange={setBusinessName} placeholder="Sidamo Coffee House" />
            <Field label="Contact name" value={contactName} onChange={setContactName} placeholder="Ms. Alemu" hint="Leave blank to address the business itself" />
            <Field label="Your name" value={senderName} onChange={setSenderName} placeholder="Who is signing" />
            <Field label="Your title" value={senderTitle} onChange={setSenderTitle} placeholder="Race Director" />
            <Field label="Date" value={date} onChange={setDate} placeholder="October 3, 2026" />

            <label className="block">
              <span className="block text-[12px] font-bold tracking-[1.5px] uppercase text-charcoal/60 mb-1.5">
                Level to propose
              </span>
              <select
                value={tierId}
                onChange={(e) =>
                  setTierId(isSponsorTier(e.target.value) ? e.target.value : "")
                }
                className="w-full rounded-lg border border-charcoal/20 bg-cream px-3.5 py-2.5 text-[14px] text-charcoal focus:outline-none focus:border-charcoal/50"
              >
                <option value="">Present all four levels</option>
                {SPONSOR_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.amount}
                  </option>
                ))}
              </select>
              <span className="block text-[12px] leading-[1.6] text-charcoal/50 mt-1.5">
                Naming one level asks for a decision; listing all four asks a
                business to make one.
              </span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 mt-7">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 yellow-card px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase cursor-pointer border-none hover:-translate-y-0.5 transition-transform"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <path d="M6 14h12v8H6z" />
              </svg>
              Print Letter
            </button>

            <button
              type="button"
              onClick={copyText}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase cursor-pointer bg-charcoal text-white border-none hover:-translate-y-0.5 transition-transform"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              {copied === "done"
                ? "Copied"
                : copied === "failed"
                  ? "Copy blocked — select the text instead"
                  : "Copy as email"}
            </button>
          </div>
        </div>
      </section>

      {/* ══ THE LETTER ══ */}
      <LetterSheet>
        <Letterhead />

        <p className="text-[12px] text-charcoal/60 mt-5">{date}</p>

        <p className="text-[13px] font-bold text-charcoal mt-4">
          {orPlaceholder(businessName, "Business name")}
        </p>

        <p className="font-[family-name:var(--font-heading)] text-[14.5px] font-bold tracking-tight text-charcoal mt-4">
          {subjectLine(tier)}
        </p>

        <p className="text-[13px] text-charcoal mt-3.5">
          {salutation(contactName)}
        </p>

        <div className="mt-3.5 space-y-2.5">
          {paragraphs.map((p, i) => (
            <div key={i} className="space-y-2.5">
              <p className="text-[13px] leading-[1.7] text-charcoal">{p}</p>
              {/* Straight after the level paragraph, which is the sentence it
                  is the detail for. The plain-text version puts it in the same
                  place. */}
              {i === 2 ? <BenefitList benefits={benefits} /> : null}
            </div>
          ))}
        </div>

        <LetterSignOff
          senderName={orPlaceholder(senderName, "Your name")}
          senderTitle={orPlaceholder(senderTitle, "Your title")}
        />

      </LetterSheet>
    </>
  );
}

/**
 * What the level buys, as a list rather than a sentence.
 *
 * A list is also what a business owner scans for, and it is the part they will
 * read back to you on the phone — so it is the part that has to be derived
 * from `SPONSOR_BENEFITS` rather than described.
 */
function BenefitList({
  benefits,
}: {
  benefits: ReturnType<typeof letterBenefits>;
}) {
  return (
    <div className="pl-1">
      <p className="text-[12px] font-bold tracking-[0.5px] text-charcoal mb-1.5">
        {benefits.heading}:
      </p>
      <ul className="space-y-1">
        {benefits.included.map((label) => (
          <li key={label} className="flex gap-2.5 text-[12.5px] leading-[1.6] text-charcoal">
            <span className="w-1 h-1 rounded-full bg-charcoal mt-[7px] shrink-0" aria-hidden />
            {label}
          </li>
        ))}
        {/* What this level does NOT reach, and the level that does. Every "no"
            becomes a route upwards instead of a rejection — the same rule the
            /sponsors accordion follows, so the letter and the page make the
            same argument. */}
        {benefits.upsell.map((u) => (
          <li key={u.label} className="flex gap-2.5 text-[12.5px] leading-[1.6] text-charcoal/55">
            <span className="w-1 h-1 rounded-full bg-charcoal/35 mt-[7px] shrink-0" aria-hidden />
            <span>
              {u.label}{" "}
              <span className="whitespace-nowrap">
                — {u.tierName}, {u.amount}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] font-bold tracking-[1.5px] uppercase text-charcoal/60 mb-1.5">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-charcoal/20 bg-cream px-3.5 py-2.5 text-[14px] text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-charcoal/50"
      />
      {hint ? (
        <span className="block text-[12px] leading-[1.6] text-charcoal/50 mt-1.5">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
