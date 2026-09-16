import { HeroController } from './hero-controller.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Interactive Hero with auto-cinematic playback on first intent
  const hero = new HeroController({
    container: '#hero-experience',
    canvas: '#hero-canvas',
    videoLoop: '#hero-loop-video',
    promptText: '#hero-scroll-status',
    totalFrames: 80,
    framePrefix: 'assets/hero-frames/frame_',
    frameExt: '.jpg'
  });

  // Navbar glass scroll effect
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
});
