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

## Notas compartidas

GitHub Pages aloja el sitio estático y Supabase sincroniza las notas entre dispositivos. Cualquier visitante puede leerlas y publicar, sin CAPTCHA; no escribas información privada. La base limita el nombre a 40 caracteres y cada nota a 500.

1. Crea un proyecto en [Supabase](https://supabase.com/).
2. En **SQL Editor**, ejecuta [`supabase/notas_compartidas.sql`](./supabase/notas_compartidas.sql) para crear la tabla pública de notas y habilitar actualizaciones en tiempo real.
3. Copia la URL del proyecto y su clave publicable/anon desde **Project Settings → API**.
4. En el repositorio GitHub, abre **Settings → Secrets and variables → Actions → New repository secret** y agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con esos valores. No uses la clave `service_role`.
5. Para desarrollo local, copia `.env.example` a `.env.local`, rellena las dos variables y ejecuta `npm run dev`.

Al guardar los secretos, vuelve a ejecutar el workflow de GitHub Actions o haz un nuevo `push` para que la página se compile con la conexión.
