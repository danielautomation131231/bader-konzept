import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion, isMobileLayout } from '../core/prefs';

/**
 * »Buchstabenraum« – schwebende Glyphen (Buchstaben & Ziffern) in
 * räumlicher Tiefe hinter der Hero-Sektion. Ruhige Drift, dezente
 * Maus-Parallaxe. Drei Farbtöne: Tinte, Königsblau, Textmarker.
 */
export function initGlyphField() {
  const canvas = document.querySelector('[data-glyph-field]') as HTMLCanvasElement | null;
  if (!canvas || reducedMotion) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  } catch {
    canvas.remove();
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 14;

  const GLYPHS = ['a', 'b', 'e', 'g', 'k', 'm', 'r', 's', 'w', '3', '7', '9', '?', '+'];
  const COLORS = [
    { c: '#1C2440', o: 0.16, w: 7 },
    { c: '#2B49C8', o: 0.2, w: 2.4 },
    { c: '#E8B50A', o: 0.5, w: 0.6 },
  ];

  const makeTexture = (glyph: string, color: string) => {
    const s = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const ctx = cv.getContext('2d')!;
    ctx.font = `600 ${s * 0.72}px 'Bricolage Grotesque Variable', Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(glyph, s / 2, s * 0.56);
    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 2;
    return tex;
  };

  const pickColor = () => {
    const total = COLORS.reduce((a, x) => a + x.w, 0);
    let r = Math.random() * total;
    for (const col of COLORS) { r -= col.w; if (r <= 0) return col; }
    return COLORS[0];
  };

  const sprites: { s: THREE.Sprite; base: THREE.Vector3; phase: number; speed: number; rot: number }[] = [];
  const count = isMobileLayout() ? 26 : 64;
  const materials = new Map<string, THREE.SpriteMaterial>();

  for (let i = 0; i < count; i++) {
    const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    const col = pickColor();
    const key = glyph + col.c;
    if (!materials.has(key)) {
      materials.set(key, new THREE.SpriteMaterial({
        map: makeTexture(glyph, col.c),
        transparent: true,
        opacity: col.o,
        depthWrite: false,
      }));
    }
    const sprite = new THREE.Sprite(materials.get(key)!);
    const depth = Math.random();
    const base = new THREE.Vector3(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 16,
      -2 - depth * 10,
    );
    const size = 0.7 + (1 - depth) * 1.5;
    sprite.scale.setScalar(size);
    sprite.position.copy(base);
    sprite.material.rotation = (Math.random() - 0.5) * 0.9;
    scene.add(sprite);
    sprites.push({
      s: sprite, base, phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.5,
      rot: (Math.random() - 0.5) * 0.12,
    });
  }

  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  const resize = () => {
    const hero = canvas.parentElement!;
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  let active = true;
  const clock = new THREE.Clock();
  const tick = () => {
    if (active) {
      const t = clock.getElapsedTime();
      for (const o of sprites) {
        o.s.position.y = o.base.y + Math.sin(t * o.speed + o.phase) * 0.9;
        o.s.position.x = o.base.x + Math.cos(t * o.speed * 0.6 + o.phase) * 0.6;
        o.s.material.rotation += o.rot * 0.016;
      }
      camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 0.9 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, -6);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  };
  tick();

  ScrollTrigger.create({
    trigger: canvas.parentElement,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => { active = self.isActive; },
  });
}
