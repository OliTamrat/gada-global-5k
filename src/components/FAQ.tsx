"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

const faqs = [
  { q: "How do I register?", a: "Visit our Register page and select your pricing tier. Fill in your details, choose your t-shirt size, and complete payment through our secure Stripe checkout. You'll receive a confirmation email with your race details." },
  { q: "Can beginners participate?", a: "The Gada Global 5K is designed for all fitness levels. Whether you're a seasoned runner or this is your very first race, you are welcome. The course is flat, paved, and beginner-friendly." },
  { q: "Are walkers welcome?", a: "Yes. Walkers are absolutely welcome and encouraged. There is no minimum pace requirement. The course will remain open and supported for all participants." },
  { q: "Are there cash prizes?", a: "Yes. The top three men and the top three women each receive cash awards: $300 for first place, $200 for second, and $100 for third, for a total purse of $1,200. Winners are announced at the awards ceremony at 10:00 AM. Age group awards and finisher medals are presented alongside the cash prizes." },
  { q: "What time does the event start?", a: "Packet pickup opens at 7:00 AM, the opening ceremony begins at 8:15 AM, and the 5K starts at 9:00 AM. The awards ceremony follows at 10:00 AM and the Irrecha cultural festival runs until noon." },
  { q: "Is there a virtual option?", a: "We are exploring a virtual participation option for those who cannot attend in person. Check back closer to race day for updates on virtual registration." },
  { q: "Where do I park?", a: "Parking information will be shared via email to all registered participants closer to race day. Free parking is available at the Rock Creek Park Tennis Center, 5220 16th St NW, where the race starts and finishes." },
  { q: "Are refunds available?", a: "Registration fees are non-refundable, but transfers to another participant are allowed up to 7 days before race day. Contact us at info@gadaglobalrun.com for transfer requests." },
  { q: "Can children participate?", a: "Children under 12 can participate with a registered adult guardian. We also plan to offer a Kids Dash as part of our event programming." },
  { q: "How can I become a sponsor?", a: "We offer multiple sponsorship tiers from Community Partner to Title Sponsor. Email info@gadaglobalrun.com or visit our About page for sponsorship details and benefits." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-cream pt-16 md:pt-20 pb-8 md:pb-12 px-6 md:px-16 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-16 items-start">
          {/* Left: heading + CTA */}
          <ScrollReveal>
            <div className="lg:sticky lg:top-24">
              <span className="text-[12px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">Got Questions?</span>
              <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-4">
                Frequently Asked<br />Questions
              </h2>
              <p className="text-base md:text-[16px] leading-[1.85] text-charcoal/78 mb-8 max-w-[320px]">
                Everything you need to know before race day. Can&apos;t find your answer? Reach out to us directly.
              </p>
              <a href="mailto:info@gadaglobalrun.com" className="inline-flex items-center gap-2 text-[14px] font-bold text-charcoal hover:text-gold-dim transition-colors no-underline">
                <span className="w-8 h-8 rounded-lg yellow-card flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                </span>
                info@gadaglobalrun.com
              </a>
            </div>
          </ScrollReveal>

          {/* Right: accordion */}
          <div className="space-y-2.5">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <ScrollReveal key={faq.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`w-full text-left rounded-2xl overflow-hidden transition-all cursor-pointer border ${
                      isOpen
                        ? "bg-charcoal border-charcoal shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                        : "bg-white border-charcoal/5 hover:border-charcoal/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    <div className="flex items-center gap-4 px-6 py-5">
                      <span className={`w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-black shrink-0 ${
                        isOpen ? "yellow-card" : "bg-charcoal/5 text-charcoal/55"
                      }`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-[16px] font-bold tracking-tight flex-1 ${isOpen ? "text-white" : "text-charcoal"}`}>{faq.q}</span>
                      <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? "yellow-card rotate-45" : "bg-charcoal/5 text-charcoal/55"
                      }`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                      </span>
                    </div>
                    {isOpen && (
                      <div className="px-6 pb-6 pl-[4.25rem]">
                        <p className="text-[16px] md:text-[15px] text-white/85 leading-[1.85]">{faq.a}</p>
                      </div>
                    )}
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
