import type { Metadata } from "next";
import { Gloock, Figtree } from "next/font/google";
import Estrellas from "@/components/Estrellas";
import "./globals.css";

const display = Gloock({ weight: "400", subsets: ["latin"], variable: "--f-display" });
const cuerpo = Figtree({ subsets: ["latin"], variable: "--f-cuerpo" });

export const metadata: Metadata = {
  title: "Para ti",
  description: "Un rinconcito con nuestros momentos y mensajes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${cuerpo.variable}`}>
      <body>
        <Estrellas />
        {children}
      </body>
    </html>
  );
}
