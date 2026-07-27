import Link from "next/link";
import Image from "next/image";

const socials = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Footer() {
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
              ],
            },
            {
              title: "Shop",
              links: [
                { href: "/shop", label: "Heritage Tee" },
                { href: "/shop", label: "Black & Gold Tee" },
                { href: "/shop", label: "Race Day Combo" },
              ],
            },
            {
              title: "Contact",
              links: [
                { href: "mailto:info@gadaglobalus.com", label: "info@gadaglobalus.com" },
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
          <span>&copy; 2026 Gada Global Inc. All rights reserved.</span>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-lg bg-white/8 text-white/78 flex items-center justify-center hover:bg-yellow hover:text-charcoal transition-all no-underline"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
