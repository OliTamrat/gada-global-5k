"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  // Only the homepage gets a transparent-to-solid transition
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Non-home pages: always solid dark. Home: transparent until scroll.
  const showSolid = !isHome || scrolled;

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/#event", label: "Event" },
    { href: "/register", label: "Register" },
    { href: "/shop", label: "Shop" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/race", label: "Live Results" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 lg:px-16 h-[76px] backdrop-blur-2xl transition-all duration-300 ${
        showSolid
          ? "bg-charcoal border-b border-white/6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          : "bg-charcoal/20 border-b border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0" aria-label="Gada Global home">
        <Image
          src="/images/brand/gada-global-logo.png"
          alt="Gada Global"
          width={425}
          height={360}
          priority
          className="h-12 md:h-14 w-auto"
        />
        <span className="font-black text-lg md:text-xl tracking-[2.5px] text-yellow leading-none">
          GADA<span className="text-white font-medium ml-1.5">GLOBAL</span>
        </span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden lg:flex gap-7 list-none">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-[15px] font-semibold transition-colors no-underline ${
                pathname === link.href
                  ? "text-yellow"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {/* Cart */}
        <Link href="/shop" className="relative text-white/85 hover:text-yellow transition-colors no-underline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-yellow text-charcoal text-[11px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>

        {/* Register CTA button */}
        <Link
          href="/register"
          className="hidden md:inline-flex items-center gap-2 bg-yellow text-charcoal px-5 py-2.5 rounded-lg font-bold text-[14px] tracking-wider uppercase hover:bg-gold-light transition-all no-underline"
        >
          Register
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>

        {/* Hamburger */}
        <button
          className="flex lg:hidden flex-col gap-1.5 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="block w-5 h-[1.5px] bg-white" />
          <span className="block w-5 h-[1.5px] bg-white" />
          <span className="block w-5 h-[1.5px] bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="absolute top-[76px] left-0 right-0 bg-charcoal border-b border-white/6 flex flex-col gap-1 p-4 list-none lg:hidden shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3.5 rounded-lg text-white/90 text-[16px] font-semibold hover:text-yellow hover:bg-white/8 transition-all no-underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
