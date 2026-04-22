import Image from "next/image";

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-white section-space">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,121,201,0.12),_transparent_45%)]" />
      <div
        className="absolute inset-y-0 right-0 z-10 w-full md:w-[65%]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,1) 52%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,1) 52%)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        <Image
          src="/bannerhero.png"
          alt="Professional cleaning in a modern office"
          fill
          className="object-cover object-[78%_center] md:object-[35%_center]"
          priority
        />
      </div>
      <div className="container-shell relative z-20">
        <div className="-ml-3 max-w-2xl md:-ml-20">
          <Image
            src="/tcs-logo.png"
            alt="Total Cleaning Solutions logo"
            width={420}
            height={156}
            className="mb-6 h-auto w-auto max-h-40"
            priority
          />
          <p className="mb-4 inline-flex rounded-full bg-[#EAF4FC] px-4 py-1.5 text-sm font-semibold text-[#1479C9]">
            Serving Commercial Clients Across New Jersey
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-[#0A3D62] md:text-4xl">
            Professional Cleaning Services for Commercial, Construction & Residential Spaces
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#6B6B6B]">
            Reliable, detail-oriented cleaning for offices, post-construction projects, and move-in /
            move-out spaces.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-xl bg-[#0A3D62] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1479C9]"
            >
              Get a Free Quote
            </a>
            <a
              href="tel:5513019412"
              className="rounded-xl border border-[#BFD5EA] px-7 py-3.5 text-sm font-bold text-[#0A3D62] transition-colors hover:border-[#1479C9] hover:text-[#1479C9]"
            >
              Call Now: 551-301-9412
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
