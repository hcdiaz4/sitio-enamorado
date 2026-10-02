"use client";

import { useState } from "react";
import type { Carta } from "@/data/contenido";

export default function Cartas({ cartas }: { cartas: Carta[] }) {
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <ul className="cartas">
      {cartas.map((c, i) => {
        const open = abierta === i;
        return (
          <li key={c.titulo}>
            <button
              className={`carta${open ? " carta--abierta" : ""}`}
              aria-expanded={open}
              onClick={() => setAbierta(open ? null : i)}
            >
              <span className="carta__titulo">{c.titulo}</span>
              {open ? (
                <span className="carta__texto">{c.texto}</span>
              ) : (
                <span className="carta__pista">Toca para abrir</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
