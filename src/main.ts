import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/600.css';
import './styles/main.css';

import { initScroll, bindAnchors, ScrollTrigger } from './core/scroll';
import { initCursor } from './core/cursor';
import { initMagnetic } from './core/magnetic';
import { runIntro } from './intro';
import { initHero } from './sections/hero';
import { initPhilo } from './sections/philo';
import { initServices } from './sections/services';
import { initFlow } from './sections/flow';
import { initPerson } from './sections/person';
import { initContact } from './sections/contact';
import { initNav } from './sections/nav';
const loadGlyphField = () => import('./scenes/glyphField').then((m) => m.initGlyphField()).catch(() => {});

const boot = () => {
  initScroll();
  bindAnchors();
  initNav();
  const hero = initHero();
  initPhilo();
  initServices();
  initFlow();
  initPerson();
  initContact();
  initCursor();
  initMagnetic();
  loadGlyphField();

  runIntro((skipped) => {
    hero?.enter(skipped);
    ScrollTrigger.refresh();
    // Signal für automatisierte Aufnahmen
    document.body.dataset.ready = '1';
  });

  // Nach Font-Load Messungen aktualisieren
  (document as any).fonts?.ready?.then(() => ScrollTrigger.refresh());
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
