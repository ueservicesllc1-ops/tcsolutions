"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
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
  readAt?: Timestamp;
};

function formatDate(date?: Timestamp) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date.toDate());
}

type DateFilter = "all" | "today" | "7d" | "30d";

export default function MensajesPage() {
  const [messages, setMessages] = useState<QuoteMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});

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

  const serviceOptions = useMemo(() => {
    const values = new Set<string>();
    messages.forEach((item) => {
      if (item.service?.trim()) values.add(item.service.trim());
    });
    return ["all", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return messages.filter((entry) => {
      const name = entry.name?.toLowerCase() ?? "";
      const email = entry.email?.toLowerCase() ?? "";
      const matchesSearch =
        !normalizedSearch || name.includes(normalizedSearch) || email.includes(normalizedSearch);

      const service = entry.service?.trim() ?? "";
      const matchesService = serviceFilter === "all" || service === serviceFilter;

      const createdAtDate = entry.createdAt?.toDate();
      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && !!createdAtDate && createdAtDate >= todayStart) ||
        (dateFilter === "7d" && !!createdAtDate && createdAtDate >= sevenDaysAgo) ||
        (dateFilter === "30d" && !!createdAtDate && createdAtDate >= thirtyDaysAgo);

      const matchesUnread = !unreadOnly || !entry.readAt;

      return matchesSearch && matchesService && matchesDate && matchesUnread;
    });
  }, [dateFilter, messages, searchTerm, serviceFilter, unreadOnly]);

  async function markAsRead(messageId: string) {
    setUpdatingIds((prev) => ({ ...prev, [messageId]: true }));
    try {
      await updateDoc(doc(db, "quoteRequests", messageId), {
        readAt: serverTimestamp(),
      });
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [messageId]: false }));
    }
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_10px_25px_rgba(10,61,98,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-3xl font-extrabold text-[#0A3D62]">Mensajes</h2>
        <span className="rounded-lg bg-[#EAF4FC] px-3 py-1.5 text-sm font-semibold text-[#1479C9]">
          {filteredMessages.length} visibles / {messages.length} recibidos
        </span>
      </div>

      <p className="mt-3 text-[#6B6B6B]">
        Aqui ves todas las solicitudes enviadas desde el formulario de Request a Free Quote.
      </p>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-xl border border-[#D6DFEA] px-4 py-2.5 text-sm text-[#0A3D62] outline-none ring-[#1479C9] focus:ring-2"
        />
        <select
          value={serviceFilter}
          onChange={(event) => setServiceFilter(event.target.value)}
          className="w-full rounded-xl border border-[#D6DFEA] px-4 py-2.5 text-sm text-[#0A3D62] outline-none ring-[#1479C9] focus:ring-2"
        >
          <option value="all">Todos los servicios</option>
          {serviceOptions
            .filter((service) => service !== "all")
            .map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
        </select>
        <select
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value as DateFilter)}
          className="w-full rounded-xl border border-[#D6DFEA] px-4 py-2.5 text-sm text-[#0A3D62] outline-none ring-[#1479C9] focus:ring-2"
        >
          <option value="all">Cualquier fecha</option>
          <option value="today">Hoy</option>
          <option value="7d">Ultimos 7 dias</option>
          <option value="30d">Ultimos 30 dias</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-[#D6DFEA] px-4 py-2.5 text-sm font-semibold text-[#0A3D62]">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(event) => setUnreadOnly(event.target.checked)}
            className="h-4 w-4 accent-[#1479C9]"
          />
          Solo no leidos
        </label>
      </div>

      {loading && <p className="mt-6 text-sm font-semibold text-[#1479C9]">Cargando mensajes...</p>}
      {error && <p className="mt-6 text-sm font-semibold text-red-600">{error}</p>}
      {!loading && !error && messages.length === 0 && (
        <p className="mt-6 text-sm text-[#6B6B6B]">Aun no hay solicitudes registradas.</p>
      )}
      {!loading && !error && messages.length > 0 && filteredMessages.length === 0 && (
        <p className="mt-6 text-sm text-[#6B6B6B]">No hay resultados con esos filtros.</p>
      )}

      <div className="mt-8 space-y-4">
        {filteredMessages.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-[#DFE7F1] p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#0A3D62]">{entry.name || "Sin nombre"}</h3>
                {entry.readAt ? (
                  <span className="rounded-md bg-[#EAF8EE] px-2 py-0.5 text-xs font-semibold text-[#28A745]">
                    Leido
                  </span>
                ) : (
                  <span className="rounded-md bg-[#FFF4E5] px-2 py-0.5 text-xs font-semibold text-[#C47A00]">
                    Nuevo
                  </span>
                )}
              </div>
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
            <div className="mt-4">
              <button
                type="button"
                disabled={!!entry.readAt || !!updatingIds[entry.id]}
                onClick={() => markAsRead(entry.id)}
                className="rounded-lg border border-[#C6D5E7] px-3 py-2 text-xs font-semibold text-[#0A3D62] transition-colors hover:bg-[#EDF3FA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {entry.readAt
                  ? "Marcado como leido"
                  : updatingIds[entry.id]
                    ? "Guardando..."
                    : "Marcar como leido"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
