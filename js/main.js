import { HeroController } from './hero-controller.js?v=2.6';

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
});
