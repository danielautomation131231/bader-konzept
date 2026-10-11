export const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches;

export const isMobileLayout = () => window.matchMedia('(max-width: 860px)').matches;
