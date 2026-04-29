# Informe: Principios de Ecodiseño Aplicados a la Interfaz de Contemporánica

**Autor:** Manuel S.  
**Módulo:** Sostenibilidad (R.A. 4)  
**Fecha:** 30 de abril de 2026  

---

## 1. Introducción
El ecodiseño de software consiste en la integración de criterios medioambientales en el diseño y desarrollo de aplicaciones web con el fin de reducir su impacto ambiental a lo largo de su ciclo de vida. En el proyecto **Contemporánica**, hemos priorizado dos pilares fundamentales: la eficiencia energética en el dispositivo del cliente y la optimización de la transferencia de datos.

## 2. Implementación de Modo Oscuro (Dark Mode)
El uso de una interfaz predominantemente oscura no es solo una elección estética, sino una medida técnica de sostenibilidad.

*   **Ahorro en Pantallas OLED/AMOLED:** A diferencia de las pantallas LCD tradicionales, las pantallas OLED apagan físicamente los píxeles para mostrar el color negro. Esto reduce drásticamente el consumo de batería (hasta un 60% en niveles de brillo altos) en dispositivos móviles.
*   **Reducción de la Fatiga Visual:** Un contraste suavizado mejora la salud visual del usuario, permitiendo sesiones de uso más largas con menor fatiga, lo que contribuye a la sostenibilidad social del producto.
*   **Propuesta para Contemporánica:** La paleta de colores utiliza negros (#000000) y grises profundos para asegurar el apagado de píxeles en zonas críticas como el buscador y los dashboards.

## 3. Estrategia de Carga Ligera (Light Load)
La transmisión de datos a través de Internet genera una huella de carbono debido al consumo eléctrico de servidores, routers y centros de datos.

*   **Optimización de Activos:** Se propone el uso de formatos de imagen de última generación como WebP o AVIF, que ofrecen mayor calidad con un peso de archivo significativamente menor que JPEG o PNG.
*   **Minificación de Código:** El uso de herramientas para comprimir archivos HTML, CSS y JavaScript reduce el número de bytes transferidos en cada petición.
*   **Arquitectura SPA (Single Page Application):** Al cargar solo los fragmentos de la página que cambian, evitamos recargas completas del servidor, optimizando el tráfico de red.

## 4. Eficiencia en el Servidor (Impacto Indirecto)
Al diseñar una interfaz limpia y minimalista, reducimos la complejidad de las consultas a la base de datos (Supabase). Una interfaz sencilla requiere menos procesamiento en el "Backend", lo que se traduce en un menor uso de CPU en los servidores y, por tanto, una menor necesidad de refrigeración y energía en los centros de datos.

## 5. Conclusión
La aplicación de estos principios en **Contemporánica** demuestra que la tecnología musical puede ser innovadora y respetuosa con el medio ambiente simultáneamente. El enfoque en "Modo Oscuro" y "Carga Ligera" no solo mejora la autonomía del usuario, sino que posiciona al proyecto como una solución alineada con los objetivos de desarrollo sostenible.
