"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-transparent bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_8px_24px_rgba(10,61,98,0.08)]" : ""
      }`}
    >
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Logo compact />
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-[#0A3D62] transition-colors hover:text-[#1479C9]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-xl bg-[#0A3D62] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1479C9]"
          >
            Get a Free Quote
          </a>
        </nav>
        <div className="flex items-center gap-3 lg:hidden">
          <a
            href="tel:5513019412"
            className="rounded-lg border border-[#D6DFEA] p-2 text-[#0A3D62]"
            aria-label="Call now"
          >
            <Phone size={20} />
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg border border-[#D6DFEA] p-2 text-[#0A3D62]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-[#E3E9F1] bg-white lg:hidden">
          <div className="container-shell flex flex-col gap-5 py-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-semibold text-[#0A3D62]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-[#0A3D62] px-5 py-3 text-center text-sm font-bold text-white"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
