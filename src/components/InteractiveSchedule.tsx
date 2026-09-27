"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

// Race-day times are fixed by the Rock Creek Park permit: start no later
// than 8:00 AM, road reopened by 9:30, post-race done by 10:30, site clear
// by 11:00. This schedule beats every one of them. See docs/decisions/0008
// before moving anything later.
const schedule = [
  {
    time: "6:30 AM",
    title: "Packet Pickup Opens",
    desc: "Collect your race bib and official Gada Global 5K Peace Run t-shirt at the start/finish area at the Rock Creek Park Tennis Center, 5220 16th St NW.",
    details: ["Bring photo ID and your registration confirmation", "T-shirt exchange available for sizing", "Course maps and the safety briefing are here", "Sign-in and packet pickup only \u2014 registration closes online beforehand"],
    duration: "6:30 - 7:30 AM",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
    color: "yellow" as const,
  },
  {
    time: "7:30 AM",
    title: "Welcome & Course Briefing",
    desc: "A short welcome, the course and safety briefing, and runners move to their wave corrals. Kept brief so the first wave can leave on time.",
    details: ["Welcome from Gada Global Inc.", "Course, turns and water-station briefing", "Marshals and medical team introduced", "Runners move to their wave corral"],
    duration: "7:30 - 7:45 AM",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1z"/><path d="M16 8a5 5 0 010 8"/></svg>,
    color: "green" as const,
  },
  {
    time: "7:45 AM",
    title: "5K Start \u2014 Three Waves",
    desc: "Elite at 7:45, open at 7:50, kids & family at 7:55. Your wave is printed on your bib. The course is flat to gently rolling, fully paved, with water stations at miles 1 and 2.",
    details: ["7:45 Elite \u00b7 7:50 Open \u00b7 7:55 Kids & Family", "Course marshals at every turn", "Water stations at mile 1 and mile 2", "Medical team on standby throughout"],
    duration: "7:45 - 9:00 AM",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M6.5 8L12 14l5.5-6M12 14v8"/></svg>,
    color: "yellow" as const,
  },
  {
    time: "9:15 AM",
    title: "Awards Ceremony",
    desc: "Overall and age-group winners are announced, and every finisher receives the official medal. Park rules do not allow prize money to be handed out on park grounds, so cash winners are announced here and collect their prize in person afterwards.",
    details: ["Men's top 3 and Women's top 3 announced", "Age group awards: 14-19, 20-29, 30-39, 40-49, 50+", "Finisher medals for all participants", "Cash prizes collected in person after the event"],
    duration: "9:15 - 9:45 AM",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 01-2-2V4h4M18 9h2a2 2 0 002-2V4h-4M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22h10c0-2-0.85-3.25-2.03-3.79A1.06 1.06 0 0114 17v-2.34"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/></svg>,
    color: "green" as const,
  },
  {
    time: "9:45 AM",
    title: "Photos & Farewell",
    desc: "A short window for photographs with finishers and award winners before the team clears the site. The road through the park reopens at 9:30, and we are fully packed up by 10:00.",
    details: ["Photographs with finishers and winners", "Race information desk stays staffed", "Lost property and bib queries handled here", "Site clear by 10:00 AM"],
    duration: "9:45 - 10:00 AM",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    color: "yellow" as const,
  },
];

export function InteractiveSchedule() {
  const [activeIndex, setActiveIndex] = useState(2); // Default to race start

  const active = schedule[activeIndex];

  return (
    <div className="max-w-7xl mx-auto">
      <ScrollReveal className="text-center mb-14">
        <span className="text-[11px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">Race Day Schedule</span>
        <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-4">October 3, 2026</h2>
        <p className="text-base md:text-[16px] leading-[1.85] text-charcoal/85 max-w-[480px] mx-auto">An early start, set by our National Park Service permit \u2014 packet pickup from 6:30 AM, first wave at 7:45, packed up by 10:00. Click any event to explore details.</p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 items-start">
          {/* Left: clickable event list */}
          <div className="flex flex-col gap-2">
            {schedule.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={item.title}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all cursor-pointer border-2 ${
                    isActive
                      ? "bg-white border-yellow shadow-[0_4px_20px_rgba(245,200,66,0.1)]"
                      : "bg-white/60 border-transparent hover:bg-white hover:border-charcoal/6"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? item.color === "yellow" ? "yellow-card" : "bg-green-deep text-white"
                      : "bg-charcoal/5 text-charcoal/55"
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[11px] font-bold tracking-[2px] uppercase mb-0.5 ${isActive ? "text-gold-dim" : "text-charcoal/55"}`}>{item.time}</div>
                    <div className={`text-[15px] font-bold tracking-tight truncate ${isActive ? "text-charcoal" : "text-charcoal/78"}`}>{item.title}</div>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full yellow-card flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: expanded detail panel */}
          <div className="bg-charcoal rounded-3xl p-8 md:p-10 text-white min-h-[400px] flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${active.color === "yellow" ? "yellow-card" : "bg-green-deep text-white"}`}>
                {active.icon}
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-[3px] uppercase text-yellow">{active.duration}</div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">{active.title}</h3>
              </div>
            </div>

            <p className="text-base md:text-[16px] text-white/95 leading-relaxed mb-8">{active.desc}</p>

            <div className="flex-1">
              <div className="text-[11px] font-bold tracking-[3px] uppercase text-white/72 mb-4">What to Expect</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                    <div className="w-5 h-5 rounded-md yellow-card flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <span className="text-[16px] md:text-[14px] text-white/92 leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-8 flex gap-1.5">
              {schedule.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1 rounded-full transition-all cursor-pointer border-none ${
                    i === activeIndex ? "bg-yellow flex-[3]" : "bg-white/10 flex-1 hover:bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
