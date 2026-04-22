export function CtaStrip() {
  return (
    <section className="bg-[#0A3D62] py-14">
      <div className="container-shell flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-[#0F4A76] p-8 md:flex-row md:items-center">
        <h2 className="max-w-2xl text-3xl font-extrabold text-white">
          Need a reliable cleaning team for your next project?
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="#contact"
            className="rounded-xl bg-[#28A745] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#20873a]"
          >
            Request a Quote
          </a>
          <a
            href="tel:5513019412"
            className="rounded-xl border border-white/35 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Call 551-301-9412
          </a>
        </div>
      </div>
    </section>
  );
}
