// ✏️ EDITA ESTE ARCHIVO: aquí está todo el contenido del sitio.

export type Momento = {
  fecha?: string;
  titulo: string;
  texto: string;
  /** Archivo dentro de public/fotos, ej: "/fotos/primera-cita.jpg" */
  foto?: string;
  fotos?: string[];
  video?: string;
};

export type Carta = { titulo: string; texto: string };

export const pareja = {
  tuNombre: "Carlos",
  suNombre: "Amy",
  // Fecha y hora desde la que están juntos (AAAA-MM-DDTHH:MM:SS)
  inicio: "2026-01-06T20:00:00",
  frase: "Cada día contigo es mi parte favorita del calendario.",
};

export const momentos: Momento[] = [
  {
    fecha: "25 de 05 de 2024",
    titulo: "El día que empezó todo",
    texto: `Ese día no lo sabías pero me enamore perdidamente de tus ojitos hermosos y esa sonrisa que cada día que pasa me hace muy pero muy feliz.
    que hermoso fue coincidir contigo y que lindo es poder compartir cada momento a tu lado.`,
    fotos: [

      "/fotos/primer-dia/WhatsApp Image 2026-10-02 at 3.30.21 PM.jpeg",
      "/fotos/primer-dia/WhatsApp Image 2026-10-02 at 3.48.09 PM.jpeg",
      "/fotos/primer-dia/WhatsApp Image 2026-10-02 at 3.48.40 PM.jpeg",
      "/fotos/primer-dia/WhatsApp Image 2026-10-02 at 3.48.58 PM.jpeg",
    ],
  },
  {
    fecha: "Siempre",
    titulo: "Mi bailarina y profesora favorita",
    texto: `No imaginas cuánto amo verte bailar. Me encanta ver cómo te emocionas con la música, cómo disfrutas cada momento y cómo les enseñas a bailar a los demás.`,
    video: "/video/bailarina.mp4",
  },
  {
    titulo: "Qué hermoso es compartir tus logros",
    texto: "Me llena de orgullo verte alcanzar tus metas y poder estar a tu lado para celebrar cada uno de tus logros. Qué bonito es compartir contigo esos momentos tan especiales.",
    fotos: [
      "/fotos/logros/WhatsApp Image 2026-10-02 at 4.20.30 PM.jpeg",
      "/fotos/logros/WhatsApp Image 2026-10-02 at 4.21.11 PM.jpeg",
    ],
  },
  {
    fecha: "Un día cualquiera",
    titulo: "Los planes pequeños",
    texto: `Tengo poquitas fotos mi amor como ya lo sabes, pero me encanta que cada momento contigo es especial. Me encanta que podamos disfrutar de los plans más simples y que cada día a tu lado sea algo hermoso mi princesa, como las citas de los martes, los detalles pequeños que enamoran, las idas a comer arepitas o pasteles, a veces unos milos jeje.`,
  },
  {
    titulo: "Tu último logro",
    texto: "Me siento muy orgulloso de ti por este logro mi amor hermosa. Sé que, con la ayuda de Dios, alcanzarás muchos más y ahí estaré viendo lograr cada uno de ellos.",
    foto: "/fotos/logros/moto.jpeg",
  },
];

export const cartas: Carta[] = [
  {
    titulo: "Para cuando tengas un mal día",
    texto: "Respira. Eres más fuerte de lo que crees y yo estoy de tu lado, siempre.",
  },
  {
    titulo: "Lo que me gusta de ti",
    texto: "Tus hermosos ojos cafés, la forma en que te emocionas con lo que amas y cómo haces que todo sea más fácil.",
  },
  {
    titulo: "Una promesa",
    texto: "Seguir escogiéndote todos los días, incluso en los días difíciles.",
  },
  {
    titulo: "Gracias",
    texto: "Por cuidarme, por escucharme y por ser tú.",
  },
  {
    titulo: "Para seguir adelante juntos",
    texto: "Sé que no ha sido fácil y que, a veces, parece que todo está en nuestra contra. Pero, con el favor de Dios y el amor tan fuerte que nos tenemos, sé que todo saldrá adelante. Juntos podemos superar cualquier dificultad.",
  },
];
