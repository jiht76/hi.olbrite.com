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
2. **Cadencia Cinematográfica**:
   - Tras varias iteraciones de prueba, la velocidad ideal para permitir una lectura pausada y apreciar la transformación del equipo a sus trajes e interfaces holográficas se calibró en **8.5 FPS** (~117.6ms por cuadro), logrando una duración de ~9.4 segundos de experiencia visual deliberada y elegante.
3. **Loop Permanente**:
   - Una vez finalizados los 80 frames, el canvas transiciona suavemente mediante opacidad hacia `assets/videos/hero-video-loop-hd.mp4` (`autoplay`, `loop`, `muted`, `playsinline`), el cual permanece activo indefinidamente incluso si el usuario vuelve a desplazarse hacia arriba (*efecto permanente*).

### B. Experiencia de Entrada ("Glass Doors" & Welcome Flow)
1. **Efecto Puerta de Vidrio (Frosted Glass Doors)**:
   - Al cargar la página, el espacio de trabajo se encuentra cubierto por dos hojas de vidrio esmerilado (`backdrop-filter: blur(28px)`) separadas por una junta luminosa vertical en el centro.
2. **Mecanismo de Activación por Touch / Click (No Scroll)**:
   - Para prevenir que el usuario haga scroll antes de cargar los cuadros o salte la cinemática, el scroll está bloqueado inicialmente (`body.hero-locked`).
   - El gatillo de entrada ahora es exclusivamente táctil o clic (en la píldora, las puertas o el canvas).
   - Una vez finalizada la transformación al loop, se desbloquea el scroll del cuerpo (`hero-unlocked`) para permitir explorar el resto de la página libremente.
3. **Detección Dinámica de Dispositivo**:
   - Dispositivos táctiles (móvil/tablet): `Welcome!... Touch to enter`.
   - Dispositivos de escritorio: `Welcome!... Click to enter`.
   - Animación de pulsación luminosa (`ready`) tan pronto como el primer cuadro está disponible en memoria.
4. **Secuencia Narrativa de Textos**:
   - **Al pulsar para entrar**: Las puertas se abren hacia los lados y el badge actualiza a: `Our Agents are Working!` seguido de `Please get in ✨`.
   - **Al llegar al Loop**:
     - El badge se ancla como tag a la izquierda arriba del título: `✨ All Agents Active!`.
     - El título principal H1 entra con el gradiente corporativo Olbrite: `What can we do for you?`.
     - Espaciado vertical ampliado generosamente (3.5rem desktop, 2.75rem móvil) hacia los botones CTA para evitar solapamientos y dar gran balance visual.
     - Rota cada 3.8 segundos por la lista de propuestas de valor y automatización.
     - Social Proof: `Over 500 agents and projects`.

### C. Optimización Móvil (Celulares y Tablets)
1. **Menú Hamburguesa Sin Bordes**:
   - Botón minimalista de 3 líneas limpias, sin bordes ni sombras que compitan con el header, animándose a "X" al abrir.
2. **Acordeón Edge-to-Edge Sin Cortes ni Espacios Vacíos**:
   - El cajón se extiende de borde a borde (`left: -1.25rem; width: calc(100% + 2.5rem)`), integrándose perfectamente con el Navbar.
   - Totalmente oculto (`max-height: 0`, `visibility: hidden`, `border: none`) al estar cerrado para eliminar líneas o espacios blancos flotantes.
   - Altura máxima y paddings calibrados para que el botón final ("Book a demo") sea 100% visible sin cortes y sin generar vacíos blancos excesivos abajo.
3. **Header Compacto**:
   - Se redujo la altura y paddings del Navbar en móvil para maximizar el área visible del video y los avatares.
4. **Píldora y Botonera Responsive**:
   - El badge de bienvenida se adapta dinámicamente con `width: 90%; max-width: 360px`, y los botones CTA se apilan verticalmente para una pulsación ergonómica.

### D. Hallazgos en el Despliegue con here.now
1. **Diferencia entre Deploy Personal y Workspace**:
   - Al publicar con `--workspace olbrite`, el sitio se asocia a la cuenta de equipo corporativa y vincula directamente las rutas de subdominio configuradas (`hi.olbrite.com` -> `gilded-mortar-r7an`).
   - Si no se especifica `--workspace`, here.now genera un sitio individual bajo la cuenta del usuario (`timber-mortar-83k8.here.now`).
2. **Uso de `--slug` y `--overwrite`**:
   - Para actualizar la versión ya vinculada a `hi.olbrite.com` sin romper el dominio ni re-subir todos los videos completos, el comando exacto es:
     ```bash
     ~/.agents/skills/here-now/scripts/publish.sh dist --slug gilded-mortar-r7an --workspace olbrite --overwrite --client gemini
     ```
   - Gracias al cálculo de hashes SHA-256 de here.now, los 85 archivos multimedia sin cambios se omiten (*skipped*) y solo se transfieren los archivos modificados (HTML, CSS, JS) en menos de 5 segundos.

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
