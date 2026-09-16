# Especificación Técnica y de Arquitectura: hi.olbrite.com

## 1. Visión y Objetivos

El objetivo de este proyecto es construir el micrositio web oficial de presentación para **Olbrite** (`hi.olbrite.com`):
- **Impacto visual premium**: Diseño inspirado en interfaces de alta gama con estética tecnológica, 3D futurista y personajes tipo avatar 3D (en línea con la imagen de referencia y el estilo de dinamosites.com).
- **Hero Interactivo Guiado por Scroll**: Transición fluida donde el **hero-video-start** (transformación / activación) responde o se activa al scroll, desembocando en un loop interactivo del **hero-video-loop** (estado operativo continuo).
- **Alto Rendimiento y Carga Instantánea**: Estrategia de carga ligera, streaming/precarga progresiva y optimización de recursos.
- **Deploy Autónomo en here.now**: Despliegue estático optimizado, compatibilidad con subdominio personalizado (`hi.olbrite.com`) bajo la cuenta autenticada (`jorgeivanhernandezt@gmail.com`).

---

## 2. Análisis de los Recursos Multimedia

### Videos en `/assets`:
1. **`assets/hero-video-loop.mp4`**:
   - **Resolución**: 1280x720, 24 fps, H.264
   - **Duración**: 10.00s (240 cuadros)
   - **Peso**: 2.8 MB
   - **Contenido**: Las 3 especialistas/avatares IA con trajes Olbrite trabajando activamente con pantallas holográficas flotantes (métricas, mapa global, leads, bandejas omnicanal).
   - **Rol en el Hero**: **Loop continuo de estado activo** (ambient loop).

2. **`assets/hero-video-start.mp4`**:
   - **Resolución**: 1280x720, 24 fps, H.264
   - **Duración**: 10.01s (240 cuadros)
   - **Peso**: 5.2 MB
   - **Contenido**: Inicio en oficina tradicional (ropa de calle/casual, llamadas telefónicas, gestión manual) evolucionando hacia la activación del equipo IA en trajes futuristas con interfaces flotantes (el momento de revelación "Olbrite").
   - **Rol en el Hero**: **Narrativa de transformación ligada al scroll inicial**.

---

## 3. Arquitectura del Hero: Video vs. Secuencia de Frames

### Análisis Técnico: ¿Frames o Video Scrubbing?

| Criterio | Secuencia de Frames (Canvas) | Video Scrubbing (`<video>` + currentTime) | Enfoque Híbrido Recomendado |
| :--- | :--- | :--- | :--- |
| **Respuesta al Scroll** | Instantánea (0 lag, 1:1 con el cursor/touch) | Suele tener lag o tirones por decodificación inter-frame (GOP) | **Instantánea** |
| **Consumo de Memoria** | Alto si se cargan cientos de imágenes completas | Bajo (gestión nativa del reproductor) | **Optimizado** (secuencia a 15fps + resolución balanceada) |
| **Peso Inicial** | Requiere precarga de lote de imágenes | Requiere descargar el mp4 | **Carga progresiva inteligente** (primeros frames prioritarios) |
| **Transición a Loop** | Exige cambio a elemento `<video>` | Nativo si se usa el mismo elemento | **Cross-fade suave de Canvas a hero-video-loop Loop** |

### Solución Diseñada:
1. **Scrubbing de Transformación**: Extraemos los frames del **hero-video-start** optimizados (JPEG/WebP balanceado, ~60-80 frames a 12-15 fps o spritesheet). Se renderizan en un elemento `<canvas>` fijado (*sticky pinned section*) durante el desplazamiento del Hero (~150vh).
2. **Convergencia a Loop**: Al llegar al 100% de la animación de transformación, el `<canvas>` realiza un suave cross-fade (opacidad CSS) hacia el elemento `<video>` que reproduce en bucle continuo **hero-video-loop** (`assets/hero-video-loop.mp4`).
3. Si el usuario vuelve a subir el scroll, el canvas retoma el control del scrubbing de forma bidireccional y transparente.

---

## 4. Estructura de Secciones del Sitio (según el Mockup de Olbrite)

1. **Header / Navbar Flotante**:
   - Logotipo Olbrite con isotipo holográfico púrpura.
   - Navegación: *Platform, Solutions, Pricing, Resources, Contact*.
   - Botón CTA brillante: *Book a demo →*.
2. **Hero Section (Interactive Storytelling)**:
   - Tagline superior: `CONVERSATIONS POWER GROWTH`.
   - Titular H1: **"Let's make it happen."**
   - Subtítulo: *AI agents, CRM and automation that turn every conversation into growth. Unify WhatsApp, Instagram, Messenger, SMS and more.*
   - CTAs: *Book a demo →* y botón interactivo *See how it works (Play)*.
   - Social proof badges: *Trusted by 2,000+ businesses*, avatares de clientes.
   - Métricas: *24/7 AI follow-up, Omnichannel conversations, Turn conversations into revenue*.
   - **Canvas / Video Stage**: Escenario interactivo que acoge la secuencia de transformación (hero-video-start) y el loop final (hero-video-loop).
3. **The Core Solution: Unified Visibility**:
   - Cubo central holográfico que unifica WhatsApp, Instagram, Messenger, Email.
   - 3 Feature Cards interactivas (*Unified Inbox*, *Lead Scoring*, *Performance Analytics*).
4. **Measurable Impact: Real Results**:
   - Testimoniales y métricas de impacto empresarial (`+175%`, `80%`, `60%`).
   - Gráfico 3D de crecimiento con los avatares Olbrite.
5. **Industry Tailored Solutions**:
   - Segmentos específicos: *E-Commerce*, *Real Estate*, *B2B SaaS*.
6. **Final CTA & Footer**:
   - Sección de alta conversión con formulario/demo y pie de página completo.

---

## 5. Rendimiento y Deploy en here.now

- **Vanilla Modern Web**: HTML5 semántico, CSS moderno con variables y Vanilla JavaScript (ES Modules). Sin dependencias pesadas ni frameworks inflados para asegurar puntuación Lighthouse 95+.
- **Despliegue**: Despliegue mediante el skill oficial de `here.now`, autenticado con la cuenta `jorgeivanhernandezt@gmail.com`.
