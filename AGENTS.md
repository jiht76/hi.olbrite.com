# AGENTS.md — Guía para Agentes y Desarrolladores: hi.olbrite.com

> **Documento de Contexto y Consistencia para Agentes de IA y Colaboradores**  
> **Proyecto**: `hi.olbrite.com` (Repositorio: [jiht76/hi.olbrite.com](https://github.com/jiht76/hi.olbrite.com))  
> **Hosting Oficial**: [https://hi.olbrite.com](https://hi.olbrite.com) (`here.now` slug: `gilded-mortar-r7an`, workspace: `olbrite`)  
> **Última actualización**: 23 de Septiembre, 2026  

---

## 1. Visión y Propósito del Proyecto

**Olbrite** es una plataforma de agentes inteligentes con IA, automatización y CRM conversacional diseñada para convertir conversaciones en crecimiento (WhatsApp, Instagram, Messenger, SMS, etc.).

Este repositorio contiene la **landing page oficial de presentación**. El objetivo primordial es lograr un **efecto WOW inmediato** mediante una experiencia web premium, futurista y de altísima fidelidad visual inspirada en interfaces 3D de última generación, pero implementada con una **arquitectura 100% Vanilla Web ultra ligera y de máximo rendimiento**.

---

## 2. Reglas de Oro y Principios de Desarrollo

Cualquier agente que trabaje en este proyecto **DEBE** respetar estrictamente las siguientes directrices:

1. **Vanilla Web Estricto (Sin frameworks inflados)**:
   - **HTML**: Semántico, limpio y estructurado (`index.html`).
   - **CSS**: Vanilla CSS con variables (`css/style.css`). **NO** introducir TailwindCSS, Bootstrap ni preprocesadores que requieran bundlers complejos salvo solicitud explícita del usuario.
   - **JS**: Vanilla JavaScript con ES Modules nativos (`js/main.js`, `js/hero-controller.js`).
2. **Cero Dependencias Pesadas en Runtime**:
   - La página debe cargar en menos de 1 segundo en conexiones estándar.
   - Sin React, Vue, jQuery ni bundlers (Webpack, Vite) en el flujo principal.
3. **Mantenimiento de Cache-Busters**:
   - Cada vez que se realicen modificaciones significativas en CSS o JS, actualizar los parámetros de versión en `index.html` y en las importaciones de módulos:
     - `css/style.css?v=X.X`
     - `js/main.js?v=X.X`
     - `import { HeroController } from './hero-controller.js?v=X.X';`
4. **Preservación de Documentación y Comentarios**:
   - No eliminar comentarios explicativos, anotaciones de diseño ni decisiones arquitectónicas en el código.
5. **Modo Auxiliar para Pruebas (`?intro=off`)**:
   - Siempre que se desarrollen o prueben nuevas secciones, utilizar el parámetro `?intro=off` en la URL local para evitar esperar la cinemática de entrada.

---

## 3. Mapa de Arquitectura y Componentes Clave

```text
hi.olbrite.com/
├── assets/
│   ├── branding/         # Logos de marca e isotipos transparentes en múltiples resoluciones
│   ├── hero-frames/      # 80 cuadros HD (frame_001.jpg a frame_080.jpg) para la cinemática inicial
│   ├── logos/            # 20 SVGs vectoriales oficiales descargados desde WorldVectorLogo
│   └── videos/
│       ├── hero-video-start.mp4       # Video de referencia de arranque
│       ├── hero-video-loop-hd.mp4     # Loop continuo HD del Hero (estado activo)
│       └── mindy-avatar-welcome.webm  # Video con canal alfa del avatar Mindy
├── css/
│   └── style.css         # Tokens de diseño, glassmorphism, responsive y animaciones
├── js/
│   ├── hero-controller.js# Controlador de puertas de vidrio, canvas, loop y avatar
│   └── main.js           # Punto de entrada, menú móvil y explorer "¿Qué es un agente?"
├── docs/                 # Especificaciones técnicas y bitácora histórica detallada
├── dist/                 # Carpeta limpia para sincronización y publicación con here.now
├── index.html            # Estructura semántica principal
├── README.md             # Documentación general para GitHub
└── AGENTS.md             # Esta guía de consistencia técnica para agentes
```

---

## 4. Funcionamiento de los Módulos Principales

### A. Hero Interactivo (`HeroController` en `js/hero-controller.js`)

El Hero cuenta con dos estados principales:

1. **Estado Inicial (Cerrado)**:
   - `body.hero-locked`: Scroll bloqueado inicialmente.
   - `#glass-doors`: Dos hojas de vidrio esmerilado (`.glass-door-left`, `.glass-door-right`) con grabado del logo a 50% de opacidad.
   - `#hero-status-pill`: Botón flotante centrado: `"Welcome!... Click to enter"` (o `"Touch to enter"` en móviles).
   - `#hero-canvas`: Muestra el cuadro 1 en espera.
   - Navbar y elementos de texto ocultos.

2. **Transición y Estado Activo (Cinemática a 8.5 FPS)**:
   - Al hacer clic o tocar: Las puertas se abren hacia los laterales (`translateX(-100%)` / `translateX(100%)`).
   - La píldora cambia de texto: `"Our Agents are Working!"` → `"Please get in ✨"`.
   - El canvas reproduce los 80 fotogramas a una cadencia cinematográfica de 8.5 FPS (~9.4 segundos).
   - Al llegar al cuadro 80 (`completeTransformation`):
     - El scroll se desbloquea (`body.hero-unlocked`).
     - `#hero-loop-video` se activa y reproduce en bucle infinito en HD.
     - La píldora se ancla a la izquierda como tag: `"✨ All Agents Active!"`.
     - El título principal comienza a rotar suavemente entre 8 propuestas de valor cada 3.8s.
     - Aparece el avatar concierge **Mindy**.

3. **Modo Auxiliar de Pruebas (`?intro=off`)**:
   - Detectado tanto en `<head>` de `index.html` (vía clase `html.intro-off`) como en `hero-controller.js` (`this.skipIntro`).
   - Desbloquea el scroll de inmediato, oculta las puertas de vidrio, ancla la píldora, activa el loop de video y salta la descarga pesada de los 80 fotogramas (cargando solo el frame 80 como respaldo).

---

### B. Avatar Concierge Mindy & Widget de Chat

1. **Aparición y Audio**:
   - El contenedor `#mindy-avatar-container` muestra el video transparente `mindy-avatar-welcome.webm`.
   - Se reproduce con volumen `1.0` (cuyo permiso de audio se desbloquea en el gesto inicial del usuario).
   - Incluye botón flotante de control de sonido (silenciar / reactivar).
   - Despliega un globo de diálogo con estética glassmorphism: *"¡Hola! Soy Mindy..."*.
2. **Salida y Transición al Chat**:
   - Tras terminar el video (~8s), ejecuta una animación fluida haciéndose pequeña hacia la esquina inferior derecha y desvaneciéndose (`.exit`).
   - Al desaparecer, inyecta automáticamente el script oficial de **LeadConnector Chat Widget** (`https://widgets.leadconnectorhq.com/loader.js`, widget ID: `6aac49d1204f7932178f3c0e`).

---

### C. Explorador de Arquitectura "¿Qué es un Agente?" (`#what-is-an-agent`)

- Controlador en `js/main.js` (`initAgentExplainer`).
- Explica los 5 pilares fundamentales de un agente de IA:
  1. **Model** (🧠 Reasoning Engine)
  2. **Skills** (📚 Specialized Abilities)
  3. **Tools** (🛠️ Apps, Data & Systems)
  4. **Harness** (🛡️ Rules & Safeguards)
  5. **Loops** (🔄 Continuous Iteration)
- Cuenta con píldoras interactivas, hotspots sobre el escritorio 3D y un carrusel que rota suavemente cada 4.8s hasta que el usuario interactúa manualmente.

---

### D. Sección de Credibilidad y Pilares ("Why Choose Olbrite") (`#why-choose`)

- Destaca las ventajas competitivas: *Enterprise Grade Security*, *Frictionless Integration*, *24/7 Autonomy*, *Measurable ROI*.
- Estructura en cuadrícula con micro-animaciones en hover y badges de contraste.

---

### E. Carrusel Bidireccional de Integraciones (`#integrations-marquee`)

- 20 logotipos oficiales vectoriales descargados desde **WorldVectorLogo**:
  - OpenAI, Anthropic, Gemini, DeepSeek, WhatsApp, Telegram, Slack, Meta, Instagram, Facebook, TikTok, WordPress, Shopify, HubSpot, Jira, Twilio, Google Calendar, Gmail, Google Drive, Calendly.
- Dos rieles animados con `translate3d` (uno hacia la derecha y otro hacia la izquierda) con máscara de gradiente CSS en los extremos y pausa al pasar el cursor (`:hover`).

---

## 5. Tokens de Diseño del Sistema (Design Tokens)

Definidos en `:root` dentro de `css/style.css`:

```css
:root {
  --primary: #754be7;           /* Violeta Olbrite principal */
  --primary-glow: #9d7df8;      /* Púrpura brillante para resplandores */
  --primary-dark: #581c87;      /* Púrpura profundo para contrastes */
  --secondary: #ec4899;        /* Acento rosa/magenta */
  --bg-page: #f9faff;           /* Fondo ultra limpio */
  --bg-card: rgba(255, 255, 255, 0.7); /* Base para glassmorphism */
  --text-main: #0f172a;         /* Texto principal de alto contraste */
  --text-muted: #64748b;        /* Texto secundario */
  --border-glass: rgba(117, 75, 231, 0.14); /* Borde sutil de vidrio */
  --shadow-glass: 0 16px 40px rgba(117, 75, 231, 0.08);
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1); /* Curva suave y elástica */
}
```

---

## 6. Flujo de Trabajo Local y Comandos Útiles

### Servidor Local
Para previsualizar y desarrollar localmente:
```bash
python3 -m http.server 3030
```
- **Modo Normal**: `http://localhost:3030/`
- **Modo Inspección / Pruebas**: `http://localhost:3030/?intro=off`

### Despliegue en Producción (`here.now`)
El sitio está enlazado a [hi.olbrite.com](https://hi.olbrite.com). Para publicar cambios:
```bash
# 1. Sincronizar archivos limpios en dist/
rsync -av --exclude='.git*' --exclude='.DS_Store' --exclude='dist' --exclude='docs' . dist/

# 2. Desplegar al slug oficial sobre el workspace corporativo
~/.agents/skills/here-now/scripts/publish.sh dist --slug gilded-mortar-r7an --workspace olbrite --overwrite --client gemini
```

---

## 7. Diagnóstico de Herramientas y Navegador (Browser Automation)

- **Puerto 9222 (Chrome DevTools Protocol)**:  
  Si un subagente del navegador reporta `open_browser_url: action timed out`, verificar si existe una instancia huérfana de Chrome escuchando en el puerto 9222 mediante:
  ```bash
  lsof -i :9222
  ```
  Para desbloquear:
  ```bash
  pkill -f "antigravity-browser-profile"
  rm -f ~/.gemini/antigravity-browser-profile/Singleton*
  ```
- **Herramienta Alternativa Directa**:  
  El servidor MCP `chrome-devtools-mcp` (configurado en `~/.gemini/config/mcp_config.json`) permite navegar, inspeccionar consola y tomar capturas de pantalla de manera inmediata y estable sin depender del subagente nativo.

---

## 8. Checklist para Nuevas Funcionalidades

Antes de dar por completado un cambio o pasar la posta a otro agente:
- [ ] ¿Se preservaron los principios de Vanilla Web sin añadir dependencias pesadas?
- [ ] ¿Se verificó la versión de cache-busting (`?v=...`) en `index.html` y en `main.js`?
- [ ] ¿Funciona fluidamente tanto en escritorio como en responsive móvil?
- [ ] ¿Se probó la navegación tanto con `?intro=off` como en el flujo completo con la cinemática?
- [ ] ¿Se mantuvieron actualizadas la bitácora en `docs/development.md` y las instrucciones en este archivo `AGENTS.md`?
