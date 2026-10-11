import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion, isMobileLayout } from '../core/prefs';

/**
 * »Tafel«-Sektion: horizontale Scroll-Story durch die vier Schritte
 * der Zusammenarbeit. Gepinnt, Kreidepfad zeichnet sich mit.
 * Auf Mobilgeräten: vertikale Liste mit Einblendungen.
 */
export function initFlow() {
  const pin = document.querySelector('[data-flow-pin]') as HTMLElement;
  const track = document.querySelector('[data-flow-track]') as HTMLElement;
  const path = document.querySelector('[data-flow-path]') as SVGPathElement;
  const steps = document.querySelectorAll('[data-flow-step]');
  const facts = document.querySelector('[data-flow-facts]');
  const section = document.querySelector('.flow') as HTMLElement;

  // Theme-Umschaltung der Navigation auf dunklen Sektionen
  const themeWatch = (el: HTMLElement, theme: string) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 60px',
      end: 'bottom 60px',
      onToggle: (self) => {
        document.body.dataset.theme = self.isActive ? theme : 'paper';
      },
    });
  };
  themeWatch(section, 'tafel');
  themeWatch(document.querySelector('.contact') as HTMLElement, 'nacht');

  if (reducedMotion) return;

  if (isMobileLayout()) {
    gsap.from(steps, {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'expo.out',
      scrollTrigger: { trigger: track, start: 'top 80%' },
    });
    return;
  }

  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: `${len}`, strokeDashoffset: len, attr: { 'stroke-dasharray': '1 14' } });
  // Kreide-Look: dasharray 1/14 fürs Punktmuster, Offset-Animation über pathLength
  path.style.strokeDasharray = '1 14';

  const getDistance = () => Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track.parentElement!).paddingLeft || '0') * 1);

  gsap.set(steps, { opacity: 0.25, y: 30 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => `+=${getDistance() + innerHeight * 0.4}`,
      scrub: 0.7,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  tl.to(track, { x: () => -getDistance(), ease: 'none', duration: 4 }, 0);
  steps.forEach((step, i) => {
    tl.to(step, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, i * 0.82);
  });
  tl.from(facts, { opacity: 0, duration: 0.6 }, 3.2);
}
