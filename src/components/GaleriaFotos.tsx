"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";

const BUCKET = "galeria-pareja";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EXTENSIONES: Record<string, string> = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const supabase = getSupabaseClient();

type FotoGaleria = {
  nombre: string;
  url: string;
};

export default function GaleriaFotos() {
  const [session, setSession] = useState<Session | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [cargandoFotos, setCargandoFotos] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [correo, setCorreo] = useState("");
  const [fotos, setFotos] = useState<FotoGaleria[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);

  const cargarFotos = useCallback(async (): Promise<boolean> => {
    if (!supabase) return false;

    setCargandoFotos(true);
    setMensaje("");
    setEsError(false);

    try {
      const { data: archivos, error: errorLista } = await supabase.storage
        .from(BUCKET)
        .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

      if (errorLista) {
        setMensaje(`No se pudieron cargar las fotos: ${errorLista.message}`);
        setEsError(true);
        return false;
      }

      const imagenes = (archivos ?? []).filter(
        (archivo) => archivo.id && EXTENSIONES[archivo.metadata?.mimetype ?? ""],
      );
      setFotos(
        imagenes.map((archivo) => ({
          nombre: archivo.name,
          url: supabase.storage.from(BUCKET).getPublicUrl(archivo.name).data.publicUrl,
        })),
      );
      return true;
    } catch (error) {
      setMensaje(`Ocurrió un error al cargar la galería: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setEsError(true);
      return false;
    } finally {
      setCargandoFotos(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setCargandoSesion(false);
      return;
    }

    let activa = true;
    const { data } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      if (activa) setSession(nuevaSesion);
    });

    void supabase.auth.getSession().then(
      ({ data: resultado, error }) => {
        if (!activa) return;
        if (error) {
          setMensaje(`No se pudo comprobar la sesión: ${error.message}`);
          setEsError(true);
        } else {
          setSession(resultado.session);
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
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (supabase) void cargarFotos();
  }, [cargarFotos]);

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
        options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
      });

      if (error) {
        setMensaje(`No se pudo enviar el enlace de acceso: ${error.message}`);
        setEsError(true);
        return;
      }

      setMensaje("Revisa tu correo: te enviamos un enlace para entrar a la galería.");
    } catch (error) {
      setMensaje(`Ocurrió un error al enviar el enlace: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setEsError(true);
    }
  };

  const subirFotos = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!supabase) return;

    const entrada = evento.currentTarget.elements.namedItem("fotos");
    if (!(entrada instanceof HTMLInputElement) || !entrada.files?.length) {
      setMensaje("Selecciona al menos una imagen para subir.");
      setEsError(true);
      return;
    }

    const seleccionadas = Array.from(entrada.files);
    const invalidas = seleccionadas.filter(
      (archivo) => !EXTENSIONES[archivo.type] || archivo.size > MAX_FILE_SIZE,
    );
    if (invalidas.length) {
      setMensaje("Solo se aceptan imágenes JPG, PNG, WebP, GIF o AVIF de hasta 10 MB cada una.");
      setEsError(true);
      return;
    }

    setSubiendo(true);
    setMensaje("");
    setEsError(false);

    try {
      const resultados = await Promise.all(
        seleccionadas.map(async (archivo) => {
          const extension = EXTENSIONES[archivo.type];
          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(`${crypto.randomUUID()}.${extension}`, archivo, {
              contentType: archivo.type,
              upsert: false,
            });
          return error;
        }),
      );
      const fallidas = resultados.filter((error) => error !== null);

      entrada.value = "";
      const fotosCargadas = await cargarFotos();
      if (fallidas.length) {
        setMensaje(`No se pudieron subir ${fallidas.length} imagen${fallidas.length === 1 ? "" : "es"}: ${fallidas[0].message}`);
        setEsError(true);
      } else if (fotosCargadas) {
        setMensaje("¡Fotos agregadas a la galería!");
        setEsError(false);
      }
    } catch (error) {
      setMensaje(`Ocurrió un error al subir las imágenes: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setEsError(true);
    } finally {
      setSubiendo(false);
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

  return (
    <section className="seccion galeria" aria-labelledby="t-galeria">
      <h2 id="t-galeria">Nuestra galería</h2>
      <p className="galeria__intro">Un espacio para guardar y volver a ver nuestros recuerdos. Las fotos son visibles para todos; solo nosotros podemos subirlas.</p>

      {!supabase ? (
        <p className="galeria__mensaje" role="status">
          La galería estará disponible cuando se configure el almacenamiento de fotos.
        </p>
      ) : (
        <>
          {cargandoSesion ? (
            <p className="galeria__mensaje" role="status">Comprobando acceso para subir fotos…</p>
          ) : session ? (
            <>
              <div className="galeria__barra">
                <p>Sesión iniciada como {session.user.email}</p>
                <button className="galeria__boton galeria__boton--secundario" type="button" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </div>

              <form className="galeria__subida" onSubmit={subirFotos}>
                <label htmlFor="galeria-fotos">Elige una o varias imágenes (máximo 10 MB cada una)</label>
                <div className="galeria__acciones">
                  <input
                    id="galeria-fotos"
                    name="fotos"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    multiple
                    disabled={subiendo}
                  />
                  <button className="galeria__boton" type="submit" disabled={subiendo}>
                    {subiendo ? "Subiendo…" : "Agregar fotos"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <form className="galeria__acceso" onSubmit={solicitarAcceso}>
              <label htmlFor="galeria-correo">Inicia sesión para subir fotos (solo usuarios invitados)</label>
              <div className="galeria__acciones">
                <input
                  id="galeria-correo"
                  type="email"
                  autoComplete="email"
                  required
                  value={correo}
                  onChange={(evento) => setCorreo(evento.target.value)}
                  placeholder="tu@correo.com"
                />
                <button className="galeria__boton" type="submit">Enviar enlace de acceso</button>
              </div>
            </form>
          )}

          {cargandoFotos ? (
            <p className="galeria__mensaje" role="status">Cargando recuerdos…</p>
          ) : fotos.length ? (
            <ul className="galeria__fotos">
              {fotos.map((foto) => (
                <li key={foto.nombre}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.url} alt="Recuerdo compartido" loading="lazy" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="galeria__mensaje">Todavía no hay fotos. ¡Suban la primera!</p>
          )}
        </>
      )}

      {mensaje && (
        <p className={`galeria__mensaje${esError ? " galeria__mensaje--error" : ""}`} role={esError ? "alert" : "status"}>
          {mensaje}
        </p>
      )}
    </section>
  );
}
