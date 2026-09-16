# Especificación de Animación y Control del Hero

## 1. Comportamiento Interactivo y Secuencia Visual

El Hero combina dos activos de video con roles complementarios:

1. **Estado Inicial (Scroll = 0)**:
   - Muestra el inicio del **hero-video-start** (oficina tradicional, gestión manual y saturación).
   - Un indicador sutil invita al usuario al scroll ("Scroll to activate AI" o animación de mouse).

2. **Fase de Scroll (Scrubbing Activo - hero-video-start)**:
   - A medida que el usuario hace scroll hacia abajo a lo largo del contenedor `.hero-scroll-container` (altura fija de `200vh` con un contenedor interno `position: sticky; top: 0; height: 100vh;`):
     - El scroll progress (`0.0` a `1.0`) mapea directamente al frame correspondiente del hero-video-start.
     - En pantalla se aprecia la transformación: las luces, la indumentaria futurista y las interfaces holográficas de Olbrite cobran vida.
     - Este scrubbing es bidireccional: si el usuario sube, la animación retrocede con fluidez total a 60 fps.

3. **Fase Final del Hero (Scroll >= 1.0) -> Loop Infinito (hero-video-loop)**:
   - Al completar la transformación, el `<canvas>` realiza una transición de opacidad (fade de ~350ms) hacia el elemento `<video id="hero-loop-video">`.
   - El hero-video-loop entra en reproducción automática (`autoplay`, `loop`, `muted`, `playsinline`), mostrando a los avatares Olbrite operando las interfaces en bucle continuo.
   - Si el usuario retrocede el scroll hacia arriba, el video loop se pausa y el canvas retoma el control del frame exacto de forma instantánea.

---

## 2. Implementación Técnica: ¿Frames o Video Nativo?

### Diagnóstico de Scrubbing de Video en HTML5:
El elemento `<video>` estándar utiliza compresión inter-frame (GOP - Group of Pictures: I-frames, P-frames, B-frames). Modificar `video.currentTime` directamente en el evento de scroll suele producir **stuttering** o pequeños tirones perceptibles debido a que el decodificador del navegador debe recalcular los frames intermedios.

### La Solución Recomendada (Canvas Image Sequence):
Para una experiencia idéntica a la de dinamosites.com / Apple:
- Extraemos la secuencia de transformación (hero-video-start) en imágenes optimizadas (80 cuadros a 8fps-10fps interpolados o 120 cuadros a 12fps).
- Con compresión balanceada a resolución de 960x540 (escalada en canvas con HiDPI `dpr`), el paquete completo de frames pesa **menos de 2.5 MB** en total.
- Se cargan los primeros 5 frames inmediatamente para visualización instantánea; el resto se descarga progresivamente en segundo plano sin bloquear el renderizado ni la navegación.
- El canvas dibuja el frame correspondiente mediante `requestAnimationFrame`.

---

## 3. Estructura del DOM del Hero

```html
<section class="hero-scroll-wrapper" id="hero-experience">
  <div class="hero-sticky-stage">
    
    <!-- Canvas para scrubbing interactivo de hero-video-start -->
    <canvas id="hero-canvas" class="hero-layer hero-canvas" width="1280" height="720"></canvas>
    
    <!-- hero-video-loop para loop continuo una vez completada la transformación -->
    <video id="hero-loop-video" class="hero-layer hero-video-loop" src="assets/hero-video-loop.mp4" muted loop playsinline preload="auto"></video>
    
    <!-- Capa de contenido textual y CTAs superpuestos -->
    <div class="hero-content-overlay">
      ...
    </div>

  </div>
</section>
```

---

## 4. Medición de Rendimiento y Fallbacks
- **Dispositivos móviles / Low-power mode**: Si el dispositivo tiene aceleración gráfica limitada o prefiere reducción de movimiento (`prefers-reduced-motion: reduce`), se ofrece un botón directo de reproducción automática o se reproduce directamente el video en mp4 nativo.
