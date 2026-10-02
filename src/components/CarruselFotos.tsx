"use client";

import { useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { ruta } from "@/lib/ruta";

export default function CarruselFotos({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <div className="momento-carrusel" role="region" aria-roledescription="carrusel" aria-label={`Fotos: ${titulo}`}>
      <Swiper
        aria-label={`Fotos de ${titulo}`}
        modules={[A11y, Keyboard, Pagination]}
        keyboard={{ enabled: true }}
        loop={fotos.length > 1}
        pagination={fotos.length > 1 ? { clickable: true } : false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {fotos.map((foto, index) => (
          <SwiperSlide key={`${foto}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="momento-carrusel__foto"
              src={ruta(foto)}
              alt={`${titulo}, foto ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {fotos.length > 1 && (
        <div className="momento-carrusel__controles">
          <button
            className="momento-carrusel__boton"
            type="button"
            aria-label="Foto anterior"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            ‹
          </button>
          <button
            className="momento-carrusel__boton"
            type="button"
            aria-label="Foto siguiente"
            onClick={() => swiperRef.current?.slideNext()}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
