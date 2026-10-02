import Contador from "@/components/Contador";
import Momentos from "@/components/Momentos";
import Cartas from "@/components/Cartas";
import ScrollReveal from "@/components/ScrollReveal";
import { cartas, momentos, pareja } from "@/data/contenido";

export default function Home() {
  return (
    <main>
      <ScrollReveal className="hero">
        <header>
          <h1>
            {pareja.tuNombre} y {pareja.suNombre} 🐚❤️
          </h1>
          <p className="hero__frase">{pareja.frase}</p>
          <Contador inicio={pareja.inicio} />
        </header>
      </ScrollReveal>

      <section className="seccion" aria-labelledby="t-momentos">
        <ScrollReveal>
          <h2 id="t-momentos">Nuestros momentos</h2>
        </ScrollReveal>
        <Momentos momentos={momentos} />
      </section>

      <section className="seccion" aria-labelledby="t-cartas">
        <ScrollReveal>
          <h2 id="t-cartas">Mensajes para ti</h2>
          <Cartas cartas={cartas} />
        </ScrollReveal>
      </section>

      <ScrollReveal>
        <footer className="pie">Hecho con mucho amor para mi princesa consentida 🐚❤️</footer>
      </ScrollReveal>
    </main>
  );
}
