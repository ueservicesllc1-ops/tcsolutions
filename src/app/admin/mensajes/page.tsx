"use client";

import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

type QuoteMessage = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
  createdAt?: Timestamp;
  metadata?: {
    source?: string;
    pagePath?: string;
    pageUrl?: string;
    language?: string;
  };
};

function formatDate(date?: Timestamp) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date.toDate());
}

export default function MensajesPage() {
  const [messages, setMessages] = useState<QuoteMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesQuery = useMemo(
    () => query(collection(db, "quoteRequests"), orderBy("createdAt", "desc")),
    []
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as QuoteMessage[];
        setMessages(rows);
        setLoading(false);
      },
      () => {
        setError("No se pudieron cargar los mensajes desde Firestore.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [messagesQuery]);

  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_10px_25px_rgba(10,61,98,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-3xl font-extrabold text-[#0A3D62]">Mensajes</h2>
        <span className="rounded-lg bg-[#EAF4FC] px-3 py-1.5 text-sm font-semibold text-[#1479C9]">
          {messages.length} recibidos
        </span>
      </div>

      <p className="mt-3 text-[#6B6B6B]">
        Aqui ves todas las solicitudes enviadas desde el formulario de Request a Free Quote.
      </p>

      {loading && <p className="mt-6 text-sm font-semibold text-[#1479C9]">Cargando mensajes...</p>}
      {error && <p className="mt-6 text-sm font-semibold text-red-600">{error}</p>}
      {!loading && !error && messages.length === 0 && (
        <p className="mt-6 text-sm text-[#6B6B6B]">Aun no hay solicitudes registradas.</p>
      )}

      <div className="mt-8 space-y-4">
        {messages.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-[#DFE7F1] p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-[#0A3D62]">{entry.name || "Sin nombre"}</h3>
              <p className="text-sm font-semibold text-[#1479C9]">{formatDate(entry.createdAt)}</p>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-[#334A5F] md:grid-cols-2">
              <p>
                <span className="font-semibold text-[#0A3D62]">Telefono:</span> {entry.phone || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#0A3D62]">Email:</span> {entry.email || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#0A3D62]">Servicio:</span> {entry.service || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#0A3D62]">Fuente:</span>{" "}
                {entry.metadata?.source || "website"}
              </p>
            </div>
            <div className="mt-4 rounded-xl bg-[#F7FAFD] p-4">
              <p className="text-sm text-[#42586C]">{entry.message || "Sin mensaje"}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
