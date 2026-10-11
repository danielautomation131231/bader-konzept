import gsap from 'gsap';
import { reducedMotion } from './core/prefs';

/**
 * Intro »Ein neues Heft«:
 * Lineatur zeichnet sich, verstreute Buchstaben setzen sich zum Wort
 * »Lernen« auf die Linie, ein Textmarker streicht es an,
 * dann öffnet sich die Seite nach oben zur Hero-Sektion.
 */
export function runIntro(onDone: (skipped: boolean) => void) {
  const intro = document.getElementById('intro')!;
  const lines = intro.querySelectorAll<HTMLElement>('[data-iline]');
  const word = intro.querySelector('[data-intro-word]') as HTMLElement;
  const chars = word.querySelectorAll<HTMLElement>('.intro__ch');
  const marker = intro.querySelector('[data-intro-marker]') as HTMLElement;
  const sub = intro.querySelector('[data-intro-sub]') as HTMLElement;
  const skipBtn = intro.querySelector('[data-intro-skip]') as HTMLButtonElement;

  const finish = (skipped: boolean) => {
    intro.classList.add('intro--done');
    try { sessionStorage.setItem('introSeen', '1'); } catch { /* egal */ }
    onDone(skipped);
  };

  let seen = false;
  try { seen = sessionStorage.getItem('introSeen') === '1'; } catch { /* egal */ }

  if (reducedMotion || seen) {
    document.body.classList.toggle('reduced-motion', reducedMotion);
    finish(true);
    return;
  }

  // Marker hinter dem Wort positionieren
  const place = () => {
    const r = word.getBoundingClientRect();
    const ir = intro.getBoundingClientRect();
    gsap.set(marker, {
      left: r.left - ir.left - r.width * 0.04,
      top: r.top - ir.top + r.height * 0.34,
      width: r.width * 1.08,
    });
  };
  place();

  const vw = innerWidth, vh = innerHeight;
  gsap.set(chars, {
    x: () => gsap.utils.random(-vw * 0.38, vw * 0.38),
    y: () => gsap.utils.random(-vh * 0.34, vh * 0.34),
    rotation: () => gsap.utils.random(-75, 75),
    scale: () => gsap.utils.random(0.5, 1.5),
    opacity: 0,
  });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to(lines, { scaleX: 1, duration: 0.8, stagger: 0.09, ease: 'power3.inOut' })
    .to(chars, { opacity: 1, duration: 0.3, stagger: 0.05 }, 0.35)
    .to(chars, {
      x: 0, y: 0, rotation: 0, scale: 1,
      duration: 1.15, stagger: 0.055, ease: 'expo.inOut',
    }, 0.45)
    .add(place, '>-0.05')
    .to(marker, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '>-0.1')
    .to(sub, { opacity: 1, y: 0, duration: 0.6 }, '<0.15')
    .to({}, { duration: 0.55 })
    .to([word, marker, sub], { y: -26, opacity: 0.9, duration: 0.8, ease: 'power3.in' }, 'exit')
    .to(intro, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.95,
      ease: 'power4.inOut',
      onComplete: () => finish(false),
    }, 'exit+=0.12');

  gsap.set(intro, { clipPath: 'inset(0% 0% 0% 0%)' });

  skipBtn.addEventListener('click', () => {
    tl.kill();
    gsap.to(intro, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => finish(true),
    });
  }, { once: true });
}
