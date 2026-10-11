import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from '../core/prefs';

/** Hero-Einstieg nach dem Intro + sanfte Scroll-Parallaxe. */
export function initHero() {
  const lines = document.querySelectorAll('[data-hero-line]');
  const eyebrow = document.querySelector('[data-hero-eyebrow]');
  const sub = document.querySelector('[data-hero-sub]');
  const actions = document.querySelector('[data-hero-actions]');
  const note = document.querySelector('[data-hero-note]');
  const cue = document.querySelector('[data-hero-cue]');
  const swipe = document.querySelector('.hero__hl-swipe');

  if (!reducedMotion) {
    gsap.set(lines, { yPercent: 112 });
    gsap.set([eyebrow, sub, actions, note, cue], { opacity: 0, y: 22 });
    gsap.set(swipe, { scaleX: 0 });
  }

  const enter = (fast = false) => {
    if (reducedMotion) return;
    const d = fast ? 0.7 : 1;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7 * d })
      .to(lines, { yPercent: 0, duration: 1.2 * d, stagger: 0.12 }, 0.05)
      .to(swipe, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, 0.75 * d)
      .to(sub, { opacity: 1, y: 0, duration: 0.8 * d }, 0.45 * d)
      .to(actions, { opacity: 1, y: 0, duration: 0.8 * d }, 0.58 * d)
      .to(note, { opacity: 1, y: 0, duration: 0.8 * d }, 0.7 * d)
      .to(cue, { opacity: 1, y: 0, duration: 0.7 * d }, 0.8 * d);
  };

  if (!reducedMotion) {
    // Dezente Parallaxe beim Herausscrollen
    gsap.to('.hero__inner', {
      yPercent: -14, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero__ruling', {
      yPercent: 20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    ScrollTrigger.create({
      trigger: '.hero', start: 'top+=120 top',
      onEnter: () => gsap.to(cue, { opacity: 0, duration: 0.4 }),
      onLeaveBack: () => gsap.to(cue, { opacity: 1, duration: 0.4 }),
    });
  }

  return { enter };
}
