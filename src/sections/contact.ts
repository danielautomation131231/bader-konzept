import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from '../core/prefs';

export function initContact() {
  const chars = document.querySelectorAll('[data-contact-ch]');

  if (!reducedMotion) {
    gsap.from(chars, {
      yPercent: 115, rotation: 8, opacity: 0,
      duration: 0.9, stagger: 0.045, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact__title', start: 'top 80%' },
    });
    gsap.from(['.contact__card', '.contact__form'], {
      y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact__grid', start: 'top 82%' },
    });
  }

  // Demo-Formular: ehrliche Demo – keine Datenübermittlung
  const form = document.querySelector('[data-demo-form]') as HTMLFormElement;
  const ok = document.querySelector('[data-form-ok]') as HTMLElement;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    ok.hidden = false;
    if (!reducedMotion) gsap.from(ok, { y: 10, opacity: 0, duration: 0.5, ease: 'power3.out' });
    form.querySelectorAll('input, textarea').forEach((el) => ((el as HTMLInputElement).value = ''));
  });
}
