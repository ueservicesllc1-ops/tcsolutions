import Link from "next/link";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export default function PoliticaCookiesPage() {
  return (
    <div className="bg-[#F2F4F7]">
      <Header />
      <main className="py-16">
        <section className="container-shell rounded-2xl bg-white p-8 shadow-[0_12px_26px_rgba(10,61,98,0.08)] md:p-10">
          <h1 className="font-heading text-3xl font-extrabold text-[#0A3D62]">Politica de Cookies</h1>
          <p className="mt-4 text-[#6B6B6B]">
            Este sitio puede usar cookies o tecnologias similares para mejorar la experiencia del usuario
            y analizar el rendimiento general del sitio.
          </p>

          <div className="mt-8 space-y-6 text-[#334A5F]">
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">1. Que son las cookies</h2>
              <p className="mt-2">
                Son pequenos archivos que se almacenan en tu navegador para recordar preferencias y medir
                interacciones con el sitio.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">2. Tipos de uso</h2>
              <p className="mt-2">
                Podemos usar cookies tecnicas, de sesion y de analitica basica para asegurar funcionamiento
                correcto y mejoras continuas.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-xl font-bold text-[#0A3D62]">3. Control de cookies</h2>
              <p className="mt-2">
                Puedes configurar o deshabilitar cookies desde tu navegador. Algunas funciones podrian verse
                limitadas si bloqueas ciertos tipos.
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
