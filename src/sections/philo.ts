import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitWords } from '../core/split';
import { reducedMotion } from '../core/prefs';

/**
 * Signaturmoment: Das Wort »verstehen« liegt zunächst verstreut
 * über der Bühne. Beim Scrollen (Scrub, gepinnt) finden die
 * Buchstaben ihren Platz auf der Lineatur.
 */
export function initPhilo() {
  const pin = document.querySelector('[data-philo-pin]') as HTMLElement;
  const chars = document.querySelectorAll<HTMLElement>('[data-philo-word] .philo__ch');
  const caption = document.querySelector('[data-philo-caption]');
  const ruling = document.querySelectorAll('.philo__ruling span');

  if (reducedMotion) return;

  const vw = innerWidth, vh = innerHeight;
  // Deterministisch gestreut (für reproduzierbare Videoaufnahmen)
  const seeds = [
    { x: -0.34, y: -0.26, r: -58 }, { x: 0.28, y: -0.3, r: 42 }, { x: -0.12, y: 0.3, r: 70 },
    { x: 0.38, y: 0.18, r: -36 }, { x: -0.4, y: 0.1, r: 24 }, { x: 0.1, y: -0.34, r: -70 },
    { x: 0.3, y: 0.32, r: 55 }, { x: -0.24, y: -0.08, r: -28 }, { x: 0.05, y: 0.22, r: 38 },
  ];
  chars.forEach((ch, i) => {
    const s = seeds[i % seeds.length];
    gsap.set(ch, {
      x: s.x * vw * 0.8, y: s.y * vh * 0.7,
      rotation: s.r, scale: 0.8 + (i % 3) * 0.25, opacity: 0.4,
    });
  });
  gsap.set(ruling, { scaleX: 0, transformOrigin: 'left' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: '+=160%',
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
    },
  });
  tl.to(ruling, { scaleX: 1, duration: 0.5, stagger: 0.06, ease: 'none' }, 0)
    .to(chars, {
      x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
      duration: 1.6, stagger: 0.07, ease: 'power2.inOut',
    }, 0.15)
    .to(caption, { opacity: 1, y: 0, duration: 0.5 }, 1.55)
    .to({}, { duration: 0.4 });

  // Statement: Wort-für-Wort-Einfärbung beim Scrollen
  const statement = document.querySelector('[data-split-words]') as HTMLElement;
  if (statement) {
    const words = splitWords(statement);
    gsap.set(words, { opacity: 0.16 });
    gsap.to(words, {
      opacity: 1, stagger: 0.04, ease: 'none',
      scrollTrigger: {
        trigger: statement, start: 'top 78%', end: 'bottom 45%', scrub: 0.4,
      },
    });
  }

  // Prinzipien
  gsap.from('[data-principle]', {
    y: 44, opacity: 0, duration: 0.9, stagger: 0.14, ease: 'expo.out',
    scrollTrigger: { trigger: '.philo__principles', start: 'top 82%' },
  });
}
