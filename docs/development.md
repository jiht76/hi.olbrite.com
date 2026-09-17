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

### C. Eliminación de Demora en Scroll Down
1. **Contenedor 100vh**:
   - Inicialmente, `.hero-scroll-container` requería `240vh` para el scrubbing manual por scroll. Con el modelo cinemático por touch/clic, dicha altura generaba una demora de 140vh de scroll muerto antes de que el hero se desplazara hacia arriba.
   - Se ajustó `.hero-scroll-container` y `.hero-scroll-container.unlocked` a `height: 100vh; min-height: 100vh;`.
   - Al estar desbloqueado el hero, cualquier desplazamiento del usuario hace avanzar inmediatamente la página hacia la sección `#core-solution` con fluidez instantánea.

### D. Favicon e Identidad de Marca Glass
1. **Favicon Isotipo Glass Transparente**:
   - Se generaron versiones de alta definición del isotipo translúcido (`assets/branding/favicon-glass.png`, `favicon-glass-32.png`, `favicon-glass-48.png`, `apple-touch-icon-glass.png`, etc.) a partir de `assets/isotipo-glass-transparent.png`.
   - Configurado en `<head>` con múltiples resoluciones (32x32, 48x48, 64x64) y Apple Touch Icon (180x180), además de los fallbacks de raíz `favicon.ico` y `favicon.png`.

### E. Optimización Móvil y Jerarquía Vertical
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

### F. Hallazgos en el Despliegue con here.now
1. **Diferencia entre Deploy Personal y Workspace**:
   - Al publicar con `--workspace olbrite`, el sitio se asocia a la cuenta corporativa y vincula directamente las rutas del subdominio configurado (`hi.olbrite.com` -> `gilded-mortar-r7an`).
2. **Uso de `--slug` y `--overwrite`**:
   - Para actualizar la versión ya vinculada a `hi.olbrite.com` sin romper el dominio ni re-subir todos los videos completos:
     ```bash
     ~/.agents/skills/here-now/scripts/publish.sh dist --slug gilded-mortar-r7an --workspace olbrite --overwrite --client gemini
     ```
   - Solo se transfieren archivos modificados (HTML, CSS, JS) en menos de 5 segundos gracias a las sumas SHA-256 de here.now.

---

## 3. Estructura Final del Proyecto

```text
hi.olbrite.com/
├── assets/
│   ├── branding/
│   │   ├── olbrite-logo-horizontal-white-background.png  # Logo original HD
│   │   └── olbrite-logo-transparent.png                 # Logo vectorizado con transparencia
│   ├── hero-frames/                                     # 80 cuadros HD (frame_001.jpg a frame_080.jpg)
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
