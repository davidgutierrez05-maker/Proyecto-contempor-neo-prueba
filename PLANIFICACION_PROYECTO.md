# 📅 Planificación del Proyecto: Contemporánica

Este documento sirve como centro de control para las tareas pendientes y objetivos cumplidos. **Prioridad absoluta: Directrices Maestras del Jefe.**

---

## 🚀 Tareas Completadas (Semana 1)
- [x] **Configuración de Entorno:** Git, GitHub CLI y Node.js instalados.
- [x] **Organización de Carpeta:** Estructura de directorios profesional creada.
- [x] **Informe de Ecodiseño:** Redactado en español y entregado en GitHub.
- [x] **Diseño UI (Fase 1):** Traducción a inglés y adaptación del buscador (Tags, Años, País, Género).
- [x] **Esquema de Base de Datos:** Archivo `diseno/tablas.sql` corregido con roles y campos obligatorios.
- [x] **Acceso Remoto:** Conexión vía Tailscale establecida con Proxmox.

---

## ⏳ Pendiente: Martes 28 (Hardware y Redes)
*Estas tareas se realizarán en cuanto se obtenga la contraseña del servidor.*
- [ ] **Auditoría de Hardware:**
  - Identificar ID y Nombre de la VM en Proxmox.
  - Anotar RAM, vCPU (Sockets/Cores) y Almacenamiento.
  - Verificar si el SO es Ubuntu Server 22.04 LTS.
- [ ] **Configuración de Red:**
  - Verificar conexión a `vmbr0`.
  - Identificar IP actual (`ip a`).
  - Documentar Puerta de Enlace y DNS.

---

## 📅 Próximos Pasos: Lunes 4 de Mayo
- [ ] **Base de Datos (Supabase):**
  - Crear el proyecto oficial en Supabase.
  - Ejecutar el script `diseno/tablas.sql` (Versión Manuel).
  - Verificar que el rol 'composer' y 'musician' sean excluyentes.
- [ ] **Desarrollo Web:**
  - Empezar a conectar el frontend (`code.html`) con la base de datos de Supabase.
  - Asegurar que el buscador de instrumentos (Tags) funcione con datos reales.
- [ ] **Limpieza de Datos:**
  - Analizar el JSON de la empresa y clasificar según los nuevos roles.

---

## ⚠️ Recordatorio: Directrices Maestras
1. **Idioma:** WEB SIEMPRE EN INGLÉS. INFORMES EN ESPAÑOL.
2. **Roles:** Compositor != Músico. Son perfiles excluyentes.
3. **Buscador:** Debe permitir rangos de años (ej: 2019-2019), país y género.
