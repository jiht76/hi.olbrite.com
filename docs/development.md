# Registro de Desarrollo y Despliegue: hi.olbrite.com

## Estado Actual del Proyecto
- **Fecha**: 2026-09-16
- **Cuenta Vinculada**: `jorgeivanhernandezt@gmail.com`
- **Plataforma de Hosting**: here.now
- **Dominio Objetivo**: `hi.olbrite.com`

---

## Estructura del Repositorio

```text
hi.olbrite.com/
├── assets/
│   ├── hero-video-1.mp4      # hero-video-loop: Loop ambient activo (2.8 MB)
│   ├── hero-video-2.mp4      # hero-video-start: Transformación para scroll scrub (5.2 MB)
│   └── hero-frames/          # Secuencia de cuadros optimizados para canvas (generado)
├── docs/
│   ├── spec.md               # Especificación técnica y arquitectura
│   ├── hero-animation-spec.md# Lógica y especificación del Hero interactivo
│   └── development.md        # Registro de avance, comandos y despliegue
├── css/
│   └── style.css             # Estilos de diseño Olbrite (Glassmorphism, Neon, Paleta)
├── js/
│   ├── main.js               # Punto de entrada de la aplicación
│   └── hero-controller.js    # Manejador del Canvas scrubbing y video loop
└── index.html                # Estructura del micrositio
```

---

## Comandos Útiles

### 1. Extracción y Optimización de Frames
Para extraer los frames de hero-video-start a 12 fps con compresión optimizada:
```bash
mkdir -p assets/hero-frames
ffmpeg -i assets/hero-video-start.mp4 -vf "fps=12,scale=960:-1" -qscale:v 5 assets/hero-frames/frame_%03d.jpg
```

### 2. Previsualización Local
```bash
npx serve .
```

### 3. Publicación en here.now
```bash
# Publicación directa con el skill instalado
~/.agents/skills/here-now/scripts/publish.sh . --client gemini
```
