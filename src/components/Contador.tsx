"use client";

import { useEffect, useState } from "react";

type Props = { inicio: string };

const partes = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    días: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  };
};

export default function Contador({ inicio }: Props) {
  const [ahora, setAhora] = useState<number | null>(null);

  useEffect(() => {
    setAhora(Date.now());
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = partes(ahora === null ? 0 : ahora - new Date(inicio).getTime());

  return (
    <dl className="contador" aria-label="Tiempo juntos">
      {Object.entries(t).map(([etiqueta, valor]) => (
        <div key={etiqueta} className="contador__celda">
          <dd>{ahora === null ? "–" : valor}</dd>
          <dt>{etiqueta}</dt>
        </div>
      ))}
    </dl>
  );
}
