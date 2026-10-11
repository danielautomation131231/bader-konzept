import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './prefs';

gsap.registerPlugin(ScrollTrigger);

export let lenis: Lenis | null = null;

export function initScroll() {
  if (!reducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    // Für die Videoaufnahme steuerbar machen
    (window as any).lenis = lenis;
  }
  ScrollTrigger.defaults({ markers: false });
}

export function scrollToTarget(selector: string) {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: selector === '#start' ? 0 : -10, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}

export function bindAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('[data-scrollto]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = a.dataset.scrollto!;
      if (!document.querySelector(target)) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });
}

export function stopScroll() { lenis?.stop(); document.documentElement.classList.add('lenis-stopped'); document.body.style.overflow = 'hidden'; }
export function startScroll() { lenis?.start(); document.documentElement.classList.remove('lenis-stopped'); document.body.style.overflow = ''; }

export { gsap, ScrollTrigger };
