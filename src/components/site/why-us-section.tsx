import { Award, CheckCircle2, Clock3, Shield } from "lucide-react";

const pillars = [
  { title: "Reliable & Insured", icon: Shield },
  { title: "Experienced Team", icon: Award },
  { title: "On Time, Every Time", icon: Clock3 },
  { title: "Quality Results", icon: CheckCircle2 },
];

export function WhyUsSection() {
  return (
    <section id="why-us" className="section-space bg-white">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0A3D62] md:text-4xl">Why Choose TCS</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#6B6B6B]">
              Total Cleaning Solutions is a trusted professional cleaning company serving New Jersey
              with dependable crews, strong communication, and detail-focused execution for
              commercial and post-construction environments.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map(({ title, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-[#E3E9F1] bg-white p-6 shadow-[0_10px_24px_rgba(10,61,98,0.08)]"
              >
                <Icon className="text-[#28A745]" />
                <h3 className="mt-4 text-lg font-bold text-[#0A3D62]">{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
