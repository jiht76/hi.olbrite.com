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
2. **Secuencia Narrativa de Textos**:
   - **Estado Inicial**: Badge flotante aumentado (`top: 70%`) con el mensaje: `Welcome to Olbrite... Scroll to Enter`.
   - **Al iniciar el primer scroll**: Las puertas se separan hacia los lados (`translateX(-100%)` y `translateX(100%)`) y el badge actualiza a: `Our Agents are Working!` seguido de `Please get in ✨`.
   - **Al llegar al Loop**:
     - El badge se traslada a la izquierda arriba del título: `✨ All Agents Active!`.
     - El título principal H1 entra con el gradiente corporativo Olbrite (`#2e1065` a `#754be7`) con: `What can we do for you?`.
     - Luego rota sutilmente cada 3.8 segundos por la lista de propuestas de valor y automatización.
     - Social Proof actualizado: `Over 500 agents and projects`.

### C. Optimización Móvil (Celulares y Tablets)
1. **Menú Acordeón**:
   - En pantallas menores a 900px, la navegación horizontal se transforma en un botón hamburguesa animado que despliega un cajón acordeón vertical con efecto cristal (`backdrop-filter: blur(20px)`).
2. **Header Compacto**:
   - Se redujo la altura y paddings del Navbar en móvil para maximizar el área visible del video y los avatares.
3. **Píldora y Botonera Responsive**:
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
