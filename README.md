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

## Galería pública de fotos

Las fotos de la galería son públicas y cualquiera puede verlas. Solo los usuarios autenticados e invitados pueden subir nuevas imágenes; no compartas fotos que deban ser privadas.

1. Crea un proyecto en [Supabase](https://supabase.com/) y, en **Authentication → Settings**, desactiva los registros públicos. Invita desde **Authentication → Users** únicamente los dos correos que podrán subir fotos. La galería utiliza enlaces de un solo uso enviados al correo.
2. En **SQL Editor**, ejecuta [`supabase/galeria.sql`](./supabase/galeria.sql). Crea un bucket público con un límite de 10 MB por imagen, lectura para todos y subida solo para usuarios autenticados.
3. En la configuración de autenticación de Supabase, permite como URL de redirección `https://TU_USUARIO.github.io/TU_REPO/` (y `http://localhost:3000/` para desarrollo).
4. En GitHub, abre **Settings → Secrets and variables → Actions → New repository secret** y agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`: la URL del proyecto.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: la clave publicable/anon del proyecto. Nunca uses la `service_role` en el sitio.
5. En tu computador, copia `.env.example` a `.env.local` y llena esas dos variables para probar localmente. Los secretos de GitHub se usarán en el siguiente despliegue.

No habilites registros públicos: cualquier visitante podrá ver las imágenes y las políticas de almacenamiento solo permiten subirlas a usuarios autenticados.
