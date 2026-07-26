"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const type = params.get("type");
  const name = params.get("name");
  const isRegistration = type === "registration";

  return (
    <main className="bg-cream min-h-screen pt-24 pb-20 px-6 md:px-16 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-2xl yellow-card flex items-center justify-center text-4xl mx-auto mb-8 shadow-[0_8px_32px_rgba(245,200,66,0.2)]">
          {isRegistration ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M6.5 8L12 14l5.5-6M12 14v8"/></svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>
          )}
        </div>

        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-4 tracking-tight">
          {isRegistration ? "You\u2019re Registered!" : "Order Confirmed!"}
        </h1>

        <p className="text-base md:text-[15px] leading-[1.85] text-charcoal/45 mb-6">
          {isRegistration ? (
            <>
              Welcome to the Gada Global 5K{name ? `, ${name}` : ""}! You&apos;ll
              receive a confirmation email with your race details shortly.
            </>
          ) : (
            <>
              Your merchandise order has been placed. You&apos;ll receive a shipping
              confirmation email once your items are on the way.
            </>
          )}
        </p>

        {isRegistration && (
          <div className="bg-white rounded-2xl p-6 border border-charcoal/5 mb-8 text-left">
            <h3 className="font-bold text-[15px] md:text-[13px] mb-3 tracking-tight">What&apos;s Next?</h3>
            <ul className="space-y-2.5 text-[15px] md:text-[13px] text-charcoal/45">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full yellow-card flex items-center justify-center mt-0.5 shrink-0"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
                Check your email for the confirmation and race waiver
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full yellow-card flex items-center justify-center mt-0.5 shrink-0"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
                Mark your calendar: October 3, 2026 \u2014 race starts 9:00 AM
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full yellow-card flex items-center justify-center mt-0.5 shrink-0"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
                Packet pickup starts at 7:00 AM at the Rock Creek Park Tennis Center,
                5220 16th St NW, Washington, DC 20011
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full yellow-card flex items-center justify-center mt-0.5 shrink-0"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
                Your official race t-shirt will be in your packet
              </li>
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="inline-flex items-center gap-2 yellow-card px-8 py-3 font-bold text-[13px] tracking-wider uppercase rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(245,200,66,0.2)] transition-all no-underline">
            Back to Home
          </Link>
          {isRegistration && (
            <Link href="/shop" className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-3 font-bold text-[13px] tracking-wider uppercase rounded-xl hover:bg-warm-gray transition-all no-underline">
              Shop Merch
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-cream min-h-screen flex items-center justify-center">
          <div className="text-[15px] text-charcoal/35">Loading...</div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
