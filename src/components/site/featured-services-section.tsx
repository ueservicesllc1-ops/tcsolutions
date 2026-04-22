import Image from "next/image";

const highlights = [
  {
    title: "Post Construction Cleaning",
    points: [
      "Dust and debris removal",
      "Floor and surface cleaning",
      "Window and glass cleaning",
      "Final touch-ups before delivery",
    ],
    image: "/postconstrution.png",
    reverse: false,
  },
  {
    title: "Office / Commercial Cleaning",
    points: [
      "Daily / weekly cleaning schedules",
      "Restroom sanitation",
      "High-touch surface disinfection",
      "Consistent professional appearance",
    ],
    image: "/office.png",
    reverse: true,
  },
];

export function FeaturedServicesSection() {
  return (
    <section className="section-space bg-[#F2F4F7]">
      <div className="container-shell space-y-8">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_40px_rgba(10,61,98,0.1)] lg:grid-cols-2"
          >
            <div className={`relative min-h-72 ${item.reverse ? "lg:order-2" : ""}`}>
              <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
            </div>
            <div className={`p-8 md:p-12 ${item.reverse ? "lg:order-1" : ""}`}>
              <h3 className="text-3xl font-extrabold text-[#0A3D62]">{item.title}</h3>
              <ul className="mt-6 space-y-3 text-[#6B6B6B]">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#28A745]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 inline-flex rounded-xl bg-[#0A3D62] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1479C9]"
              >
                Request Service Quote
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
