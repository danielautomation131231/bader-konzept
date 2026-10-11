import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitLines } from '../core/split';
import { reducedMotion } from '../core/prefs';

export function initPerson() {
  const name = document.querySelector('.person__name') as HTMLElement;
  if (name && !reducedMotion) {
    const inners = splitLines(name);
    gsap.from(inners, {
      yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'expo.out',
      scrollTrigger: { trigger: name, start: 'top 82%' },
    });
  }
  if (!reducedMotion) {
    gsap.from('[data-fact]', {
      y: 36, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-person-facts]', start: 'top 80%' },
    });
    gsap.from('[data-person-mono]', {
      scale: 0.9, opacity: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-person-mono]', start: 'top 85%' },
    });
  }

  // Titel der Förderbereiche (split lines)
  const svcTitle = document.querySelector('.svc__title') as HTMLElement;
  if (svcTitle && !reducedMotion) {
    const inners = splitLines(svcTitle);
    gsap.from(inners, {
      yPercent: 110, duration: 1, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: svcTitle, start: 'top 85%' },
    });
  }
}
