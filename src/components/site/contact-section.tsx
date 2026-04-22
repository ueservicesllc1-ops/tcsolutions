"use client";

import { FormEvent, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FormData = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const quoteRef = useMemo(() => collection(db, "quoteRequests"), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      await addDoc(quoteRef, {
        ...formData,
        createdAt: serverTimestamp(),
        metadata: {
          source: "website-contact-form",
          pagePath: window.location.pathname,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          language: navigator.language,
        },
      });
      setFormData(initialForm);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section-space bg-[#F2F4F7]">
      <div className="container-shell grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_15px_32px_rgba(10,61,98,0.1)] md:p-10">
          <h2 className="text-3xl font-extrabold text-[#0A3D62]">Request a Free Quote</h2>
          <p className="mt-3 text-[#6B6B6B]">
            Tell us about your project and we will follow up with a tailored cleaning plan.
          </p>
          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-[#D6DFEA] px-4 py-3 text-[#0A3D62] outline-none ring-[#1479C9] transition focus:ring-2"
            />
            <input
              type="tel"
              required
              placeholder="Phone"
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full rounded-xl border border-[#D6DFEA] px-4 py-3 text-[#0A3D62] outline-none ring-[#1479C9] transition focus:ring-2"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-xl border border-[#D6DFEA] px-4 py-3 text-[#0A3D62] outline-none ring-[#1479C9] transition focus:ring-2"
            />
            <input
              type="text"
              placeholder="Service Needed"
              value={formData.service}
              onChange={(event) => setFormData((prev) => ({ ...prev, service: event.target.value }))}
              className="w-full rounded-xl border border-[#D6DFEA] px-4 py-3 text-[#0A3D62] outline-none ring-[#1479C9] transition focus:ring-2"
            />
            <textarea
              rows={5}
              placeholder="Message"
              required
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              className="w-full rounded-xl border border-[#D6DFEA] px-4 py-3 text-[#0A3D62] outline-none ring-[#1479C9] transition focus:ring-2"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-xl bg-[#0A3D62] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1479C9]"
            >
              {isSubmitting ? "Sending..." : "Submit Request"}
            </button>
            {status === "success" && (
              <p className="text-sm font-semibold text-[#28A745]">
                Your request was sent successfully. We will contact you shortly.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm font-semibold text-red-600">
                We could not send your request right now. Please call us at 551-301-9412.
              </p>
            )}
          </form>
        </div>
        <aside className="rounded-[2rem] bg-[#0A3D62] p-8 text-white shadow-[0_20px_38px_rgba(10,61,98,0.25)] md:p-10">
          <h3 className="text-2xl font-bold">Contact Information</h3>
          <p className="mt-3 text-white/85">
            Connect with our team for commercial, office, and post-construction cleaning services in New
            Jersey.
          </p>
          <div className="mt-8 space-y-4">
            <p>
              <span className="font-semibold text-[#8CC3EC]">Phone:</span> 551-301-9412
            </p>
            <p>
              <span className="font-semibold text-[#8CC3EC]">Email:</span> tcleaningsolutions@gmail.com
            </p>
            <p>
              <span className="font-semibold text-[#8CC3EC]">Website:</span> tcleaningsolutions.com
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
