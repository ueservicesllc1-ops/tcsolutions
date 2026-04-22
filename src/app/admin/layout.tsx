import Link from "next/link";
import { ReactNode } from "react";

const adminLinks = [
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      <header className="border-b border-[#D9E2EE] bg-white">
        <div className="container-shell flex h-18 items-center justify-between py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1479C9]">
              TCS Dashboard
            </p>
            <h1 className="font-heading text-2xl font-extrabold text-[#0A3D62]">Admin</h1>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-[#C9D8EA] px-4 py-2 text-sm font-semibold text-[#0A3D62] hover:bg-[#F7FAFD]"
          >
            Volver al sitio
          </Link>
        </div>
      </header>
      <div className="container-shell grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl bg-white p-4 shadow-[0_10px_25px_rgba(10,61,98,0.08)]">
          <nav className="space-y-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl px-4 py-3 font-semibold text-[#0A3D62] transition-colors hover:bg-[#EAF4FC]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
