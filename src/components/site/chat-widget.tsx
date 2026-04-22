"use client";

import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

type ChatMessage = {
  id: string;
  text: string;
  from: "user" | "admin" | "system";
  createdAt?: Timestamp;
};

const SESSION_KEY = "tcsChatSessionId";

type ChatSessionMeta = {
  visitorName?: string;
};

function getOrCreateSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(SESSION_KEY, generated);
  return generated;
}

function formatTime(date?: Timestamp) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date.toDate());
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [sessionMeta, setSessionMeta] = useState<ChatSessionMeta | null>(null);
  const [incomingAlert, setIncomingAlert] = useState<string | null>(null);
  const isOpenRef = useRef(isOpen);
  const previousMessageCountRef = useRef(0);

  function playVisitorAlertSound() {
    try {
      const AudioContextCtor = (
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      );
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
      oscillator.frequency.value = 920;
      oscillator2.frequency.value = 1240;
      gainNode.gain.value = 0.18;
      oscillator.start();
      oscillator2.start(ctx.currentTime + 0.08);
      oscillator.stop(ctx.currentTime + 0.34);
      oscillator2.stop(ctx.currentTime + 0.42);
    } catch {
      // Ignore autoplay or audio API errors.
    }
  }

  const sessionId = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => getOrCreateSessionId(),
    () => ""
  );

  useEffect(() => {
    if (!sessionId) return;
    void setDoc(
      doc(db, "chatSessions", sessionId),
      {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        source: "website-chat-widget",
      },
      { merge: true }
    );
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    const unsubscribe = onSnapshot(doc(db, "chatSessions", sessionId), (snapshot) => {
      setSessionMeta((snapshot.data() as ChatSessionMeta | undefined) ?? null);
    });
    return () => unsubscribe();
  }, [sessionId]);

  const messagesQuery = useMemo(() => {
    if (!sessionId) return null;
    return query(
      collection(db, "chatSessions", sessionId, "messages"),
      orderBy("createdAt", "asc")
    );
  }, [sessionId]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!messagesQuery) return;
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const nextMessages = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as ChatMessage[];
      const latest = nextMessages[nextMessages.length - 1];
      if (
        previousMessageCountRef.current > 0 &&
        nextMessages.length > previousMessageCountRef.current &&
        (latest?.from === "admin" || latest?.from === "system")
      ) {
        setIncomingAlert("New reply received from TCS.");
        playVisitorAlertSound();
        if (!isOpenRef.current) setIsOpen(true);
      }
      previousMessageCountRef.current = nextMessages.length;
      setMessages(nextMessages);
    });
    return () => unsubscribe();
  }, [messagesQuery]);

  useEffect(() => {
    if (!incomingAlert) return;
    const timeout = window.setTimeout(() => setIncomingAlert(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [incomingAlert]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanText = messageText.trim();
    if (!cleanText || !sessionId) return;

    setSending(true);
    try {
      const priorUserMessages = messages.filter((item) => item.from === "user").length;

      await addDoc(collection(db, "chatSessions", sessionId, "messages"), {
        text: cleanText,
        from: "user",
        createdAt: serverTimestamp(),
      });

      const needsName = !sessionMeta?.visitorName;
      const shouldAskNameFirst = needsName && priorUserMessages === 0;

      if (shouldAskNameFirst) {
        await setDoc(
          doc(db, "chatSessions", sessionId),
          {
            updatedAt: serverTimestamp(),
            lastMessage: cleanText,
            lastFrom: "user",
            unreadForAdmin: increment(1),
          },
          { merge: true }
        );

        await addDoc(collection(db, "chatSessions", sessionId, "messages"), {
          text: "Thanks for contacting TCS. May I have your name, please?",
          from: "system",
          createdAt: serverTimestamp(),
        });
      } else if (needsName) {
        await setDoc(
          doc(db, "chatSessions", sessionId),
          {
            visitorName: cleanText,
            updatedAt: serverTimestamp(),
            lastMessage: cleanText,
            lastFrom: "user",
            unreadForAdmin: increment(1),
          },
          { merge: true }
        );

        const autoReply = `Thanks, ${cleanText}. One of our advisors will assist you in a moment.`;
        await addDoc(collection(db, "chatSessions", sessionId, "messages"), {
          text: autoReply,
          from: "system",
          createdAt: serverTimestamp(),
        });
      } else {
        await setDoc(
          doc(db, "chatSessions", sessionId),
          {
            updatedAt: serverTimestamp(),
            lastMessage: cleanText,
            lastFrom: "user",
            unreadForAdmin: increment(1),
          },
          { merge: true }
        );
      }

      setMessageText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section className="mb-3 w-[340px] overflow-hidden rounded-2xl border border-[#D6DFEA] bg-white shadow-[0_18px_38px_rgba(10,61,98,0.2)]">
          <header className="flex items-center justify-between bg-[#0A3D62] px-4 py-3 text-white">
            <div>
              <p className="font-heading text-sm font-bold">TCS Live Chat</p>
              <p className="text-xs text-white/80">Te respondemos desde admin</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
              <X size={18} />
            </button>
          </header>
          {incomingAlert && (
            <div className="border-b border-[#D9E7F5] bg-[#EAF4FC] px-4 py-2 text-xs font-semibold text-[#0A3D62]">
              {incomingAlert}
            </div>
          )}

          <div className="max-h-80 space-y-3 overflow-y-auto bg-[#F7FAFD] p-4">
            {messages.length === 0 && (
              <p className="rounded-xl bg-white p-3 text-sm text-[#6B6B6B]">
                Send your first message and we will assist you right away.
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  message.from === "user"
                    ? "ml-auto bg-[#0A3D62] text-white"
                    : message.from === "admin"
                      ? "mr-auto bg-white text-[#234157]"
                      : "mr-auto border border-[#DCE5F0] bg-[#F4F8FC] text-[#35536A]"
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    message.from === "user" ? "text-white/75" : "text-[#7E93A8]"
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-[#E2EAF3] p-3">
            <input
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Escribe tu mensaje..."
              className="min-w-0 flex-1 rounded-xl border border-[#D6DFEA] px-3 py-2 text-sm text-[#0A3D62] outline-none ring-[#1479C9] focus:ring-2"
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1479C9] text-white hover:bg-[#0A3D62] disabled:opacity-60"
              aria-label="Enviar mensaje"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full bg-[#1479C9] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(20,121,201,0.35)] transition-colors hover:bg-[#0A3D62]"
      >
        <MessageCircle size={18} />
        Chat
      </button>
    </div>
  );
}
