import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/50 px-6 md:px-16 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div>
            <Link href="/" className="font-black text-base tracking-[3px] text-yellow no-underline inline-block mb-5">
              GADA<span className="text-white font-medium ml-1.5">GLOBAL</span>
            </Link>
            <p className="text-[13px] leading-[1.85] max-w-[280px] text-white/35">
              Celebrating Oromo heritage through the power of running. October 3, 2026 at Rock Creek Parkway, Washington DC.
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
                { href: "/shop", label: "Race Tee" },
                { href: "/shop", label: "Gold Edition" },
                { href: "/shop", label: "Heritage Hoodie" },
              ],
            },
            {
              title: "Contact",
              links: [
                { href: "mailto:info@gadaglobal5k.com", label: "info@gadaglobal5k.com" },
                { href: "/#event", label: "Race Day FAQ" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] font-bold tracking-[3px] uppercase text-white/60 mb-5">{col.title}</h4>
              <ul className="list-none space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/35 text-[13px] hover:text-yellow transition-colors no-underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/25">
          <span>&copy; 2026 Gada Global. All rights reserved.</span>
          <div className="flex gap-3">
            {["f", "IG", "X"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-8 h-8 rounded-lg bg-white/4 text-white/30 flex items-center justify-center hover:bg-yellow hover:text-charcoal transition-all no-underline text-xs font-bold"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
