import { Building2, ClipboardCheck, HardHat, MoveRight, ScanSearch } from "lucide-react";
import type { ComponentType } from "react";

type Service = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; size?: number }>;
};

const services: Service[] = [
  {
    title: "Post Construction Cleaning",
    description: "Complete final cleaning to prepare newly built or renovated spaces for turnover.",
    icon: HardHat,
  },
  {
    title: "Commercial Cleaning",
    description: "Professional cleaning programs tailored for retail, buildings, and business facilities.",
    icon: Building2,
  },
  {
    title: "Office Cleaning",
    description: "Consistent, reliable office care that keeps your workspace sanitary and client-ready.",
    icon: ClipboardCheck,
  },
  {
    title: "Deep Cleaning",
    description: "Detailed top-to-bottom service focused on neglected areas and high-impact results.",
    icon: ScanSearch,
  },
  {
    title: "Move-In / Move-Out Cleaning",
    description: "Detailed prep cleaning for property transitions, leasing, and occupancy handoff.",
    icon: MoveRight,
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="section-space bg-[#F2F4F7]">
      <div className="container-shell">
        <h2 className="text-3xl font-extrabold text-[#0A3D62] md:text-4xl">Our Services</h2>
        <p className="mt-4 max-w-2xl text-[#6B6B6B]">
          Designed for commercial standards and demanding project timelines, our services support
          contractors, property managers, and businesses that expect dependable execution.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="group rounded-2xl bg-white p-7 shadow-[0_12px_26px_rgba(10,61,98,0.08)] transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_rgba(10,61,98,0.12)]"
            >
              <div className="mb-5 inline-flex rounded-xl bg-[#EAF4FC] p-3 text-[#1479C9]">
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-bold text-[#0A3D62]">{title}</h3>
              <p className="mt-3 leading-relaxed text-[#6B6B6B]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
