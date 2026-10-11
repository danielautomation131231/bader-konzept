// QA-Check: Screenshots + Konsolenfehler über mehrere Scrollpositionen
import { chromium } from 'playwright';

const BASE = process.env.URL ?? 'http://localhost:5173/';
const OUT = process.env.OUT ?? 'shots';
const MOBILE = process.env.MOBILE === '1';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({
  viewport: MOBILE ? { width: 390, height: 844 } : { width: 1600, height: 900 },
  deviceScaleFactor: 1,
});

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const tag = MOBILE ? 'm' : 'd';
await page.screenshot({ path: `${OUT}/${tag}00-intro.png` });

// Intro abwarten (max. 8s)
await page.waitForSelector('body[data-ready="1"]', { timeout: 8000 }).catch(() => {});
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/${tag}01-hero.png` });

// Scroll-Stationen
const stops = [0.12, 0.2, 0.3, 0.42, 0.55, 0.68, 0.8, 0.92, 1];
for (let i = 0; i < stops.length; i++) {
  await page.evaluate((f) => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (window.lenis) window.lenis.scrollTo(h * f, { immediate: true });
    else scrollTo(0, h * f);
  }, stops[i]);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${tag}${String(i + 2).padStart(2, '0')}-s${Math.round(stops[i] * 100)}.png` });
}

// Overlay testen (Desktop)
if (!MOBILE) {
  await page.evaluate(() => { if (window.lenis) window.lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0); });
  await page.waitForTimeout(400);
  await page.click('[data-scrollto="#foerderbereiche"]');
  await page.waitForTimeout(1600);
  await page.click('.svc__rowbtn[data-svc="0"]');
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${OUT}/${tag}90-panel.png` });
  await page.click('[data-panel-next]');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${tag}91-panel-next.png` });
  await page.click('[data-panel-close]');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${tag}92-after-close.png` });
} else {
  // Mobile Menü testen (erst nach oben, sonst ist die Nav ausgeblendet)
  await page.evaluate(() => { if (window.lenis) window.lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0); });
  await page.waitForTimeout(600);
  await page.click('[data-burger]');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${tag}90-menu.png` });
  await page.click('[data-mmenu-link][href="#kontakt"]');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/${tag}91-kontakt.png` });
}

console.log(JSON.stringify({ errors }, null, 2));
await browser.close();
