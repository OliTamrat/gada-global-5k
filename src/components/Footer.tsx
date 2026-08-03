"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeSocials } from "@/lib/links";
import { LINK_ICONS } from "@/components/LinkIcons";
import Image from "next/image";


const socials = activeSocials();

export function Footer() {
  // /links is a link-in-bio page whose whole job is one screen of taps. The
  // footer repeats the same destinations directly beneath them.
  const pathname = usePathname();
  if (pathname === "/links") return null;

  return (
    <footer className="bg-charcoal text-white px-6 md:px-16 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div>
            <Link href="/" className="flex items-center gap-3 no-underline mb-5" aria-label="Gada Global home">
              <Image
                src="/images/brand/gada-global-logo.png"
                alt="Gada Global"
                width={425}
                height={360}
                className="h-16 w-auto"
              />
              <span className="font-black text-xl tracking-[2.5px] text-yellow leading-none">
                GADA<span className="text-white font-medium ml-1.5">GLOBAL</span>
              </span>
            </Link>
            <p className="text-[16px] md:text-[14px] leading-[1.85] max-w-[280px] text-white/88">
              Celebrating Oromo heritage through the power of running. October 3, 2026 at the Rock Creek Park Tennis Center, Washington DC.
            </p>
          </div>

          {[
            {
              title: "Event",
              links: [
                { href: "/#about", label: "About" },
                { href: "/#event", label: "Details" },
                { href: "/#schedule", label: "Schedule" },
                { href: "/register", label: "Register" },
                { href: "/sponsors", label: "Become a Sponsor" },
                { href: "/links", label: "All Links" },
              ],
            },
            {
              title: "Shop",
              links: [
                { href: "/shop", label: "Race Day Tee" },
                { href: "/shop", label: "Race Day Hoodie" },
                { href: "/shop", label: "Race Day Bundle" },
              ],
            },
            {
              title: "Contact",
              links: [
                { href: "mailto:info@gadaglobalrun.com", label: "info@gadaglobalrun.com" },
                { href: "/#event", label: "Race Day FAQ" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[12px] font-bold tracking-[3px] uppercase text-white/95 mb-5">{col.title}</h4>
              <ul className="list-none space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/82 text-[16px] md:text-[14px] hover:text-yellow transition-colors no-underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/78">
          <div className="flex flex-col sm:flex-row items-center gap-x-3 gap-y-1.5 text-center sm:text-left">
            <span>&copy; 2026 Gada Global Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-white/30" aria-hidden="true">
              &middot;
            </span>
            {/* SVG heart rather than an emoji — the project forbids emoji in UI,
                and this also renders identically across platforms. */}
            <span className="inline-flex items-center gap-1.5">
              Made with
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-red-oromo shrink-0"
                role="img"
                aria-label="love"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              by <span className="font-semibold text-white/92">Olink Technologies</span>
            </span>
          </div>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-lg bg-white/8 text-white/78 flex items-center justify-center hover:bg-yellow hover:text-charcoal transition-all no-underline"
              >
                {LINK_ICONS[s.icon]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
