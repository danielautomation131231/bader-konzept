import gsap from 'gsap';
import { finePointer, reducedMotion } from './prefs';

/**
 * Textmarker-Cursor: kleiner Tintenpunkt, der über interaktiven
 * Elementen zu einem gelben Marker-Fleck wird (mix-blend-multiply),
 * optional mit Label (data-cursor="…").
 */
export function initCursor() {
  if (!finePointer || reducedMotion) return;

  const dot = document.querySelector('[data-cursor-dot]') as HTMLElement;
  const blob = document.querySelector('[data-cursor-blob]') as HTMLElement;
  const label = document.querySelector('[data-cursor-label]') as HTMLElement;
  if (!dot || !blob) return;

  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const blobPos = { x: pos.x, y: pos.y };
  let visible = false;

  const dotX = gsap.quickSetter(dot, 'x', 'px');
  const dotY = gsap.quickSetter(dot, 'y', 'px');
  const blobX = gsap.quickSetter(blob, 'x', 'px');
  const blobY = gsap.quickSetter(blob, 'y', 'px');

  window.addEventListener('mousemove', (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    if (!visible) {
      visible = true;
      gsap.to(dot, { opacity: 1, duration: 0.3 });
    }
  }, { passive: true });

  gsap.ticker.add(() => {
    blobPos.x += (pos.x - blobPos.x) * 0.16;
    blobPos.y += (pos.y - blobPos.y) * 0.16;
    dotX(pos.x); dotY(pos.y);
    blobX(blobPos.x); blobY(blobPos.y);
  });

  gsap.set(dot, { opacity: 0 });

  const activate = (text?: string) => {
    gsap.to(blob, {
      opacity: 0.9,
      scale: text ? 2.1 : 1,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to(dot, { scale: 0.4, duration: 0.3, overwrite: 'auto' });
    if (label) {
      label.textContent = text ?? '';
      gsap.to(label, { opacity: text ? 1 : 0, duration: 0.25 });
    }
  };
  const deactivate = () => {
    gsap.to(blob, { opacity: 0, scale: 0.35, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(dot, { scale: 1, duration: 0.3, overwrite: 'auto' });
    if (label) gsap.to(label, { opacity: 0, duration: 0.2 });
  };

  const attach = (root: ParentNode) => {
    root.querySelectorAll<HTMLElement>('a, button, [data-cursor]').forEach((el) => {
      if ((el as any).__cursorBound) return;
      (el as any).__cursorBound = true;
      el.addEventListener('mouseenter', () => activate(el.dataset.cursor));
      el.addEventListener('mouseleave', deactivate);
    });
  };
  attach(document);
  // Später eingefügte Elemente (Service-Index) nachrüsten
  new MutationObserver(() => attach(document)).observe(document.body, { childList: true, subtree: true });
}
