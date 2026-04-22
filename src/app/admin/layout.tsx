"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useSyncExternalStore } from "react";

const adminLinks = [
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/chat", label: "Chat" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPinPage = pathname === "/admin/pin";
  const hasAccess = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => window.sessionStorage.getItem("tcsAdminAccess") === "granted",
    () => null
  );

  useEffect(() => {
    if (hasAccess === null) return;

    if (!hasAccess && !isPinPage) {
      router.replace("/admin/pin");
    } else if (hasAccess && isPinPage) {
      router.replace("/admin/mensajes");
    }
  }, [hasAccess, isPinPage, router]);

  function handleExitAdmin() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("tcsAdminAccess");
    }
    router.replace("/");
  }

  if (hasAccess === null || (!hasAccess && !isPinPage) || (hasAccess && isPinPage)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F4F7]">
        <p className="text-sm font-semibold text-[#1479C9]">Validando acceso...</p>
      </div>
    );
  }

  if (isPinPage) return <>{children}</>;

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
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-[#C9D8EA] px-4 py-2 text-sm font-semibold text-[#0A3D62] hover:bg-[#F7FAFD]"
            >
              Volver al sitio
            </Link>
            <button
              type="button"
              onClick={handleExitAdmin}
              className="rounded-xl bg-[#0A3D62] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1479C9]"
            >
              Salir admin
            </button>
          </div>
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
