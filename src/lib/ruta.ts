// Antepone el basePath de GitHub Pages a los archivos de /public.
export const ruta = (p: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;
