"use client";

import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { BellRing } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatSession = {
  id: string;
  updatedAt?: Timestamp;
  lastMessage?: string;
  lastFrom?: "user" | "admin";
  unreadForAdmin?: number;
  visitorName?: string;
};

type ChatMessage = {
  id: string;
  text: string;
  from: "user" | "admin" | "system";
  createdAt?: Timestamp;
};

function formatDate(date?: Timestamp) {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date.toDate());
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [newChatAlert, setNewChatAlert] = useState<string | null>(null);
  const previousUnreadRef = useRef(0);

  function playAdminAlertSound() {
    try {
      const AudioContextCtor = (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
      if (!AudioContextCtor) return;
      const ctx = new AudioContextCtor();
      const oscillator = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "square";
      oscillator2.type = "square";
      oscillator.frequency.value = 880;
      oscillator2.frequency.value = 1180;
      gainNode.gain.value = 0.2;
      oscillator.start();
      oscillator2.start(ctx.currentTime + 0.08);
      oscillator.stop(ctx.currentTime + 0.32);
      oscillator2.stop(ctx.currentTime + 0.4);
    } catch {
      // Ignore audio errors caused by browser autoplay policies.
    }
  }

  const sessionsQuery = useMemo(
    () => query(collection(db, "chatSessions"), orderBy("updatedAt", "desc")),
    []
  );

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
      const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as ChatSession[];
      const unreadCount = rows.reduce((sum, row) => sum + (row.unreadForAdmin ?? 0), 0);
      if (unreadCount > previousUnreadRef.current) {
        const latest = rows.find((row) => (row.unreadForAdmin ?? 0) > 0) ?? rows[0];
        setNewChatAlert("Nuevo mensaje de chat recibido.");
        playAdminAlertSound();
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("Nuevo chat en TCS", {
            body: latest?.visitorName
              ? `Mensaje de ${latest.visitorName}`
              : "Tienes un nuevo mensaje de chat.",
          });
        }
      }
      previousUnreadRef.current = unreadCount;
      setSessions(rows);
      if (!selectedSessionId && rows.length > 0) {
        setSelectedSessionId(rows[0].id);
      }
    });
    return () => unsubscribe();
  }, [selectedSessionId, sessionsQuery]);

  useEffect(() => {
    if (!newChatAlert) return;
    const timeout = window.setTimeout(() => setNewChatAlert(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [newChatAlert]);

  const messagesQuery = useMemo(() => {
    if (!selectedSessionId) return null;
    return query(
      collection(db, "chatSessions", selectedSessionId, "messages"),
      orderBy("createdAt", "asc")
    );
  }, [selectedSessionId]);

  useEffect(() => {
    if (!messagesQuery || !selectedSessionId) return;
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as ChatMessage[]);
    });

    void setDoc(
      doc(db, "chatSessions", selectedSessionId),
      { unreadForAdmin: 0 },
      { merge: true }
    );

    return () => unsubscribe();
  }, [messagesQuery, selectedSessionId]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSessionId) return;
    const cleanText = messageText.trim();
    if (!cleanText) return;

    setSending(true);
    try {
      await addDoc(collection(db, "chatSessions", selectedSessionId, "messages"), {
        text: cleanText,
        from: "admin",
        createdAt: serverTimestamp(),
      });
      await setDoc(
        doc(db, "chatSessions", selectedSessionId),
        {
          updatedAt: serverTimestamp(),
          lastMessage: cleanText,
          lastFrom: "admin",
          unreadForAdmin: 0,
        },
        { merge: true }
      );
      setMessageText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_10px_25px_rgba(10,61,98,0.08)] md:p-8">
      <h2 className="font-heading text-3xl font-extrabold text-[#0A3D62]">Chat</h2>
      <p className="mt-2 text-[#6B6B6B]">Responde en tiempo real a usuarios conectados desde la pagina.</p>
      {newChatAlert && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#B6D8F2] bg-[#EAF4FC] px-3 py-2 text-sm font-semibold text-[#0A3D62]">
          <BellRing size={16} className="text-[#1479C9]" />
          {newChatAlert}
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-[#DCE5F0] bg-[#F8FBFE] p-3">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6287AB]">
            Conversaciones
          </p>
          <div className="space-y-2">
            {sessions.length === 0 && (
              <p className="rounded-xl bg-white px-3 py-2 text-sm text-[#6B6B6B]">
                Aun no hay conversaciones.
              </p>
            )}
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => setSelectedSessionId(session.id)}
                className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                  session.id === selectedSessionId
                    ? "border-[#1479C9] bg-white"
                    : "border-transparent bg-white/70 hover:border-[#C5D6E8]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold text-[#0A3D62]">
                    {session.visitorName?.trim() || `${session.id.slice(0, 10)}...`}
                  </p>
                  {!!session.unreadForAdmin && session.unreadForAdmin > 0 && (
                    <span className="rounded-full bg-[#FFF1DF] px-2 py-0.5 text-xs font-semibold text-[#C47A00]">
                      {session.unreadForAdmin}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-[#607A93]">{session.lastMessage || "Sin mensajes"}</p>
                <p className="mt-1 text-[11px] text-[#8AA0B5]">{formatDate(session.updatedAt)}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="rounded-2xl border border-[#DCE5F0] bg-white">
          <div className="border-b border-[#E6EDF5] px-4 py-3">
            <p className="text-sm font-semibold text-[#0A3D62]">
              {selectedSessionId ? `Sesion: ${selectedSessionId}` : "Selecciona una conversacion"}
            </p>
          </div>
          <div className="max-h-[420px] min-h-[320px] space-y-3 overflow-y-auto bg-[#F7FAFD] p-4">
            {messages.length === 0 && (
              <p className="rounded-xl bg-white p-3 text-sm text-[#6B6B6B]">Sin mensajes para mostrar.</p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  message.from === "admin"
                    ? "ml-auto bg-[#0A3D62] text-white"
                    : message.from === "user"
                      ? "mr-auto bg-white text-[#234157]"
                      : "mr-auto border border-[#DCE5F0] bg-[#F4F8FC] text-[#35536A]"
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    message.from === "admin" ? "text-white/75" : "text-[#7E93A8]"
                  }`}
                >
                  {formatDate(message.createdAt)}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-[#E6EDF5] p-3">
            <input
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Responder al usuario..."
              className="min-w-0 flex-1 rounded-xl border border-[#D6DFEA] px-3 py-2 text-sm text-[#0A3D62] outline-none ring-[#1479C9] focus:ring-2"
              disabled={!selectedSessionId}
            />
            <button
              type="submit"
              disabled={!selectedSessionId || sending}
              className="rounded-xl bg-[#1479C9] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0A3D62] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
