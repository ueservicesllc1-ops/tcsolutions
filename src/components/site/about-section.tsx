export function AboutSection() {
  return (
    <section id="about" className="section-space bg-white">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0A3D62] md:text-4xl">About Total Cleaning Solutions</h2>
          <p className="mt-6 leading-relaxed text-[#6B6B6B]">
            Total Cleaning Solutions (TCS) provides dependable, detail-driven cleaning solutions for
            commercial, post-construction, office, and residential spaces throughout New Jersey.
          </p>
          <p className="mt-4 leading-relaxed text-[#6B6B6B]">
            Our team focuses on professionalism, consistency, and communication, delivering spaces that
            are clean, presentable, and ready to impress clients, tenants, and project stakeholders.
          </p>
        </div>
        <div className="rounded-[2rem] bg-[#0A3D62] p-8 text-white shadow-[0_20px_45px_rgba(10,61,98,0.25)]">
          <p className="text-sm uppercase tracking-[0.25em] text-[#8CC3EC]">Our Commitment</p>
          <h3 className="mt-4 text-2xl font-bold">Clean Spaces, Better Places.</h3>
          <p className="mt-4 text-white/90">
            We build long-term client relationships through reliable scheduling, efficient execution, and
            quality standards that support modern businesses and construction partners.
          </p>
        </div>
      </div>
    </section>
  );
}
