import type { Momento } from "@/data/contenido";
import { ruta } from "@/lib/ruta";
import CarruselFotos from "@/components/CarruselFotos";
import ScrollReveal from "@/components/ScrollReveal";

export default function Momentos({ momentos }: { momentos: Momento[] }) {
  return (
    <ol className="momentos">
      {momentos.map((m) => (
        <li key={m.titulo} className="momento">
          <ScrollReveal className="momento__reveal">
            {m.video ? (
              <>
                <div className="momento__texto">
                  {m.fecha && <time>{m.fecha}</time>}
                  <h3>{m.titulo}</h3>
                  <p>{m.texto}</p>
                </div>
                <video
                  className="momento__video"
                  src={ruta(m.video)}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={`Video: ${m.titulo}`}
                />
              </>
            ) : m.fotos?.length ? (
              <CarruselFotos fotos={m.fotos} titulo={m.titulo} />
            ) : m.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="momento__foto" src={ruta(m.foto)} alt={m.titulo} loading="lazy" />
            ) : (
              <div className="momento__foto momento__foto--vacia" role="img" aria-label="Aquí va una foto">
                <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 21s-7-4.6-9.5-9C.8 8.8 2.6 5 6.2 5c2 0 3.4 1 5.8 3.2C14.4 6 15.8 5 17.8 5c3.6 0 5.4 3.8 3.700 7-2.500 4.400-9.5 9-9.5 9z"
                  />
                </svg>
              </div>
            )}
            {!m.video && (
              <div className="momento__texto">
                {m.fecha && <time>{m.fecha}</time>}
                <h3>{m.titulo}</h3>
                <p>{m.texto}</p>
              </div>
            )}
          </ScrollReveal>
        </li>
      ))}
    </ol>
  );
}
