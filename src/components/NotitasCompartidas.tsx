"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
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
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [autorizado, setAutorizado] = useState(false);
  const [correo, setCorreo] = useState("");
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

    let activa = true;
    const { data: authData } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      if (activa) {
        setSession(nuevaSesion);
        setCargandoSesion(false);
      }
    });
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
      activa = false;
      authData.subscription.unsubscribe();
      void supabase.removeChannel(canal);
    };
  }, [cargarNotas]);

  useEffect(() => {
    if (!supabase) {
      setCargandoSesion(false);
      return;
    }

    let activa = true;
    void supabase.auth.getSession().then(
      ({ data, error }) => {
        if (!activa) return;
        if (error) {
          setMensaje(`No se pudo comprobar la sesión: ${error.message}`);
          setEsError(true);
        } else {
          setSession(data.session);
        }
        setCargandoSesion(false);
      },
      (error: unknown) => {
        if (!activa) return;
        setMensaje(`No se pudo comprobar la sesión: ${error instanceof Error ? error.message : "Error desconocido"}`);
        setEsError(true);
        setCargandoSesion(false);
      },
    );

    return () => {
      activa = false;
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session) {
      setAutorizado(false);
      return;
    }

    let activa = true;
    void supabase
      .from("notas_autores_permitidos")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(
        ({ data, error }) => {
          if (!activa) return;
          if (error) {
            setMensaje(`No se pudo verificar el permiso para publicar: ${error.message}`);
            setEsError(true);
            setAutorizado(false);
            return;
          }
          setAutorizado(Boolean(data));
        },
        (error: unknown) => {
          if (!activa) return;
          setMensaje(`Ocurrió un error al verificar el permiso: ${error instanceof Error ? error.message : "Error desconocido"}`);
          setEsError(true);
          setAutorizado(false);
        },
      );

    return () => {
      activa = false;
    };
  }, [session]);

  const solicitarAcceso = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!supabase) return;

    setMensaje("");
    setEsError(false);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const redirectTo = `${window.location.origin}${basePath}/`;
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: correo.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setMensaje(`No se pudo enviar el enlace de acceso: ${error.message}`);
        setEsError(true);
        return;
      }
      setMensaje("Si el correo está autorizado, recibirás un enlace para iniciar sesión.");
    } catch (error) {
      setMensaje(`Ocurrió un error al enviar el enlace: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setEsError(true);
    }
  };

  const cerrarSesion = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMensaje(`No se pudo cerrar la sesión: ${error.message}`);
      setEsError(true);
    }
  };

  const publicarNota = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!supabase || !session || !autorizado) return;

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
        Las notas son públicas para que todos puedan leerlas; solo nosotros dos podemos publicarlas. No incluyas datos personales.
      </p>

      {!supabase ? (
        <p className="notas-compartidas__mensaje" role="status">
          Las notas compartidas estarán disponibles cuando se configure el servicio de sincronización.
        </p>
      ) : (
        <>
          {cargandoSesion ? (
            <p className="notas-compartidas__mensaje" role="status">Comprobando acceso para publicar…</p>
          ) : session && autorizado ? (
            <>
              <div className="notas-compartidas__sesion">
                <p>Sesión iniciada: {session.user.email}</p>
                <button className="notas-compartidas__boton notas-compartidas__boton--secundario" type="button" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </div>
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
            </>
          ) : session ? (
            <div className="notas-compartidas__sesion">
              <p>Este correo no tiene permiso para publicar notas.</p>
              <button className="notas-compartidas__boton notas-compartidas__boton--secundario" type="button" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <form className="notas-compartidas__formulario" onSubmit={solicitarAcceso}>
              <label htmlFor="nota-correo">Inicia sesión con uno de los dos correos autorizados</label>
              <div className="notas-compartidas__acceso">
                <input
                  id="nota-correo"
                  type="email"
                  autoComplete="email"
                  required
                  value={correo}
                  onChange={(evento) => setCorreo(evento.target.value)}
                  placeholder="tu@correo.com"
                />
                <button className="notas-compartidas__boton" type="submit">
                  Enviar enlace de acceso
                </button>
              </div>
            </form>
          )}

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
