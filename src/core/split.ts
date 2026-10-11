/** Leichter eigener Text-Splitter (Wörter / Zeilen) – kein Fremdcode. */

export function splitWords(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.textContent = '';
  const words: HTMLElement[] = [];
  text.split(/\s+/).filter(Boolean).forEach((w, i, arr) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = w;
    el.appendChild(span);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    words.push(span);
  });
  return words;
}

/** Zerlegt Überschriften mit <br> in maskierte Zeilen. */
export function splitLines(el: HTMLElement): HTMLElement[] {
  const parts = el.innerHTML.split(/<br\s*\/?>/i).map((s) => s.trim());
  el.innerHTML = '';
  const inners: HTMLElement[] = [];
  parts.forEach((part) => {
    const line = document.createElement('span');
    line.className = 'line';
    const inner = document.createElement('span');
    inner.innerHTML = part;
    line.appendChild(inner);
    el.appendChild(line);
    inners.push(inner);
  });
  return inners;
}
