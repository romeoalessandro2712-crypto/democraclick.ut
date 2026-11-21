// worlds/util.js — small helpers shared by the world modules. No three.js import.

export const damp = (dt, rate) => 1 - Math.exp(-dt * rate);

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Localised value from an {it, en} pair. */
export const loc = (o, lang) => (o == null ? '' : typeof o === 'string' ? o : (o[lang] || o.it));

/** Deterministic pseudo-random numbers, so layouts are the same on every visit. */
export function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1000003) / 1000003; };
}

/** Park the shared party orbs as a quiet, identical ring while another world is active. */
export function restOrbs(orbs) {
  orbs.setSync(true);
  const ring = orbs.ring(3.4, 1.0, 0);
  orbs.state.forEach((s, i) => { s.tp.copy(ring[i]); s.ts = 0.75; s.tdim = 0.55; s.hover = 0; s.ttint.setRGB(1, 1, 1); });
}

/** aria-hidden label layer for 3D annotations (accessible copies always live in the HTML panels). */
export function labelLayer(root, cls) {
  const layer = document.createElement('div');
  layer.className = `labels-${cls}`;
  layer.setAttribute('aria-hidden', 'true');
  root.appendChild(layer);
  const pool = [];
  return {
    get(i, extra = '') {
      while (pool.length <= i) { const el = document.createElement('span'); el.className = 'lbl'; layer.appendChild(el); pool.push(el); }
      const el = pool[i];
      if (extra && el.dataset.extra !== extra) { el.className = `lbl ${extra}`; el.dataset.extra = extra; }
      return el;
    },
    place(el, p, text, opacity = 1, anchor = 'translate(-50%, -50%)', html = false) {
      // html = true: `text` is trusted markup built by the caller from escaped values
      if (html) { if (el.dataset.h !== text) { el.innerHTML = text; el.dataset.h = text; } }
      else if (el.textContent !== text || el.dataset.h) { el.textContent = text; delete el.dataset.h; }
      el.style.transform = `translate(${p.x | 0}px, ${p.y | 0}px) ${anchor}`;
      el.style.opacity = p.visible ? String(opacity) : '0';
    },
    hideFrom(i) { for (let k = i; k < pool.length; k++) pool[k].style.opacity = '0'; },
    remove() { layer.remove(); },
  };
}

/** Patch a material so each instance has its own opacity (InstancedBufferAttribute "aFade"). */
export function withInstanceFade(material) {
  material.transparent = true;
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aFade;\nvarying float vFade;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFade = aFade;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vFade;')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= vFade;');
  };
  return material;
}
