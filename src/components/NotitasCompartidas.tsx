"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getSupabaseClient, type Database } from "@/lib/supabase";

const MAX_CARACTERES = 500;
const supabase = getSupabaseClient();

type Nota = Database["public"]["Tables"]["notas_compartidas"]["Row"];

const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));

export default function NotitasCompartidas() {
  const [autor, setAutor] = useState("");
  const [contenido, setContenido] = useState("");
  const [notas, setNotas] = useState<Nota[]>([]);
  const [cargando, setCargando] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);

  const cargarNotas = useCallback(async () => {
    if (!supabase) {
      setCargando(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notas_compartidas")
        .select("id, autor, contenido, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        setMensaje(`No se pudieron cargar las notas: ${error.message}`);
        setEsError(true);
        setCargando(false);
        return;
      }

      setNotas(data ?? []);
      setEsError(false);
    } catch (error) {
      setMensaje(`Ocurrió un error al cargar las notas: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setEsError(true);
      setCargando(false);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarNotas();
    if (!supabase) return;

    const canal = supabase
      .channel("notas-compartidas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notas_compartidas" },
        () => void cargarNotas(),
      )
      .subscribe((estado) => {
        if (estado === "CHANNEL_ERROR" || estado === "TIMED_OUT") {
          setMensaje("No se pudo conectar para actualizar las notas en tiempo real. Recarga la página para ver las más recientes.");
          setEsError(true);
        }
      });

    return () => {
      void supabase.removeChannel(canal);
    };
  }, [cargarNotas]);

  const publicarNota = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!supabase) return;

    const nota = contenido.trim();
    const nombre = autor.trim() || "Anónimo";
    if (!nota) {
      setMensaje("Escribe una nota antes de publicarla.");
      setEsError(true);
      return;
    }
    if (nota.length > MAX_CARACTERES || nombre.length > 40) {
      setMensaje("El nombre admite hasta 40 caracteres y la nota hasta 500.");
      setEsError(true);
      return;
    }

    setPublicando(true);
    setMensaje("");
    setEsError(false);

    try {
      const { error } = await supabase
        .from("notas_compartidas")
        .insert({ autor: nombre, contenido: nota });

      if (error) {
        setMensaje(`No se pudo publicar la nota: ${error.message}`);
        setEsError(true);
        return;
      }

      setContenido("");
      setMensaje("¡Nota publicada para que todos puedan verla!");
      setEsError(false);
      await cargarNotas();
    } catch (error) {
      setMensaje(`Ocurrió un error al publicar la nota: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setEsError(true);
    } finally {
      setPublicando(false);
    }
  };

  return (
    <section className="seccion notas-compartidas" aria-labelledby="t-notas-compartidas">
      <h2 id="t-notas-compartidas">Notas compartidas</h2>
      <p className="notas-compartidas__intro">
        Cualquiera puede leer y publicar notas. No incluyas datos personales.
      </p>

      {!supabase ? (
        <p className="notas-compartidas__mensaje" role="status">
          Las notas compartidas estarán disponibles cuando se configure el servicio de sincronización.
        </p>
      ) : (
        <>
          <form className="notas-compartidas__formulario" onSubmit={publicarNota}>
            <label htmlFor="nota-autor">Tu nombre (opcional)</label>
            <input
              id="nota-autor"
              type="text"
              maxLength={40}
              value={autor}
              onChange={(evento) => setAutor(evento.target.value)}
              placeholder="Anónimo"
            />
            <label htmlFor="nota-contenido">Tu nota</label>
            <textarea
              id="nota-contenido"
              value={contenido}
              onChange={(evento) => setContenido(evento.target.value)}
              maxLength={MAX_CARACTERES}
              rows={4}
              required
              placeholder="Escribe algo bonito…"
            />
            <div className="notas-compartidas__acciones">
              <span>{contenido.length}/{MAX_CARACTERES}</span>
              <button className="notas-compartidas__boton" type="submit" disabled={publicando}>
                {publicando ? "Publicando…" : "Publicar nota"}
              </button>
            </div>
          </form>

          {cargando ? (
            <p className="notas-compartidas__mensaje" role="status">Cargando notas…</p>
          ) : notas.length ? (
            <ul className="notas-compartidas__lista">
              {notas.map((nota) => (
                <li className="notas-compartidas__nota" key={nota.id}>
                  <p>{nota.contenido}</p>
                  <div>
                    <strong>{nota.autor}</strong>
                    <time dateTime={nota.created_at}>{formatearFecha(nota.created_at)}</time>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="notas-compartidas__mensaje">Aún no hay notas. ¡Deja la primera!</p>
          )}
        </>
      )}

      {mensaje && (
        <p
          className={`notas-compartidas__mensaje${esError ? " notas-compartidas__mensaje--error" : ""}`}
          role={esError ? "alert" : "status"}
        >
          {mensaje}
        </p>
      )}
    </section>
  );
}
