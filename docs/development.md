# Registro de Desarrollo, Arquitectura y Despliegue: hi.olbrite.com

## 1. Estado y Metadatos del Proyecto
- **Fecha**: 2026-09-16
- **Cuenta Vinculada**: `jorgeivanhernandezt@gmail.com`
- **Plataforma de Hosting**: here.now
- **Workspace**: `olbrite`
- **Slug en Producción**: `gilded-mortar-r7an`
- **Dominio Público Oficial**: [https://hi.olbrite.com](https://hi.olbrite.com)
- **Repositorio GitHub**: [https://github.com/jiht76/hi.olbrite.com](https://github.com/jiht76/hi.olbrite.com)

---

## 2. Hallazgos Técnicos y Decisiones de Arquitectura

### A. Animación Guiada por Scroll y Transición a Loop
1. **Scrubbing de Video vs. Canvas Frames**:
   - Modificar `video.currentTime` directamente en el evento de scroll produce *stuttering* y saltos de fotogramas debido a la compresión inter-frame (GOP) de los archivos MP4 estándar.
   - **Solución implementada**: Se extrajeron 80 cuadros HD nítidos (1280x720) mediante FFmpeg con escala Lanczos y compresión de alta calidad (`-qscale:v 3`). Se renderizan en un elemento `<canvas>` acelerado por hardware con soporte para pantallas HiDPI/Retina (`window.devicePixelRatio`).
2. **Cadencia Cinematográfica y Alineación de Video Loop**:
   - Velocidad calibrada a **8.5 FPS** (~117.6ms por cuadro), para una transformación fluida de ~9.4 segundos.
   - **Sincronización Pixel-Perfect Canvas vs. Video**: Tanto los fotogramas del `<canvas>` como el video `#hero-loop-video` están rigurosamente centrados (`ox = (cw - nw) * 0.5; oy = (ch - nh) * 0.5;` y `object-position: center center;`). Esto elimina cualquier salto o desfase de posición al llegar al cuadro 80 y comenzar el bucle infinito.
3. **Loop Permanente**:
   - Una vez finalizados los 80 frames, el canvas transiciona suavemente mediante opacidad hacia `assets/videos/hero-video-loop-hd.mp4` (`autoplay`, `loop`, `muted`, `playsinline`), el cual permanece activo indefinidamente incluso si el usuario vuelve a desplazarse hacia arriba (*efecto permanente*).

### B. Experiencia de Entrada ("Glass Doors" & Welcome Flow)
1. **Efecto Puerta de Vidrio Doble (Frosted Glass Doors)**:
   - Al cargar la página, el espacio de trabajo se encuentra cubierto por dos hojas de vidrio esmerilado independientes (`.glass-door-left` y `.glass-door-right`) con `backdrop-filter: blur(28px)` separadas por una junta luminosa vertical en el centro.
2. **Grabado de Marca en Cada Mitad (Dual Glass Engraving)**:
   - En el estado inicial previo a la apertura, **cada hoja de vidrio** contiene su propio grabado centrado con el isotipo (`assets/isotipo-glass-transparent.png`) y el logotipo (`assets/olbrite-logo-glass-transparent.png`):
     - **Escritorio**: Tamaño 50% mayor (isotipo 84px, logo 210px) para presencia nítida y elegante.
     - **Móvil**: Proporciones compactas y refinadas (isotipo 46px, logo 115px).
     - **Tratamiento**: 50% de transparencia (`opacity: 0.5`) y contraste atenuado (`filter: contrast(0.85) brightness(1.05)`).
3. **Apertura y Desvanecimiento Direccional (Lateral Dissolve)**:
   - Al pulsar para entrar, la puerta izquierda y su grabado se desplazan y desvanecen hacia la izquierda (`translateX(-100%)` / `translate(-80%, -50%)`), y la puerta derecha hacia la derecha (`translateX(100%)` / `translate(-20%, -50%)`).
   - Al concluir la transición (1.2s), el contenedor se oculta por completo (`display: none; visibility: hidden; pointer-events: none;`) para garantizar que no permanezca ninguna capa sobre el canvas ni el video.
4. **Mecanismo de Activación por Touch / Click (No Scroll)**:
   - Para prevenir que el usuario haga scroll antes de cargar los cuadros o salte la cinemática, el scroll está bloqueado inicialmente (`body.hero-locked`).
   - El gatillo de entrada es exclusivamente táctil o clic (en la píldora, las puertas o el canvas).
   - Detección dinámica de dispositivo: `Welcome!... Touch to enter` en móviles / tablets y `Welcome!... Click to enter` en escritorios.
5. **Secuencia Narrativa de Textos y Transición al Loop**:
   - **Al pulsar para entrar**: `Our Agents are Working!` seguido de `Please get in ✨`.
   - **Al llegar al Loop**:
     - El badge se ancla arriba del título: `✨ All Agents Active!`.
     - En **desktop**, el badge anclado se alinea de forma **pixel-perfect al margen izquierdo** (`left: calc(max(2rem, (100% - 1280px) / 2 + 2rem)); transform: none !important; animation: none !important;`), coincidiendo al 100% (diferencia 0px) con el título `What can we do for you?` y los botones.
     - El título principal H1 entra con el gradiente corporativo Olbrite y rota cada 3.8s por la lista de propuestas de valor y automatización.
     - Social Proof: `Over 500 agents and projects`.
6. **Modo Auxiliar de Pruebas e Inspección (`?intro=off`)**:
   - Permite cargar el sitio directamente en su estado activo/desbloqueado sin puertas de vidrio, sin bloqueo de scroll y sin tener que esperar la animación inicial de 80 cuadros o el video de Mindy.
   - Activación vía parámetro de URL: `https://hi.olbrite.com/?intro=off` (también acepta `intro=false`, `intro=0`, o `no-intro`).
   - Cuenta con detección en `<head>` para evitar parpadeos visuales (FOUC), desbloqueo inmediato de scroll y montaje instantáneo del video loop y la navegación.

### C. Eliminación de Demora en Scroll Down
1. **Contenedor 100vh**:
   - Inicialmente, `.hero-scroll-container` requería `240vh` para el scrubbing manual por scroll. Con el modelo cinemático por touch/clic, dicha altura generaba una demora de 140vh de scroll muerto antes de que el hero se desplazara hacia arriba.
   - Se ajustó `.hero-scroll-container` y `.hero-scroll-container.unlocked` a `height: 100vh; min-height: 100vh;`.
   - Al estar desbloqueado el hero, cualquier desplazamiento del usuario hace avanzar inmediatamente la página hacia la sección `#core-solution` con fluidez instantánea.

### D. Favicon e Identidad de Marca Glass
1. **Favicon Isotipo Glass Transparente**:
   - Se generaron versiones de alta definición del isotipo translúcido (`assets/branding/favicon-glass.png`, `favicon-glass-32.png`, `favicon-glass-48.png`, `apple-touch-icon-glass.png`, etc.) a partir de `assets/isotipo-glass-transparent.png`.
   - Configurado en `<head>` con múltiples resoluciones (32x32, 48x48, 64x64) y Apple Touch Icon (180x180), además de los fallbacks de raíz `favicon.ico` y `favicon.png`.

### E. Slider de Integraciones ("Our agents can work with...")
1. **Descarga Automatizada de Vectores Oficiales (WorldVectorLogo)**:
   - Utilizando la herramienta CLI del skill `worldvectorlogo` (`wvl.py`), se consultaron y descargaron directamente los 20 logotipos vectoriales oficiales en formato SVG optimizado en `assets/logos/`:
     - *Modelos de IA*: OpenAI, Anthropic, Google Gemini, DeepSeek.
     - *Canales y Redes Sociales*: WhatsApp, Telegram, Slack, Meta, Instagram, Facebook, TikTok.
     - *Plataformas y CRMs*: WordPress, Shopify, HubSpot, Jira, Twilio.
     - *Productividad*: Google Calendar, Gmail, Google Drive, Calendly.
2. **Carrusel Bidireccional Infinito (Marquee Doble)**:
   - **Fila 1 (Izquierda a Derecha)**: Modelos de IA y Mensajería + distintivo destacado `"✨ And hundreds of tools"`.
   - **Fila 2 (Derecha a Izquierda)**: CRMs, Comercio y Productividad + distintivo destacado `"🚀 And hundreds of tools"`.
   - Implementado mediante `translate3d` continuo con duplicación de sets para rotación infinita sin saltos visuales (`36s` y `40s`).
   - Máscara de desvanecimiento lateral en bordes con CSS `mask-image` y `-webkit-mask-image`.
   - Pausa suave al pasar el cursor (`:hover { animation-play-state: paused; }`).
3. **Píldoras Glassmorphism de Alta Fidelidad**:
   - Cada herramienta se presenta en una píldora translúcida con icono SVG nítido y tipografía seminegrilla con micro-animaciones en hover (`translateY(-3px)`, resplandor violeta Olbrite).

### F. Optimización Móvil y Jerarquía Vertical
1. **Distribución Vertical Ergonómica en el Hero**:
   - **Badge "All Agents Active!"**: Desplazado a `top: 6.4rem` con respiro adecuado frente al Navbar.
   - **Frase Dinámica**: Elevada hacia la zona superior-media para dejar despejado el rostro de los avatares.
   - **Botones CTA y Social Proof**: Alineados abajo para ergonomía de pulgar.
2. **Menú Hamburguesa Sin Bordes**:
   - Botón minimalista de 3 líneas limpias, sin bordes ni fondos que compitan con el header.
3. **Acordeón Edge-to-Edge Sin Cortes ni Espacios Vacíos**:
   - Despliegue limpio sin marcos flotantes ni cortes en el botón "Book a demo".
4. **Header Compacto**:
   - Navbar optimizado en móvil para maximizar el área visible.

### G. Hallazgos en el Despliegue con here.now
1. **Diferencia entre Deploy Personal y Workspace**:
   - Al publicar con `--workspace olbrite`, el sitio se asocia a la cuenta corporativa y vincula directamente las rutas del subdominio configurado (`hi.olbrite.com` -> `gilded-mortar-r7an`).
2. **Uso de `--slug` y `--overwrite`**:
   - Para actualizar la versión ya vinculada a `hi.olbrite.com` sin romper el dominio ni re-subir todos los videos completos:
     ```bash
     ~/.agents/skills/here-now/scripts/publish.sh dist --slug gilded-mortar-r7an --workspace olbrite --overwrite --client gemini
     ```
   - Solo se transfieren archivos modificados (HTML, CSS, JS, SVGs) en menos de 5 segundos gracias a las sumas SHA-256 de here.now.

### H. Avatar Concierge Mindy & Widget de Chat LeadConnector
1. **Integración de Video con Canal Alfa (WebM)**:
   - Archivo: `assets/videos/mindy-avatar-welcome.webm`.
   - Se activa de forma automática una vez completada la cinemática de entrada (`completeTransformation`).
2. **Estrategia de Audio y Permisos del Navegador**:
   - Los navegadores modernos bloquean la reproducción automática con sonido (*autoplay audio policy*).
   - **Solución implementada**: Durante el gesto de clic/touch del usuario en las puertas o píldora central de entrada, se ejecuta un *warmup* inmediato (`video.play()` con volumen `1.0` y posterior `pause()`). Cuando la transformación culmina, Mindy saluda con audio nítido sin restricciones del navegador.
   - Controles de sonido UI: Botón flotante accesible para silenciar (`mute`) o reactivar el sonido en cualquier momento.
3. **Escala Móvil Aumentada (+60%)**:
   - En pantallas pequeñas, el avatar se incrementó un 60% para brindar máxima presencia e impacto visual sin tapar los botones clave de acción.
4. **Globo de Diálogo y Animación de Salida (Shrink-to-Corner)**:
   - Se despliega un globo de texto con glassmorphism: *"Hi there! I'm Mindy... Welcome to Olbrite!"*.
   - Al terminar el mensaje de saludo (~8s), el contenedor ejecuta una transición fluida encogiéndose hacia la esquina inferior derecha (`.exit`).
5. **Carga Diferida del Widget de Chat LeadConnector**:
   - Al finalizar la animación de salida de Mindy, se monta en el DOM el script oficial del widget de conversación de LeadConnector (`https://widgets.leadconnectorhq.com/loader.js` con widget ID `6aac49d1204f7932178f3c0e`). Esto asegura que el widget pesado no consuma recursos de renderizado durante la cinemática de entrada.

### I. Explorador Interactivo de Arquitectura: "¿Qué es un Agente?"
1. **Propósito Educativo y de Conversión**:
   - `#what-is-an-agent`: Desmitifica qué es un agente autónomo frente a los chatbots rígidos tradicionales.
2. **Los 5 Componentes Fundamentales**:
   - **Model**: El motor de razonamiento y planificación adaptativa.
   - **Skills**: Competencias especializadas de negocio (calificación de leads, análisis financiero, redacción).
   - **Tools**: Integraciones bidireccionales con APIs (WhatsApp, Slack, CRMs, bases de datos).
   - **Harness**: Reglas de negocio, seguridad, límites de marca y escalamiento humano.
   - **Loops**: Ciclos de ejecución continua (Plan → Act → Evaluate → Learn).
3. **Mecánica Interactiva Híbrida**:
   - Píldoras superiores interactivas (`.comp-pill`) sincronizadas con *hotspots* sobre la ilustración del escritorio 3D (`.stage-hotspot`).
   - Ciclo automático cada 4.8s que se desactiva suavemente tan pronto como el usuario interactúa manualmente con cualquier control.

### J. Pilares de Credibilidad y Propuesta de Valor ("Why Choose Olbrite")
1. **Estructura de Cuadrícula con Micro-interacciones**:
   - `#why-choose`: Cuatro pilares de confianza empresarial:
     - *Enterprise-Grade Security & Governance*.
     - *Zero-Friction Omnichannel Integration*.
     - *Continuous 24/7 Autonomous Operation*.
     - *Measurable Business ROI & Conversion*.
2. **Estilo Visual**:
   - Píldoras de micro-tags, badges con métricas de alto contraste y tarjetas glassmorphism con elevación elástica al pasar el cursor.

### K. Diagnóstico de Herramientas del Navegador y Protocolo CDP
1. **Causa del Timeout en `open_browser_url` del Subagente**:
   - El puerto `9222` de Chrome DevTools Protocol (CDP) puede entrar en colisión si existe un proceso Chrome previo en segundo plano escuchando en IPv6 mientras el navegador del usuario escucha en IPv4.
   - Si quedan archivos de bloqueo (`SingletonLock`, `SingletonSocket`) en `~/.gemini/antigravity-browser-profile`, las llamadas nativas de navegación pueden esperar indefinidamente.
   - **Resolución**: Limpiar procesos huérfanos (`kill -9 <PID>`) y eliminar `Singleton*`.
2. **Uso de Servidores MCP Alternativos**:
   - El servidor `chrome-devtools-mcp` permite interactuar directamente con la sesión activa vía CDP, realizar capturas de pantalla de alta fidelidad e inspeccionar mensajes de consola de forma instantánea.

---

### L. The Olbrite Ecosystem: Escenario Flotante 3D con Profundidad de Campo (DoF)
1. **Reemplazo del Grid Estático por Escenario 3D Cinemático**:
   - Sección `#core-solution` evolucionada de una cuadrícula de 3 columnas a un escenario interactivo tridimensional con perspectiva óptica (`perspective: 1200px`).
   - Protagonismo absoluto a las 3 soluciones de la plataforma (Agentic Development, Expert-in-the-Loop, Autonomous Business Systems) flotando limpiamente en el espacio sin pedestales ni avatares.
2. **Profundidad de Campo (Depth of Field) y Cinemática 3D Continua**:
   - En lugar de saltos instantáneos de flexbox `order`, las tarjetas se posicionan de manera absoluta en el espacio 3D interpoladas por la GPU con `cubic-bezier(0.16, 1, 0.3, 1)`:
     - **Tarjeta Central (Activa)**: `translate3d(0, 0, 75px) scale(1.02)`, `filter: blur(0px)`, `opacity: 1`, halo violeta Olbrite y `z-index: 15`.
     - **Tarjeta Izquierda**: `translate3d(-370px, 0, -90px) rotateY(18deg) scale(0.88)`, `filter: blur(2.5px)`, `opacity: 0.72`, `z-index: 8`.
     - **Tarjeta Derecha**: `translate3d(370px, 0, -90px) rotateY(-18deg) scale(0.88)`, `filter: blur(2.5px)`, `opacity: 0.72`, `z-index: 8`.
   - **Velocidad de Vuelo Calibrada (15% más lenta)**: Transición ajustada a `0.86s` (frente a los `0.75s` anteriores), ofreciendo un desplazamiento aún más pausado, elegante y natural.
   - El desenfoque óptico (`blur(2.5px)`) emula la profundidad de lente de cámara, dirigiendo la atención del usuario a la propuesta central y permitiendo ver cómo las tarjetas vuelan fluidamente hacia adelante y atrás.
3. **Ergonomía de Pantalla, Altura Compacta y Limpieza Visual**:
   - Retiro de los botones CTA de cada tarjeta para dar total protagonismo al contenido y reducir la altura a **425px** (margen negativo `-212px`), mockups a `165px` y paddings condensados.
   - Eliminación de la plataforma/pedestal circular bajo las tarjetas para lograr una estética limpia de tarjetas suspendidas en el aire.
   - El escenario completo entra holgadamente en viewports estándar (incluyendo laptops de 13" y 14") sin requerir scroll ni provocar recortes.
4. **Interactividad y Control**:
   - Carrusel con ciclo continuo y cálculo modular `((idx - currentIndex) % 3 + 3) % 3`.
   - Controles laterales circulares con glassmorphism, dots de navegación con barra de progreso activo, y clic directo en tarjetas laterales para traerlas al frente.
   - Pestaña de terminal adaptada a `flow.ts` para mantener orden y legibilidad sin desbordes.
   - Pausa automática en hover para lectura de código o métricas, y adaptación responsive limpia con desplazamiento lateral 3D en dispositivos móviles.

---


## 3. Estructura Final del Proyecto

```text
hi.olbrite.com/
├── assets/
│   ├── branding/                                        # Logos principales y favicons glass
│   ├── hero-frames/                                     # 80 cuadros HD (frame_001.jpg a frame_080.jpg)
│   ├── logos/                                           # 20 SVGs oficiales de integración (wvl.py)
│   └── videos/
│       ├── hero-video-start.mp4                         # Video 1: Secuencia de arranque/oficina
│       └── hero-video-loop-hd.mp4                       # Video 2: Loop ambient HD en pantallas holográficas
├── css/
│   └── style.css                                        # Estilos completos, glassmorphism y media queries
├── js/
│   ├── hero-controller.js                               # Controlador del canvas, rotación de frases y loop
│   └── main.js                                          # Módulo principal y listener del menú acordeón móvil
├── dist/                                                # Carpeta limpia para despliegues en producción
├── docs/
│   ├── spec.md                                          # Especificación técnica inicial
│   ├── hero-animation-spec.md                           # Especificación de animación de frames
│   └── development.md                                   # Este documento de registro y hallazgos
├── index.html                                           # Markup semántico de la landing page
└── .gitignore                                           # Exclusiones (.DS_Store, dist/, .herenow/)
```

---

## 4. Comandos de Trabajo

### Previsualización Local
```bash
python3 -m http.server 3030
# Abrir en: http://localhost:3030
```

### Sincronizar y Publicar en Producción (`hi.olbrite.com`)
```bash
# 1. Sincronizar dist
rsync -av --exclude='.git*' --exclude='.DS_Store' --exclude='dist' --exclude='docs' . dist/

# 2. Publicar en here.now sobre el slug oficial del dominio
~/.agents/skills/here-now/scripts/publish.sh dist --slug gilded-mortar-r7an --workspace olbrite --overwrite --client gemini

# 3. Guardar en GitHub
git add . && git commit -m "docs: update development notes and findings" && git push origin main
```
