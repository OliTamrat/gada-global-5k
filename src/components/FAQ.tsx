"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

const faqs = [
  { q: "How do I register?", a: "Visit our Register page and select your pricing tier. Fill in your details, choose your t-shirt size, and complete payment through our secure Stripe checkout. You'll receive a confirmation email with your race details." },
  { q: "Can beginners participate?", a: "The Gada Global 5K is designed for all fitness levels. Whether you're a seasoned runner or this is your very first race, you are welcome. The course is flat, paved, and beginner-friendly." },
  { q: "Are walkers welcome?", a: "Yes. Walkers are absolutely welcome and encouraged. There is no minimum pace requirement. The course will remain open and supported for all participants." },
  { q: "Is there a virtual option?", a: "We are exploring a virtual participation option for those who cannot attend in person. Check back closer to race day for updates on virtual registration." },
  { q: "Where do I park?", a: "Parking information will be shared via email to all registered participants closer to race day. Free parking is available near the Rock Creek Nature Center start area." },
  { q: "Are refunds available?", a: "Registration fees are non-refundable, but transfers to another participant are allowed up to 7 days before race day. Contact us at info@gadaglobal5k.com for transfer requests." },
  { q: "Can children participate?", a: "Children under 12 can participate with a registered adult guardian. We also plan to offer a Kids Dash as part of our event programming." },
  { q: "How can I become a sponsor?", a: "We offer multiple sponsorship tiers from Community Partner to Title Sponsor. Email info@gadaglobal5k.com or visit our About page for sponsorship details and benefits." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <span className="text-[11px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">Got Questions?</span>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-[15px] leading-[1.85] text-charcoal/65 max-w-[460px] mx-auto">
            Everything you need to know before race day.
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <ScrollReveal key={faq.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left bg-white rounded-2xl border border-charcoal/5 overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] cursor-pointer"
                >
                  <div className="flex items-center justify-between px-6 py-5">
                    <span className="text-[15px] font-bold tracking-tight text-charcoal pr-4">{faq.q}</span>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${isOpen ? 'yellow-card rotate-45' : 'bg-charcoal/5 text-charcoal/40'}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    </span>
                  </div>
                  {isOpen && (
                    <div className="px-6 pb-5 -mt-1">
                      <p className="text-[15px] md:text-[14px] text-charcoal/55 leading-[1.8]">{faq.a}</p>
                    </div>
                  )}
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
