import gsap from 'gsap';
import { stopScroll, startScroll } from '../core/scroll';
import { reducedMotion } from '../core/prefs';

export function initNav() {
  const nav = document.querySelector('[data-nav]') as HTMLElement;
  const burger = document.querySelector('[data-burger]') as HTMLButtonElement;
  const mmenu = document.querySelector('[data-mmenu]') as HTMLElement;
  const mlinks = mmenu.querySelectorAll('[data-mmenu-link]');

  // Ein-/Ausblenden bei Scrollrichtung + Hintergrund ab Scrollposition
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('nav--scrolled', y > 40);
    if (y > 300 && y > lastY + 6 && !menuOpen) nav.classList.add('nav--hidden');
    else if (y < lastY - 6 || y < 300) nav.classList.remove('nav--hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });

  let menuOpen = false;
  const setOpen = (open: boolean) => {
    menuOpen = open;
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    mmenu.setAttribute('aria-hidden', String(!open));
    if (reducedMotion) {
      mmenu.style.visibility = open ? 'visible' : 'hidden';
      mmenu.style.clipPath = open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)';
      open ? stopScroll() : startScroll();
      return;
    }
    if (open) {
      stopScroll();
      gsap.set(mmenu, { visibility: 'visible' });
      gsap.timeline()
        .to(mmenu, { clipPath: 'inset(0% 0 0% 0)', duration: 0.65, ease: 'power4.inOut' })
        .from(mlinks, { y: 46, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'expo.out' }, '-=0.2')
        .from('.mmenu__foot', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3');
    } else {
      startScroll();
      gsap.to(mmenu, {
        clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'power3.inOut',
        onComplete: () => gsap.set(mmenu, { visibility: 'hidden' }),
      });
    }
  };

  burger.addEventListener('click', () => setOpen(!menuOpen));
  mlinks.forEach((a) => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setOpen(false); });
}
