import gsap from 'gsap';
import { finePointer, reducedMotion } from './prefs';

/** Magnetische Elemente: folgen dem Cursor sanft innerhalb ihres Umfelds. */
export function initMagnetic() {
  if (!finePointer || reducedMotion) return;

  const bind = (el: HTMLElement) => {
    if ((el as any).__magBound) return;
    (el as any).__magBound = true;
    const strength = 0.32;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  };

  const scan = () => document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(bind);
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
}
