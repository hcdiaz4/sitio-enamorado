"use client";

import { useState, type FormEvent } from "react";
import Contador from "@/components/Contador";
import Momentos from "@/components/Momentos";
import Cartas from "@/components/Cartas";
import NotitasCompartidas from "@/components/NotitasCompartidas";
import ScrollReveal from "@/components/ScrollReveal";
import { cartas, momentos, pareja } from "@/data/contenido";

const CLAVE_ACCESO = "06012026";

export default function Home() {
  const [desbloqueado, setDesbloqueado] = useState(false);
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const verificarClave = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (clave === CLAVE_ACCESO) {
      setDesbloqueado(true);
      return;
    }
    setClave("");
    setError("Esa no es la clave, mi amor. Inténtalo de nuevo 🥺");
  };

  if (!desbloqueado) {
    return (
      <div className="acceso__fondo">
        <section
          className="acceso__modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-acceso"
          aria-describedby="mensaje-acceso"
        >
          <span className="acceso__corazon" aria-hidden="true">❤️</span>
          <h1 id="titulo-acceso">Mi princesa consentida 🥺</h1>
          <p id="mensaje-acceso">
            Para poder ver el sitio tienes que digitar una clave. La clave es la fecha en que nos hicimos novios ❤️.
            Tienes que escribirla pegada, mi amor hermosa, y así podrás ver lo que te hice.
          </p>
          <form className="acceso__formulario" onSubmit={verificarClave}>
            <label htmlFor="clave-acceso">Escribe la clave</label>
            <input
              id="clave-acceso"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              autoComplete="off"
              autoFocus
              required
              value={clave}
              onChange={(evento) => {
                setClave(evento.target.value);
                setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "error-acceso" : undefined}
            />
            <button className="acceso__boton" type="submit">Ver mi sorpresa ❤️</button>
            {error && <p className="acceso__error" id="error-acceso" role="alert">{error}</p>}
          </form>
        </section>
      </div>
    );
  }

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

      <NotitasCompartidas />

      <ScrollReveal>
        <footer className="pie">Hecho con mucho amor para mi princesa consentida 🐚❤️</footer>
      </ScrollReveal>
    </main>
  );
}
