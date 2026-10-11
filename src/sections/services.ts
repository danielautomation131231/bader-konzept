import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stopScroll, startScroll } from '../core/scroll';
import { reducedMotion, finePointer } from '../core/prefs';

type Service = {
  id: string;
  num: string;
  name: string;
  tag: string;
  motif: string;
  intro: string;
  detail: string;
  bullets: string[];
};

/* Inhalte basieren auf dem veröffentlichten Leistungsangebot von
   lernzentrum-bader.de (Diagnostik, Lerntherapie bei LRS, Rechenschwäche,
   Konzentrations-/Aufmerksamkeitsproblemen, AD(H)S, Prüfungstraining
   Mathematik & Deutsch, Eltern- und Lehrerberatung). */
const SERVICES: Service[] = [
  {
    id: 'lrs', num: '01',
    name: 'Lese-Rechtschreib-Schwäche',
    tag: 'LRS · Legasthenie',
    motif: motifLetters(),
    intro: 'Wenn Buchstaben ihre Ordnung verlieren, wird Lesen und Schreiben zur täglichen Hürde – und das Selbstvertrauen leidet mit.',
    detail: 'Die Förderung bei Lese-Rechtschreib-Schwäche ist der Schwerpunkt des Lernzentrums. Auf Grundlage einer ausführlichen Diagnostik entsteht ein Förderkonzept, das genau dort ansetzt, wo Ihr Kind steht.',
    bullets: [
      'Ausführliche Diagnostik des Schriftsprachstands',
      'Individuelles Förderkonzept statt Standardprogramm',
      'Lerntherapie in Kleingruppen von höchstens drei Kindern',
      'Regelmäßige Elterngespräche über jeden Fortschritt',
    ],
  },
  {
    id: 'rechnen', num: '02',
    name: 'Rechenschwäche',
    tag: 'Dyskalkulie',
    motif: motifCount(),
    intro: 'Mengen, Zahlen, Rechenwege – was für andere selbstverständlich ist, bleibt für manche Kinder lange ein Rätsel.',
    detail: 'Bei einer Rechenschwäche hilft Üben allein selten weiter. Die Diagnostik zeigt, welche mathematischen Grundvorstellungen fehlen – dort setzt die gezielte Förderung an.',
    bullets: [
      'Diagnostik der mathematischen Lernvoraussetzungen',
      'Aufbau tragfähiger Grundvorstellungen von Zahl und Menge',
      'Wöchentliche Förderung, 60 Minuten, max. drei Kinder',
      'Enge Rückkopplung mit den Eltern',
    ],
  },
  {
    id: 'konzentration', num: '03',
    name: 'Konzentration',
    tag: 'Beratung & Training',
    motif: motifFocus(),
    intro: 'Gedanken wandern, Aufgaben bleiben liegen: Konzentrationsschwierigkeiten haben viele Ursachen – und verdienen einen genauen Blick.',
    detail: 'Das Lernzentrum bietet Beratung und Training bei Konzentrationsschwierigkeiten. Gemeinsam finden wir heraus, was Ihr Kind beim fokussierten Arbeiten unterstützt.',
    bullets: [
      'Beratung zu Ursachen und Lernumfeld',
      'Gezieltes Konzentrationstraining',
      'Strategien für Hausaufgaben und Schulalltag',
    ],
  },
  {
    id: 'adhs', num: '04',
    name: 'AD(H)S',
    tag: 'Aufmerksamkeit',
    motif: motifPath(),
    intro: 'Aufmerksamkeit ist keine Frage des Wollens. Kinder mit AD(H)S brauchen Strukturen, die zu ihnen passen – nicht mehr Druck.',
    detail: 'Bei Aufmerksamkeitsproblemen und AD(H)S begleitet das Lernzentrum Kind und Eltern gemeinsam. Auf Wunsch arbeiten wir mit Lehrkräften, Erziehern oder behandelnden Ärzten zusammen.',
    bullets: [
      'Förderung bei Aufmerksamkeitsproblemen',
      'Beratung der Eltern im Umgang mit dem Lernalltag',
      'Zusammenarbeit mit Lehrern, Erziehern oder Ärzten – Ihr Einverständnis vorausgesetzt',
    ],
  },
  {
    id: 'diagnostik', num: '05',
    name: 'Diagnostik',
    tag: 'Der genaue Blick',
    motif: motifLens(),
    intro: 'Bevor wir fördern, wollen wir verstehen: Wo steht Ihr Kind – und warum?',
    detail: 'Eine ausführliche Diagnostik zeigt den individuellen Lernstand und die Lernvoraussetzungen Ihres Kindes, seine Stärken und Schwächen. Die Ergebnisse besprechen wir in einem persönlichen Elterngespräch und entwickeln daraus mögliche Lösungsansätze.',
    bullets: [
      'Erhebung von Lernstand und Lernvoraussetzungen',
      'Stärken- und Schwächenprofil statt bloßer Note',
      'Ausführliches Auswertungsgespräch mit den Eltern',
      'Grundlage für ein individuelles Therapiekonzept',
    ],
  },
  {
    id: 'pruefung', num: '06',
    name: 'Prüfungstraining',
    tag: 'Mathematik & Deutsch',
    motif: motifCheck(),
    intro: 'Vor Abschluss- und Übergangsprüfungen zählt beides: sicherer Stoff und ein kühler Kopf.',
    detail: 'Das Lernzentrum bietet gezieltes Prüfungstraining in Mathematik und Deutsch – strukturiert, mit Plan und ohne Panik.',
    bullets: [
      'Prüfungstraining Mathematik',
      'Prüfungstraining Deutsch',
      'Systematische Wiederholung und Prüfungsstrategie',
    ],
  },
  {
    id: 'beratung', num: '07',
    name: 'Eltern- & Lehrerberatung',
    tag: 'Gemeinsam stark',
    motif: motifTalk(),
    intro: 'Kinder lernen leichter, wenn alle an einem Strang ziehen – zu Hause und in der Schule.',
    detail: 'Regelmäßige Elterngespräche gehören fest zur Zusammenarbeit: Sie bleiben über die Entwicklung Ihres Kindes immer informiert. Auf Wunsch tauschen wir uns auch mit Lehrkräften und Erziehern aus, damit der Fortschritt im Schulalltag ankommt.',
    bullets: [
      'Regelmäßige persönliche Elterngespräche',
      'Beratung für Lehrkräfte und Erzieher',
      'Abgestimmtes Vorgehen zwischen Elternhaus, Schule und Therapie',
    ],
  },
];

function motifLetters() {
  return `<svg class="motif-letters" viewBox="0 0 340 170" fill="none">
    <line x1="10" y1="128" x2="330" y2="128" stroke="#FFD44A" stroke-width="2" stroke-dasharray="2 8"/>
    <text x="30" y="120" font-size="86" font-weight="600" fill="#F4F6F3" font-family="inherit">b</text>
    <text x="100" y="120" font-size="86" font-weight="600" fill="#FFD44A" font-family="inherit">d</text>
    <text x="172" y="120" font-size="86" font-weight="600" fill="#F4F6F3" font-family="inherit">p</text>
    <text x="242" y="120" font-size="86" font-weight="600" fill="#8FA2F0" font-family="inherit">q</text>
  </svg>`;
}
function motifCount() {
  return `<svg class="motif-count" viewBox="0 0 340 170" fill="none">
    <g transform="translate(0,150) scale(1,-1)">
      <rect x="30" y="0" width="34" height="60" rx="4" fill="#8FA2F0"/>
      <rect x="84" y="0" width="34" height="92" rx="4" fill="#F4F6F3"/>
      <rect x="138" y="0" width="34" height="48" rx="4" fill="#FFD44A"/>
      <rect x="192" y="0" width="34" height="110" rx="4" fill="#F4F6F3"/>
      <rect x="246" y="0" width="34" height="76" rx="4" fill="#8FA2F0"/>
    </g>
    <text x="300" y="60" font-size="40" font-weight="600" fill="#FFD44A" font-family="inherit">7</text>
  </svg>`;
}
function motifFocus() {
  return `<svg class="motif-focus" viewBox="0 0 340 170" fill="none">
    <circle cx="170" cy="85" r="72" stroke="#8FA2F0" stroke-width="2.5"/>
    <circle cx="170" cy="85" r="46" stroke="#F4F6F3" stroke-width="2.5"/>
    <circle cx="170" cy="85" r="22" stroke="#FFD44A" stroke-width="3"/>
    <circle cx="170" cy="85" r="6" fill="#FFD44A"/>
  </svg>`;
}
function motifPath() {
  return `<svg class="motif-path" viewBox="0 0 340 170" fill="none">
    <path d="M18 140 C 60 30, 110 160, 160 80 S 250 20, 282 76" stroke="#F4F6F3" stroke-width="3" stroke-linecap="round"/>
    <circle cx="296" cy="82" r="14" stroke="#FFD44A" stroke-width="3"/>
    <circle cx="296" cy="82" r="4" fill="#FFD44A"/>
  </svg>`;
}
function motifLens() {
  return `<svg class="motif-path" viewBox="0 0 340 170" fill="none">
    <path d="M20 120 q 30 -26 60 -8 q 34 20 66 -4 q 30 -22 60 -4" stroke="#8FA2F0" stroke-width="3" stroke-linecap="round"/>
    <circle cx="150" cy="104" r="46" stroke="#F4F6F3" stroke-width="3.5"/>
    <line x1="184" y1="138" x2="222" y2="166" stroke="#F4F6F3" stroke-width="4" stroke-linecap="round"/>
    <circle cx="150" cy="104" r="46" stroke="#FFD44A" stroke-width="1.5" stroke-dasharray="4 10"/>
  </svg>`;
}
function motifCheck() {
  return `<svg class="motif-check" viewBox="0 0 340 170" fill="none">
    <rect x="30" y="35" width="44" height="44" rx="8" stroke="#8FA2F0" stroke-width="2.5"/>
    <path class="tick" d="M40 57 l12 12 l20 -24" stroke="#FFD44A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="30" y="100" width="44" height="44" rx="8" stroke="#8FA2F0" stroke-width="2.5"/>
    <path class="tick" d="M40 122 l12 12 l20 -24" stroke="#FFD44A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="100" y1="57" x2="300" y2="57" stroke="#F4F6F3" stroke-width="3" stroke-linecap="round" stroke-dasharray="26 14"/>
    <line x1="100" y1="122" x2="260" y2="122" stroke="#F4F6F3" stroke-width="3" stroke-linecap="round" stroke-dasharray="26 14"/>
  </svg>`;
}
function motifTalk() {
  return `<svg class="motif-talk" viewBox="0 0 340 170" fill="none">
    <ellipse cx="130" cy="78" rx="86" ry="52" stroke="#F4F6F3" stroke-width="3"/>
    <ellipse cx="216" cy="98" rx="74" ry="44" stroke="#FFD44A" stroke-width="3"/>
    <circle cx="104" cy="78" r="5" fill="#8FA2F0"/><circle cx="130" cy="78" r="5" fill="#8FA2F0"/><circle cx="156" cy="78" r="5" fill="#8FA2F0"/>
  </svg>`;
}

/* ---------------------------------------------------------- */

export function initServices() {
  const index = document.querySelector('[data-svc-index]') as HTMLOListElement;
  const panel = document.querySelector('[data-panel]') as HTMLElement;
  const mask = panel.querySelector('[data-panel-mask]') as HTMLElement;
  const content = panel.querySelector('[data-panel-content]') as HTMLElement;
  const kicker = panel.querySelector('[data-panel-kicker]') as HTMLElement;
  const title = panel.querySelector('[data-panel-title]') as HTMLElement;
  const motif = panel.querySelector('[data-panel-motif]') as HTMLElement;
  const body = panel.querySelector('[data-panel-body]') as HTMLElement;
  const closeBtn = panel.querySelector('[data-panel-close]') as HTMLButtonElement;
  const prevBtn = panel.querySelector('[data-panel-prev]') as HTMLButtonElement;
  const nextBtn = panel.querySelector('[data-panel-next]') as HTMLButtonElement;

  // Index aufbauen
  SERVICES.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'svc__row';
    li.innerHTML = `
      <button class="svc__rowbtn" data-svc="${i}" data-cursor="Öffnen" aria-haspopup="dialog">
        <span class="svc__num">${s.num}</span>
        <span class="svc__name">${s.name}</span>
        <span class="svc__tag">${s.tag}</span>
      </button>`;
    index.appendChild(li);
  });

  // Reihen-Entrance
  if (!reducedMotion) {
    gsap.from('.svc__row', {
      y: 46, opacity: 0, duration: 0.85, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: index, start: 'top 85%' },
    });
  }

  // Schwebende Motiv-Vorschau am Cursor (nur Desktop)
  let preview: HTMLElement | null = null;
  if (finePointer && !reducedMotion) {
    preview = document.createElement('div');
    preview.className = 'svc__preview';
    preview.setAttribute('aria-hidden', 'true');
    document.body.appendChild(preview);
    const px = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3.out' });
    const py = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3.out' });
    index.addEventListener('mousemove', (e) => { px(e.clientX + 120); py(e.clientY); }, { passive: true });
    index.querySelectorAll<HTMLElement>('.svc__rowbtn').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        const s = SERVICES[Number(btn.dataset.svc)];
        preview!.innerHTML = s.motif.replace(/#F4F6F3/g, '#1C2440').replace(/#8FA2F0/g, '#2B49C8').replace(/#FFD44A/g, '#D9A400');
        gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(preview, { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power3.out' });
      });
    });
  }

  /* ---------- Overlay ---------- */
  let current = -1;
  let isOpen = false;
  let lastFocus: HTMLElement | null = null;

  const fill = (i: number) => {
    const s = SERVICES[i];
    current = i;
    kicker.textContent = `Förderbereich ${s.num} / ${String(SERVICES.length).padStart(2, '0')}`;
    title.textContent = s.name;
    motif.innerHTML = s.motif;
    body.innerHTML = `
      <p><strong>${s.intro}</strong></p>
      <p>${s.detail}</p>
      <ul>${s.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      <p class="panel__source">Konzeptdarstellung auf Basis des veröffentlichten Angebots von lernzentrum-bader.de.</p>`;
    prevBtn.textContent = `← ${SERVICES[(i - 1 + SERVICES.length) % SERVICES.length].name}`;
    nextBtn.textContent = `${SERVICES[(i + 1) % SERVICES.length].name} →`;
  };

  const swapTo = (i: number) => {
    if (reducedMotion) { fill(i); return; }
    gsap.to([title, body, motif, kicker], {
      opacity: 0, y: -14, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        fill(i);
        gsap.fromTo([kicker, title, motif, body],
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'expo.out' });
      },
    });
  };

  const open = (i: number, x: number, y: number, trigger: HTMLElement) => {
    if (isOpen) return;
    isOpen = true;
    lastFocus = trigger;
    fill(i);
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    stopScroll();
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 40;
    if (reducedMotion) {
      mask.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
      content.style.opacity = '1';
      closeBtn.focus();
      return;
    }
    gsap.set(mask, { clipPath: `circle(0px at ${x}px ${y}px)` });
    gsap.set(content, { opacity: 0 });
    gsap.set([kicker, title, motif, body, '.panel__nav'], { opacity: 0, y: 26 });
    const tl = gsap.timeline();
    tl.to(mask, { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: 0.75, ease: 'power3.inOut' })
      .to(content, { opacity: 1, duration: 0.2 }, '-=0.25')
      .to([kicker, title, motif, body, '.panel__nav'], {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'expo.out',
        onComplete: () => closeBtn.focus(),
      }, '-=0.1');
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    panel.setAttribute('aria-hidden', 'true');
    const done = () => {
      panel.classList.remove('is-open');
      startScroll();
      lastFocus?.focus();
    };
    if (reducedMotion) { content.style.opacity = '0'; mask.style.clipPath = 'circle(0px at 50% 50%)'; done(); return; }
    gsap.timeline({ onComplete: done })
      .to(content, { opacity: 0, duration: 0.25, ease: 'power2.in' })
      .to(mask, { clipPath: (i, t) => {
        const m = /at ([\d.]+)px ([\d.]+)px/.exec((t as HTMLElement).style.clipPath);
        return `circle(0px at ${m ? m[1] : '50%'}px ${m ? m[2] : '50%'}px)`;
      }, duration: 0.6, ease: 'power3.inOut' }, '-=0.05');
  };

  index.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.svc__rowbtn');
    if (!btn) return;
    const i = Number(btn.dataset.svc);
    const useCenter = e.detail === 0; // Tastatur
    open(i, useCenter ? innerWidth / 2 : e.clientX, useCenter ? innerHeight / 2 : e.clientY, btn);
  });
  // Fokus-Stil für Tastatur
  index.querySelectorAll('.svc__rowbtn').forEach((btn) => {
    btn.addEventListener('focus', () => btn.closest('.svc__row')?.classList.add('is-focused'));
    btn.addEventListener('blur', () => btn.closest('.svc__row')?.classList.remove('is-focused'));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => swapTo((current - 1 + SERVICES.length) % SERVICES.length));
  nextBtn.addEventListener('click', () => swapTo((current + 1) % SERVICES.length));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
