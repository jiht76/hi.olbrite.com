/**
 * Hero Stage Controller
 * Glass Door Entry Experience + Conversational Progression
 * 
 * Flow:
 * 1. Initial State:
 *    - Frosted glass doors are closed with central vertical seam.
 *    - Large central pill (shifted 20% down): "Welcome to Olbrite... Scroll to Enter"
 *    - Left text and navbar are hidden.
 * 
 * 2. On User Scroll / Touch / Intent:
 *    - Glass doors part open smoothly to both sides.
 *    - Pill updates to: "Our Agents are Working!"
 *    - After a brief pause: "Please get in ✨"
 *    - Frames sequence plays smoothly at 17 FPS.
 * 
 * 3. At Loop Arrival (HD Loop Starts):
 *    - Pill docks cleanly to the left above the title as a status tag: "✨ Active Office".
 *    - Main Title receives: "What can we do for you?" in Olbrite gradient.
 *    - Left Column texts, Social Proof, 24/7 Bottom Ribbon and Navbar reveal gracefully.
 *    - The Main Title then elegantly rotates through the conversational value statements:
 *        • "What can we do for you?"
 *        • "We can create agents for you!"
 *        • "Agents can help you answer customers!"
 *        • "Agents are great to reduce costs!"
 *        • "Maybe you need automations?"
 *        • "Automations allow agents to work at all times!"
 *        • "Agents are great at reducing cost and increasing sales!"
 *        • "You can learn more right below!"
 */

export class HeroController {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '#hero-experience');
    this.canvas = document.querySelector(options.canvas || '#hero-canvas');
    this.videoLoop = document.querySelector(options.videoLoop || '#hero-loop-video');
    this.promptText = document.querySelector(options.promptText || '#hero-scroll-status');
    this.statusPill = document.querySelector(options.statusPill || '#hero-status-pill');
    this.mediaOverlay = document.querySelector(options.mediaOverlay || '#hero-media-overlay');
    this.navbar = document.querySelector(options.navbar || '#main-nav');
    this.glassDoors = document.querySelector(options.glassDoors || '#glass-doors');
    this.titleLine = document.querySelector(options.titleLine || '#title-rotating-line');
    
    // Reveal targets
    this.revealItems = document.querySelectorAll('.hero-reveal-item');
    this.socialProof = document.querySelector('#hero-social-proof');
    this.featuresRibbon = document.querySelector('#hero-features-ribbon');

    this.totalFrames = options.totalFrames || 80;
    this.framePrefix = options.framePrefix || 'assets/hero-frames/frame_';
    this.frameExt = options.frameExt || '.jpg';
    
    this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: false }) : null;
    this.images = new Array(this.totalFrames);
    this.currentFrameIndex = 1;
    
    this.hasTriggeredAutoPlay = false;
    this.isTransformationComplete = false;
    this.isPlayingSequence = false;

    // Narrative statements loop
    this.narrativeStatements = [
      "What can we do for you?",
      "We can create agents for you!",
      "Agents can help you answer customers!",
      "Agents are great to reduce costs!",
      "Maybe you need automations?",
      "Automations allow agents to work at all times!",
      "Agents are great at reducing cost and increasing sales!",
      "You can learn more right below!"
    ];
    this.statementIndex = 0;
    this.rotationTimer = null;

    if (this.canvas && this.ctx) {
      this.init();
    }
  }

  init() {
    this.setupDimensions();
    window.addEventListener('resize', () => this.setupDimensions(), { passive: true });

    // Preload all frames immediately
    this.preloadAllFrames();

    // Attach user triggers
    this.setupTriggerListeners();

    // Render initial frame
    this.loadImage(1);
  }

  setupDimensions() {
    if (!this.canvas || !this.ctx) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const targetWidth = Math.round((rect.width || window.innerWidth) * dpr);
    const targetHeight = Math.round((rect.height || window.innerHeight) * dpr);

    this.canvas.width = targetWidth;
    this.canvas.height = targetHeight;

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    this.renderFrame(this.currentFrameIndex);
  }

  preloadAllFrames() {
    for (let i = 1; i <= this.totalFrames; i++) {
      this.loadImage(i);
    }
  }

  loadImage(index) {
    if (this.images[index - 1]) return this.images[index - 1];

    const img = new Image();
    const formatted = String(index).padStart(3, '0');
    img.src = `${this.framePrefix}${formatted}${this.frameExt}`;
    
    img.onload = () => {
      this.images[index - 1] = img;
      if (index === this.currentFrameIndex) {
        this.renderFrame(this.currentFrameIndex);
      }
    };
    return img;
  }

  setupTriggerListeners() {
    const onFirstUserIntent = (e) => {
      if (this.hasTriggeredAutoPlay) return;
      if (e.type === 'wheel' && e.deltaY <= 0) return;
      this.startCinematicTransformation();
    };

    window.addEventListener('wheel', onFirstUserIntent, { passive: true });
    window.addEventListener('touchmove', onFirstUserIntent, { passive: true });
    window.addEventListener('scroll', () => {
      if (!this.hasTriggeredAutoPlay && window.scrollY > 8) {
        this.startCinematicTransformation();
      }
    }, { passive: true });

    const playBtn = document.querySelector('#btn-play-demo');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.startCinematicTransformation();
      });
    }
  }

  startCinematicTransformation() {
    if (this.hasTriggeredAutoPlay) return;
    this.hasTriggeredAutoPlay = true;
    this.isPlayingSequence = true;

    // 1. Part open the frosted glass doors
    if (this.glassDoors) {
      this.glassDoors.classList.add('opened');
    }

    // 2. Progression: 'Our Agents are Working!' -> 'Please get in'
    if (this.statusPill) {
      this.statusPill.classList.add('animating');
    }

    if (this.promptText) {
      this.promptText.innerHTML = 'Our Agents are Working!';
    }

    setTimeout(() => {
      if (this.promptText && !this.isTransformationComplete) {
        this.promptText.innerHTML = 'Please get in ✨';
      }
    }, 3200);

    // Cadence: 8.5 FPS (~117.6ms per frame, 50% slower) for ~9.4s deliberate, cinematic transformation
    const fps = 8.5;
    const interval = 1000 / fps;
    let then = performance.now();

    const animate = (now) => {
      if (!this.isPlayingSequence) return;

      const elapsed = now - then;

      if (elapsed >= interval) {
        then = now - (elapsed % interval);
        this.currentFrameIndex++;

        if (this.currentFrameIndex <= this.totalFrames) {
          this.renderFrame(this.currentFrameIndex);
        }
      }

      if (this.currentFrameIndex < this.totalFrames) {
        requestAnimationFrame(animate);
      } else {
        this.completeTransformation();
      }
    };

    requestAnimationFrame(animate);
  }

  completeTransformation() {
    this.isPlayingSequence = false;
    this.isTransformationComplete = true;

    // 1. Activate Video Loop in HD
    if (this.videoLoop) {
      this.videoLoop.play().catch(() => {});
      this.videoLoop.classList.add('active');
    }

    // 2. Activate Media Contrast Overlay
    if (this.mediaOverlay) {
      this.mediaOverlay.classList.add('active');
    }

    // 3. Dock Center Status Pill to the left
    if (this.statusPill) {
      this.statusPill.classList.remove('animating');
      this.statusPill.classList.add('docked');
    }

    if (this.promptText) {
      this.promptText.innerHTML = '✨ All Agents Active!';
    }

    // 4. Set Main Title to: "What can we do for you?"
    if (this.titleLine) {
      this.titleLine.textContent = this.narrativeStatements[0];
    }

    // 5. Staggered reveal of Left Column items
    this.revealItems.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, 250 + (index * 150));
    });

    // 6. Reveal "Trusted by..." social proof
    setTimeout(() => {
      if (this.socialProof) {
        this.socialProof.classList.add('revealed');
      }
    }, 900);

    // 7. Slide up the bottom 24/7 feature ribbon
    setTimeout(() => {
      if (this.featuresRibbon) {
        this.featuresRibbon.classList.add('revealed');
      }
    }, 1100);

    // 8. Slide down the top Navbar
    setTimeout(() => {
      if (this.navbar) {
        this.navbar.classList.add('visible');
      }
    }, 700);

    // 9. Start subtle narrative title rotation after user reads initial title (~3.8s)
    setTimeout(() => {
      this.startTitleRotation();
    }, 3800);
  }

  startTitleRotation() {
    if (this.rotationTimer) clearInterval(this.rotationTimer);

    this.rotationTimer = setInterval(() => {
      if (!this.titleLine) return;

      // Next statement
      this.statementIndex = (this.statementIndex + 1) % this.narrativeStatements.length;
      const nextText = this.narrativeStatements[this.statementIndex];

      // Subtle, elegant cross-fade swap
      this.titleLine.classList.add('text-swap-out');

      setTimeout(() => {
        this.titleLine.textContent = nextText;
        this.titleLine.classList.remove('text-swap-out');
        this.titleLine.classList.add('text-swap-in');

        // Force reflow
        void this.titleLine.offsetWidth;

        this.titleLine.classList.remove('text-swap-in');
      }, 450);

    }, 3800); // 3.8s cadence per statement: comfortable reading speed
  }

  renderFrame(index) {
    if (!this.ctx || !this.canvas) return;
    const img = this.images[index - 1];

    if (img && img.complete && img.naturalWidth > 0) {
      const cw = this.canvas.width;
      const ch = this.canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const ox = (cw - nw) * 0.82;
      const oy = (ch - nh) * 0.5;

      this.ctx.drawImage(img, ox, oy, nw, nh);
    } else {
      this.loadImage(index);
    }
  }
}
