# Análisis Técnico y Arquitectura: Avatar Asistente IA Concierge

> **Documento de Investigación y Evaluación de Alternativas**  
> **Fecha**: 17 de Septiembre, 2026  
> **Proyecto**: hi.olbrite.com  
> **Objetivo**: Evaluar la viabilidad, peso en descarga, compatibilidad cross-browser y experiencia de usuario (UX) para incorporar un personaje/avatar interactivo que entra al armarse el Hero, transiciona a un bucle de espera, acompaña al usuario en scroll en la esquina inferior y despliega la aplicación de soporte IA al hacer clic.

---

## 1. Resumen de la Idea y Flujo de Experiencia

1. **Gatillo de Activación**: Una vez completada la cinemática de apertura del Hero y establecido el bucle HD (`completeTransformation`), entra en escena un personaje interactivo.
2. **Entrada y Saludo (Intro)**: El avatar entra (desde un lateral), mira al usuario, saluda de manera empática y natural, opcionalmente desplegando un micro-callout de bienvenida (*"¡Hola! ¿Buscas automatizar tu negocio?"*).
3. **Bucle de Espera (Idle Loop)**: Finalizado el saludo, el personaje entra en un bucle continuo de espera orgánica (respiración, microgestos, mirando su móvil o al usuario).
4. **Comportamiento en Scroll (Sticky / Floating Concierge)**: Cuando el usuario desciende hacia las secciones inferiores (`#integrations`, `#core-solution`, etc.), el avatar acompaña la navegación como un widget flotante magnético en la esquina inferior izquierda (o derecha), manteniéndose llamativo pero sin obstruir el contenido.
5. **Acción al Clic**: Al pulsar sobre el personaje, se abre la aplicación/modal conversacional de Olbrite para interactuar directamente con el agente de atención al cliente con IA.

---

## 2. Evaluación de Alternativas Técnicas

### Alternativa A: Video con Fondo Verde (Chroma Key en Canvas / WebGL)
* **Mecanismo**: Se graba o renderiza el personaje sobre un fondo verde puro (`#00FF00`). Se reproduce en un `<video>` oculto y se dibuja cuadro a cuadro en un `<canvas>` mediante un shader WebGL o contexto 2D que calcula la distancia de color y descarta los píxeles verdes en tiempo real.
* **Peso estimado**: **~700 KB – 1.4 MB** (compresión estándar H.264 MP4 muy eficiente).
* **Compatibilidad**: **100% universal** (todos los navegadores en iOS, Android, macOS y Windows admiten MP4 H.264 con aceleración por hardware).
* **Ventajas**:
  - Un solo archivo de video para todas las plataformas.
  - Gran compresión y tamaño de archivo muy reducido.
* **Desventajas / Retos**:
  - *Color Spill*: El reflejo verdoso en bordes de cabello o ropa translúcida requiere algoritmos de supresión de verde (*despill shader*).
  - No admite sombras proyectadas translúcidas reales de manera nativa (solo cortes duros o semitransparencias calibradas).

---

### Alternativa B: Video con Transparencia Nativa Dual (WebM VP9 + Apple HEVC Alpha)
* **Mecanismo**: 
  - Para Chrome, Firefox, Edge y Android: **WebM con canal alfa (codec VP9)**.
  - Para Safari en iOS y macOS: **MP4 con canal alfa (codec HEVC / H.265 con metadatos de canal alfa `hvc1`)**.
  - Se implementa directamente con la etiqueta HTML5:
    ```html
    <video playsinline autoplay muted loop>
      <source src="avatar.webm" type="video/webm">
      <source src="avatar.mp4" type='video/mp4; codecs="hvc1"'>
    </video>
    ```
* **Peso estimado**: **~1.2 MB – 2.2 MB** por variante.
* **Compatibilidad**: **~98% moderno** (WebM VP9 en Chromium/Firefox y HEVC Alpha en Safari desde iOS 13 y macOS Catalina).
* **Ventajas**:
  - Calidad de bordes perfecta (píxel con canal alfa real de 8 bits).
  - Admite sombras suaves, cabello fino y efectos de vidrio translúcido sin ningún artefacto de color verde.
  - Cero consumo de CPU por procesamiento de píxeles: el motor de composición del navegador y la GPU se encargan al 100%.
* **Desventajas / Retos**:
  - Requiere generar dos exportaciones del mismo video (WebM y Apple ProRes 4444 -> HEVC with Alpha via Compressor/FFmpeg).
  - En algunos dispositivos iOS en modo de bajo consumo de batería (*Low Power Mode*), la reproducción automática de video puede requerir una estrategia de fallback.

---

### Alternativa C: Video MP4 con Máscara Alfa Integrada (Side-by-Side Alpha Matte)
* **Mecanismo**: Un solo video MP4 H.264 de doble altura (o doble ancho): la mitad superior contiene el color RGB del personaje y la mitad inferior contiene la máscara en blanco y negro (el canal alfa). Un fragment shader ultraligero en WebGL (o Canvas 2D) fusiona ambos en tiempo real (`gl_FragColor = vec4(rgb, alpha)`).
* **Peso estimado**: **~900 KB – 1.6 MB**.
* **Compatibilidad**: **100% universal** (funciona exactamente igual en cualquier iPhone, Android o PC).
* **Ventajas**:
  - Elimina por completo los problemas de borde verde del Chroma Key.
  - Canal alfa real y transparente con sombras suaves.
  - Un único archivo MP4 compatible con todos los navegadores existentes.
* **Desventajas / Retos**:
  - Requiere un pequeño script de renderizado en Canvas/WebGL (~3 KB de código JS).

---

### Alternativa D: Secuencia de Fotogramas (Canvas Frame Scrubbing)
* **Mecanismo**: Similar al sistema actual del Hero de Olbrite: exportar la secuencia de fotogramas WebP o PNG transparentes y dibujarlos en canvas.
* **Peso estimado**: **~3.5 MB – 6.0 MB** (un saludo de 4 segundos a 24 fps son ~96 fotogramas; sumado al loop de espera, supera los 150 fotogramas).
* **Compatibilidad**: **100% universal**.
* **Ventajas**: Control total cuadro por cuadro mediante JavaScript.
* **Desventajas / Retos**:
  - Demasiado pesado para animaciones continuas de varios segundos.
  - Aumenta drásticamente el consumo de memoria RAM y peticiones de red en dispositivos móviles.

---

## 3. Matriz Comparativa de Decisión

| Criterio | Opción A: Chroma Key (Verde) | Opción B: Alfa Nativo Dual | Opción C: MP4 + Alpha Matte | Opción D: Frames WebP |
| :--- | :---: | :---: | :---: | :---: |
| **Peso en Descarga** | ⭐⭐⭐⭐⭐ (~1 MB) | ⭐⭐⭐⭐ (~1.5 MB) | ⭐⭐⭐⭐⭐ (~1.2 MB) | ⭐⭐ (~4-6 MB) |
| **Compatibilidad Total** | ⭐⭐⭐⭐⭐ (100%) | ⭐⭐⭐⭐ (~98%) | ⭐⭐⭐⭐⭐ (100%) | ⭐⭐⭐⭐⭐ (100%) |
| **Calidad de Bordes / Sin Halo** | ⭐⭐⭐ (Riesgo de verde) | ⭐⭐⭐⭐⭐ (Perfecta) | ⭐⭐⭐⭐⭐ (Perfecta) | ⭐⭐⭐⭐⭐ (Perfecta) |
| **Soporte de Sombras Suaves** | ⭐⭐ (Difícil) | ⭐⭐⭐⭐⭐ (Nativo) | ⭐⭐⭐⭐⭐ (Nativo) | ⭐⭐⭐⭐⭐ (Nativo) |
| **Consumo CPU / Batería** | ⭐⭐⭐⭐ (Shader leve) | ⭐⭐⭐⭐⭐ (Cero JS) | ⭐⭐⭐⭐ (Shader leve) | ⭐⭐ (Elevado en loop) |
| **Mantenimiento y Archivos** | 1 archivo MP4 | 2 archivos (WebM + MP4) | 1 archivo MP4 | Cientos de imágenes |

---

## 4. Impacto en el Rendimiento del Sitio (Performance & Carga)

### ¿Qué tan pesada va a ser la página con este esquema?
* **Impacto en Carga Inicial (First Contentful Paint)**: **0.0 KB (Cero Impacto)**.
  - El video del avatar **NO debe precargarse al abrir la web**.
  - Durante la pantalla inicial (puertas cerradas con el botón *"Click to enter"*), los recursos de red están 100% dedicados a los cuadros del Hero.
  - La descarga del avatar se dispara **únicamente tras el clic/touch del usuario**, mientras las puertas se abren y se reproduce la secuencia del Hero (~9.4 segundos de margen).
  - En esos 9.4 segundos de cinemática, cualquier conexión 4G/5G o WiFi descarga 1.2 MB en segundo plano sin que el usuario perciba absolutamente ninguna demora.
* **Impacto en Memoria y GPU**:
  - En bucle de video, la decodificación de video H.264/WebM está optimizada por hardware en silicio (Apple Neural/Media Engine, Qualcomm Adreno, Intel QuickSync), con un consumo de CPU inferior al 2%.

---

## 5. Propuesta de Arquitectura UX e Integración con la IA

### 1. La Transición en el Hero
* En el segundo 9.4, cuando la cámara termina de entrar a la oficina y las pantallas holográficas se encienden:
  * El personaje aparece en la escena con un gesto de bienvenida.
  * Una micro-burbuja de texto (*speech bubble*) con diseño glassmorphism flota sobre el personaje:
    > *"¡Hola! Soy tu asistente de Olbrite. ¿Te gustaría ver cómo crear tu primer agente?"*

### 2. El Comportamiento en Scroll (Floating Concierge)
* Cuando el usuario hace scroll hacia abajo para leer las soluciones o el slider de logos:
  * El personaje no desaparece abruptamente: hace una transición suave hacia la **esquina inferior izquierda (o derecha)** de la pantalla (`position: fixed; bottom: 1.5rem; left: 1.5rem; z-index: 999;`).
  * En modo flotante adopta un tamaño compacto y ergonómico (aprox. 120px de ancho en escritorio, 90px en móvil), luciendo vivo con su bucle continuo de espera.
  * Se acompaña de un badge sutil pulsante: `💬 Hablar con el Agente`.

### 3. Apertura de la Aplicación de Servicio al Cliente
* Al hacer clic sobre el avatar flotante:
  * El avatar realiza una micro-reacción (sonrisa o gesto de atención).
  * Se despliega un panel flotante / modal tipo drawer con la interfaz interactiva de Olbrite AI:
    - **Chat en vivo multicanal simulado** con respuestas en tiempo real.
    - Opciones rápidas de un clic: *"Quiero automatizar WhatsApp"*, *"Quiero integrar mi CRM"*, *"Agendar una llamada demo"*.
    - Botón de cierre discreto para devolver al personaje a su estado flotante.

---

## 6. Conclusión y Recomendación

1. **Recomendación Técnica Principal**:
   - **Opción B (Video con Alfa Nativo WebM + HEVC)** es la más limpia y moderna si contamos con exportación con canal alfa directo desde After Effects / Premiere / Blender. No deja rastro de bordes verdes y corre con aceleración nativa pura del navegador.
   - **Opción C (MP4 con Side-by-Side Alpha Matte)** es la mejor alternativa si se busca un único archivo MP4 100% infalible en cualquier navegador sin depender de los códecs de Apple.
   - **Desaconsejamos la Opción D (Frames PNG/WebP)** debido a que mantener un loop continuo con decenas de imágenes cargadas en memoria RAM causaría ralentizaciones en teléfonos móviles.

2. **Garantía de Rendimiento**:
   - Con la estrategia de **carga diferida (deferred post-click)**, el peso añadido no degradará en absoluto la velocidad de carga ni la fluidez de la animación actual del Hero.
