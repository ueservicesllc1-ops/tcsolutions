"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const ADMIN_PIN = "1619";

export default function AdminPinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pin === ADMIN_PIN) {
      window.sessionStorage.setItem("tcsAdminAccess", "granted");
      router.replace("/admin/mensajes");
      return;
    }
    setError("PIN incorrecto.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2F4F7] px-6 py-16">
      <section className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_12px_30px_rgba(10,61,98,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1479C9]">TCS Admin</p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold text-[#0A3D62]">Acceso con PIN</h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">Ingresa el PIN para entrar al panel administrativo.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(event) => {
              setPin(event.target.value);
              if (error) setError(null);
            }}
            placeholder="PIN"
            className="w-full rounded-xl border border-[#D6DFEA] px-4 py-3 text-center text-lg tracking-[0.35em] text-[#0A3D62] outline-none ring-[#1479C9] focus:ring-2"
            required
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[#0A3D62] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1479C9]"
          >
            Entrar al admin
          </button>
        </form>

        {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

        <div className="mt-8">
          <Link href="/" className="text-sm font-semibold text-[#1479C9] hover:text-[#0A3D62]">
            Volver al sitio principal
          </Link>
        </div>
      </section>
    </main>
  );
}
