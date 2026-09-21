# Portfolio 3D — propuesta de rediseño

Referencia revisada el 21 de septiembre de 2026: https://3d-portfolio-website-gamma.vercel.app/

## Dirección recomendada

Adaptación cercana de la composición y del lenguaje de movimiento de la referencia, con identidad de Wilder Mancera, español/inglés, negro #05070D, azul oscuro #101C34 y cian #67E8F9. Se conserva React, TypeScript, Three.js y GSAP y la exportación estática para Vercel.

Alternativas consideradas: retocar las animaciones del diseño actual (menor impacto y menor parecido); construir una experiencia completamente cinematográfica controlada por scroll (más complejidad y menos cercanía a esta referencia). La adaptación de sus secciones y escenas encaja mejor con la solicitud.

## Composición y animaciones

1. Portada amplia con saludo, nombre destacado en cian, descripción full stack y escritorio 3D propio con monitor, teclado y torre. Fondo de curvas topográficas en azul y cian; indicador de scroll animado. Escena iluminada con movimiento suave y control de perspectiva.
2. Presentación breve y cuatro tarjetas de especialidades: frontend, backend, datos y calidad/entrega. Entrada escalonada, borde luminoso e inclinación sutil al mover el puntero.
3. Experiencia laboral en una línea vertical, tarjetas alternadas en escritorio, fechas y responsabilidades verificadas. En móvil, una sola columna. Los datos laborales se solicitaron al usuario; no se deducen empleadores ni fechas de los proyectos.
4. Tecnologías en objetos facetados giratorios con símbolos reconocibles de .NET, Node.js, Angular, React, SQL Server, PostgreSQL, MongoDB y Dynamics 365. QA Automation, CI/CD y DevOps como capacidades complementarias. Esta adaptación adopta los objetos de la nueva referencia; las partículas que forman logotipos no forman parte de esta propuesta inicial.
5. Tres tarjetas de proyecto con visual amplio, descripción, tecnologías, contribución y enlace. Mantener las contribuciones verificadas de DeltaForex, TechBrains y BM Cargo; no inventar repositorios públicos ni resultados cuantitativos. Inclinación al puntero y entrada escalonada.
6. Contacto en dos columnas: panel con los canales reales y motivo de contacto, junto a un globo 3D estilizado en azul/cian sobre un campo de estrellas. Mantener correo y enlaces funcionales; un formulario de envío real requeriría elegir y conectar un servicio de correo.

No se incorporan testimonios sin testimonios reales proporcionados por Wilder. Los modelos y fondos se crearán para este proyecto; cualquier recurso externo requerirá comprobar su licencia.

## Implementación y comprobación

Separar escenas, tarjetas, timeline y animaciones en componentes enfocados. Contenido bilingüe en módulos de datos. Evitar varios contextos WebGL por cada tecnología: compartir una escena para la galería, cargar las escenas al acercarse a pantalla y detener el renderizado fuera de vista. Limitar la resolución del renderizado.

Respetar movimiento reducido, navegación por teclado, enlaces y etiquetas accesibles. Mostrar alternativas legibles si WebGL no está disponible; no bloquear la lectura tras un cargador. Validar ambas traducciones, dispositivos móviles, carga de escenas, ausencia de errores, build estático y despliegue Vercel. La revisión visual incluirá recorrer e interactuar con la página terminada.

## Estado

Propuesta para revisión. No se han modificado los componentes ni el sitio publicado. Falta recibir el historial laboral y confirmar esta dirección antes de implementar.
