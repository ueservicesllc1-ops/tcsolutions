import Link from "next/link";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-[#F2F4F7]">
      <Header />
      <main className="py-16">
        <section className="container-shell rounded-2xl bg-white p-8 shadow-[0_12px_26px_rgba(10,61,98,0.08)] md:p-10">
          <h1 className="font-heading text-3xl font-extrabold text-[#0A3D62]">Politica de Privacidad</h1>
          <p className="mt-4 text-[#6B6B6B]">
            En Total Cleaning Solutions (TCS) respetamos tu privacidad. Esta politica explica como
            recopilamos, usamos y protegemos la informacion enviada en nuestro sitio web.
          </p>

          <div className="mt-8 space-y-6 text-[#334A5F]">
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">1. Informacion que recopilamos</h2>
              <p className="mt-2">
                Cuando completas el formulario de cotizacion, podemos recopilar nombre, telefono, email,
                servicio solicitado, mensaje y metadatos tecnicos basicos del envio.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">2. Uso de la informacion</h2>
              <p className="mt-2">
                Usamos tus datos para responder solicitudes, preparar cotizaciones, coordinar servicios y
                mejorar la atencion al cliente.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">3. Almacenamiento y seguridad</h2>
              <p className="mt-2">
                Los datos se almacenan en plataformas de terceros con medidas de seguridad razonables,
                incluyendo Firestore para la gestion de solicitudes.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">4. Compartir informacion</h2>
              <p className="mt-2">
                No vendemos tu informacion personal. Solo se comparte cuando es necesario para operar el
                servicio o cumplir obligaciones legales.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">5. Tus derechos</h2>
              <p className="mt-2">
                Puedes solicitar acceso, correccion o eliminacion de tus datos escribiendo a
                tcleaningsolutions@gmail.com.
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
