import { HeroController } from './hero-controller.js?v=3.3';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Interactive Hero Stage
  const hero = new HeroController({
    container: '#hero-experience',
    canvas: '#hero-canvas',
    videoLoop: '#hero-loop-video',
    promptText: '#hero-scroll-status',
    totalFrames: 80,
    framePrefix: 'assets/hero-frames/frame_',
    frameExt: '.jpg'
  });

  // 2. Navbar glass scroll effect
  const navbar = document.querySelector('.navbar');
  const handleNavScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // 3. Mobile Accordion Menu Toggle
  const toggleBtn = document.querySelector('#mobile-menu-toggle');
  const menuWrapper = document.querySelector('#nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-link-item');

  if (toggleBtn && menuWrapper) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = menuWrapper.classList.toggle('accordion-open');
      toggleBtn.classList.toggle('open', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close accordion when clicking on any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuWrapper.classList.remove('accordion-open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Interactive "What is an Agent?" Architecture Explorer
  const initAgentExplainer = () => {
    const compData = {
      model: {
        badge: '🧠 THE REASONING ENGINE',
        title: 'Model',
        text: "The brain that reasons and decides. Unlike static chatbots that follow rigid scripts, an agent's model evaluates nuances, maintains memory across conversations, and dynamically chooses the right path of action.",
        tags: ['Context Window', 'Strategic Planning', 'Adaptive Thinking']
      },
      skills: {
        badge: '📚 SPECIALIZED ABILITIES',
        title: 'Skills',
        text: 'Modular domain competencies trained for real business work: automated lead qualification, research & market analysis, bespoke content drafting, financial calculations, and calendar scheduling.',
        tags: ['Research & Analysis', 'Content Creation', 'Data Analysis', 'Planning & Comms']
      },
      tools: {
        badge: '🛠️ APPS, DATA & SYSTEMS',
        title: 'Tools',
        text: 'Direct two-way API integrations with your everyday workspace apps (WhatsApp, Slack, Notion, Google Workspace, HubSpot, Salesforce) and private databases to take real action autonomously.',
        tags: ['Native APIs', 'CRM Sync', 'Database Read/Write', 'Omnichannel Dispatch']
      },
      harness: {
        badge: '🛡️ RULES & SAFEGUARDS',
        title: 'Harness',
        text: 'Strict security boundaries, brand guidelines, and operational bounds. Ensures data confidentiality, compliance with industry regulations, and seamless human-in-the-loop escalation whenever sensitive cases arise.',
        tags: ['Permission Scopes', 'Brand Policies', 'Safety Filters', 'Human Escalation']
      },
      loops: {
        badge: '🔄 CONTINUOUS ITERATION',
        title: 'Loops',
        text: 'Plans, acts, evaluates output, learns from results, and repeats until the objective is accomplished. An agent does not stop at giving an answer—it executes complete workflows to the finish line.',
        tags: ['Plan -> Act -> Learn', 'Self-Correction', 'Iterative Execution', 'Goal Fulfillment']
      }
    };

    const pills = document.querySelectorAll('.comp-pill');
    const hotspots = document.querySelectorAll('.stage-hotspot');
    const cardBadge = document.querySelector('#active-card-badge');
    const cardTitle = document.querySelector('#active-card-title');
    const cardText = document.querySelector('#active-card-text');
    const cardTags = document.querySelector('#active-card-tags');

    const compKeys = Object.keys(compData);
    let currentIdx = 0;
    let userInteracted = false;
    let autoCycleTimer = null;

    const setActiveComponent = (compId) => {
      const data = compData[compId];
      if (!data) return;

      // Update pills
      pills.forEach(p => p.classList.toggle('active', p.dataset.target === compId));

      // Update hotspots
      hotspots.forEach(h => h.classList.toggle('active', h.dataset.component === compId));

      // Animate card update
      if (cardBadge && cardTitle && cardText && cardTags) {
        cardBadge.textContent = data.badge;
        cardTitle.textContent = data.title;
        cardText.textContent = data.text;
        cardTags.innerHTML = data.tags.map(t => `<span class="card-micro-tag">${t}</span>`).join('');
      }
    };

    // Pill click listeners
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        userInteracted = true;
        setActiveComponent(pill.dataset.target);
      });
    });

    // Hotspot hover/click listeners
    hotspots.forEach(hotspot => {
      hotspot.addEventListener('mouseenter', () => {
        userInteracted = true;
        setActiveComponent(hotspot.dataset.component);
      });
      hotspot.addEventListener('click', () => {
        userInteracted = true;
        setActiveComponent(hotspot.dataset.component);
      });
    });

    // Auto-cycle through components gently every 4.8 seconds until user interacts
    const startAutoCycle = () => {
      autoCycleTimer = setInterval(() => {
        if (userInteracted) {
          if (autoCycleTimer) clearInterval(autoCycleTimer);
          return;
        }
        currentIdx = (currentIdx + 1) % compKeys.length;
        setActiveComponent(compKeys[currentIdx]);
      }, 4800);
    };

    const container = document.querySelector('#what-is-an-agent');
    if (container) {
      container.addEventListener('mouseenter', () => { userInteracted = true; }, { once: true });
      container.addEventListener('touchstart', () => { userInteracted = true; }, { once: true, passive: true });
    }

    startAutoCycle();
  };

  initAgentExplainer();

  // 5. Interactive "The Olbrite Ecosystem" 3D Stage & Carousel
  const initEcosystemStage = () => {
    const stageWrapper = document.querySelector('#ecosystem-stage-wrapper');
    const cardsTrack = document.querySelector('#ecosystem-cards-track');
    const cards = Array.from(document.querySelectorAll('.ecosystem-card'));
    const dots = Array.from(document.querySelectorAll('.ecosystem-dot'));
    const prevBtn = document.querySelector('#ecosystem-prev-btn');
    const nextBtn = document.querySelector('#ecosystem-next-btn');

    if (!stageWrapper || !cardsTrack || cards.length === 0) return;

    let currentIndex = 1; // Default to Center card: Olbrite Development (index 1)

    const updateStage = (newIndex) => {
      currentIndex = (newIndex + cards.length) % cards.length;

      // Update dots
      dots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });

      const isMobile = window.innerWidth <= 992;

      cards.forEach((card, idx) => {
        const rel = ((idx - currentIndex) % 3 + 3) % 3;

        // Clear any inline styles so GPU transitions & :hover apply cleanly
        card.style.order = '';
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderColor = '';
        card.style.zIndex = '';
        card.style.opacity = '';

        if (rel === 0) {
          // Center stage active card (in focus, sharp, prominent)
          card.dataset.position = 'center';
          card.classList.add('center-card');
        } else if (rel === 1) {
          // Right background card (tilted, distant, blurred)
          card.dataset.position = 'right';
          card.classList.remove('center-card');
        } else {
          // Left background card (tilted, distant, blurred)
          card.dataset.position = 'left';
          card.classList.remove('center-card');
        }
      });
    };

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateStage(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateStage(currentIndex + 1));
    }

    // Dot indicators
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIdx = parseInt(dot.dataset.index, 10);
        if (!isNaN(targetIdx)) {
          updateStage(targetIdx);
        }
      });
    });

    // Clicking any side card brings it to center stage
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (currentIndex !== idx) {
          updateStage(idx);
        }
      });
    });

    // Interactive Code Terminal Tabs in Card 2
    const codeTabs = document.querySelectorAll('.term-tab');
    const codeSnippets = document.querySelectorAll('.code-snippet');
    codeTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        const tabKey = tab.dataset.tab;
        codeTabs.forEach(t => t.classList.toggle('active', t === tab));
        codeSnippets.forEach(snip => {
          snip.classList.toggle('active', snip.id === `code-${tabKey}`);
        });
      });
    });

    // 3D Mousemove Parallax Tilt
    let mouseX = 0, mouseY = 0;
    let currentTiltX = 0, currentTiltY = 0;
    let rafId = null;

    const animateTilt = () => {
      currentTiltX += (mouseY - currentTiltX) * 0.08;
      currentTiltY += (mouseX - currentTiltY) * 0.08;

      if (cardsTrack && window.innerWidth > 992) {
        cardsTrack.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
      }

      if (Math.abs(mouseY - currentTiltX) > 0.04 || Math.abs(mouseX - currentTiltY) > 0.04) {
        rafId = requestAnimationFrame(animateTilt);
      } else {
        rafId = null;
      }
    };

    stageWrapper.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 992) return;
      const rect = stageWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 8;  // max 4 deg
      mouseY = -y * 6; // max 3 deg
      if (!rafId) rafId = requestAnimationFrame(animateTilt);
    }, { passive: true });

    stageWrapper.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
      if (!rafId) rafId = requestAnimationFrame(animateTilt);
    }, { passive: true });

    // Touch Swipe gestures on mobile
    let touchStartX = 0;
    let touchEndX = 0;
    stageWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stageWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchStartX - touchEndX;
      if (diffX > 45) {
        updateStage(currentIndex + 1); // Swipe left -> next
      } else if (diffX < -45) {
        updateStage(currentIndex - 1); // Swipe right -> prev
      }
    }, { passive: true });

    // Handle resize
    window.addEventListener('resize', () => {
      updateStage(currentIndex);
    }, { passive: true });

    // Initialize initial state
    updateStage(currentIndex);
  };

  initEcosystemStage();
});
