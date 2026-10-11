// Automatisierte Bildschirmaufnahme der laufenden Website.
// Modus A: Showcase (ca. 60s) · Modus B: Vollständiger Rundgang (ca. 3min)
// Nutzung: node tools/record.mjs A|B [mobile]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const MODE = (process.argv[2] ?? 'A').toUpperCase();
const MOBILE = process.argv[3] === 'mobile';
const BASE = process.env.URL ?? 'http://localhost:5173/';
const DIR = 'video-raw';
mkdirSync(DIR, { recursive: true });

const VP = MOBILE ? { width: 540, height: 960 } : { width: 1600, height: 900 };

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({
  viewport: VP,
  deviceScaleFactor: MOBILE ? 2 : 1,
  recordVideo: { dir: DIR, size: VP },
  hasTouch: MOBILE,
});
const page = await ctx.newPage();

/* Hilfen */
const sleep = (ms) => page.waitForTimeout(ms);
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

let cur = { x: VP.width / 2, y: VP.height * 0.7 };
async function glide(x, y, ms = 900) {
  const steps = Math.max(14, Math.round(ms / 16));
  for (let i = 1; i <= steps; i++) {
    const t = easeInOut(i / steps);
    await page.mouse.move(lerp(cur.x, x, t), lerp(cur.y, y, t));
    await sleep(ms / steps);
  }
  cur = { x, y };
}
async function clickAt(sel, ms = 900) {
  const el = page.locator(sel).first();
  const b = await el.boundingBox();
  if (!b) throw new Error('not found: ' + sel);
  await glide(b.x + b.width / 2, b.y + b.height / 2, ms);
  await sleep(180);
  await page.mouse.down(); await sleep(70); await page.mouse.up();
}
async function smoothScrollTo(fraction, ms = 2600) {
  await page.evaluate(({ f, d }) => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (window.lenis) window.lenis.scrollTo(h * f, { duration: d / 1000, lock: true });
    else scrollTo({ top: h * f, behavior: 'smooth' });
  }, { f: fraction, d: ms });
  await sleep(ms + 250);
}
async function scrollToEl(sel, ms = 2400) {
  await page.evaluate(({ s, d }) => {
    const el = document.querySelector(s);
    if (window.lenis) window.lenis.scrollTo(el, { duration: d / 1000, lock: true });
    else el.scrollIntoView({ behavior: 'smooth' });
  }, { s: sel, d: ms });
  await sleep(ms + 250);
}

/* Cursor fürs Video etwas größer */
await page.addInitScript(() => {
  addEventListener('DOMContentLoaded', () => {
    const st = document.createElement('style');
    st.textContent = '.cursor__dot{width:12px!important;height:12px!important;} .intro__skip{opacity:0;pointer-events:none;}';
    document.head.appendChild(st);
  });
});

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.mouse.move(cur.x, cur.y);

/* Intro immer zeigen */
await sleep(300);
await page.waitForSelector('body[data-ready="1"]', { timeout: 12000 });
await sleep(MODE === 'A' ? 1400 : 900);

if (MODE === 'A') {
  /* ---------- SHOWCASE ~60s ---------- */
  await glide(VP.width * 0.42, VP.height * 0.42, 1200);          // Hero wirken lassen
  await glide(VP.width * 0.3, VP.height * 0.78, 900);            // Richtung CTA
  await sleep(500);
  await smoothScrollTo(0.14, 2800);                               // Philosophie-Pin
  await smoothScrollTo(0.24, 3200);                               // Buchstaben sammeln sich
  await sleep(600);
  await smoothScrollTo(0.36, 2600);                               // Statement + Prinzipien
  await sleep(500);
  await scrollToEl('#foerderbereiche', 2200);
  await sleep(400);
  // Hover über Zeilen
  const rows = await page.locator('.svc__rowbtn').all();
  for (const i of [0, 1, 2]) {
    const b = await rows[i].boundingBox();
    await glide(b.x + b.width * 0.3, b.y + b.height / 2, 650);
    await sleep(320);
  }
  await clickAt('.svc__rowbtn[data-svc="0"]', 700);               // Panel öffnen
  await sleep(1900);
  await glide(VP.width * 0.5, VP.height * 0.5, 800);
  await clickAt('[data-panel-next]', 800);                        // Bereich wechseln
  await sleep(1700);
  await clickAt('[data-panel-close]', 800);
  await sleep(900);
  await scrollToEl('#ablauf', 2400);                               // Tafel
  await smoothScrollTo(0.62, 3600);                                // horizontale Fahrt
  await smoothScrollTo(0.72, 2600);
  await sleep(400);
  await scrollToEl('#kontakt', 2800);                              // Finale
  await sleep(600);
  const tel = await page.locator('.contact__big').first().boundingBox();
  await glide(tel.x + tel.width * 0.5, tel.y + tel.height * 0.5, 900);
  await sleep(900);
  await glide(VP.width * 0.72, VP.height * 0.5, 900);
  await sleep(1200);
} else {
  /* ---------- RUNDGANG ~3min ---------- */
  const nudgeUp = async () => {
    await page.evaluate(() => {
      const y = Math.max(0, (window.lenis ? window.lenis.scroll : scrollY) - 140);
      if (window.lenis) window.lenis.scrollTo(y, { duration: 0.45, lock: true });
      else scrollTo({ top: y, behavior: 'smooth' });
    });
    await sleep(650);
  };
  await glide(VP.width * 0.4, VP.height * 0.45, 1100);
  // Navigation: alle Punkte einmal ansteuern
  for (const t of ['#philosophie', '#foerderbereiche', '#ablauf', '#ueber']) {
    await nudgeUp();
    await clickAt(`.nav__links a[data-scrollto="${t}"]`, 800);
    await sleep(2300);
  }
  await nudgeUp();
  await clickAt('.nav__brand', 800);                               // zurück nach oben
  await sleep(2000);
  // CTA in der Hero
  await clickAt('.hero__actions .btn--ghost', 900);
  await sleep(2200);
  // Alle 7 Bereiche öffnen und durchschalten
  await clickAt('.svc__rowbtn[data-svc="0"]', 800);
  await sleep(1800);
  for (let i = 0; i < 6; i++) {
    await clickAt('[data-panel-next]', 700);
    await sleep(1500);
  }
  await clickAt('[data-panel-prev]', 700);
  await sleep(1400);
  await clickAt('[data-panel-close]', 700);
  await sleep(800);
  // Philosophie im Detail
  await scrollToEl('#philosophie', 2000);
  await smoothScrollTo(0.22, 3000);
  await smoothScrollTo(0.34, 2600);
  // Tafel komplett
  await scrollToEl('#ablauf', 2200);
  await smoothScrollTo(0.6, 3400);
  await smoothScrollTo(0.74, 3200);
  // Person
  await scrollToEl('#ueber', 2200);
  await smoothScrollTo(0.88, 2600);
  // Kontakt + Demo-Formular
  await scrollToEl('#kontakt', 2400);
  await sleep(600);
  await clickAt('.contact__form input[name="name"]', 900);
  await page.keyboard.type('Beispiel Familie', { delay: 70 });
  await clickAt('.contact__form input[name="email"]', 700);
  await page.keyboard.type('familie@beispiel.de', { delay: 60 });
  await clickAt('.contact__form textarea', 700);
  await page.keyboard.type('Wir interessieren uns für ein Erstgespräch.', { delay: 45 });
  await clickAt('.contact__form .btn--solid', 800);
  await sleep(1800);
  // Zurück nach oben über Footer-Link
  await clickAt('.footer__meta a', 900);
  await sleep(2600);
  await sleep(1000);
}

await ctx.close();
const video = await page.video()?.path?.();
console.log('RAW_VIDEO_DONE');
await browser.close();
