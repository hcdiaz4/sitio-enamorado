"use client";

import { useEffect, useRef } from "react";

type Estrella = {
  x: number;
  y: number;
  velocidad: number;
  deriva: number;
  tamano: number;
  brillo: number;
};

export default function Estrellas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cantidad = Math.min(70, Math.max(32, Math.floor(window.innerWidth / 18)));
    const estrellas: Estrella[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;

    const crearEstrella = (y: number): Estrella => ({
      x: Math.random() * width,
      y,
      velocidad: 18 + Math.random() * 38,
      deriva: 5 + Math.random() * 15,
      tamano: 0.7 + Math.random() * 1.5,
      brillo: 0.35 + Math.random() * 0.55,
    });

    const ajustarTamano = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      estrellas.length = 0;
      for (let index = 0; index < cantidad; index += 1) {
        estrellas.push(crearEstrella(Math.random() * height));
      }
    };

    const dibujar = (tiempo: number) => {
      const delta = Math.min((tiempo - frame) / 1000, 0.05);
      frame = tiempo;
      context.clearRect(0, 0, width, height);

      for (const estrella of estrellas) {
        estrella.x += estrella.deriva * delta;
        estrella.y += estrella.velocidad * delta;

        const gradiente = context.createLinearGradient(
          estrella.x - estrella.deriva * 0.16,
          estrella.y - estrella.velocidad * 0.2,
          estrella.x,
          estrella.y,
        );
        gradiente.addColorStop(0, "rgba(244, 194, 122, 0)");
        gradiente.addColorStop(1, `rgba(255, 235, 190, ${estrella.brillo})`);
        context.strokeStyle = gradiente;
        context.lineWidth = estrella.tamano;
        context.beginPath();
        context.moveTo(
          estrella.x - estrella.deriva * 0.16,
          estrella.y - estrella.velocidad * 0.2,
        );
        context.lineTo(estrella.x, estrella.y);
        context.stroke();

        context.fillStyle = `rgba(255, 248, 225, ${estrella.brillo})`;
        context.beginPath();
        context.arc(estrella.x, estrella.y, estrella.tamano, 0, Math.PI * 2);
        context.fill();

        if (estrella.y > height + 8 || estrella.x > width + 8) {
          Object.assign(estrella, crearEstrella(-8 - Math.random() * height * 0.15));
        }
      }

      animationFrame = window.requestAnimationFrame(dibujar);
    };

    ajustarTamano();
    window.addEventListener("resize", ajustarTamano);
    animationFrame = window.requestAnimationFrame(dibujar);

    return () => {
      window.removeEventListener("resize", ajustarTamano);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="estrellas" aria-hidden="true" />;
}
