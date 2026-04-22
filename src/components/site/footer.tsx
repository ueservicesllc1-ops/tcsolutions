import { Logo } from "./logo";
import Link from "next/link";
import { Shield } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const legalLinks = [
  { label: "Terminos y Condiciones", href: "/terminos-condiciones" },
  { label: "Politica de Privacidad", href: "/politica-privacidad" },
  { label: "Politica de Cookies", href: "/politica-cookies" },
];

export function Footer() {
  return (
    <footer className="bg-[#071F33] py-14 text-white">
      <div className="container-shell grid gap-10 md:grid-cols-4">
        <div>
          <Logo white />
          <p className="mt-4 max-w-sm text-white/75">
            Premium cleaning solutions for New Jersey commercial, office, post-construction, and
            residential properties.
          </p>
          <p className="mt-4 font-semibold text-[#8CC3EC]">Clean Spaces, Better Places.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold">Navigation</h4>
          <nav className="mt-4 flex flex-col gap-2">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="text-white/80 transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="text-lg font-bold">Legal</h4>
          <nav className="mt-4 flex flex-col gap-2">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="text-lg font-bold">Contact</h4>
          <div className="mt-4 space-y-2 text-white/80">
            <p>Phone: 551-301-9412</p>
            <p>Email: tcleaningsolutions@gmail.com</p>
            <p>Website: tcleaningsolutions.com</p>
          </div>
        </div>
      </div>
      <div className="container-shell mt-10 border-t border-white/15 pt-6 text-center text-sm text-white/75">
        Total Cleaning Solutions 2025@ Todos los derechos reservados - Desarrollado y potenciado por
        Freedom Labs
        <div className="mt-3 flex justify-center">
          <Link
            href="/admin/pin"
            className="inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1 text-xs font-semibold text-white/85 transition-colors hover:border-white/45 hover:text-white"
            aria-label="Entrar al panel admin"
          >
            <Shield size={12} />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
