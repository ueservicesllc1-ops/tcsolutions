import Link from "next/link";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export default function TerminosCondicionesPage() {
  return (
    <div className="bg-[#F2F4F7]">
      <Header />
      <main className="py-16">
        <section className="container-shell rounded-2xl bg-white p-8 shadow-[0_12px_26px_rgba(10,61,98,0.08)] md:p-10">
          <h1 className="font-heading text-3xl font-extrabold text-[#0A3D62]">Terminos y Condiciones</h1>
          <p className="mt-4 text-[#6B6B6B]">
            Estos terminos regulan el uso del sitio web de Total Cleaning Solutions (TCS) y la solicitud
            de servicios por parte de clientes comerciales y residenciales.
          </p>

          <div className="mt-8 space-y-6 text-[#334A5F]">
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">1. Servicios</h2>
              <p className="mt-2">
                TCS ofrece limpieza comercial, post-construccion, oficinas, limpieza profunda y
                mudanzas. Todo servicio esta sujeto a disponibilidad, alcance acordado y confirmacion
                previa.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">2. Cotizaciones</h2>
              <p className="mt-2">
                Las cotizaciones enviadas por el formulario son estimadas y pueden ajustarse tras visita
                tecnica o revision final del proyecto.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">3. Pagos y cancelaciones</h2>
              <p className="mt-2">
                Las condiciones de pago y cancelacion se acuerdan antes de iniciar cada servicio.
                Cancelaciones fuera del plazo acordado pueden generar cargos operativos.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">4. Limitacion de responsabilidad</h2>
              <p className="mt-2">
                TCS no se hace responsable por danos indirectos o situaciones fuera de su control razonable.
                Cualquier reclamo debe notificarse dentro de un plazo razonable posterior al servicio.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">5. Contacto</h2>
              <p className="mt-2">
                Para dudas legales o comerciales: tcleaningsolutions@gmail.com | 551-301-9412.
              </p>
            </section>
          </div>

          <div className="mt-10">
            <Link href="/" className="text-sm font-semibold text-[#1479C9] hover:text-[#0A3D62]">
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
