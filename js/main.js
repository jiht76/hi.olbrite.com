import { HeroController } from './hero-controller.js?v=3.0';

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
});
