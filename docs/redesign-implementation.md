# Rediseño 3D — plan de implementación

Objetivo: adaptar la experiencia de la referencia al portfolio bilingüe con escritorio 3D, especialidades, historial laboral real, galería 3D del stack, proyectos y globo de contacto.

Arquitectura: conservar la exportación estática Vinext/Vercel, React y GSAP. Escenas independientes con carga diferida y Three.js; datos laborales tipados separados de la presentación. Mantener canales de contacto funcionales.

- [x] Crear `components/immersive-scene.tsx`: escena compartida con modos desk/globe/tech, recursos propios procedurales, carga en proximidad, pausa fuera de pantalla y movimiento reducido, limpieza y fallback.
- [x] Crear `lib/experience.ts`: cinco empleos ES/EN con las fechas, stack y resultados proporcionados. Crear presentación de línea de tiempo en `components/experience-timeline.tsx`.
- [x] Reorganizar `components/portfolio.tsx`: portada, especialidades, experiencia, stack, proyectos y contacto. Añadir entradas al scroll e inclinación del puntero en tarjetas, conservando interacción por teclado y traducciones.
- [x] Rediseñar `app/globals.css`: composición amplia, curvas, tarjetas redondeadas, navegación fija, timeline alternado y layouts móviles. Mantener paleta negro/azul/cian y preferencias de movimiento.
- [x] Ejecutar typecheck, pruebas existentes, lint y compilación. Revisar en navegador desktop/móvil, idiomas, controles y escenas. Revisión independiente de cumplimiento y calidad antes de publicar.
- [x] Subir la versión validada a main y comprobar despliegue Vercel y URL pública.

No inventar testimonios, empleadores adicionales ni repositorios. Las métricas proceden del usuario; conservar sus matices (hasta/aproximadamente/más de). No copiar modelos de terceros: construir geometría propia. No añadir un formulario que aparente enviar sin un servicio real.
