# Sitio para mi enamorado 💌

Next.js + React + TypeScript, exportado como sitio estático para GitHub Pages.

## Personalizar
- Textos, fechas, momentos y mensajes: `src/data/contenido.ts`
- Fotos: súbelas a `public/fotos/` y escribe la ruta en `contenido.ts` (ej. `"/fotos/primer-dia.jpg"`)
- Colores: variables al inicio de `src/app/globals.css`

## Probar en tu computador
```bash
npm install
npm run dev
```

## Publicar en GitHub Pages
1. Crea un repositorio en GitHub y sube el proyecto a la rama `main`:
   ```bash
   git init && git add . && git commit -m "Primer commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` publica el sitio en `https://TU_USUARIO.github.io/TU_REPO/`.

> Si el repo se llama `TU_USUARIO.github.io`, quita `NEXT_PUBLIC_BASE_PATH` en `.github/workflows/deploy.yml`.
> Tip: usa un repo privado + Pages solo si tu plan lo permite; si no, ten en cuenta que el sitio será público.
