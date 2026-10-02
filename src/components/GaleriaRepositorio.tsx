import { readdirSync } from "node:fs";
import { extname, join } from "node:path";
import Image from "next/image";
import { ruta } from "@/lib/ruta";

const DIRECTORIO_FOTOS = join(process.cwd(), "public", "fotos", "galeria");
const EXTENSIONES_IMAGEN = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

export default function GaleriaRepositorio() {
  const fotos = readdirSync(DIRECTORIO_FOTOS, { withFileTypes: true })
    .filter((archivo) => archivo.isFile() && EXTENSIONES_IMAGEN.has(extname(archivo.name).toLowerCase()))
    .map((archivo) => archivo.name)
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));

  return (
    <section className="seccion galeria" aria-labelledby="t-galeria">
      <h2 id="t-galeria">Nuestra galería</h2>
      <p className="galeria__intro">
        Un espacio para guardar y volver a ver nuestros recuerdos. Las fotos que agreguemos aquí serán visibles para todos.
      </p>
      {fotos.length ? (
        <ul className="galeria__fotos">
          {fotos.map((nombre) => {
            const src = ruta(`/fotos/galeria/${encodeURIComponent(nombre)}`);
            const descripcion = nombre.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

            return (
              <li key={nombre}>
                <a href={src} target="_blank" rel="noreferrer" aria-label={`Abrir foto: ${descripcion}`}>
                  <Image src={src} alt={descripcion} fill sizes="(max-width: 720px) 50vw, 18rem" />
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="galeria__mensaje">
          Aún no hay fotos. Agrega imágenes a la carpeta <code>public/fotos/galeria</code> y publícalas para verlas aquí.
        </p>
      )}
    </section>
  );
}
